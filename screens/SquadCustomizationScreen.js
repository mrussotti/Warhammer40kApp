import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { db } from '../firebase';

const SquadCustomizationScreen = ({ route, navigation }) => {
    const { armyId, squadId } = route.params;
    const [squad, setSquad] = useState(null);
    const [models, setModels] = useState([]);
    const [totalCount, setTotalCount] = useState(0); // For Total Count

    useEffect(() => {
        // Fetch the latest army and squad data when the screen opens
        const armyRef = db.collection('Armies').doc(armyId);
        const unsubscribe = armyRef.onSnapshot(async doc => {
            const data = doc.data();
            const updatedSquad = data.units.find(unit => unit.id === squadId);
            if (updatedSquad) {
                setSquad(updatedSquad);
                setModels(updatedSquad.models);
            }
        });

        // Clean up the subscription on unmount
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const newTotalCount = models.reduce((sum, model) => sum + model.count, 0);
        setTotalCount(newTotalCount);
    }, [models]);

    const updateArmy = async () => {
        const updatedSquad = { ...squad, models: models };

        const squadSize = models.reduce((sum, model) => sum + model.count, 0);
        const factionRef = db.collection('factions').doc(squad.factionId);

        const squadsRef = factionRef.collection('squads').doc(squad.id);
        await squadsRef.update({ squadSize: squadSize, models: models });

        console.log(`Squad size updated to: ${squadSize}`);
    };

    const handleModelPress = (model) => {
        // calculate squadSize
        const squadSize = models.reduce((sum, model) => sum + model.count, 0);
        navigation.navigate('ModelCustomization', {
            model: model,
            handleModelUpdate: handleModelUpdate,
            squadSize: squadSize  // pass squadSize to the ModelCustomizationScreen
        });
    };

    const handleModelCountChange = (model, newCount) => {
        setModels(models.map((m) => m.name === model.name ? { ...m, count: newCount } : m));
    };
    const handleModelUpdate = (updatedModel) => {
        setModels(models.map((m) => m.name === updatedModel.name ? updatedModel : m));
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Squad Customization</Text>
            <Text style={styles.squadInfo}>{squad.name}</Text>
            <Text style={styles.squadInfo}>Total Count: {totalCount}</Text> 
            <FlatList
                data={models}
                renderItem={({ item }) => (
                    <View>
                        <TouchableOpacity onPress={() => handleModelPress(item)}>
                            <Text>{item.name}</Text>
                        </TouchableOpacity>
                        <Text>Count: {item.count}</Text>
                        <Text>Min: {item.min} Max: {item.max}</Text>
                        <Button title="-" onPress={() => handleModelCountChange(item, Math.max(item.min, item.count - 1))} />
                        <Button title="+" onPress={() => handleModelCountChange(item, Math.min(item.max, item.count + 1))} />
                        <Text>Wargear: </Text>
                        <FlatList
                            data={item.wargear}
                            renderItem={({ item }) => (
                                <Text>{item}</Text>
                            )}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </View>
                )}
                keyExtractor={(item, index) => index.toString()}
            />

            <Button title="Update Army" onPress={updateArmy} style={styles.submitButton} />
        </View>
    );
};


export default SquadCustomizationScreen;

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
    squadInfo: {
        fontSize: 18,
        marginBottom: 10,
    },
    squadItem: {
        marginBottom: 15,
    },
    submitButton: {
        marginTop: 20,
    },
});