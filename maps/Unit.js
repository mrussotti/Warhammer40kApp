// components/Unit.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native';


const Unit = ({ x, y, unitData, onPress }) => {
    const backgroundColor = unitData && unitData.player === 'Player 1' ? 'blue' : '#99cc99';
    const text = unitData && unitData.name ? unitData.name : '';

    return (
        <TouchableOpacity 
            style={[styles.unit, { backgroundColor, left: x, top: y }]}
            activeOpacity={0.7} // you can change this number to adjust the opacity change when pressed
            onPress={() => onPress(x,y)}
        >
            <Text style={styles.text}>{text}</Text>
        </TouchableOpacity>
    );
};


const styles = StyleSheet.create({
    unit: {
        position: 'absolute',
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#000000',
        borderWidth: 1,
    },
    text: {
        fontSize: 10,
    },
});

export default Unit;


