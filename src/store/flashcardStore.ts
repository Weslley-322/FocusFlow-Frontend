import { create } from 'zustand';
import { Flashcard } from '@/types';

interface FlashcardState {
  currentCard: Flashcard | null;
  showAnswer: boolean;
  
  setCurrentCard: (card: Flashcard | null) => void;
  toggleAnswer: () => void;
  resetCard: () => void;
}

export const useFlashcardStore = create<FlashcardState>((set) => ({
  currentCard: null,
  showAnswer: false,

  setCurrentCard: (card: Flashcard | null) => {
    set({ currentCard: card, showAnswer: false });
  },

  toggleAnswer: () => {
    set((state) => ({ showAnswer: !state.showAnswer }));
  },

  resetCard: () => {
    set({ currentCard: null, showAnswer: false });
  },
}));