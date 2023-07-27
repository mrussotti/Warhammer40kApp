//screens/ModelCustomizationScreen.js
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { db } from '../firebase';
import { AntDesign } from '@expo/vector-icons';  // Add this import


const ModelCustomizationScreen = ({ route, navigation }) => {
    const { modelId, squadId, armyId } = route.params;
    const [model, setModel] = useState(null);
    const [squad, setSquad] = useState(null);
    const [selectedWargear, setSelectedWargear] = useState([]);
    const [wargearToReplace, setWargearToReplace] = useState(null);
    const [army, setArmy] = useState(null);
    const armyRef = useRef(); // <-- declare the ref
    const [wargearToAdd, setWargearToAdd] = useState(false);

    const [wargearOptions, setWargearOptions] = useState([]);


    useEffect(() => {
        console.log("useEffect called");
        armyRef.current = db.collection('Armies').doc(armyId);
        const unsubscribe = armyRef.current.onSnapshot(async doc => {
            console.log("Snapshot listener called");
            const data = doc.data();
            console.log("Document data:", data);
            setArmy(data);

            const updatedSquad = data.units.find(unit => unit.id === squadId);
            console.log("Updated squad:", updatedSquad);

            if (updatedSquad) {
                setSquad(updatedSquad);

                // Find model based on the modelId
                const updatedModel = updatedSquad.models.find(model => model.id === modelId);
                console.log("Updated model:", updatedModel);

                if (updatedModel) {
                    setModel(updatedModel);

                    // Find wargear options for the model
                    const modelRule = updatedSquad.rules.find(rule => rule.name === updatedModel.name);
                    console.log("Model rule:", modelRule);

                    if (modelRule) {
                        let options = null;

                        if (modelRule.wargearOptions) {
                            console.log("Model rule wargear options:", modelRule.wargearOptions);

                            if (modelRule.wargearOptions.some(option => option.replace)) { // Check if any option has replace
                                console.log("Replace option found");
                                options = modelRule.wargearOptions
                                    .filter(option => option.replace)
                                    .map(option => {
                                        const replaceOption = {
                                            replace: option.replace,
                                            options: getWargearOptionsReplace(option, updatedSquad) // pass the entire option
                                        };
                                        console.log("Replace option:", replaceOption);
                                        return replaceOption;
                                    });
                            } else {
                                console.log("No replace option found, checking for add");
                                options = modelRule.wargearOptions
                                    .filter(option => option.add)
                                    .map(option => {
                                        console.log("Add option888888888:", option.add)
                                        const addOption = {
                                            add: getWargearOptionsAdd(option, updatedSquad), // pass the entire option
                                            max: option.max
                                        };
                                        console.log("Add option:", addOption);
                                        return addOption;
                                    });
                            }

                            console.log("Final options:", options);
                            setWargearOptions(options);
                        }
                    }

                }
            }
        });
        return () => unsubscribe();
    }, []);





    const handleSelectWargear = (gear) => {
        if (model.wargear.includes(gear)) {
            setWargearToReplace(gear);
        }
    };

    // Add this to your code after `handleSelectOption` function
    const handleAddOption = (option) => {
        const newWargear = [...model.wargear, option];
        const updatedModel = { ...model, wargear: newWargear };
        setModel(updatedModel);
    };

    const handleAddWargear = (gear) => {
        if (wargearOptions.some(optionObj => optionObj.add && optionObj.add.includes(gear))) {
            handleAddOption(gear);
        }
    };

    const getWargearOptionsReplace = (rule, squad) => {
        const availableOptions = [];
        const { for: ruleFor, if: ruleIf, options, replace, max } = rule;
        const modelCount = squad.models.filter(model => model.name === ruleFor).length;
        // Check if the rule has a condition. If it doesn't, just add the options
        // Add a check for maximum number of this type of wargear
        if ((!ruleIf || checkCondition(ruleIf, modelCount)) && checkMaxModels(replace, max, squad)) {
            options.forEach(option => availableOptions.push(option));
        }
        return availableOptions;
    };

    const checkMaxWargear = (replace, max, currentCount, squad) => {
        // If the rule doesn't define a maximum, return true
        return true;
    };

    const getWargearOptionsAdd = (rule, squad) => {
        const availableOptions = [];
        const { for: ruleFor, if: ruleIf, add, replace, max } = rule;
        const modelCount = squad.models.filter(model => model.name === ruleFor).length;
        // Check if the rule has a condition. If it doesn't, just add the options
        // Add a check for maximum number of this type of wargear
        if ((!ruleIf || checkCondition(ruleIf, modelCount)) && checkMaxWargear(replace, max, modelCount, squad)) {
            // Add the `add` array from the rule object, not `options`
            availableOptions.push({ options: add });
        }
        return availableOptions;
    };





    const checkMaxModels = (replace, max, squad) => {
        // Check if max is specified in the rule
        if (max) {
            // Count how many models have this wargear
            let count = 0;
            squad.models.forEach(model => {
                if (model.wargear && !model.wargear.includes(replace)) {
                    count++;

                }
            });
            // If the count is less than the max, return true
            if (count < max) {
                return true;
            } else {
                return false;
            }
        } else {
            // If max is not specified, return true
            return true;
        }
    };

    const handleSelectOption = (option) => {
        if (wargearToReplace) {
            const newWargear = model.wargear.map(gear => gear === wargearToReplace ? option : gear);
            const updatedModel = { ...model, wargear: newWargear };
            setModel(updatedModel);
            setWargearToReplace(null);
        }
    };

    const handleConfirm = async () => {
        // Update the model's currentWargear with the selected wargear
        if (model && army) {
            const updatedModel = { ...model, currentWargear: selectedWargear };

            // If there's no defaultWargear yet, then set the currentWargear as the default
            if (!updatedModel.defaultWargear) {
                updatedModel.defaultWargear = [...model.wargear];
            }

            // Find the index of the model in the squad
            const modelIndex = squad.models.findIndex(m => m.id === model.id);

            // Replace the old model with the updated one
            const updatedModels = [...squad.models];
            updatedModels[modelIndex] = updatedModel;

            // Update the squad's models
            const updatedSquad = { ...squad, models: updatedModels };

            // Find the index of the squad in the army's units
            const squadIndex = army.units.findIndex(unit => unit.id === squad.id);

            // Replace the old squad with the updated one
            const updatedUnits = [...army.units];
            updatedUnits[squadIndex] = updatedSquad;

            // Update the army's units in Firebase
            await armyRef.current.update({
                units: updatedUnits
            });
        }
    };

    const handleReset = async () => {
        if (model && model.wargear && army) {
            // Use armyId to look up the faction
            const armySnapshot = await armyRef.current.get();
            const armyData = armySnapshot.data();
            //   console.log("armyData: "+ armyData)

            const factionRef = db.collection('factions').where('name', '==', armyData.faction);
            const factionSnapshot = await factionRef.get();
            //   console.log("factionSnapshot: "+ factionSnapshot.docs[0].data())

            let defaultWargear = [];
            const factionData = factionSnapshot.docs[0].data();

            if (factionData) {
                for (let i = 0; i < factionData.models.length; i++) {
                    if (factionData.models[i].name === model.name) {
                        defaultWargear = factionData.models[i].defaultWargear;
                        break;
                    }
                }
            }

            if (defaultWargear.length > 0) {
                const resetModel = { ...model, wargear: defaultWargear };

                const modelIndex = squad.models.findIndex(m => m.id === model.id);
                const resetModels = [...squad.models];
                resetModels[modelIndex] = resetModel;

                const resetSquad = { ...squad, models: resetModels };

                const squadIndex = army.units.findIndex(unit => unit.id === squad.id);
                const resetUnits = [...army.units];
                resetUnits[squadIndex] = resetSquad;

                await armyRef.current.update({
                    units: resetUnits
                });

                setModel(resetModel);
            }
        }
    };




    const checkCondition = (conditionObj, value) => {
        // If there is no conditionObj, then there's no condition to check.
        // Therefore, the condition is assumed to be met, and the function returns true
        if (!conditionObj) {
            return true;
        }

        const { condition, value: conditionValue } = conditionObj;
        switch (condition) {
            case 'lessThan':
                return value < conditionValue;
            case 'equals':
                return value === conditionValue;
            default:
                return false;
        }
    };
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Model Customization</Text>
            <Text style={styles.modelInfo}>{model ? model.name : "Loading..."}</Text>

            {model && model.wargear && (
                <View>
                    <Text style={styles.subtitle}>Current Wargear:</Text>
                    {model.wargear.map((gear, index) => (
                        <View key={index} style={styles.wargearContainer}>
                            <TouchableOpacity onPress={() => handleSelectWargear(gear)}>
                                <Text style={styles.wargear}>
                                    {gear}
                                    {wargearOptions.some(optionObj => optionObj.replace && optionObj.replace.includes(gear)) && ' (swappable)'}
                                </Text>
                            </TouchableOpacity>
                            {wargearOptions.some(optionObj => optionObj.add && optionObj.add.some(addObj => addObj.options.includes(gear))) &&
                                model.wargear.filter(item => item === gear).length < wargearOptions.find(optionObj => optionObj.add && optionObj.add.some(addObj => addObj.options.includes(gear))).max &&
                                <TouchableOpacity style={styles.addIcon} onPress={() => handleAddOption(gear)}>
                                    <Text style={styles.addIconText}>+</Text>
                                </TouchableOpacity>
                            }
                        </View>
                    ))}
                    {wargearToReplace && (
                        <View>
                            <Text style={styles.subtitle}>Select a wargear to replace {wargearToReplace}:</Text>
                            {wargearOptions
                                .filter(optionObj => optionObj.replace && optionObj.replace.includes(wargearToReplace))
                                .map((optionObj, index) => {
                                    return optionObj.options.map((option, subIndex) => (
                                        <TouchableOpacity key={`${index}-${subIndex}`} onPress={() => handleSelectOption(option)}>
                                            <Text style={selectedWargear.includes(option) ? styles.selectedOption : styles.option}>{option}</Text>
                                        </TouchableOpacity>
                                    ));
                                })
                            }
                        </View>
                    )}
                </View>
            )}
            <Button title="Confirm" onPress={handleConfirm} />
            {model && model.defaultWargear && <Button title="Reset to default" onPress={handleReset} />}
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f2f2f2',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
        textAlign: 'center',
    },
    modelInfo: {
        fontSize: 18,
        marginBottom: 10,
        color: '#666',
        backgroundColor: '#ddd',
        padding: 10,
        borderRadius: 5,
    },
    option: {
        fontSize: 16,
        marginBottom: 5,
        color: '#555',
    },
    selectedOption: {
        fontSize: 16,
        marginBottom: 5,
        color: '#007AFF',
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
        color: '#222',
    },
    wargearContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#e8e8e8',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    wargear: {
        fontSize: 16,
        color: '#222',
    },
    addIcon: {
        backgroundColor: '#007AFF',
        borderRadius: 50,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addIconText: {
        color: '#fff',
        fontSize: 20,
    },
});


export default ModelCustomizationScreen;
