// screens/EditArmy.js
import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { db, auth } from '../firebase';

const EditArmy = ({ navigation, route }) => {
    const [loading, setLoading] = useState(true);
    const [armyId, setArmyId] = useState(null);
    const [armyRef, setArmyRef] = useState(null);

    const [name, setName] = useState('');
    const [faction, setFaction] = useState('');
    const [unit, setUnit] = useState('');
    const [units, setUnits] = useState([]);
    const [factions, setFactions] = useState([]);
    const [armyUnits, setArmyUnits] = useState([]);
    const [army, setArmy] = useState(null);

    useEffect(() => {
        if (route.params?.army) {
            setArmy(route.params.army);
            setArmyId(route.params.army.id);
            setName(route.params.army.name);
            setFaction(route.params.army.faction);
            setArmyUnits(route.params.army.units);
            setArmyRef(db.collection('Armies').doc(route.params.army.id));
        }
    }, []);

    useEffect(() => {
        const fetchFactions = async () => {
            try {
                const snapshot = await db.collection('factions').get();
                const factionsArray = snapshot.docs.map(doc => {
                    const faction = doc.data();
                    return { id: doc.id, ...faction };
                });
                setFactions(factionsArray);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching factions:', error);
            }
        };
        fetchFactions();
    }, []);

    useEffect(() => {
        if (faction) {
          const selectedFaction = factions.find(f => f.id === faction);
          if (selectedFaction) {
            setUnits(selectedFaction.squads);
          } else {
            setUnits([]);
          }
        }
      }, [faction]);
      

    const handleSquadPress = (squad) => {
        updateArmyData(() => {
          navigation.navigate('SquadCustomization', {
            squad: squad,
            armyId: armyId,
            setArmyUnits: setArmyUnits,
            armyUnits: armyUnits
          });
        });
    }

    const updateArmyData = (callback) => {
        const armyData = {
          name,
          faction,
          units: armyUnits.map(unit => ({
            ...unit,
            models: unit.models.map(model => ({
              ...model,
              wargear: model.wargear
            }))
          })),
        };
      
        armyRef.update(armyData).then(callback);
    };

    const handleUpdate = () => {
        updateArmyData(() => navigation.goBack());
    };

    if (loading) {
        return <Text>Loading...</Text>;
    }


    const handleAddSquad = () => {
        // Find the selected faction
        const selectedFaction = factions.find(f => f.id === faction);

        // If selectedFaction can't be found, don't continue
        if (!selectedFaction) {
            console.error('Cannot find selected faction');
            return;
        }

        // Find the selected squad in the faction's squads
        const selectedSquad = selectedFaction.squads.find(s => s.name === unit);

        // If selectedSquad can't be found, don't continue
        if (!selectedSquad) {
            console.error('Cannot find selected squad in faction');
            return;
        }

        let clonedSquad = JSON.parse(JSON.stringify(selectedSquad));
        // Add a unique ID to the squad
        clonedSquad.id = generateUniqueId();  // Replace uuidv4 with generateUniqueId

        clonedSquad.models.forEach(model => {
            // Find the corresponding model in the faction's models
            const factionModel = selectedFaction.models.find(m => m.name === model.name);

            // If factionModel can't be found, or it doesn't have defaultWargear, don't continue
            if (!factionModel || !factionModel.defaultWargear) {
                console.error('Model does not exist or does not have defaultWargear');
                return;
            }

            // Map the wargear names to actual wargear objects
            model.wargear = factionModel.defaultWargear.reduce((acc, gearName) => {
                const gear = selectedFaction.wargear.find(gear => gear.name === gearName);
                return gear ? [...acc, gear] : acc;
            }, []);

            // Set the model count to the minimum count
            model.count = model.min;
        });

        // Filter out models where no wargear could be found
        clonedSquad.models = clonedSquad.models.filter(model => model.wargear.length > 0);

        // Add the new squad to the army only if it has at least one model
        if (clonedSquad.models.length > 0) {
            setArmyUnits([...armyUnits, clonedSquad]);
        } else {
            console.error('No valid models found in the squad. The squad was not added to the army.');
        }
    };


    function generateUniqueId() {
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
    }
    const handleSubmit = () => {
        const armyData = {
            name,
            faction,
            units: armyUnits.map(unit => ({
                ...unit,
                models: unit.models.map(model => ({
                    ...model,
                    wargear: model.wargear
                }))
            })),
            userId: auth.currentUser.uid,
        };

        // Set the data in the document
        armyRef.set(armyData).then(() => {
            navigation.goBack();
        });
    };


    return (
        <View style={styles.mainContainer}>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Name</Text>
                <TextInput style={styles.input} value={name} onChangeText={setName} />
            </View>

            <Text style={styles.label}>Faction</Text>
            <View style={styles.radioContainer}>
                {factions.map((f, index) => (
                    <View key={index} style={styles.radioButton}>
                        <TouchableOpacity
                            style={styles.circle}
                            onPress={() => setFaction(f.id)}
                        >
                            {faction === f.id && <View style={styles.checkedCircle} />}
                        </TouchableOpacity>
                        <Text style={styles.radioText}>{f.name}</Text>
                    </View>
                ))}
            </View>

            <Text style={styles.label}>Units</Text>
            <View style={styles.radioContainer}>
                {units.map((u, index) => (
                    <View key={index} style={styles.radioButton}>
                        <TouchableOpacity
                            style={styles.circle}
                            onPress={() => setUnit(u.name)}
                        >
                            {unit === u.name && <View style={styles.checkedCircle} />}
                        </TouchableOpacity>
                        <Text style={styles.radioText}>{u.name}</Text>
                    </View>
                ))}
            </View>


            <Button title="Add Squad" onPress={handleAddSquad} disabled={!faction || !unit} />
            <FlatList
    data={armyUnits}
    renderItem={({ item }) => (
        <View style={styles.unitContainer}>
            <TouchableOpacity onPress={() => handleSquadPress(item)}>
                <Text style={styles.unitText}>{item.name} x {item.count}</Text>
            </TouchableOpacity>
            <View style={styles.modelsContainer}>
                {item.models.map((model, index) => (
                    <Text key={index} style={styles.modelText}>{model.name} x {model.count}</Text>
                ))}
            </View>
        </View>
    )}
    keyExtractor={(item, index) => index.toString()}
    ListFooterComponent={
        <Button title="Submit" onPress={handleSubmit} />
    }
/>

            <Button title="Update Army" onPress={() => updateArmyData(() => {})} />

        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        padding: 15,
        backgroundColor: '#f5f5f5',
    },
    inputContainer: {
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    input: {
        height: 40,
        borderColor: '#000',
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: 10,
        backgroundColor: '#fff',
    },
    radioContainer: {
        marginBottom: 15,
        alignItems: 'flex-start',
    },
    radioButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    circle: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
    },
    checkedCircle: {
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#000',
    },
    radioText: {
        fontSize: 16,
    },
    unitText: {
        fontSize: 16,
        marginBottom: 5,
    }
});


export default EditArmy;

