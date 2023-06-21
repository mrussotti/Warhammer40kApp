import React from 'react';
import { View, StyleSheet } from 'react-native';
import Map from '../components/map';

const TestPlay = () => {
  // Define the initial state of the game here, such as the positions of the units
  const mapData = [
    ['cell1', 'cell2', 'cell3'],
    ['cell4', 'cell5', 'cell6'],
    ['cell7', 'cell8', 'cell9'],
  ];

  return (
    <View style={styles.container}>
      <Map mapData={mapData} />
      {/* Add other components as needed, such as a status bar, controls, etc. */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TestPlay;
