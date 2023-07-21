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
      
      const getWargearOptions = (rules, squad) => {
        const availableOptions = [];
        rules.forEach(rule => {
            const { for: ruleFor, if: ruleIf, options, replace, max } = rule;
            const modelCount = squad.models.filter(model => model.name === ruleFor).length;
            // Check if the rule has a condition. If it doesn't, just add the options
            // Add a check for maximum number of this type of wargear
            if ((!ruleIf || checkCondition(ruleIf, modelCount)) && checkMax(replace, max, squad)) {
                availableOptions.push({ replace, options });
            }
        });
        return availableOptions;
    };
    
    const checkMax = (replace, max, squad) => {
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
          console.log("armyData: "+ armyData)
      
          const factionRef = db.collection('factions').where('name', '==', armyData.faction);
          const factionSnapshot = await factionRef.get();
          console.log("factionSnapshot: "+ factionSnapshot.docs[0].data())
      
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
            {model && model.defaultWargear && <Button title="Reset to default" onPress={handleReset} />}
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
