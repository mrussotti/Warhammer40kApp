// screens/CreateArmy.js
import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native'; 
import { db, auth } from '../firebase';

const CreateArmy = ({ navigation }) => {
    const [loading, setLoading] = useState(true);

    const [name, setName] = useState('');
    const [faction, setFaction] = useState('');
    const [unit, setUnit] = useState('');
    const [units, setUnits] = useState([]);
    const [factions, setFactions] = useState([]);
    const [armyUnits, setArmyUnits] = useState([]);
    const [unitCount, setUnitCount] = useState(1);

    useEffect(() => {
        const fetchFactions = async () => {
            try {
                const snapshot = await db.collection('factions').get();
                const factionsArray = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setFactions(factionsArray);
                setFaction(factionsArray[0].id); 
                setLoading(false); 
            } catch (error) {
                console.error('Error fetching factions:', error);
            }
        };

        fetchFactions();
    }, []);

    useEffect(() => {
        if (faction) {
            const selectedFaction = factions.find(f => f.id === faction);
            setUnits(selectedFaction.squads);
            setArmyUnits([]); 
            setUnit(selectedFaction.squads[0].name); 
        }
    }, [faction]);

    const handleAddUnit = () => {
        const selectedUnit = units.find(u => u.name === unit);
        setArmyUnits([...armyUnits, { ...selectedUnit, count: unitCount }]);
    };

    const handleSubmit = () => {
        db.collection('Armies').add({
            name,
            faction,
            units: armyUnits,
            userId: auth.currentUser.uid,
        });
        navigation.goBack();
    };

    if (loading) {
        return <Text>Loading...</Text>; 
    }

    return (
        <View style={styles.mainContainer}>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Name</Text>
                <TextInput style={styles.input} value={name} onChangeText={setName} />
            </View>
            
            <Text style={styles.label}>Faction</Text>
            <View style={styles.radioContainer}>
              {factions.map((f, index) => (
                <View key={index} style={styles.radioButton}>
                  <TouchableOpacity
                    style={styles.circle}
                    onPress={() => setFaction(f.id)}
                  >
                    {faction === f.id && <View style={styles.checkedCircle} />}
                  </TouchableOpacity>
                  <Text style={styles.radioText}>{f.name}</Text>
                </View>
              ))}
            </View>
            
            <Text style={styles.label}>Units</Text>
            <View style={styles.radioContainer}>
              {units.map((u, index) => (
                <View key={index} style={styles.radioButton}>
                  <TouchableOpacity
                    style={styles.circle}
                    onPress={() => setUnit(u.name)}
                  >
                    {unit === u.name && <View style={styles.checkedCircle} />}
                  </TouchableOpacity>
                  <Text style={styles.radioText}>{u.name}</Text>
                </View>
              ))}
            </View>
            
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Number of Units</Text>
                <TextInput style={styles.input} value={String(unitCount)} onChangeText={text => setUnitCount(Number(text))} keyboardType="numeric" />  
            </View>
            <Button title="Add Unit" onPress={handleAddUnit} disabled={!faction || !unit} />
            <FlatList
                data={armyUnits}
                renderItem={({ item }) => <Text style={styles.unitText}>{item.name} x {item.count}</Text>}  
                keyExtractor={(item, index) => index.toString()}
                ListFooterComponent={
                    <Button title="Submit" onPress={handleSubmit} />
                }
            />
        </View>
    );    
};    

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f5f5f5',
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    backgroundColor: '#fff',
  },
  radioContainer: {
    marginBottom: 15,
    alignItems: 'flex-start',
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  circle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  checkedCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#000',
  },
  radioText: {
    fontSize: 16,
  },
  unitText: {
    fontSize: 16,
    marginBottom: 5,
  }
});

export default CreateArmy;
