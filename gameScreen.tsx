import { useState, useEffect } from "react"
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Animated, Platform, StatusBar as RNStatusBar } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import emojiData from '../data/emojiDataBase.json'
import { router } from "expo-router"
import { Keyboard } from '../components/Keyboard'
import { SuccessModal } from '../components/modals/SuccessModal'
import { HintModal } from '../components/modals/HintModal'
import { useShake } from '../hooks/useShake'
import { useCoinsStore } from '../store/useCoinsStore'
import { SectionCompletedModal } from '../components/modals/SectionCompletedModal'
import { useProgressStore } from '../store/useProgressStore'
import { PurchaseModal } from '../components/modals/PurchaseModal'
import * as Haptics from 'expo-haptics'
import { useVibrationStore } from '../store/useVibrationStore';

export default function App() {
  const { currentSection: savedSection, currentPuzzle: savedPuzzle, setProgress } = useProgressStore()
  const [sectionIndex, setSectionIndex] = useState(savedSection)
  const [puzzleIndex, setPuzzleIndex] = useState(savedPuzzle)
  const [currentSection, setCurrentSection] = useState(emojiData.sections[0])
  const [currentPuzzle, setCurrentPuzzle] = useState(emojiData.sections[0].questions[0])
  const [guessedLetters, setGuessedLetters] = useState<string[]>([])
  const [showHint, setShowHint] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const { shakeAnimation, shake } = useShake()
  const { coins, addCoins, spendCoins } = useCoinsStore()
  const [revealedLetters, setRevealedLetters] = useState<{ [key: number]: string }>({})
  const [showSectionCompleted, setShowSectionCompleted] = useState(false)
  const [showPurchase, setShowPurchase] = useState(false)
  const { isEnabled: vibrationEnabled } = useVibrationStore();

  const CORRECT_ANSWER_REWARD = 15
  const JOKER_COST = 50

  const answer = currentPuzzle.answer.toUpperCase()
  const words = answer.split(' ')

  const isLastPuzzleInSection = puzzleIndex === currentSection.questions.length - 1

  useEffect(() => {
    setCurrentSection(emojiData.sections[sectionIndex])
    setCurrentPuzzle(emojiData.sections[sectionIndex].questions[puzzleIndex])
  }, [sectionIndex, puzzleIndex])

  const checkAnswer = () => {
    const displayLetters = getDisplayLetters()
    const guessedWord = displayLetters.join('')
    return guessedWord === answer.replace(/\s/g, '')
  }

  const saveProgress = (section: number, puzzle: number) => {
    setProgress(section, puzzle)
  }

  const goToNextPuzzle = () => {
    if (isLastPuzzleInSection) {
      setShowSuccess(false)
      setShowSectionCompleted(true)
    } else {
      const nextPuzzle = puzzleIndex + 1
      setPuzzleIndex(nextPuzzle)
      setCurrentPuzzle(currentSection.questions[nextPuzzle])
      setGuessedLetters([])
      setRevealedLetters({})
      setShowSuccess(false)
      saveProgress(sectionIndex, nextPuzzle)
    }
  }

  const goToNextSection = () => {
    const nextSectionIndex = sectionIndex + 1
    if (nextSectionIndex < emojiData.sections.length) {
      setSectionIndex(nextSectionIndex)
      setPuzzleIndex(0)
      const nextSection = emojiData.sections[nextSectionIndex]
      setCurrentSection(nextSection)
      setCurrentPuzzle(nextSection.questions[0])
      setGuessedLetters([])
      setRevealedLetters({})
      setShowSectionCompleted(false)
      saveProgress(nextSectionIndex, 0)
    } else {
      // Tüm oyun tamamlandı
      router.replace('/')
    }
  }

  const useJoker = () => {
    if (spendCoins(JOKER_COST)) {
      const fullAnswer = answer.replace(/\s/g, '').split('')
      const availableIndexes = fullAnswer
        .map((_, index) => index)
        .filter(index => {
          // Hem revealed hem de guessed letterları kontrol et
          const isNotRevealed = !revealedLetters[index]
          const displayLetters = getDisplayLetters()
          const isNotGuessed = !displayLetters[index]
          return isNotRevealed && isNotGuessed
        })

      if (availableIndexes.length > 0) {
        const randomIndex = availableIndexes[Math.floor(Math.random() * availableIndexes.length)]
        setRevealedLetters(prev => ({
          ...prev,
          [randomIndex]: fullAnswer[randomIndex]
        }))
      }
    }
  }

  const getDisplayLetters = () => {
    const fullLength = answer.replace(/\s/g, '').length
    const display = Array(fullLength).fill('')
    
    // Fill revealed letters first
    Object.entries(revealedLetters).forEach(([index, letter]) => {
      display[parseInt(index)] = letter
    })
    
    // Fill user input letters in remaining empty spaces from start
    let userInputIndex = 0
    for (let i = 0; i < fullLength; i++) {
      if (!display[i] && userInputIndex < guessedLetters.length) {
        display[i] = guessedLetters[userInputIndex]
        userInputIndex++
      }
    }
    
    return display
  }

  const displayLetters = getDisplayLetters()

  useEffect(() => {
    const totalLength = answer.replace(/\s/g, '').length
    const remainingSpaces = totalLength - Object.keys(revealedLetters).length
    
    // Kullanıcının gireceği harfler tamamlandığında kontrol et
    if (guessedLetters.length === remainingSpaces) {
      if (checkAnswer()) {
        setShowSuccess(true)
        addCoins(CORRECT_ANSWER_REWARD)
      } else {
        if (vibrationEnabled) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
        }
        shake()
        setGuessedLetters([])
      }
    }
  }, [guessedLetters, vibrationEnabled])

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={router.back} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.levelIndicator}>
          <Text style={styles.levelText}>Bölüm {currentSection.id}</Text>
          <Text style={styles.puzzleText}>{puzzleIndex + 1}/{currentSection.questions.length}</Text>
        </View>
        <TouchableOpacity style={styles.coinContainer} onPress={() => setShowPurchase(true)}>
          <Ionicons name="logo-usd" size={20} color="gold" />
          <Text style={styles.coinText}>{coins} +</Text>
        </TouchableOpacity>
      </View>

      {/* Game Area */}
      <View style={styles.gameArea}>
        <View style={styles.emojiContainer}>
          {currentPuzzle.emojis.map((emoji, index) => (
            <Text key={index} style={styles.emoji}>{emoji}</Text>
          ))}
        </View>
        <View style={styles.gameControls}>
          <TouchableOpacity onPress={() => setShowHint(true)} style={styles.gameButton}>
            <Ionicons name="help-circle" size={24} color="blue" />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={useJoker} 
            style={[
              styles.gameButton,
              { 
                opacity: coins >= JOKER_COST ? 1 : 0.5 
              }
            ]}
          >
            <Ionicons name="flash" size={24} color="gold" />
            <Text style={styles.jokerCost}>{JOKER_COST}</Text>
          </TouchableOpacity>
        </View>
        <Animated.View 
          style={[
            styles.wordContainer,
            {
              transform: [{
                translateX: shakeAnimation
              }]
            }
          ]}
        >
          {words.map((word, wordIndex) => (
            <View key={wordIndex} style={styles.wordRow}>
              {word.split("").map((_, letterIndex) => {
                const absoluteIndex = words
                  .slice(0, wordIndex)
                  .join('')
                  .length + letterIndex
                
                return (
                  <View key={letterIndex} style={styles.letterBox}>
                    <Text style={styles.letter}>
                      {displayLetters[absoluteIndex]}
                    </Text>
                  </View>
                )
              })}
            </View>
          ))}
        </Animated.View>
      </View>

      <Keyboard 
        maxLength={answer.replace(/\s/g, '').length - Object.keys(revealedLetters).length}
        onAnswerChange={setGuessedLetters}
        guessedLetters={guessedLetters}
      />

      <SuccessModal 
        visible={showSuccess}
        onClose={() => setShowSuccess(false)}
        onNext={goToNextPuzzle}
      />

      <HintModal
        visible={showHint}
        onClose={() => setShowHint(false)}
        hint={currentPuzzle.hint}
      />

      <SectionCompletedModal 
        visible={showSectionCompleted}
        onClose={() => {
          setShowSectionCompleted(false)
          router.replace('/')
        }}
        onNext={goToNextSection}
        isLastSection={sectionIndex === emojiData.sections.length - 1}
        sectionId={currentSection.id}
      />

      <PurchaseModal 
        visible={showPurchase}
        onClose={() => setShowPurchase(false)}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8DC",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  backButton: {
    padding: 5,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 24,
  },
  coinContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: 5,
    borderRadius: 15,
  },
  coinText: {
    marginLeft: 5,
    color: "purple",
    fontWeight: "bold",
  },
  gameArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emojiContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emoji: {
    fontSize: 40,
    marginHorizontal: 10,
  },
  wordContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    minWidth: '80%',
  },
  wordRow: {
    flexDirection: "row",
    marginBottom: 10,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  letterBox: {
    width: 30,
    height: 40,
    borderBottomWidth: 2,
    borderBottomColor: "black",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 2,
  },
  letter: {
    fontSize: 24,
    fontWeight: "bold",
  },
  hintButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  gameControls: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    gap: 10,
  },
  gameButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  jokerCost: {
    fontSize: 12,
    color: 'gold',
    fontWeight: 'bold',
    marginTop: 2,
  },
  levelIndicator: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 5,
    borderRadius: 15,
  },
  levelText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'purple',
  },
  puzzleText: {
    fontSize: 12,
    color: 'gray',
  }
})