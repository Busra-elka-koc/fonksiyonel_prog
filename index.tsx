import { StyleSheet, View, Text, TouchableOpacity, Animated } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from "expo-router";
import { useEffect, useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import SettingsModal from '../components/SettingsModal';

export default function HomeScreen() {
  const titleScale = useRef(new Animated.Value(0.5)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);

  useEffect(() => {
    Animated.spring(titleScale, {
      toValue: 1,
      useNativeDriver: true,
      tension: 10,
      friction: 2
    }).start();
  }, []);

  const onPressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <LinearGradient
      colors={['#4c1d95', '#7c3aed', '#8b5cf6']}
      style={styles.container}
    >
      <TouchableOpacity 
        style={styles.settingsButton}
        onPress={() => setIsSettingsVisible(true)}
      >
        <Ionicons name="settings-outline" size={30} color="white" />
      </TouchableOpacity>

      <Animated.Text 
        style={[
          styles.title,
          { transform: [{ scale: titleScale }] }
        ]}
      >
        MojiMatch
      </Animated.Text>
      
      <TouchableOpacity
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={styles.buttonWrapper}
      >
        <Link href="/gameScreen" style={styles.buttonContainer}>
          <Animated.View style={{transform: [{scale: buttonScale}]}}>
            <LinearGradient
              colors={['#c4b5fd', '#8b5cf6']}
              style={styles.button}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.buttonText}>Oyuna Başla</Text>
            </LinearGradient>
          </Animated.View>
        </Link>
      </TouchableOpacity>

      <SettingsModal 
        isVisible={isSettingsVisible}
        onClose={() => setIsSettingsVisible(false)}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 50,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  buttonWrapper: {
    width: '80%',
    maxWidth: 300,
    marginTop: 20,
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    padding: 20,
    borderRadius: 25,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  buttonText: {
    fontSize: 28,
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: '700',
    letterSpacing: 1,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  settingsButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    padding: 10,
  }
});
