// screens/Army.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { db, auth } from '../firebase';
import { useIsFocused } from '@react-navigation/native';

const Army = ({ navigation }) => {
  const [armies, setArmies] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      const fetchArmies = async () => {
        const armiesSnapshot = await db.collection('Armies').where('userId', '==', auth.currentUser.uid).get();
        
        const armiesData = armiesSnapshot.docs.map(doc => {
          const armyData = doc.data();
  
          if (!armyData) {
            console.error('armyData is undefined', doc.id);
            return;
          }
  
          if (!armyData.units) {
            console.error('units is undefined', doc.id);
            return;
          }
  
          // Since each unit already contains its models, we can directly use them.
          const finalUnits = armyData.units;
  
          // Return the complete army data
          return { id: doc.id, ...armyData, units: finalUnits };
        });
  
        // Filter out any undefined values (from the errors) and set the armies data.
        setArmies(armiesData.filter(Boolean));
      };
  
      fetchArmies();
    }
  }, [isFocused]);
  
  
  
  

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('EditArmy', { army: item })}>
      <View style={styles.item}>
        <Text style={styles.armyName}>Army: {item.name}</Text>
        <Text style={styles.factionTitle}>Faction: {item.faction}</Text>
        <Text style={styles.unitsTitle}>Units:</Text>
        {item.units.map((unit, index) => (
          <View key={index}>
            <Text style={styles.unitText}>{unit.name} x {unit.count}</Text>
            {unit.models.map((model, modelIndex) => (
              <View key={modelIndex}>
                <Text style={styles.modelsTitle}>Model: {model.name} x {model.count}</Text>
                <Text style={styles.wargearTitle}>Wargear:</Text>
                {model.wargear.map((gear, gearIndex) => (
                  <Text key={gearIndex} style={styles.gearText}>{gear}</Text>
                ))}
                <View style={styles.separator}></View>
              </View>
            ))}
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );
  
  
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Armies</Text>
      <TouchableOpacity style={styles.createButton} onPress={() => navigation.navigate('CreateArmy')}>
        <Text style={styles.buttonText}>Make New Army</Text>
      </TouchableOpacity>
      <FlatList
        data={armies}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

export default Army;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start', // Align the content to the top
    alignItems: 'center',
    padding: 10, // Add padding
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  createButton: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 18,
    color: '#000',
  },
  modelsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
    marginLeft: 10,
  },
  modelText: {
    fontSize: 14,
    marginLeft: 20,
  },
  wargearTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
    marginLeft: 30,
  },
  gearText: {
    fontSize: 14,
    marginLeft: 40,
  },
  separator: {
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    marginTop: 10,
    marginBottom: 10,
    width: '80%',
    alignSelf: 'center'
  }
});
