import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

interface ProgressState {
  currentSection: number
  currentPuzzle: number
  setProgress: (section: number, puzzle: number) => void
  resetProgress: () => void
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      currentSection: 0,
      currentPuzzle: 0,
      setProgress: (section: number, puzzle: number) => 
        set({ currentSection: section, currentPuzzle: puzzle }),
      resetProgress: () => set({ currentSection: 0, currentPuzzle: 0 }),
    }),
    {
      name: 'progress-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)
