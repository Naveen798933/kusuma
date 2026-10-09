import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { GameState } from '../types';
import { CONFIG } from '../config';

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      currentLevel: 1,
      playerName: CONFIG.herName,
      soundEnabled: true,
      completedLevels: [],
      stage: 'splash',
      finalAnswerGiven: false,
      hasStarted: false,

      setPlayerName: (name: string) => {
        set({ playerName: name.trim() || CONFIG.herName });
      },

      startGame: () => {
        const { completedLevels } = get();
        // If they already completed some levels, resume at the first incomplete level
        const nextIncomplete = [1, 2, 3, 4, 5, 6, 7].find(lvl => !completedLevels.includes(lvl)) || 7;
        set({
          hasStarted: true,
          stage: 'playing',
          currentLevel: nextIncomplete,
        });
      },

      completeCurrentLevel: () => {
        const { currentLevel, completedLevels } = get();
        const updated = completedLevels.includes(currentLevel)
          ? completedLevels
          : [...completedLevels, currentLevel];

        set({
          completedLevels: updated,
          stage: 'revealing',
        });
      },

      proceedToNextLevel: () => {
        const { currentLevel } = get();
        if (currentLevel < 7) {
          set({
            currentLevel: currentLevel + 1,
            stage: 'playing',
          });
        } else {
          // Finished level 7 proposal flow
          set({
            stage: 'victory',
          });
        }
      },

      recordProposalYes: () => {
        const { completedLevels } = get();
        const updated = completedLevels.includes(7) ? completedLevels : [...completedLevels, 7];
        set({
          finalAnswerGiven: true,
          completedLevels: updated,
          stage: 'victory',
        });
      },

      toggleSound: () => {
        set((state) => ({ soundEnabled: !state.soundEnabled }));
      },

      resetGame: () => {
        set({
          currentLevel: 1,
          completedLevels: [],
          stage: 'splash',
          finalAnswerGiven: false,
          hasStarted: false,
        });
      },
    }),
    {
      name: 'levelup-our-story-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
