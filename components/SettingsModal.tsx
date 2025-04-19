import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, Switch } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useProgressStore } from '../store/useProgressStore';
import { useVibrationStore } from '../store/useVibrationStore';

interface SettingsModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isVisible, onClose }: SettingsModalProps) {
  const [sound, setSound] = useState(true);
  const [music, setMusic] = useState(true);
  const { isEnabled: vibration, setEnabled: setVibration } = useVibrationStore();
  const { resetProgress } = useProgressStore();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showRestorePurchases, setShowRestorePurchases] = useState(false);

  const handleResetProgress = () => {
    onClose();  
    setShowResetConfirm(true);    
  };

  const handleCancelReset = () => {
    setShowResetConfirm(false);   
    onClose(); 
  };

  const confirmReset = () => {
    resetProgress();
    setShowResetConfirm(false);
  };

  const handleRestorePurchases = () => {
    onClose();
    setShowRestorePurchases(true);
  };

  const handleCancelRestore = () => {
    setShowRestorePurchases(false);
    onClose();
  };

  const confirmRestore = () => {
    // Burada satın almaları geri yükleme işlemi yapılacak
    setShowRestorePurchases(false);
  };

  const ResetConfirmModal = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={showResetConfirm}
      onRequestClose={handleCancelReset}
    >
      <View style={styles.modalOverlay}>
        <LinearGradient
          colors={['#4c1d95', '#7c3aed']}
          style={[styles.modalView, styles.confirmModalView]}
        >
          <Text style={styles.confirmTitle}>Emin misiniz?</Text>
          <Text style={styles.confirmText}>
            Tüm ilerlemeniz sıfırlanacak ve oyun başa dönecek.
          </Text>
          <View style={styles.confirmButtons}>
            <TouchableOpacity 
              style={[styles.confirmButton, styles.cancelButton]}
              onPress={handleCancelReset}
            >
              <Text style={styles.confirmButtonText}>Vazgeç</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.confirmButton, styles.confirmResetButton]}
              onPress={confirmReset}
            >
              <Text style={styles.confirmButtonText}>Sıfırla</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    </Modal>
  );

  const RestorePurchasesModal = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={showRestorePurchases}
      onRequestClose={handleCancelRestore}
    >
      <View style={styles.modalOverlay}>
        <LinearGradient
          colors={['#4c1d95', '#7c3aed']}
          style={[styles.modalView, styles.confirmModalView]}
        >
          <Text style={styles.confirmTitle}>Satın Alınanları Geri Yükle</Text>
          <Text style={styles.confirmText}>
            Daha önce satın aldığınız içerikler geri yüklenecek.
          </Text>
          <View style={styles.confirmButtons}>
            <TouchableOpacity 
              style={[styles.confirmButton, styles.cancelButton]}
              onPress={handleCancelRestore}
            >
              <Text style={styles.confirmButtonText}>Vazgeç</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.confirmButton, styles.confirmResetButton]}
              onPress={confirmRestore}
            >
              <Text style={styles.confirmButtonText}>Geri Yükle</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    </Modal>
  );

  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isVisible}
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          <LinearGradient
            colors={['#4c1d95', '#7c3aed']}
            style={styles.modalView}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Ayarlar</Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>

            <View style={styles.settingItem}>
              <Text style={styles.settingText}>Ses Efektleri</Text>
              <Switch value={sound} onValueChange={setSound} />
            </View>

            <View style={styles.settingItem}>
              <Text style={styles.settingText}>Müzik</Text>
              <Switch value={music} onValueChange={setMusic} />
            </View>

            <View style={styles.settingItem}>
              <Text style={styles.settingText}>Titreşim</Text>
              <Switch 
                value={vibration} 
                onValueChange={(value) => {
                  setVibration(value);
                  if (value) {
                    Haptics.selectionAsync(); // Provide feedback when enabling
                  }
                }} 
              />
            </View>

            <TouchableOpacity 
              style={styles.settingButton}
              onPress={handleRestorePurchases}
            >
              <Text style={styles.settingButtonText}>Satın Alınanları Geri Yükle</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.settingButton}
              onPress={handleResetProgress}
            >
              <Text style={styles.settingButtonText}>İlerlemeyi Sıfırla</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingButton}>
              <Text style={styles.settingButtonText}>Kullanım Şartları</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingButton}>
              <Text style={styles.settingButtonText}>Gizlilik Politikası</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </Modal>
      <ResetConfirmModal />
      <RestorePurchasesModal />
    </>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: '90%',
    padding: 20,
    borderRadius: 20,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  settingText: {
    color: 'white',
    fontSize: 16,
  },
  settingButton: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  settingButtonText: {
    color: 'white',
    fontSize: 16,
  },
  confirmModalView: {
    padding: 20,
    width: '80%',
  },
  confirmTitle: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  confirmText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  confirmButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  confirmButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    minWidth: 100,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  confirmResetButton: {
    backgroundColor: '#dc2626',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
