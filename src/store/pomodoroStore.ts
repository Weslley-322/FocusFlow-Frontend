import { create } from 'zustand';

interface PomodoroTimerState {
  isRunning: boolean;
  isPaused: boolean;
  isBreak: boolean;
  timeLeft: number; // em segundos
  duration: number; // duração total em minutos
  breakTime: number; // tempo de pausa em minutos
  
  start: (duration: number, breakTime: number) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  tick: () => void;
  startBreak: () => void;
  reset: () => void;
}

export const usePomodoroStore = create<PomodoroTimerState>((set, get) => ({
  isRunning: false,
  isPaused: false,
  isBreak: false,
  timeLeft: 0,
  duration: 25,
  breakTime: 5,

  start: (duration: number, breakTime: number) => {
    set({
      isRunning: true,
      isPaused: false,
      isBreak: false,
      duration,
      breakTime,
      timeLeft: duration * 60, 
    });
  },

  pause: () => {
    set({ isPaused: true });
  },

  resume: () => {
    set({ isPaused: false });
  },

  stop: () => {
    set({
      isRunning: false,
      isPaused: false,
      isBreak: false,
      timeLeft: 0,
    });
  },

  tick: () => {
    const state = get();
    
    if (!state.isRunning || state.isPaused) return;
    
    if (state.timeLeft > 0) {
      set({ timeLeft: state.timeLeft - 1 });
    } else {
      // Timer chegou a zero
      if (!state.isBreak) {
        // Se não estava em pausa, iniciar pausa
        set({
          isBreak: true,
          timeLeft: state.breakTime * 60,
        });
      } else {
        // Se estava em pausa, parar completamente
        set({
          isRunning: false,
          isBreak: false,
          timeLeft: 0,
        });
      }
    }
  },

  startBreak: () => {
    const state = get();
    set({
      isBreak: true,
      timeLeft: state.breakTime * 60,
    });
  },

  reset: () => {
    set({
      isRunning: false,
      isPaused: false,
      isBreak: false,
      timeLeft: 0,
      duration: 25,
      breakTime: 5,
    });
  },
}));