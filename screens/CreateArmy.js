import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { db, auth } from '../firebase';
import { Picker } from '@react-native-picker/picker';

const CreateArmy = ({ navigation }) => {
  const [name, setName] = useState('');
  const [faction, setFaction] = useState('');
  const [factions, setFactions] = useState([]);

  useEffect(() => {
    const fetchFactions = async () => {
      try {
        const snapshot = await db.collection('Factions').get();
        const factionsArray = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFactions(factionsArray);
      } catch (error) {
        console.error('Error fetching factions:', error);
      }
    };

    fetchFactions();
  }, []);

  const handleSubmit = () => {
    db.collection('Armies').add({
      name,
      faction,
      userId: auth.currentUser.uid,
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
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
};

export default CreateArmy;
