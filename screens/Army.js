import React, { useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { db } from '../firebase';
import { Picker } from '@react-native-picker/picker';


const Army = ({ navigation }) => {
  const [selectedFaction, setSelectedFaction] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('');
  const [army, setArmy] = useState([]);

  const factions = ['Faction 1', 'Faction 2', 'Faction 3']; // Replace with your actual factions
  const units = ['Unit 1', 'Unit 2', 'Unit 3']; // Replace with your actual units

  const handleAddUnit = () => {
    setArmy([...army, selectedUnit]);
  };

  const handleSaveArmy = async () => {
    try {
      await db.collection('armies').add({
        faction: selectedFaction,
        units: army,
      });
      alert('Army saved successfully!');
    } catch (error) {
      console.log('Error saving army:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Army</Text>
      <Picker
        selectedValue={selectedFaction}
        onValueChange={(itemValue) => setSelectedFaction(itemValue)}
      >
        {factions.map((faction, index) => (
          <Picker.Item key={index} label={faction} value={faction} />
        ))}
      </Picker>
      <Picker
        selectedValue={selectedUnit}
        onValueChange={(itemValue) => setSelectedUnit(itemValue)}
      >
        {units.map((unit, index) => (
          <Picker.Item key={index} label={unit} value={unit} />
        ))}
      </Picker>
      <Button title="Add Unit" onPress={handleAddUnit} />
      <Button title="Save Army" onPress={handleSaveArmy} />
    </View>
  );
};

export default Army;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});
