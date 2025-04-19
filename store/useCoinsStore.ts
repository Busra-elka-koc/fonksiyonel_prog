import { create } from 'zustand'

interface CoinsStore {
  coins: number
  addCoins: (amount: number) => void
  spendCoins: (amount: number) => boolean
}

export const useCoinsStore = create<CoinsStore>((set) => ({
  coins: 500, // Başlangıç coini
  addCoins: (amount) => set((state) => ({ coins: state.coins + amount })),
  spendCoins: (amount) => {
    let success = false;
    set((state) => {
      if (state.coins >= amount) {
        success = true;
        return { coins: state.coins - amount }
      }
      return state // Yeterli coin yoksa state'i değiştirme
    });
    return success;
  }
}))
