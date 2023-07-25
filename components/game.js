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
        if (phase === 0) {
            console.log("deploymentPhase")
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
        console.log("pressed");
      
        const [x, y] = convertScreenToWorld(screenX, screenY, screenWidth, screenHeight, playAreaWidth, playAreaHeight);
      
        const squadData = deployedSquads.find(unit => {
            // Define unit boundary, considering the size of the model
            const modelSize = unit.models[0].gameData.size;
            const rows = Math.ceil(unit.models.length / 5);
            const columns = Math.min(unit.models.length, 5);
            // Define the boundaries
            const boundaryX1 = unit.position.x - modelSize * 2.5;
            const boundaryX2 = unit.position.x + modelSize * 2.5;
            const boundaryY1 = unit.position.y - modelSize * rows;
            const boundaryY2 = unit.position.y + modelSize * rows;
      
            // Check if the click is within the boundaries
            return x >= boundaryX1 && x <= boundaryX2 && y >= boundaryY1 && y <= boundaryY2;
        });   
        // if (squadData) {
        //     console.log('squad Selected:', squadData);
        //     console.log(squadData.player);
        // }

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
                        alert('Cannot move opponent unit');
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
    
        if (unitToDeployIndex !== -1) {
            const unitToDeploy = currentArmyData.units[unitToDeployIndex];
            const modelSize = unitToDeploy.models[0].gameData.size;
    
            // Calculate rows and columns
            const rows = Math.ceil(unitToDeploy.models.length / 5);
            const columns = Math.min(unitToDeploy.models.length, 5);
    
            // Calculate the offset of the first model
            const offsetX = x - ((columns * modelSize) / 2);
            const offsetY = y - ((rows * modelSize) / 2); 
    
            // Define unit boundary
            const unitBoundaryX = offsetX + (modelSize * (columns - 1));
            const unitBoundaryY = offsetY + (modelSize * (rows - 1));
    
            // Check if deployment position + unit boundary is within game area, while considering the size of the model and the buffer
            if (offsetX >= 5 && unitBoundaryX + modelSize + 10 <= playAreaWidth &&
                offsetY >= 5 && unitBoundaryY + modelSize + 5 <= playAreaHeight) {
    
                // Adding x, y coordinates to each model in the unit
                const updatedModels = unitToDeploy.models.map((model, index) => {
                    // Calculate row and column for model, assuming a max of 5 models per row
                    const row = Math.floor(index / 5);
                    const col = index % 5;
    
                    return {
                        ...model,
                        gameData: {
                            ...model.gameData,
                            x: offsetX + col * modelSize,  // assign x-coordinate based on model's column
                            y: offsetY + row * modelSize,  // assign y-coordinate based on model's row
                        },
                    };
                });
    
                const deployedUnit = {
                    ...unitToDeploy,
                    models: updatedModels,  // updating models with the new coordinates
                    // set the center of the squad as the unit's position
                    position: { x: offsetX + (columns * modelSize) / 2, y: offsetY + (rows * modelSize) / 2 }, 
                    player: players[player],
                    isDeployed: true,
                    moved: false,
                };
    
                // Deploy unit by updating the armyData array
                const newArmyData = { ...currentArmyData };  // Clone the armyData object
                newArmyData.units[unitToDeployIndex] = deployedUnit;
    
                setCurrentArmyData(newArmyData);
    
                // Update squads state
                setDeployedSquads(prevSquads => [...prevSquads, deployedUnit]);
            } else {
                console.log('Unit deployment position is outside the game area');
                alert('Unit deployment position is outside the game area');
            }
        } else {
            // If no units are left to deploy, send an alert to the phone
            alert('No more units to deploy');
        }
    };
    
    
    
    
    

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
    // Iterate over every model in the unit
    for (let i = 0; i < unit.models.length; i++) {
        const model = unit.models[i];

        const maxMovementDistance = parseInt(model.gameData.movement) * 100;

        // Construct the model's current position
        const currentPosition = { x: model.gameData.x, y: model.gameData.y };

        // Calculate the Euclidean distance between the model's current position and the new position
        const distance = calculateDistance(currentPosition, newPosition);

        // Check if the unit has already moved this turn
        if (unit.moved) {
            console.log("This unit has already moved this turn.");
            return;  // return early if the unit has already moved
        }

        // Check if the move is within the model's movement range
        if (distance <= maxMovementDistance) {

            const proposedModelsPositions = unit.models.map(m => {
                const proposedPosition = {
                    x: m.gameData.x + newPosition.x - unit.position.x,
                    y: m.gameData.y + newPosition.y - unit.position.y
                };
                return proposedPosition;
            });

            // Check if any proposed position is outside the play area
            if (proposedModelsPositions.some(pos => pos.x - model.gameData.size < 0 || pos.y - model.gameData.size < 0 || pos.x + model.gameData.size  + 10> playAreaWidth || pos.y + model.gameData.size  > playAreaHeight)) {
                console.log('Move would result in model being outside the play area');
                alert('Move would result in model being outside the play area');
                return;
            }

            // Update the position of each model in the unit and set the 'moved' flag to true
            setDeployedSquads(prevSquads => {
                return prevSquads.map(squad => {
                    if (squad.id === unit.id) {
                        return {
                            ...squad,
                            models: squad.models.map(m => {
                                if (m.id === model.id) {
                                    return {
                                        ...m,
                                        gameData: {
                                            ...m.gameData,
                                            // Add the difference between the new and old unit positions to each model's position
                                            x: m.gameData.x + newPosition.x - unit.position.x,
                                            y: m.gameData.y + newPosition.y - unit.position.y,
                                        },
                                    };
                                } else {
                                    return m;
                                }
                            }),
                            moved: true,
                            // Update the unit's position
                            position: newPosition,
                        };
                    } else {
                        return squad;
                    }
                });
            });

            // Update currentArmyData based on the new deployedSquads
            setCurrentArmyData(prevArmyData => {
                return {
                    ...prevArmyData,
                    units: deployedSquads
                };
            });
        } else {
            console.log('Move exceeds model movement range');
            alert('Move exceeds model movement range');
        }
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