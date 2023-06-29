// screens/TestPlay.js
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Animated, Text } from 'react-native';
import { db } from '../firebase';
import Game from '../components/game';
import { map1, map2, warhammerMap } from '../maps/TestMap';
import { PinchGestureHandler } from 'react-native-gesture-handler';

const TestPlay = ({ route }) => {
    const { armyId } = route.params;
    const map = warhammerMap; // Define your map here

    const scale = new Animated.Value(1);

    const onPinchEvent = Animated.event(
        [{ nativeEvent: { scale: scale } }],
        { useNativeDriver: true }
    );

    return (
        <View style={styles.container}>
            <PinchGestureHandler onGestureEvent={onPinchEvent}>
                <Animated.View style={[styles.mapy, { transform: [{ scale: scale }] }]}>
                {armyId ? <Game armyId={armyId} map={map} /> : <Text>Loading...</Text>}
                </Animated.View>
            </PinchGestureHandler>
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
