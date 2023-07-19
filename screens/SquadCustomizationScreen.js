//screens/SquadCustomizationScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { db } from '../firebase';

const SquadCustomizationScreen = ({ route, navigation }) => {
    const { squad, armyId, setArmyUnits, armyUnits } = route.params;
    const [models, setModels] = useState(squad.models.map(model => ({ ...model, count: model.min })) || []);
    const factionId = squad.factionId;

    useEffect(() => {
        // Fetch the latest army data when the screen opens
        const armyRef = db.collection('Armies').doc(armyId);
        const unsubscribe = armyRef.onSnapshot(doc => {
            const data = doc.data();
            setArmyUnits(data.units);
            const updatedSquad = data.units.find(unit => unit.id === squad.id);
            if (updatedSquad) {
                setModels(updatedSquad.models);
            }
        });

        // Clean up the subscription on unmount
        return () => unsubscribe();
    }, []);


    const updateArmy = async () => {
        const updatedSquad = { ...squad, models: models };
        const updatedArmyUnits = armyUnits.map(unit => unit.id === updatedSquad.id ? updatedSquad : unit);
        setArmyUnits(updatedArmyUnits);

        const squadSize = models.reduce((sum, model) => sum + model.count, 0);

        try {
            const docRef = db.collection('factions').doc(factionId).collection('squads').doc(updatedSquad.id);
            const docSnap = await docRef.get();

            if (docSnap.exists) {
                await docRef.update({ squadSize: squadSize });
            } else {
                await docRef.set({ ...updatedSquad, squadSize: squadSize });
            }

            console.log(`Squad size updated to: ${squadSize}`);
        } catch (error) {
            console.error("Error updating squad size: ", error);
        }
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
                        <Text>Wargear options: </Text>
                        <FlatList
                            data={item.wargearOptions}
                            renderItem={({ item }) => (
                                <Text>{item.options.join(', ')} (replaces {item.replace})</Text>
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