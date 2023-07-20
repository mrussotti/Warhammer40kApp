import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { db } from '../firebase';

const SquadCustomizationScreen = ({ route, navigation }) => {
    const { armyId, squadId } = route.params;
    const [squad, setSquad] = useState(null);
    const [models, setModels] = useState([]);

    useEffect(() => {
        // Fetch the specific squad data when the screen opens
        console.log(armyId)
    console.log(squadId)
    console.log("nutskjdl")
        const armyRef = db.collection('Armies').doc(armyId);
        const unsubscribe = armyRef.onSnapshot(async doc => {
            const data = doc.data();
            const updatedSquad = data.units.find(unit => unit.id === squadId);
            console.log(squadId)
            if (updatedSquad) {
                console.log("updated shit")
                setSquad(updatedSquad);
                setModels(updatedSquad.models);
            }
        });

        // Clean up the subscription on unmount
        return () => unsubscribe();
    }, []);

    const handleModelPress = (model) => {
        navigation.navigate('ModelCustomization', {
            model: model,
        });
    };
    

    const handleModelUpdate = (updatedModel) => {
        setModels(models.map((m) => m.name === updatedModel.name ? updatedModel : m));
    };

    const updateArmy = async () => {
        const updatedSquad = { ...squad, models: models };

        const armyRef = db.collection('Armies').doc(armyId);
        const armySnapshot = await armyRef.get();
        let armyData = armySnapshot.data();

        let updatedUnits = armyData.units.map(unit => unit.id === squadId ? { ...unit, models: models } : unit);
        
        await armyRef.update({ units: updatedUnits });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Squad Customization</Text>
            <Text style={styles.squadInfo}>{squad ? squad.name : 'Loading...'}</Text>
            <FlatList
                data={models}
                renderItem={({ item }) => (
                    <View>
                        <TouchableOpacity onPress={() => handleModelPress(item)}>
                            <Text>{item.name}</Text>
                        </TouchableOpacity>
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
