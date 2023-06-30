import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity } from 'react-native';
import { db, auth } from '../firebase';
import { Picker } from '@react-native-picker/picker';

const CreateArmy = ({ navigation }) => {
    const [name, setName] = useState('');
    const [faction, setFaction] = useState('');
    const [unit, setUnit] = useState('');
    const [units, setUnits] = useState([]);
    const [factions, setFactions] = useState([]);
    const [armyUnits, setArmyUnits] = useState([]);

    useEffect(() => {
        const fetchFactions = async () => {
            try {
                const snapshot = await db.collection('factions').get();
                const factionsArray = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setFactions(factionsArray);
                setFaction(factionsArray[0].id); // Set initial faction to the first one
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
            setArmyUnits([]); // Reset army units when faction changes
            setUnit(selectedFaction.squads[0].name); // Set initial unit to the first one of the selected faction
        }
    }, [faction]);

    const handleAddUnit = () => {
        const selectedUnit = units.find(u => u.name === unit);
        setArmyUnits([...armyUnits, selectedUnit]);
    };

    const handleSubmit = () => {
        db.collection('Armies').add({
            name,
            faction,
            units: armyUnits,
            userId: auth.currentUser.uid, // store the user's ID with the army
        });
        navigation.goBack();
    };

    return (
        <View>
            <Text>Name</Text>
            <TextInput value={name} onChangeText={setName} />
            <Text>Faction</Text>
            <Picker selectedValue={faction} onValueChange={setFaction}>
                {factions.map((faction) => (
                    <Picker.Item key={faction.id} label={faction.name} value={faction.id} />
                ))}
            </Picker>
            <Text>Units</Text>
            <Picker selectedValue={unit} onValueChange={setUnit}>
                {units.map((unit) => (
                    <Picker.Item key={unit.name} label={unit.name} value={unit.name} />
                ))}
            </Picker>
            <Button title="Add Unit" onPress={handleAddUnit} disabled={!faction || !unit} />
            <FlatList
                data={armyUnits}
                renderItem={({ item }) => <Text>{item.name}</Text>} // assuming 'name' is a field in the object
                keyExtractor={(item, index) => index.toString()}
            />

            <Button title="Submit" onPress={handleSubmit} />
        </View>
    );
};

export default CreateArmy;
