// screens/TestPlay.js
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Animated, Text } from 'react-native';
import { db } from '../firebase';
import Game from '../components/game';
import { map1, map2, warhammerMap } from '../maps/TestMap';
import { PinchGestureHandler } from 'react-native-gesture-handler';

const TestPlay = ({ route }) => {
    const [army, setArmy] = useState(null);
    const map = warhammerMap; // Define your map here

    useEffect(() => {
        const fetchArmy = async () => {
            const armySnapshot = await db.collection('Armies').doc(route.params.armyId).get();
            console.log(armySnapshot.data()); // Log the army data
            setArmy(armySnapshot.data());
        };
        

        fetchArmy();
    }, [route.params.armyId]);

    const scale = new Animated.Value(1);

    const onPinchEvent = Animated.event(
        [{ nativeEvent: { scale: scale } }],
        { useNativeDriver: true }
    );

    return (
        <View style={styles.container}>
            <PinchGestureHandler onGestureEvent={onPinchEvent}>
                <Animated.View style={[styles.mapy, { transform: [{ scale: scale }] }]}>
                {army ? <Game army={army} map={map} /> : <Text>Loading...</Text>}
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
