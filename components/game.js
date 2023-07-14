// components/game.js
import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import GameMap from './gameMap';
import { Picker } from '@react-native-picker/picker';
import useFetchUnitsData from './FetchUnitsData';
import UnitInfoModal from './UnitInfoModal';  // import here



const Game = ({ armyId, map: initialMap }) => {
    const { isLoading, unitsData, error } = useFetchUnitsData(armyId);

    const [turn, setTurn] = useState(0);
    const [player, setPlayer] = useState(0);
    const [phase, setPhase] = useState(0);
    const [map, setMap] = useState(initialMap || []);
    const [unitsToDeploy, setUnitsToDeploy] = useState([]);
    const [selectedUnit, setSelectedUnit] = useState(null);
    const [movedUnits, setMovedUnits] = useState([]);
    const [moveInstruction, setMoveInstruction] = useState(null);
    const [shootingTarget, setShootingTarget] = useState(null);


    const onSelectTarget = (targetUnit) => {
        setShootingTarget(targetUnit);
    };
    const handleMoveInstruction = (unit) => {
        setMoveInstruction(unit);
        setSelectedUnit(null);  // Close the modal
    };

    useEffect(() => {
        if (!isLoading && unitsData) {
            const unitsWithUniqueId = unitsData.map((unit, index) => ({
                ...unit,
                id: `${armyId}-${index}`
            }));
            console.log(unitsWithUniqueId)


            setUnitsToDeploy(unitsWithUniqueId);
        }
    }, [isLoading, unitsData]);

    const players = ['Player 1', 'Player 2'];
    const phases = ['Deployment', 'Movement', 'Psychic', 'Shooting', 'Charge', 'Melee', 'Shock'];

    const nextPhase = () => {
        if (phase === 0 && unitsToDeploy.length === 0) {
            setPlayer(player);
            setUnitsToDeploy(unitsData);
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
                setMovedUnits([]); // Reset the moved units list
            }
        }
    };

    const handleCellPress = (rowIndex, cellIndex) => {
        const cellData = map[rowIndex][cellIndex];
        if (cellData.unit && cellData.player === players[player]) {
            setSelectedUnit({ ...cellData.unit, position: [rowIndex, cellIndex] });  // Use data from the unit
        }
        switch (phases[phase]) {
            case 'Deployment':
                handleDeploymentCellPress(rowIndex, cellIndex);
                break;
            case 'Movement':
                if (moveInstruction) {
                    handleMoveUnit([rowIndex, cellIndex], moveInstruction);
                    setMoveInstruction(null);  // Clear the move instruction
                } else {
                    handleMovementCellPress(rowIndex, cellIndex, cellData);
                }
                break;
            case 'Shooting':
                if (selectedUnit) {
                    handleShooting(selectedUnit, cellData.unit);
                } else {
                    onSelectTarget(cellData.unit);
                }
                break;
        }
    };


    const handleDeploymentCellPress = (rowIndex, cellIndex) => {
        if (unitsToDeploy.length > 0) {
            const newMap = [...map];
            newMap[rowIndex][cellIndex] = { player: players[player], unit: unitsToDeploy[0] };
            setMap(newMap);
            setUnitsToDeploy(unitsToDeploy.slice(1));
        }
    };

    const handleMovementCellPress = (rowIndex, cellIndex) => {//delete this?
        // const cellData = map[rowIndex][cellIndex];  // Get the cell data

        // if (selectedUnit) {
        //     const maxMovementDistance = parseInt(selectedUnit.unit.gameData.movement);
        //     const [selectedUnitRow, selectedUnitCell] = selectedUnit.position;
        //     const distance = Math.abs(rowIndex - selectedUnitRow) + Math.abs(cellIndex - selectedUnitCell);

        //     // Check if this unit has already moved this turn
        //     if (movedUnits.includes(selectedUnit.unit.id)) {
        //         setSelectedUnit(null);
        //         return;
        //     }

        //     if (distance <= maxMovementDistance && !map[rowIndex][cellIndex].unit) {
        //         const newMap = [...map];
        //         newMap[rowIndex][cellIndex] = { player: players[player], unit: selectedUnit.unit };
        //         newMap[selectedUnitRow][selectedUnitCell] = { player: null, unit: null };
        //         // setMap(newMap);
        //         setSelectedUnit(null);
        //         // setMovedUnits([...movedUnits, selectedUnit.unit.id]);
        //     }
        // } else {
        //     if (cellData.unit && cellData.player === players[player]) {
        //         setSelectedUnit({ ...cellData.unit, position: [rowIndex, cellIndex] });  // Use data from the unit
        //     }
        // }
    };

    useEffect(() => {
        switch (phases[phase]) {
            case 'Deployment':
                deploymentPhase(unitsData);
                break;
            case 'Movement':
                movementPhase();
                break;
        }
    }, [turn, player, phase, unitsData, map]);

    const deploymentPhase = (unitsData) => {
        // logic for deployment phase
    };

    const movementPhase = (unitsData) => {
        // logic for movement phase
    };

    // Add the handleShooting function.
    const handleShooting = (shootingUnit, targetUnit) => {
        // TODO: Implement the logic for shooting.
    };


    const handleMoveUnit = (newPosition, unit) => {
        console.log(unit)
        console.log("__________________________________")
        console.log(unit.unit)
        const [newRowIndex, newCellIndex] = newPosition;

        const maxMovementDistance = parseInt(unit.gameData.movement);
        const [selectedUnitRow, selectedUnitCell] = unit.position;
        const distance = Math.abs(newRowIndex - selectedUnitRow) + Math.abs(newCellIndex - selectedUnitCell);

        // Check if this unit has already moved this turn
        if (movedUnits.includes(unit.id)) {
            return;
        }

        if (distance <= maxMovementDistance && !map[newRowIndex][newCellIndex].unit) {
            const newMap = [...map];
            newMap[newRowIndex][newCellIndex] = { player: players[player], unit: unit };
            newMap[selectedUnitRow][selectedUnitCell] = { player: null, unit: null };
            setMap(newMap);
            setMovedUnits([...movedUnits, unit.id]);
        }
    };


    return (
        <View>
            <Text>Turn: {turn + 1}, {players[player]}'s {phases[phase]} Phase</Text>
            <Button title="Next Phase" onPress={nextPhase} />

            <GameMap map={map || []} onCellPress={handleCellPress} />
            {phase === 0 && (
                <View>
                    <Text>Select a unit to deploy:</Text>
                    <Picker selectedValue={selectedUnit} onValueChange={unit => setSelectedUnit(unit)}>
                        {unitsToDeploy.map((unit, i) => (
                            <Picker.Item key={i} label={unit.name} value={unit} />
                        ))}
                    </Picker>
                </View>
            )}

            <UnitInfoModal
                visible={!!selectedUnit}
                unit={selectedUnit}
                onClose={() => setSelectedUnit(null)}
                phase={phases[phase]}
                onMoveUnit={handleMoveInstruction}  // Note this change
                shootPhase={ handleShooting }

            />
        </View>
    );
};

export default Game;
