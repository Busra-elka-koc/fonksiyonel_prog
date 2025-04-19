import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

interface VibrationStore {
  isEnabled: boolean
  setEnabled: (enabled: boolean) => void
}

export const useVibrationStore = create<VibrationStore>()(
  persist(
    (set) => ({
      isEnabled: true,
      setEnabled: (enabled) => set({ isEnabled: enabled }),
    }),
    {
      name: 'vibration-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)
