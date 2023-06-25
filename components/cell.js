// components/cell.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const Cell = ({ cellData, onPress }) => {
    return (
        <TouchableOpacity style={styles.cell} onPress={onPress}>
          <Text>{cellData}</Text>
        </TouchableOpacity>
      );
    };

const styles = StyleSheet.create({
  cell: {
    width: 30,
    height: 30,
    backgroundColor: '#99cc99',
    borderColor: '#000000',
    borderWidth: 1,
  },
});

export default Cell;
