//screens/SquadCustomizationScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { db } from '../firebase';
import { v4 as uuidv4 } from 'uuid';

const SquadCustomizationScreen = ({ route, navigation }) => {
    const { squad, armyId, setArmyUnits, armyUnits } = route.params; // Updated
    const [models, setModels] = useState(squad.models.map(model => ({ ...model, count: model.min })) || []);
    const factionId = squad.factionId; // This assumes that the factionId is passed with the squad object

    const handleModelPress = (model) => {
        navigation.navigate('ModelCustomization', { model: model });
    };

    const handleModelCountChange = (model, newCount) => {
        setModels(models.map((m) => m.name === model.name ? { ...m, count: newCount } : m));
    };

    const handleSubmit = () => { // Updated
        const updatedSquad = { ...squad, models: models };
        
        // Update armyUnits state in CreateArmy.js
        const updatedArmyUnits = armyUnits.map(unit => unit.id === updatedSquad.id ? updatedSquad : unit);
        setArmyUnits(updatedArmyUnits);

        navigation.goBack();
    };

    return (
        <View>
            <Text>Squad Customization</Text>
            <Text>{squad.name}</Text>
            <FlatList
                data={models}
                renderItem={({ item }) => (
                    <View>
                        <Text>{item.name}</Text>
                        <Text>Count: {item.count}</Text>
                        <Text>Min: {item.min} Max: {item.max}</Text>
                        <Button title="-" onPress={() => handleModelCountChange(item, Math.max(item.min, item.count - 1))} />
                        <Button title="+" onPress={() => handleModelCountChange(item, Math.min(item.max, item.count + 1))} />
                        <Text>Wargear options: </Text>
                        <FlatList
                            data={item.wargearOptions}
                            renderItem={({ item }) => (
                                <Text>{item.options.join(', ')} (replaces {item.replace})</Text>
                            )}
                            keyExtractor={(item, index) => index.toString()}
                        />
                        <Button title="Customize Wargear" onPress={() => handleModelPress(item)} />
                    </View>
                )}
                keyExtractor={(item, index) => index.toString()}
            />
            <Button title="Submit" onPress={handleSubmit} />
        </View>
    );
};

export default SquadCustomizationScreen;