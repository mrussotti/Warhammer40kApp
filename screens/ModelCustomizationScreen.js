//screens/ModelCustomizationScreen.js
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { db } from '../firebase';


const ModelCustomizationScreen = ({ route, navigation }) => {
    const { modelId, squadId, armyId } = route.params;
    const [model, setModel] = useState(null);
    const [squad, setSquad] = useState(null);
    const [selectedWargear, setSelectedWargear] = useState([]);
    const [wargearToReplace, setWargearToReplace] = useState(null);
    const [army, setArmy] = useState(null);
    const armyRef = useRef(); // <-- declare the ref

    const [wargearOptions, setWargearOptions] = useState([]);



    useEffect(() => {
        armyRef.current = db.collection('Armies').doc(armyId); 
        const unsubscribe = armyRef.current.onSnapshot(async doc => { // <-- use the ref
            const data = doc.data();
            setArmy(data); // <--- add this line

            const updatedSquad = data.units.find(unit => unit.id === squadId);

            if (updatedSquad) {


                setSquad(updatedSquad);

                // Find model based on the modelId
                const updatedModel = updatedSquad.models.find(model => model.id === modelId);


                if (updatedModel) {

                    setModel(updatedModel);

                    // Find wargear options for the model
                    const modelRule = updatedSquad.rules.find(rule => rule.name === updatedModel.name);
                    if (modelRule) {
                        const options = getWargearOptions(modelRule.wargearOptions, updatedSquad);
                        console.log("))))))))))))))))))))0")

                        console.log(options)
                        setWargearOptions(options);
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
        if (model && army) { // <-- add army to the check
            const updatedModel = { ...model, currentWargear: selectedWargear };
    
            // Find the index of the model in the squad
            const modelIndex = squad.models.findIndex(m => m.id === model.id);
    
            // Replace the old model with the updated one
            const updatedModels = [...squad.models];
            updatedModels[modelIndex] = updatedModel;
    
            // Update the squad's models
            const updatedSquad = { ...squad, models: updatedModels };
    
            // Find the index of the squad in the army's units
            const squadIndex = army.units.findIndex(unit => unit.id === squad.id); // <-- use army.units here
    
            // Replace the old squad with the updated one
            const updatedUnits = [...army.units]; // <-- use army.units here
            updatedUnits[squadIndex] = updatedSquad;
    
            // Update the army's units in Firebase
            await armyRef.current.update({ // <-- use the ref in handleConfirm
                units: updatedUnits
            });
        }
    };
    




    const getWargearOptions = (rules, squad) => {
        const availableOptions = [];
        rules.forEach(rule => {
            const { for: ruleFor, if: ruleIf, options, replace } = rule;
            const modelCount = squad.models.filter(model => model.name === ruleFor).length;
            // Check if the rule has a condition. If it doesn't, just add the options
            if (!ruleIf || checkCondition(ruleIf, modelCount)) {
                availableOptions.push({ replace, options });
            }
        });
        return availableOptions;
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
                        <TouchableOpacity key={index} onPress={() => handleSelectWargear(gear)}>
                            <Text style={styles.wargear}>
                                {gear}
                                {wargearOptions.some(optionObj => optionObj.replace.includes(gear)) && ' (swappable)'}
                            </Text>
                        </TouchableOpacity>
                    ))}
                    {wargearToReplace && (
                        <View>
                            <Text style={styles.subtitle}>Select a wargear to replace {wargearToReplace}:</Text>
                            {wargearOptions
                            .filter(optionObj => optionObj.replace.includes(wargearToReplace))
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
        </View>
    );
    

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    modelInfo: {
        fontSize: 18,
        marginBottom: 10,
    },
    option: {
        fontSize: 16,
        marginBottom: 5,
    },
    selectedOption: {
        fontSize: 16,
        marginBottom: 5,
        color: 'blue',
    },
    subtitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
    },
    currentWargear: {
        fontSize: 16,
        marginBottom: 5,
    },
});

export default ModelCustomizationScreen;
