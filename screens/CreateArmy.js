// screens/CreateArmy.js
import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { db, auth } from '../firebase';


const CreateArmy = ({ navigation }) => {
    const [loading, setLoading] = useState(true);
    const [armyId, setArmyId] = useState(null);
    const [armyRef, setArmyRef] = useState(null);

    const [name, setName] = useState('');
    const [faction, setFaction] = useState('');
    const [unit, setUnit] = useState('');
    const [units, setUnits] = useState([]);
    const [factions, setFactions] = useState([]);
    const [armyUnits, setArmyUnits] = useState([]);

    useEffect(() => {
        // Create a new document reference and save the ID
        const armyRef = db.collection('Armies').doc();
        setArmyId(armyRef.id);
        setArmyRef(armyRef);
    }, []);

    useEffect(() => {
        const fetchFactions = async () => {
            try {
                const snapshot = await db.collection('factions').get();
                const factionsArray = snapshot.docs.map(doc => {
                    const faction = doc.data();
                    return { id: doc.id, ...faction };
                });
                // console.log('Factions fetched: '); // Add console.log here
                setFactions(factionsArray);
                setFaction(factionsArray[0].name);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching factions:', error);
            }
        };
        fetchFactions();
    }, []);

    useEffect(() => {
        if (faction) {
            const selectedFaction = factions.find(f => f.name === faction);
            // console.log('Selected faction: ', selectedFaction); // Add console.log here
            setUnits(selectedFaction.squads);
            setArmyUnits([]);
            setUnit(selectedFaction.squads[0].name);
        }
    }, [faction]);

const handleSquadPress = (squadID) => {
    updateArmyData(() => {
      navigation.navigate('SquadCustomization', {
        armyId: armyId,
        squadId: squadID,
      });
    });
}

    

const updateArmyData = (callback) => {
    // Find the selected faction by id
    const selectedFaction = factions.find(f => f.name === faction);

    const armyData = {
        name,
        faction: selectedFaction.name, // Use faction name instead of id
        units: armyUnits.map(unit => ({
            ...unit,
            models: unit.models.map(model => ({
                ...model
            }))
        })),
        userId: auth.currentUser.uid,
    };
  
    // Set the data in the document
    armyRef.set(armyData).then(callback);
    console.log("updated")
};



    const handleAddSquad = () => {
        // Find the selected faction
        const selectedFaction = factions.find(f => f.name === faction);

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
        clonedSquad.id = generateUniqueId(); 
        console.log(clonedSquad)
 

        clonedSquad.models.forEach(model => {
            console.log(model)
            // Find the corresponding model in the faction's models
            const factionModel = selectedFaction.models.find(m => m.name === model.name);

            // If factionModel can't be found, or it doesn't have defaultWargear, don't continue
            if (!factionModel || !factionModel.defaultWargear) {
                console.error('Model does not exist or does not have defaultWargear');
                return;
            }
            model.id= generateUniqueId(); //generate unique id for each model
        });
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
        // Find the selected faction by id
        const selectedFaction = factions.find(f => f.name === faction);
    
        const armyData = {
            name,
            faction: selectedFaction.name, // Use faction name instead of id
            units: armyUnits.map(unit => ({
                ...unit,
                models: unit.models.map(model => ({
                    ...model
                }))
            })),
            userId: auth.currentUser.uid,
        };
    
        // Set the data in the document
        armyRef.set(armyData).then(() => {
            navigation.goBack();
        });
    };


    if (loading) {
        return <Text>Loading...</Text>;
    }

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
                            onPress={() => setFaction(f.name)}
                        >
                            {faction === f.name && <View style={styles.checkedCircle} />}
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
                renderItem={({ item }) => {
                    return (
                        <View style={styles.unitContainer}>
                            <TouchableOpacity onPress={() => handleSquadPress(item.id)}>
                                <Text style={styles.unitText}>{item.name}</Text>
                            </TouchableOpacity>
                            <View style={styles.modelsContainer}>
                                {item.models.map((model, index) => (
                                    <Text key={index} style={styles.modelText}>{model.name}</Text>
                                ))}
                            </View>
                        </View>
                    );
                }}
                keyExtractor={(item, index) => index.toString()}
                ListFooterComponent={<Button title="Submit" onPress={handleSubmit} />}
            />


            <Button title="Update Army" onPress={() => updateArmyData(() => { })} />

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

export default CreateArmy;