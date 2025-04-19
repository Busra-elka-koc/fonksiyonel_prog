import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from "@expo/vector-icons"

interface SuccessModalProps {
  visible: boolean
  onClose: () => void
  onNext: () => void
  coinsEarned?: number
}

export const SuccessModal = ({ visible, onClose, onNext, coinsEarned = 15 }: SuccessModalProps) => {
  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Tebrikler! 🎉</Text>
          <Text style={styles.modalText}>Doğru cevap!</Text>
          <View style={styles.coinsEarned}>
            <Ionicons name="logo-usd" size={24} color="gold" />
            <Text style={styles.coinsText}>+{coinsEarned}</Text>
          </View>
          <TouchableOpacity onPress={onNext} style={styles.modalButton}>
            <Text style={styles.modalButtonText}>Sıradaki Bulmaca</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    textAlign: "center",
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  coinsEarned: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    padding: 10,
    borderRadius: 10,
  },
  coinsText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'gold',
    marginLeft: 5,
  }
})
