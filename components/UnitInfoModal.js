// components/UnitInfoModal.js
import { Modal, Text, View, TouchableOpacity, StyleSheet } from 'react-native';

const UnitInfoModal = ({ visible, unit, onClose }) => {
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
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  closeButton: {
    backgroundColor: "#2196F3",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  }
});

export default UnitInfoModal;
