import React from 'react';
import { View, StyleSheet } from 'react-native';
import Cell from './cell';

const Map = ({ mapData }) => {
  return (
    <View style={styles.map}>
      {mapData.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((cellData, cellIndex) => (
            <Cell key={cellIndex} cellData={cellData} />
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

export default Map;
