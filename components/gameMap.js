// components/gameMap.js
import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Cell from './cell';

const GameMap = ({ mapData, onCellPress }) => {
  return (
    <View>
      {mapData.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((cellData, cellIndex) => ( // cellData is defined here
            <TouchableOpacity key={cellIndex} onPress={() => onCellPress(rowIndex, cellIndex)}>
              <Cell cellData={cellData} onPress={() => onCellPress(rowIndex, cellIndex)} />
            </TouchableOpacity>
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
