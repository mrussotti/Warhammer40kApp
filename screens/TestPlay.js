import React from 'react';
import { View, StyleSheet } from 'react-native';
import Map from '../components/map';
import { map1, map2, warhammerMap } from '../maps/TestMap';

const TestPlay = () => {
  // Define the initial state of the game here, such as the positions of the units
 

  return (
    <View style={styles.container}>
      <Map mapData={warhammerMap} />  
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
