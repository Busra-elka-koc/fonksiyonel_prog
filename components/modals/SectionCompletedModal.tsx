import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'

interface SectionCompletedModalProps {
  visible: boolean
  onClose: () => void
  onNext: () => void
  isLastSection: boolean
  sectionId: number
}

export const SectionCompletedModal = ({ 
  visible, 
  onClose, 
  onNext,
  isLastSection,
  sectionId
}: SectionCompletedModalProps) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.iconContainer}>
            <Ionicons name="trophy" size={60} color="gold" />
          </View>
          <Text style={styles.titleText}>Tebrikler!</Text>
          <Text style={styles.messageText}>
            {isLastSection 
              ? "Tüm bölümleri başarıyla tamamladınız!" 
              : `Bölüm ${sectionId}'ü başarıyla tamamladınız!`
            }
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={isLastSection ? onClose : onNext}
          >
            <Text style={styles.buttonText}>
              {isLastSection ? "Ana Menüye Dön" : "Sonraki Bölüme Geç"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
  },
  iconContainer: {
    marginBottom: 15,
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2c3e50',
  },
  messageText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#7f8c8d',
  },
  button: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    elevation: 2,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
})
