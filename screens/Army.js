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
        const armiesData = await Promise.all(armiesSnapshot.docs.map(async doc => {
          const armyData = doc.data();
          const factionSnapshot = await db.collection('factions').doc(armyData.faction).get();
          const factionData = factionSnapshot.data();
          return { id: doc.id, name: armyData.name, faction: factionData.name, units: armyData.units };
        }));
        console.log(armiesData);
        setArmies(armiesData);
      };

      fetchArmies();
    }
  }, [isFocused]);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.armyName}>Army: {item.name}</Text>
      <Text style={styles.factionTitle}>Faction: {item.faction}</Text>
      <Text style={styles.unitsTitle}>Units:</Text>
      {item.units.map((unit, index) => (
        <Text key={index} style={styles.unitText}>{unit.name} x {unit.count}</Text>
      ))}
    </View>
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
  }
});
