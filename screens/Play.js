import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { db } from '../firebase';

const Play = ({ navigation }) => {
  const [selectedArmy, setSelectedArmy] = useState('');
  const [armies, setArmies] = useState([]);

  useEffect(() => {
    const fetchArmies = async () => {
      try {
        const snapshot = await db.collection('armies').get();
        const armies = snapshot.docs.map((doc) => doc.data());
        setArmies(armies);
      } catch (error) {
        console.log('Error fetching armies:', error);
      }
    };

    fetchArmies();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Play</Text>
      <Picker
        selectedValue={selectedArmy}
        onValueChange={(itemValue) => setSelectedArmy(itemValue)}
      >
        {armies.map((army, index) => (
          <Picker.Item key={index} label={army.faction} value={army.faction} />
        ))}
      </Picker>
      <Button title="Campaign" onPress={() => navigation.navigate('Campaign')} />
      <Button title="Multiplayer" onPress={() => navigation.navigate('Multiplayer')} />
    </View>
  );
};

export default Play;

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
