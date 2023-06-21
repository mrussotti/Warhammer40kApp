import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Cell = ({ cellData }) => {
    return (
        <View style={styles.cell}>
          <Text>{cellData}</Text>
        </View>
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
