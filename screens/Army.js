import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, FlatList } from 'react-native';
import { db, auth } from '../firebase';
import { useIsFocused } from '@react-navigation/native';

const Army = ({ navigation }) => {
  const [armies, setArmies] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      const fetchArmies = async () => {
        const armiesSnapshot = await db.collection('Armies').where('userId', '==', auth.currentUser.uid).get(); // only get armies for the current user
        const armiesData = await Promise.all(armiesSnapshot.docs.map(async doc => {
          const armyData = doc.data();
          const factionSnapshot = await db.collection('factions').doc(armyData.faction).get();
          const factionData = factionSnapshot.data();
          return { id: doc.id, faction: factionData.name, units: armyData.units };
        }));
        console.log(armiesData);
        setArmies(armiesData);
      };

      fetchArmies();
    }
  }, [isFocused]);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.title}>Faction: {item.faction}</Text>
      <Text style={styles.title}>Units:</Text>
      {item.units.map((unit, index) => (
        <Text key={index}>{unit.name}</Text>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Armies</Text>
      <FlatList
        data={armies}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
      <Button title="Make New Army" onPress={() => navigation.navigate('CreateArmy')} />
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
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
});
