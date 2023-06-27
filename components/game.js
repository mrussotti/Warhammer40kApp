//components/game.js
import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import GameMap from './gameMap';
import { Picker } from '@react-native-picker/picker';

const Game = ({ army, map: initialMap }) => {
    // ----------------- State Variables -----------------
    const [turn, setTurn] = useState(0);
    const [player, setPlayer] = useState(0);
    const [phase, setPhase] = useState(0);
    const [map, setMap] = useState(initialMap);
    const [unitsToDeploy, setUnitsToDeploy] = useState(army.units);
    const [selectedUnit, setSelectedUnit] = useState(null);
    const units =  ['Unit1', 'Unit2', 'Unit3', 'Unit4', 'Unit5']
    
    useEffect(() => {
        const fetchUnitsForArmy = async () => {
            units = await fetchUnits(army.units); // Replace with your function to fetch units
            setUnitsToDeploy(units);
        };
    
        fetchUnitsForArmy();
    }, [army.id]);
    
    // ----------------- Constants -----------------
    const players = ['Player 1', 'Player 2']; // Assuming a 2-player game
    const phases = ['Deployment', 'Movement', 'Psychic', 'Ranged', 'Charge', 'Melee', 'Shock'];

    // ----------------- Phase Transition Function -----------------
    const nextPhase = () => {
        if (phase === 0 && unitsToDeploy === 0) {
            // if (player < players.length - 1) {
            //     // Move to the next player
            //     setPlayer(player + 1);
            //     setUnitsToDeploy(army.units);
            // } else {
            //     // All players have deployed their units, move to the next phase
            //     setPhase(phase + 1);
            // }
            //commented it for testing purposes, not ready for multi player content
            setPlayer(player);
            setUnitsToDeploy(army.units);
            setPhase(phase + 1);

        } else if (phase < phases.length - 1) {
            setPhase(phase + 1);
        } else {
            setPhase(0);
            if (player < players.length - 1) {
                setPlayer(player + 1);
            } else {
                setPlayer(0);
                setTurn(turn + 1);
            }
        }
    };


    // ----------------- Game Phase Logic -----------------
    // useEffect(() => {
    //     // Reset the number of units to deploy at the start of the deployment phase
    //     if (phases[phase] === 'Deployment') {
    //         setUnitsToDeploy(army.units);
    //     }
    // }, [phase]);
    // ----------------- Cell Press Handlers -----------------
    const handleCellPress = (rowIndex, cellIndex) => {
        // Delegates to the appropriate handler based on the current phase
        switch (phases[phase]) {
            case 'Deployment':
                handleDeploymentCellPress(rowIndex, cellIndex);
                break;
            case 'Movement':
                handleMovementCellPress(rowIndex, cellIndex);
                break;
            // etc.
        }
    };

    const handleDeploymentCellPress = (rowIndex, cellIndex) => {
        // Handle cell press during deployment phase
        if (unitsToDeploy.length > 0) {
            // Place a unit in the selected cell
            

            const newMap = [...map];
            newMap[rowIndex][cellIndex] = { player: players[player], unit: unitsToDeploy[0] };
            setMap(newMap);
            console.log("deployed");
            // Remove the deployed unit from the unitsToDeploy array
            setUnitsToDeploy(unitsToDeploy.slice(1));
        }
    };
    

    const handleMovementCellPress = (rowIndex, cellIndex) => {
        // If a unit is already selected for movement
        if (selectedUnit) {
            // If the selected cell is empty
            if (!map[rowIndex][cellIndex].unit) {
                // Move the unit to the selected cell
                const newMap = [...map];
                newMap[rowIndex][cellIndex] = { player: players[player], unit: selectedUnit.unit };
                // Remove the unit from its original cell
                newMap[selectedUnit.rowIndex][selectedUnit.cellIndex].unit = null;
                setMap(newMap);

                // Deselect the unit
                setSelectedUnit(null);
            }
            // If the selected cell contains a unit
            else {
                // If the unit belongs to the current player
                if (map[rowIndex][cellIndex].player === players[player]) {
                    // Select the unit
                    setSelectedUnit({ rowIndex, cellIndex, unit: map[rowIndex][cellIndex].unit });
                }
            }
        }
        // If no unit is selected
        else {
            // If the selected cell contains a unit that belongs to the current player
            if (map[rowIndex][cellIndex].unit && map[rowIndex][cellIndex].player === players[player]) {
                // Select the unit
                setSelectedUnit({ rowIndex, cellIndex, unit: map[rowIndex][cellIndex].unit });
            }
        }
    };



    // ----------------- Game Phase Logic -----------------
    useEffect(() => {
        // Run the game logic for the current phase here
        // This will depend on your game's specific rules
        // For example:
        switch (phases[phase]) {
            case 'Deployment':
                console.log(army + "---------------")
                deploymentPhase(army)
                break;
            case 'Movement':
                movementPhase();
                break;
            // etc.
        }
    }, [turn, player, phase, army, map]);


    const deploymentPhase = (army) => {
        
    };


    const movementPhase = (army) => {
        
    };

        // ----------------- Game Phase State Reset -----------------
        useEffect(() => {
            setSelectedUnit(null);
        }, [player, phase]);

    // ----------------- Map Initialization -----------------
    useEffect(() => {
        setMap(initialMap);
    }, [initialMap]);

    // ----------------- Render -----------------
    return (
        <View>    
            <Text>Turn: {turn}</Text>
            <Text>Current Player: {players[player]}</Text>
            <Text>Current Phase: {phases[phase]}</Text>
            <Text>Units to Deploy: {unitsToDeploy.join(', ')}</Text>
            <Button title="Next Phase" onPress={nextPhase} />
            <GameMap mapData={map} onCellPress={handleCellPress} />
        </View>
    );
    
};

export default Game;
