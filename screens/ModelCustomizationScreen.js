//screens/ModelCustomizationScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity } from 'react-native';
import { db } from '../firebase';

const ModelCustomizationScreen = ({ route, navigation }) => {
    const { model } = route.params;
    const [wargear, setWargear] = useState(model.wargear || []);

    const handleWargearChange = (item, newValue) => {
        setWargear(wargear.map((wg) => wg.name === item.name ? { ...wg, value: newValue } : wg));
    };

    const handleSubmit = () => {
        // Here you would need to update your model's data in Firebase
        console.log(wargear);
    };

    return (
        <View>
            <Text>Model Customization</Text>
            <Text>{model.name}</Text>
            <FlatList
                data={wargear}
                renderItem={({ item }) => (
                    <View>
                        <Text>{item.name}</Text>
                        <Button title="Remove" onPress={() => handleWargearChange(item, false)} />
                        <Button title="Add" onPress={() => handleWargearChange(item, true)} />
                    </View>
                )}
                keyExtractor={(item, index) => index.toString()}
            />
            <Button title="Submit" onPress={handleSubmit} />
        </View>
    );
};

export default ModelCustomizationScreen;
