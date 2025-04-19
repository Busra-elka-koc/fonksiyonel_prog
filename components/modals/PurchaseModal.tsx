import { Modal, View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native'
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from 'expo-linear-gradient'

interface PurchaseModalProps {
  visible: boolean
  onClose: () => void
}

export function PurchaseModal({ visible, onClose }: PurchaseModalProps) {
  const purchaseOptions = [
    { coins: 100, price: '₺2.99', colors: ['#FFD700', '#FFA500'] as const },
    { coins: 500, price: '₺9.99', colors: ['#4facfe', '#00f2fe'] as const },
    { coins: 1000, price: '₺14.99', colors: ['#667eea', '#764ba2'] as const },
    { coins: 2500, price: '₺29.99', colors: ['#f43b47', '#453a94'] as const },
  ]

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <LinearGradient
          colors={['#2c3e50', '#3498db']}
          style={styles.modalContent}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close-circle" size={32} color="white" />
          </TouchableOpacity>
          
          <View style={styles.headerContainer}>
            <Ionicons name="diamond" size={40} color="#FFD700" />
            <Text style={styles.title}>Premium Jetonlar</Text>
          </View>

          <View style={styles.optionsContainer}>
            {purchaseOptions.map((option, index) => (
              <TouchableOpacity key={index} style={styles.optionWrapper}>
                <LinearGradient
                  colors={option.colors}
                  style={styles.purchaseOption}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <View style={styles.coinInfo}>
                    <Ionicons name="logo-usd" size={30} color="white" />
                    <Text style={styles.coinAmount}>{option.coins}</Text>
                  </View>
                  <View style={styles.priceTag}>
                    <Text style={styles.price}>{option.price}</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.footer}>En İyi Teklif! 🔥</Text>
        </LinearGradient>
      </View>
    </Modal>
  )
}

const { width } = Dimensions.get('window')
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.9,
    maxWidth: 400,
    borderRadius: 25,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 10,
  },
  closeButton: {
    position: 'absolute',
    right: 15,
    top: 15,
    zIndex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  optionsContainer: {
    gap: 15,
  },
  optionWrapper: {
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  purchaseOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    justifyContent: 'space-between',
  },
  coinInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  coinAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  priceTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  price: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  footer: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
})
