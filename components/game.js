import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import GameMap from './gameMap';
// import { deploymentPhase } from '../gamePhases/deploymentPhase';
// import { movementPhase } from '../gamePhases/movementPhase';
import { Picker } from '@react-native-picker/picker';

const Game = ({ army, map: initialMap }) => {
    // ----------------- State Variables -----------------
    const [turn, setTurn] = useState(0);
    const [player, setPlayer] = useState(0);
    const [phase, setPhase] = useState(0);
    const [map, setMap] = useState(initialMap);
    const [unitsToDeploy, setUnitsToDeploy] = useState(army.units);
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
    const phases = ['Deployment', 'Movement', 'Psychic', 'Ranged', 'Charge', 'Melee', 'Shock'];//deployment and scoreboard is its own

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
        // Handle cell press during movement phase
        // ...
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
