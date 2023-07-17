// components/Unit.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Unit = ({ x, y, unitData }) => {
  // Set background color based on the player's name
  const backgroundColor = unitData && unitData.player === 'Player 1' ? 'blue' : '#99cc99';

  // Fetch the unit's name from unitData
  const text = unitData && unitData.name ? unitData.name : '';

  console.log(unitData);
  console.log(`Unit coordinates: x = ${x}, y = ${y}`);

  return (
    <View style={[styles.unit, { backgroundColor, left: x, top: y }]}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  unit: {
    position: 'absolute',
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#000000',
    borderWidth: 1,
  },
  text: {
    fontSize: 10,
  },
});

export default Unit;
