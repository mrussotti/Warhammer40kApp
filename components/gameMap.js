// components/gameMap.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Cell from './cell';

const GameMap = ({ map, onCellPress }) => {
  return (
    <View style={styles.container}>
      {map.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((cell, cellIndex) => (
            <Cell
              key={cellIndex}
              cellData={cell}
              rowIndex={rowIndex}
              cellIndex={cellIndex}
              onPress={onCellPress}
            />
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  map: {
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
  },
});

export default GameMap;
