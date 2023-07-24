// components/game.js
import React, { useState, useEffect } from 'react';
import { View, Text, Button, Dimensions, document } from 'react-native';
import PlayArea from '../maps/PlayArea';
import { Picker } from '@react-native-picker/picker';
import useFetchUnitsData from './FetchUnitsData';
import UnitInfoModal from './UnitInfoModal';
import Unit from '../maps/Unit'; // import here


const Game = ({ armyId, playAreaWidth, playAreaHeight }) => {
    const { isLoading, armyData, error } = useFetchUnitsData(armyId);
    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;
    const [turn, setTurn] = useState(0);
    const [player, setPlayer] = useState(0);
    const [phase, setPhase] = useState(0);
    const [deployedSquads, setDeployedSquads] = useState([]);  // units now represent units with their positions
    const [squadsToDeploy, setSquadToDeploy] = useState([]);
    const [selectedUnit, setSelectedUnit] = useState(null);
    const [movedSquads, setMovedSquads] = useState([]);
    const [moveInstruction, setMoveInstruction] = useState(null);
    const [shootingTarget, setShootingTarget] = useState(null);
    const [shootInstruction, setShootInstruction] = useState(null);
    const players = ['Player 1', 'Player 2'];
    const phases = ['Deployment', 'Movement', 'Psychic', 'Shooting', 'Charge', 'Melee', 'Shock'];
    const [currentArmyData, setCurrentArmyData] = useState(null);



    const handleMoveInstruction = (unit) => {
        console.log("handle move Instruction---------------------------")
        console.log(unit)
        setMoveInstruction(unit);
        setSelectedUnit(null);  // Close the modal
    };
    const handleShootInstruction = (unit, weapon) => {
        console.log("handle Shooting Instruction---------------------------")
        console.log(unit)
        console.log(weapon)
        const shootingInstruction = {
            ...unit,
            selectedWeapon: weapon,  // Include the selected weapon in the instruction
        };

        setShootInstruction(shootingInstruction);
        setSelectedUnit(null);  // Close the modal
    };






    useEffect(() => {
        console.log("11111111111111111111111111111111111")
        if (!isLoading && armyData) {
            setCurrentArmyData(armyData)
            setSquadToDeploy(currentArmyData);
        }
    }, [isLoading, armyData]);




    const nextPhase = () => {
        if (phase === 0 && squadsToDeploy.length === 0) {
            console.log("happened")
            setCurrentArmyData(armyData)
            setPlayer(player);
            setSquadToDeploy(currentArmyData);
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
                setMovedSquads([]); // Reset the moved units list
            }
        }
    };



    const handleScreenPress = (screenX, screenY) => {
        console.log("pressed")

        const [x, y] = convertScreenToWorld(screenX, screenY, screenWidth, screenHeight, playAreaWidth, playAreaHeight);

        const squadData = deployedSquads.find(unit => {
            const unitCenterX = unit.x + unit.models[0].gameData.size / 2;
            const unitCenterY = unit.y + unit.models[0].gameData.size / 2;

            // calculate square of distance from the center of the unit to the click
            const distanceSquared = Math.pow(unitCenterX - x, 2) + Math.pow(unitCenterY - y, 2);

            // define the increased radius squared directly
            const increasedUnitRadiusSquared = Math.pow(unit.models[0].gameData.size, 2);

            // Check the square of the distance against the square of the increased radius
            return distanceSquared < increasedUnitRadiusSquared;
        });




        if (squadData) {
            console.log('squad Selected:', squadData);
            console.log(squadData.player);

        }

        switch (phases[phase]) {
            case 'Deployment':
                console.log("KLJ X: " + x)
                console.log("KLJ Y: " + y)

                handleDeploymentCellPress(x, y);
                break;
            case 'Movement':
                if (moveInstruction) {
                    // Make sure that the selected unit belongs to the current player
                    if (moveInstruction.player === players[player]) {
                        handleMoveUnit({ x, y }, moveInstruction);
                        setMoveInstruction(null);  // Clear the move instruction
                    } else {
                        console.log('Cannot move opponent unit');
                    }
                } else if (squadData && squadData.player === players[player]) {
                    setSelectedUnit({ ...squadData, position: { x, y } });  // Use data from the unit
                }
                break;
            case 'Shooting':
                if (shootInstruction) {
                    handleShooting(shootInstruction, { ...squadData, position: { x, y } });
                    setShootInstruction(null);  // Clear the shoot instruction
                } else if (squadData && squadData.player === players[player]) {
                    setSelectedUnit({ ...squadData, position: { x, y } });  // Use data from the unit
                }
                break;
            default:
                if (squadData && squadData.player === players[player]) {
                    setSelectedUnit({ ...squadData, position: { x, y } });  // Use data from the unit
                }
                break;
        }
    };

    const handleDeploymentCellPress = (x, y) => {

        const unitToDeployIndex = currentArmyData.units.findIndex(unit => !unit.isDeployed);
        console.log("index deploy", unitToDeployIndex)
    
        if (unitToDeployIndex !== -1) {
            const unitToDeploy = currentArmyData.units[unitToDeployIndex];
            // Check if deployment position is within game area
            if (x - unitToDeploy.models[0].gameData.size / 2 >= 0 &&
                y - unitToDeploy.models[0].gameData.size / 2 >= 0 &&
                x + unitToDeploy.models[0].gameData.size / 2 <= playAreaWidth &&
                y + unitToDeploy.models[0].gameData.size / 2 <= playAreaHeight) {
    
                // Adding x, y coordinates to each model in the unit
                const updatedModels = unitToDeploy.models.map((model, index) => {
                    return {
                        ...model,
                        gameData: {
                            ...model.gameData,
                            x: x + index * model.gameData.size,  // assigning coordinates based on model index
                            y: y + index * model.gameData.size,
                        },
                    };
                });
    
                const deployedUnit = {
                    ...unitToDeploy,
                    models: updatedModels,  // updating models with the new coordinates
                    position: { x, y },
                    x: x - unitToDeploy.models[0].gameData.size / 2,
                    y: y - unitToDeploy.models[0].gameData.size / 2,
                    player: players[player],
                };
    
    
                // Deploy unit by updating the armyData array
                const newArmyData = { ...currentArmyData };  // Clone the armyData object
                newArmyData.units[unitToDeployIndex] = {
                    ...newArmyData.units[unitToDeployIndex],
                    isDeployed: true
                };
    
    
                setCurrentArmyData(newArmyData);
    
                // Update squads state
                setDeployedSquads(prevSquads => [...prevSquads, deployedUnit]);
    
    
            } else {
                console.log('Unit deployment position is outside the game area');
            }
        } else {
            // If no units are left to deploy, send an alert to the phone
            alert('No more units to deploy');
        }
    };
    

    useEffect(() => {
        console.log(deployedSquads);
    }, [deployedSquads]);
    


    const handleShooting = (shootingInstruction, targetUnit) => {
        if (!targetUnit || !shootingInstruction || !shootingInstruction.selectedWeapon || !shootingInstruction.selectedWeapon.range) {
            console.log('No target unit selected or shooting instruction is incomplete');
            return;
        }

        // Ensure weapon range is an integer value
        const weaponRange = parseInt(shootingInstruction.selectedWeapon.range.replace('"', '')) * 100;
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

        // Calculate remaining wounds
        const remainingWounds = targetUnit.gameData.wounds - weaponDamage;

        // Check if the target unit is destroyed
        if (remainingWounds <= 0) {
            console.log('Target unit destroyed!');
            // Here you would remove the unit from the game or otherwise mark it as destroyed
            // For example:
            setDeployedSquads(deployedSquads.filter(u => u.id !== targetUnit.id));
        } else {
            console.log('Target unit damaged! Remaining wounds: ', remainingWounds);
            // Here you would update the unit's wounds in your game state
            // For example:
            setDeployedSquads(deployedSquads.map(u => {
                if (u.id === targetUnit.id) {
                    return {
                        ...u,
                        gameData: {
                            ...u.gameData,
                            wounds: remainingWounds
                        }
                    };
                } else {
                    return u;
                }
            }));
        }
    };


    // This function calculates the Euclidean distance between two points
    const calculateDistance = (point1, point2) => {
        return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
    }

    const handleMoveUnit = (newPosition, unit) => {
        const maxMovementDistance = parseInt(unit.gameData.movement) * 100;

        // Calculate the Euclidean distance between the unit's current position and the new position
        const distance = calculateDistance(unit.position, newPosition);

        // Check if the unit has already moved this turn
        if (movedSquads.includes(unit.id)) {
            console.log('Unit has already moved this turn');
            return;
        }

        // Check if the move is within the unit's movement range
        if (distance <= maxMovementDistance) {
            // Check if the new position overlaps with an existing unit
            // And if the new position is within the game area
            if (!deployedSquads.find(u => calculateDistance(u.position, newPosition) < unit.gameData.size) &&
                newPosition.x - unit.gameData.size / 2 >= 0 &&
                newPosition.y - unit.gameData.size / 2 >= 0 &&
                newPosition.x + unit.gameData.size / 2 <= playAreaWidth &&
                newPosition.y + unit.gameData.size / 2 <= playAreaHeight) {
                // Update the position of the unit in the units state
                setDeployedSquads(deployedSquads.map(u => {
                    if (u.id === unit.id) {
                        return {
                            ...u,
                            position: newPosition,
                            x: newPosition.x - u.gameData.size / 2,
                            y: newPosition.y - u.gameData.size / 2,
                        };
                    } else {
                        return u;
                    }
                }));
                // Add the unit to the list of moved units
                setMovedSquads([...movedSquads, unit.id]);
            } else {
                console.log('Move is blocked or outside the game area');
            }
        } else {
            console.log('Move exceeds unit movement range');
        }
    };

    const convertScreenToWorld = (screenX, screenY, screenWidth, screenHeight, playAreaWidth, playAreaHeight) => {
        const worldX = (screenX / screenWidth) * playAreaWidth;
        const worldY = (screenY / screenHeight) * playAreaHeight;

        return [worldX, worldY];
    };




    return (
        <View>
            <Text>Turn: {turn + 1}, {players[player]}'s {phases[phase]} Phase</Text>
            <Button title="Next Phase" onPress={nextPhase} />
            {/* {
            console.log("-------------------0000000000000")
            }
            {
            console.log(deployedSquads)
            } */}
            
            <PlayArea
                width={playAreaWidth}
                height={playAreaHeight}
                onPress={(evt) => handleScreenPress(evt.nativeEvent.locationX, evt.nativeEvent.locationY)}
            >
                {deployedSquads.map((squad, index) => (
                    squad.models.map((unit, unitIndex) => (
                        <Unit
                            x={unit.gameData.x}
                            y={unit.gameData.y}
                            unitData={unit}
                            key={`${index}-${unitIndex}`}
                            onPress={(x, y) => handleScreenPress(x, y)}
                        />
                    ))
                ))}
            </PlayArea>


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