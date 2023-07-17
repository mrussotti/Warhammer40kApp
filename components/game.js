// components/game.js
import React, { useState, useEffect } from 'react';
import { View, Text, Button, Dimensions } from 'react-native';
import PlayArea from '../maps/PlayArea';
import { Picker } from '@react-native-picker/picker';
import useFetchUnitsData from './FetchUnitsData';
import UnitInfoModal from './UnitInfoModal';
import Unit from '../maps/Unit'; // import here

const Game = ({ armyId, playAreaWidth, playAreaHeight }) => {
    const { isLoading, unitsData, error } = useFetchUnitsData(armyId);
    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;
    const [turn, setTurn] = useState(0);
    const [player, setPlayer] = useState(0);
    const [phase, setPhase] = useState(0);
    const [units, setUnits] = useState([]);  // units now represent units with their positions
    const [unitsToDeploy, setUnitsToDeploy] = useState([]);
    const [selectedUnit, setSelectedUnit] = useState(null);
    const [movedUnits, setMovedUnits] = useState([]);
    const [moveInstruction, setMoveInstruction] = useState(null);
    const [shootingTarget, setShootingTarget] = useState(null);
    const [shootInstruction, setShootInstruction] = useState(null);



    const onSelectTarget = (targetUnit) => {
        setShootingTarget(targetUnit);
    };
    const handleMoveInstruction = (unit) => {
        setMoveInstruction(unit);
        setSelectedUnit(null);  // Close the modal
    };
    const handleShootInstruction = (unit, weapon) => {
        const shootingInstruction = {
            ...unit,
            selectedWeapon: weapon,  // Include the selected weapon in the instruction
        };

        setShootInstruction(shootingInstruction);
        setSelectedUnit(null);  // Close the modal
    };






    useEffect(() => {
        if (!isLoading && unitsData) {
            const unitsWithUniqueId = unitsData.map((unit, index) => ({
                ...unit,
                id: `${armyId}-${index}`
            }));
            // console.log(unitsWithUniqueId)


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

    const handleScreenPress = (screenX, screenY) => {
        console.log("pressed")

        const [x, y] = convertScreenToWorld(screenX, screenY, screenWidth, screenHeight, playAreaWidth, playAreaHeight);

        // find the condition that determines if the pressed position is on a unit
        const unitData = units.find(unit =>
            Math.abs(unit.x - x) < unit.gameData.size / 2 &&
            Math.abs(unit.y - y) < unit.gameData.size / 2
        );

        switch (phases[phase]) {
            case 'Deployment':
                console.log("KLJ X: "+ x)
                console.log("KLJ Y: "+ y)

                handleDeploymentCellPress(x, y);
                break;
            case 'Movement':
                if (moveInstruction) {
                    handleMoveUnit({ x, y }, moveInstruction);
                    setMoveInstruction(null);  // Clear the move instruction
                } else if (unitData && unitData.player === players[player]) {
                    setSelectedUnit({ ...unitData, position: { x, y } });  // Use data from the unit
                }
                break;
            case 'Shooting':
                if (shootInstruction) {
                    handleShooting(shootInstruction, { ...unitData, position: { x, y } });
                    setShootInstruction(null);  // Clear the shoot instruction
                } else if (unitData && unitData.player === players[player]) {
                    setSelectedUnit({ ...unitData, position: { x, y } });  // Use data from the unit
                }
                break;
            default:
                if (unitData && unitData.player === players[player]) {
                    setSelectedUnit({ ...unitData, position: { x, y } });  // Use data from the unit
                }
                break;
        }
    };






    const handleDeploymentCellPress = (x, y) => {
        if (unitsToDeploy.length > 0) {
            const newUnits = [...units];
            const unitToDeploy = unitsToDeploy[0];
    
            if (unitToDeploy) {
                const deployedUnit = {
                    ...unitToDeploy,
                    position: { x, y },
                    x: x, // add x-coordinate
                    y: y, // add y-coordinate
                };
                newUnits.push(deployedUnit);
                setUnits(newUnits);
                setUnitsToDeploy(unitsToDeploy.slice(1));
                console.log("deployed")
            } else {
                console.log('No more units to deploy');
            }
        } else {
            console.log('No more units to deploy');
        }
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
    }, [turn, player, phase, unitsData]);


    const deploymentPhase = (unitsData) => {
        // logic for deployment phase
    };

    const movementPhase = (unitsData) => {
        // logic for movement phase
    };

    const handleShooting = (shootingInstruction, targetUnit) => {
        if (!targetUnit || !shootingInstruction || !shootingInstruction.selectedWeapon || !shootingInstruction.selectedWeapon.range) {
            console.log('No target unit selected or shooting instruction is incomplete');
            return;
        }

        // Ensure weapon range is an integer value
        const weaponRange = parseInt(shootingInstruction.selectedWeapon.range.replace('"', ''));
        const weaponDamage = parseInt(shootingInstruction.selectedWeapon.damage);
        const shooterPosition = shootingInstruction.position;

        const targetPosition = targetUnit.position;

        // Calculate the Euclidean distance
        const distance = Math.sqrt(Math.pow(targetPosition.y - shooterPosition.y, 2) + Math.pow(targetPosition.x - shooterPosition.x, 2));

        // Check if the target is within range
        if (distance > weaponRange) {
            console.log('Target is out of range');
            return;
        }

        // Here you would implement a dice roll or another mechanism to decide whether the shot hits.
        // But for now, let's say the shot always hits.

        // Apply damage to the target unit
        // For simplicity's sake, let's just subtract the weapon damage from the target unit's wounds
        targetUnit.gameData.wounds -= weaponDamage;

        // Check if the target unit is destroyed
        if (targetUnit.gameData.wounds <= 0) {
            console.log('Target unit destroyed!');
            // Here you would remove the unit from the game or otherwise mark it as destroyed
            // For example:
            setUnits(units.filter(u => u.id !== targetUnit.id));
        } else {
            console.log('Target unit damaged! Remaining wounds: ', targetUnit.gameData.wounds);
            // Here you would update the unit's wounds in your game state
        }
    };

    const handleMoveUnit = (newPosition, unit) => {
        const maxMovementDistance = parseInt(unit.gameData.movement);
        const distance = Math.sqrt(Math.pow(newPosition.x - unit.position.x, 2) + Math.pow(newPosition.y - unit.position.y, 2));

        // Check if this unit has already moved this turn
        if (movedUnits.includes(unit.id)) {
            return;
        }

        if (distance <= maxMovementDistance && !units.find(u =>
            Math.abs(u.position.x - newPosition.x) < unit.gameData.size / 2 &&
            Math.abs(u.position.y - newPosition.y) < unit.gameData.size / 2
        )) {
            setUnits(units.map(u => {
                if (u.id === unit.id) {
                    return { ...u, position: newPosition };
                } else {
                    return u;
                }
            }));
            setMovedUnits([...movedUnits, unit.id]);
        }
    };


    const convertScreenToWorld = (screenX, screenY, screenWidth, screenHeight, playAreaWidth, playAreaHeight) => {
        console.log("screenX: "+ screenX)
        console.log("screenY: "+ screenY)
        console.log("screenWidth: "+ screenWidth)
        console.log("screenHeight: "+ screenHeight)
        console.log("playAreaWidth: "+ playAreaWidth)
        console.log("playAreaHeight: "+ playAreaHeight)


        const worldX = (screenX / screenWidth) * playAreaWidth;
        const worldY = (screenY / screenHeight) * playAreaHeight;
        console.log("x: "+ worldX)
        console.log("y: "+ worldY)

        return [worldX, worldY];
    };




    return (
        <View>
            <Text>Turn: {turn + 1}, {players[player]}'s {phases[phase]} Phase</Text>
            <Button title="Next Phase" onPress={nextPhase} />

            <PlayArea
                width={playAreaWidth}
                height={playAreaHeight}
                onPress={(evt) => handleScreenPress(evt.nativeEvent.locationX, evt.nativeEvent.locationY)}
            >
                {units.map((unitData, index) => (
                    <Unit
                        x={unitData.x}
                        y={unitData.y}
                        unitData={unitData}
                        key={index}
                    />
                ))}
            </PlayArea>


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
                onMoveUnit={handleMoveInstruction}
                onShootUnit={handleShootInstruction}
            />
        </View>
    );
};

export default Game;