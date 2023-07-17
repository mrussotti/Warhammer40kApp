// screens/TestPlay.js
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, StyleSheet, Animated, Text, Dimensions } from 'react-native';
import { db } from '../firebase';
import Game from '../components/game';
import PlayArea from '../maps/PlayArea'; // Import PlayArea instead of TestMap
import { PinchGestureHandler } from 'react-native-gesture-handler';

const TestPlay = ({ route }) => {
    const { armyId } = route.params;
    const scale = new Animated.Value(1);
    const { width, height } = Dimensions.get('window');

    const onPinchEvent = Animated.event(
        [{ nativeEvent: { scale: scale } }],
        { useNativeDriver: true }
    );

    return (
        <View style={styles.container}>
            <PinchGestureHandler onGestureEvent={onPinchEvent}>
                <Animated.View style={[styles.mapy, { transform: [{ scale: scale }] }]}>
                {armyId ? 
                    <PlayArea width={width} height={height}> 
                        <Game armyId={armyId} playAreaWidth={width} playAreaHeight={height} />
                    </PlayArea> 
                    : <Text>Loading...</Text>}
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
