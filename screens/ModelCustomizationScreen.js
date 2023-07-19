// screens/ModelCustomizationScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { db } from '../firebase';

const ModelCustomizationScreen = ({ route, navigation }) => {
    const { model, handleModelUpdate, squadSize } = route.params;
    const [wargear, setWargear] = useState(model.wargear || []);
    const [wargearOptions, setWargearOptions] = useState([]);

    useEffect(() => {
        const loadWargearOptions = async () => {
            try {
                // First fetch the faction that contains the squad
                const factionSnapshot = await db.collection('factions').get();
                let squad;
                factionSnapshot.docs.some(doc => {
                    const factionData = doc.data();
                    const foundSquad = factionData.squads?.find(squad => squad.models.some(model => model.name === model.name));
                    if (foundSquad) {
                        squad = foundSquad;
                        return true;  // Exit the loop once the correct squad has been found
                    }
                });
    
                console.log("Squad Data:", squad);
    
                const options = squad.models.find(m => m.name === model.name).wargearOptions;
                setWargearOptions(options);
            } catch (error) {
                console.error("Error loading wargear options: ", error);
            }
        };
        
        loadWargearOptions();
    }, [model.name]);
    

    const handleWargearChange = (item, newValue) => {
        setWargear(wargear.map((wg) => wg.name === item.name ? { ...wg, value: newValue } : wg));
    };

    const handleSubmit = () => {
        // Update model wargear in parent screen
        handleModelUpdate({ ...model, wargear });
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
        <Text style={styles.title}>Model Customization</Text>
        <Text style={styles.modelInfo}>{model.name}</Text>
            <FlatList
                data={wargearOptions.filter(option => {
                    switch(option.if.condition) {
                        case 'lessThan':
                            return squadSize < option.if.value;
                        case 'equals':
                            return squadSize === option.if.value;
                        default:
                            return true;
                    }
                })}
                renderItem={({ item }) => (
                    <View>
                        <Text>Replace {item.replace} with:</Text>
                        <FlatList
                            data={item.options}
                            renderItem={({ item: option }) => (
                                <View>
                                    <Text>{option}</Text>
                                    <Button title="Select" onPress={() => handleWargearChange({ name: item.replace }, option)} />
                                </View>
                            )}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </View>
                )}
                keyExtractor={(item, index) => index.toString()}
            />
        <Button title="Submit" onPress={handleSubmit} style={styles.submitButton} />
        </View>
    );
};

export default ModelCustomizationScreen;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        backgroundColor: '#F5FCFF',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    modelInfo: {
        fontSize: 18,
        marginBottom: 10,
    },
    modelItem: {
        marginBottom: 15,
    },
    submitButton: {
        marginTop: 20,
    },
});