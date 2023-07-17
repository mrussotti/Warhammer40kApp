// maps/PlayArea.js
import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';

const PlayArea = ({ width, height, children, onPress }) => {
  return (
    <Pressable onPress={onPress} style={[styles.container, { width, height }]}>
      {children}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderColor: '#000000',
    borderWidth: 5,
    position: 'relative',
  },
});

export default PlayArea;
