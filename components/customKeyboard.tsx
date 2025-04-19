import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface CustomKeyboardProps {
  onKeyPress: (key: string) => void;
  onDelete: () => void;
}

const CustomKeyboard: React.FC<CustomKeyboardProps> = ({ onKeyPress, onDelete }) => {
  const keyboardLayout = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'Ğ', 'Ü'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ş', 'İ'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Ö', 'Ç'],
  ];

  return (
    <View style={styles.keyboard}>
      {keyboardLayout.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((key) => (
            <TouchableOpacity
              key={key}
              style={styles.key}
              onPress={() => onKeyPress(key)}
            >
              <Text style={styles.keyText}>{key}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
      <View style={styles.row}>
        <TouchableOpacity style={[styles.key, styles.specialKey]} onPress={onDelete}>
          <Text style={styles.keyText}>⌫</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  keyboard: {
    backgroundColor: '#002341',
    padding: 5,
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 5,
  },
  key: {
    backgroundColor: 'white',
    padding: 5,
    margin: 2,
    borderRadius: 5,
    minWidth: 30,
    alignItems: 'center',
  },
  specialKey: {
    backgroundColor: '#87CEFA',
    minWidth: 80,
  },
  keyText: {
    fontSize: 28,
  },
});

export default CustomKeyboard;
