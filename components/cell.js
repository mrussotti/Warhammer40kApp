// components/Cell.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const Cell = ({ cellData, rowIndex, cellIndex, onPress }) => {
  const backgroundColor = cellData && cellData.player ? 'blue' : '#99cc99';
  const text = cellData && cellData.unit ? cellData.unit.name : ''; 

  return (
    <TouchableOpacity
      style={[styles.cell, { backgroundColor }]}
      onPress={() => onPress(rowIndex, cellIndex)}
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
