//components/game.js
import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import { deploymentPhase } from '../gamePhases/deploymentPhase';
import { movementPhase } from '../gamePhases/movementPhase';
import {NextPhaseButton} from "./nextPhaseButton";

const Game = () => {
  const [turn, setTurn] = useState(0);
  const [player, setPlayer] = useState(0);
  const [phase, setPhase] = useState(0);
  const players = ['Player 1', 'Player 2']; // Assuming a 2-player game
  const phases = ['Deployment', 'Movement', 'Psychic', 'Ranged', 'Charge', 'Melee', 'Shock', 'Scoreboard'];

  const nextPhase = () => {
    if (phase < phases.length - 1) {
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

  useEffect(() => {
    // Run the game logic for the current phase here
    // This will depend on your game's specific rules
    // For example:
    switch (phases[phase]) {
      case 'Deployment':
        deploymentPhase();
        break;
      case 'Movement':
        movementPhase();
        break;
      // etc.
    }
  }, [turn, player, phase]);

  return (
    <View>
      <Text>Turn: {turn}</Text>
      <Text>Current Player: {players[player]}</Text>
      <Text>Current Phase: {phases[phase]}</Text>
      <Button title="Next Phase" onPress={() => nextPhase()} />
    </View>
  );
};

export default Game;
