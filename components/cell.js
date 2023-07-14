import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const Cell = ({ cellData, onPress }) => {
  const backgroundColor = cellData && cellData.player ? 'blue' : '#99cc99';
  const text = cellData && cellData.unit ? cellData.unit.name : ''; // Updated line

  return (
    <TouchableOpacity
      style={[styles.cell, { backgroundColor }]}
      onPress={() => onPress(cellData.unit)}  // Update onPress event to handle unit
    >
      <Text>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cell: {
    width: 30,
    height: 30,
    borderColor: '#000000',
    borderWidth: 1,
  },
});

export default Cell;
