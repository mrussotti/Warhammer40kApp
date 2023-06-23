import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { db, auth } from '../firebase';

const Play = ({ navigation }) => {
  const [selectedArmy, setSelectedArmy] = useState(null);
  const [armies, setArmies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArmies = async () => {
      try {
        const armiesSnapshot = await db.collection('Armies').where('userId', '==', auth.currentUser.uid).get(); // only get armies for the current user
        const armiesData = await Promise.all(armiesSnapshot.docs.map(async doc => {
          const armyData = doc.data();
          const factionSnapshot = await db.collection('factions').doc(armyData.faction).get();
          const factionData = factionSnapshot.data();
          return { label: factionData.name, value: doc.id };  // use the faction name as the label and the army ID as the value
        }));
        console.log(armiesData);
        setArmies(armiesData);
        setLoading(false);  // set loading to false once data is loaded
      } catch (error) {
        console.log('Error fetching armies:', error);
        setLoading(false);  // set loading to false if there's an error
      }
    };
  
    fetchArmies();
  }, []);
  
  if (loading) {
    return <ActivityIndicator />;  // show a loading spinner while data is being loaded
  }

  const handlePress = (screenName) => {
    if (!selectedArmy) {
      Alert.alert('Please select an army before proceeding.');
    } else {
      navigation.navigate(screenName);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Play</Text>
      </View>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedArmy}
          onValueChange={(itemValue) => setSelectedArmy(itemValue)}
          style={{height: 50, width: '100%'}} // Use full width
        >
          {armies.map((army) => (
            <Picker.Item key={army.value} label={army.label} value={army.value} />
          ))}
        </Picker>
      </View>
      <View style={styles.buttonsContainer}>
        <Button title="Campaign" onPress={() => handlePress('Campaign')} />
        <Button title="Multiplayer" onPress={() => handlePress('Multiplayer')} />
        <Button title="TestPlay" onPress={() => handlePress('TestPlay')} />
      </View>
    </View>
  );
  
  
};

export default Play;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between', // This will distribute the space evenly between your items
    alignItems: 'center',
    padding: 20, // Add some padding around the edges
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
  },
  pickerContainer: {
    flex: 2,
    width: '100%', // Use full width
  },
  buttonsContainer: {
    flex: 2,
    justifyContent: 'space-around', // This will distribute the space evenly around your buttons
  },
});


