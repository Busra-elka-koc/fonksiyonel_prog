import { View, Text, TouchableOpacity, StyleSheet } from "react-native"

interface KeyboardProps {
  maxLength: number
  onAnswerChange: (answer: string[]) => void
  guessedLetters: string[]  // Add this prop
}

interface KeyProps {
  letter: string
  onPress: (key: string) => void
}

const Key = ({ letter, onPress }: KeyProps) => (
  <TouchableOpacity onPress={() => onPress(letter)} style={styles.key}>
    <Text style={styles.keyText}>{letter}</Text>
  </TouchableOpacity>
)

export const Keyboard = ({ maxLength, onAnswerChange, guessedLetters }: KeyboardProps) => {
  const handleKeyPress = (key: string) => {
    if (key === "←") {
      onAnswerChange(guessedLetters.slice(0, -1))
      return
    }
    
    if (guessedLetters.length < maxLength) {
      onAnswerChange([...guessedLetters, key])
    }
  }

  const keyboard = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "Ğ", "Ü"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ş", "İ"],
    ["Z", "X", "C", "V", "B", "N", "M", "Ö", "Ç", "←"],
  ]

  return (
    <View style={styles.keyboard}>
      {keyboard.map((row, i) => (
        <View key={i} style={styles.keyboardRow}>
          {row.map((key) => (
            <Key key={key} letter={key} onPress={handleKeyPress} />
          ))}
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  keyboard: {
    backgroundColor: "#1a1f3d",
    padding: 35,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  keyboardRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 5,
  },
  key: {
    width: 28,
    height: 45,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 2,
  },
  keyText: {
    fontSize: 20,
    fontWeight: "bold",
  },
})
