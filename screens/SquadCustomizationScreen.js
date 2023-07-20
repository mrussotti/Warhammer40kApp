import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { db } from '../firebase';

const SquadCustomizationScreen = ({ route, navigation }) => {
    const { armyId, squadId } = route.params;
    const [squad, setSquad] = useState(null);
    const [models, setModels] = useState([]);
    const modelCounts = {};


    useEffect(() => {
        const armyRef = db.collection('Armies').doc(armyId);
        const unsubscribe = armyRef.onSnapshot(async doc => {
            const data = doc.data();
            const updatedSquad = data.units.find(unit => unit.id === squadId);
            if (updatedSquad) {
                setSquad(updatedSquad);
                setModels(updatedSquad.models);
            }
        });
        return () => unsubscribe();
    }, []);

    const handleModelPress = (model) => {
        navigation.navigate('ModelCustomization', {
            modelId: model.id,
        });
    };

    const updateArmy = async () => {
        const updatedSquad = { ...squad, models: models };
        const armyRef = db.collection('Armies').doc(armyId);
        const armySnapshot = await armyRef.get();
        let armyData = armySnapshot.data();
        let updatedUnits = armyData.units.map(unit => unit.id === squadId ? { ...unit, models: models } : unit);
        await armyRef.update({ units: updatedUnits });
    };

    const countModels = (models) => {
        models.forEach(model => {
            modelCounts[model.name] = (modelCounts[model.name] || 0) + 1;
        });
        return modelCounts;
    };

    const canAddModel = (modelName) => {
        const modelRule = squad.rules.find(rule => rule.name === modelName);
        return modelCounts[modelName] < modelRule.max;
    }

    const canRemoveModel = (modelName) => {
        const modelRule = squad.rules.find(rule => rule.name === modelName);
        return modelCounts[modelName] > modelRule.min;
    }

    const addModel = (modelName) => {
        if (canAddModel(modelName)) {
            const newModel = { ...models[0], id: Math.random().toString(), name: modelName };
            setModels([...models, newModel]);
        }
    }

    const removeModel = (modelName) => {
        if (canRemoveModel(modelName)) {
            const firstIndexOfModel = models.findIndex(model => model.name === modelName);
            if (firstIndexOfModel > -1) {
                setModels(models.filter((_, index) => index !== firstIndexOfModel));
            }
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Squad Customization</Text>
            <Text style={styles.squadInfo}>{squad ? squad.name : 'Loading...'}</Text>
            {models && (
        <>
            <Text style={styles.title}>Model Counts:</Text>
            {Object.entries(countModels(models)).map(([modelName, count], index) => (
                <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={styles.squadInfo}>{modelName}: {count}</Text>
                    <View style={{ flexDirection: 'row' }}>
                        {canAddModel(modelName) && <Button title="+" onPress={() => addModel(modelName)} />}
                        {canRemoveModel(modelName) && <Button title="-" onPress={() => removeModel(modelName)} />}
                    </View>
                </View>
            ))}
        </>
    )}
            <FlatList
                data={models}
                renderItem={({ item }) => (
                    <View style={styles.modelItem}>
                        <TouchableOpacity onPress={() => handleModelPress(item)}>
                            <Text>{item.name}</Text>
                        </TouchableOpacity>
                        <Text>Wargear: </Text>
                        <FlatList
                            data={item.wargear}
                            renderItem={({ item }) => (
                                <Text style={styles.wargearItem}>{item}</Text>
                            )}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </View>
                )}
                keyExtractor={(item, index) => index.toString()}
            />
            <TouchableOpacity onPress={updateArmy} style={styles.submitButton}>
                <Text style={{ color: '#fff', textAlign: 'center' }}>Update Army</Text>
            </TouchableOpacity>
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
        textAlign: 'center', 
    },
    squadInfo: {
        fontSize: 18,
        marginBottom: 10,
        color: '#333', 
    },
    submitButton: {
        marginTop: 20,
        backgroundColor: '#3498db', 
        color: '#fff', 
        padding: 10, 
        borderRadius: 5, 
    },
    modelItem: { 
        marginTop: 10,
        padding: 10,
        backgroundColor: '#ecf0f1',
        borderRadius: 5,
    },
    wargearItem: { 
        marginTop: 5,
        fontSize: 16,
        color: '#2c3e50',
    },
});
