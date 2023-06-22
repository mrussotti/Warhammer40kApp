import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import Map from '../components/map';
import { map1, map2, warhammerMap } from '../maps/TestMap';
import { PinchGestureHandler } from 'react-native-gesture-handler';

const TestPlay = () => {
  // Define the initial state of the game here, such as the positions of the units
  const scale = new Animated.Value(1);

  const onPinchEvent = Animated.event(
    [{ nativeEvent: { scale: scale } }],
    { useNativeDriver: true }
  );

  return (
    <View style={styles.container}>
      <PinchGestureHandler onGestureEvent={onPinchEvent}>
        <Animated.View style={[styles.mapy, { transform: [{ scale: scale }] }]}>
          <Map mapData={warhammerMap} />
        </Animated.View>
      </PinchGestureHandler>
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
  mapy: {
    flex: 1,
  },
});

export default TestPlay;
