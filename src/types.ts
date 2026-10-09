export type GameStage = 'splash' | 'playing' | 'revealing' | 'victory';

export interface GameState {
  currentLevel: number;        // 1 to 7
  playerName: string;
  soundEnabled: boolean;
  completedLevels: number[];   // e.g. [1, 2]
  stage: GameStage;
  finalAnswerGiven: boolean;   // true when YES is tapped
  hasStarted: boolean;
  
  // Actions
  setPlayerName: (name: string) => void;
  startGame: () => void;
  completeCurrentLevel: () => void;
  proceedToNextLevel: () => void;
  recordProposalYes: () => void;
  toggleSound: () => void;
  resetGame: () => void;
}
