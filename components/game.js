import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import GameMap from './gameMap';
// import { deploymentPhase } from '../gamePhases/deploymentPhase';
import { movementPhase } from '../gamePhases/movementPhase';
import { Picker } from '@react-native-picker/picker';

const Game = ({ army, map: initialMap }) => {
  // ----------------- State Variables -----------------
  const [turn, setTurn] = useState(0);
  const [player, setPlayer] = useState(0);
  const [phase, setPhase] = useState(0);
  const [map, setMap] = useState(initialMap);

  // ----------------- Constants -----------------
  const players = ['Player 1', 'Player 2']; // Assuming a 2-player game
  const phases = ['Deployment', 'Movement', 'Psychic', 'Ranged', 'Charge', 'Melee', 'Shock'];//deployment and scoreboard is its own

  // ----------------- Phase Transition Function -----------------
  const nextPhase = () => {
    if (turn === 0) {
        setPhase("Deployment")
        setPlayer(player + 1);
        setTurn(turn + 1);
        console.log("deployment")
    }
    if (phase < phases.length - 1) {
        console.log("next")
      setPhase(phase + 1);
    } else {
        console.log("idkkk")

      setPhase(0);
      if (player < players.length - 1) {
        setPlayer(player + 1);
      } else {
        setPlayer(0);
        setTurn(turn + 1);
        setPhase("Scoreboard")
      }
    }
  };

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
    // ...
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
        console.log(army.units);
        deploymentPhase(army)
        break;
      case 'Movement':
        console.log("2")
        movementPhase();
        break;
      // etc.
    }
  }, [turn, player, phase, army, map]);


  const deploymentPhase = (army) => {
    console.log(army.units);
};


const movementPhase = (army) => {
    console.log(army.units);
};

  // ----------------- Map Initialization -----------------
  useEffect(() => {
    setMap(initialMap);
  }, [initialMap]);

  // ----------------- Render -----------------
  return (
    <View>
        {console.log('Map in GameMap:', map)} 

      <Text>Turn: {turn}</Text>
      <Text>Current Player: {players[player]}</Text>
      <Text>Current Phase: {phases[phase]}</Text>
      <Button title="Next Phase" onPress={nextPhase} />
      <GameMap mapData={map} onCellPress={handleCellPress} />  
    </View>
  );
};

export default Game;
