import React, { useState } from 'react';
import { Modal, Text, View, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

const UnitInfoModal = ({ visible, unit, onClose, phase, onMoveUnit, onShootUnit, showMoreDetails }) => {
    const [isWeaponSelectionVisible, setWeaponSelectionVisible] = useState(false);
    const [selectedWeapon, setSelectedWeapon] = useState(null);

    const handleShoot = () => {
        setWeaponSelectionVisible(true);
    };

    const handleWeaponSelection = (weapon) => {
        console.log('Selected weapon:', weapon); // This line will print the selected weapon
        setSelectedWeapon(weapon);
        setWeaponSelectionVisible(false);
        onShootUnit(unit, weapon);
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    {unit && (
                        <>

                            <Text style={styles.modalText}>Name: {unit.name}</Text>
                            <Text style={styles.modalText}>Movement: {unit.gameData.movement}</Text>
                            <Text style={styles.modalText}>Weapon Skill: {unit.gameData.weaponSkill}</Text>
                            <Text style={styles.modalText}>Ballistic Skill: {unit.gameData.ballisticSkill}</Text>
                            <Text style={styles.modalText}>Strength: {unit.gameData.strength}</Text>
                            <Text style={styles.modalText}>Toughness: {unit.gameData.toughness}</Text>
                            <Text style={styles.modalText}>Wounds: {unit.gameData.wounds}</Text>
                            <Text style={styles.modalText}>Attacks: {unit.gameData.attacks}</Text>
                            <Text style={styles.modalText}>Leadership: {unit.gameData.leadership}</Text>
                            <Text style={styles.modalText}>Save: {unit.gameData.save}</Text>
                            {/* <TouchableOpacity
                                style={styles.detailsButton}
                                onPress={() => showMoreDetails(unit)}     DONT NEED THIS YET
                            >
                                <Text style={styles.detailsButtonText}>Show More Details</Text>
                            </TouchableOpacity> */}
                            <Text style={styles.modalText}>Actions:</Text>
                            {phase === 'Movement' && !unit.moved && (
                                <TouchableOpacity
                                    style={styles.actionButton}
                                    onPress={() => onMoveUnit(unit)}
                                >
                                    <Text style={styles.actionButtonText}>Move</Text>
                                </TouchableOpacity>
                            )}
                            {phase === 'Shooting' && (
                                <TouchableOpacity
                                    style={styles.actionButton}
                                    onPress={handleShoot}
                                >
                                    <Text style={styles.actionButtonText}>Shoot</Text>
                                </TouchableOpacity>
                            )}
                            {isWeaponSelectionVisible && (
                                <View>
                                    <Text style={styles.modalText}>Select a weapon:</Text>
                                    <FlatList
                                        data={unit.wargear}
                                        keyExtractor={(item, index) => index.toString()} // Use index as a key
                                        renderItem={({ item }) => {

                                            return (
                                                <TouchableOpacity onPress={() => handleWeaponSelection(item)}>
                                                    <Text style={styles.weaponText}>{item.name || item}</Text>
                                                </TouchableOpacity>
                                            );
                                        }}
                                    />

                                </View>
                            )}

                        </>
                    )}
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={onClose}
                    >
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};


const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    unitImage: {
        width: 150,
        height: 150,
        marginBottom: 15,
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },
    closeButton: {
        backgroundColor: "#2196F3",
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        margin: 3
    },
    closeButtonText: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    actionButton: {
        backgroundColor: "maroon",
        borderRadius: 20,
        padding: 10,
        margin: 3,
        elevation: 2
    },
    actionButtonText: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    detailsButton: {
        backgroundColor: "purple",
        borderRadius: 20,
        padding: 10,
        margin: 3,
        elevation: 2
    },
    detailsButtonText: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    }
});

export default UnitInfoModal;
