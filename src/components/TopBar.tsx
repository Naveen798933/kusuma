import React, { useState } from 'react';
import { Volume2, VolumeX, RotateCcw, Heart, X, BookOpen } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { sound } from '../utils/sound';
import { CONFIG } from '../config';
import { motion, AnimatePresence } from 'framer-motion';
import { MemoryDrawer } from './MemoryDrawer';

export const TopBar: React.FC = () => {
  const {
    currentLevel,
    completedLevels,
    soundEnabled,
    toggleSound,
    resetGame,
    stage
  } = useGameStore();

  const [eggTaps, setEggTaps] = useState(0);
  const [showEggModal, setShowEggModal] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showScrapbook, setShowScrapbook] = useState(false);

  const handleLogoTap = () => {
    sound.playTap();
    const nextCount = eggTaps + 1;
    setEggTaps(nextCount);

    if (nextCount >= 5) {
      sound.playLevelWin();
      setShowEggModal(true);
      setEggTaps(0);
    }
  };

  const handleToggleAudio = () => {
    const isMuted = sound.toggleMute();
    toggleSound();
    if (!isMuted) {
      sound.playTap();
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full px-3 py-2.5 max-w-md mx-auto">
        <div className="glass-card rounded-2xl px-3.5 py-2 flex items-center justify-between border border-rose-soft/20 backdrop-blur-md">
          {/* Logo & Game Title with Easter Egg */}
          <div
            onClick={handleLogoTap}
            className="flex items-center gap-2 cursor-pointer active:scale-95 transition-transform"
            title="Tap me!"
          >
            <div className="relative">
              <span className="text-xl">🎮</span>
              <motion.div
                animate={{ scale: [1, 1.25, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute -top-1 -right-1 text-xs"
              >
                💖
              </motion.div>
            </div>
            <div>
              <div className="text-xs font-bold tracking-wider uppercase text-rose-blush flex items-center gap-1">
                <span>OUR STORY</span>
                <span className="text-[10px] text-gold-accent font-mono">v1.0</span>
              </div>
              <div className="text-[10px] text-white/60 font-medium">
                {stage === 'splash' ? 'Press Start' : `Level ${currentLevel} of 7`}
              </div>
            </div>
          </div>

          {/* 7 Hearts Progress Bar */}
          <div className="flex items-center gap-1 px-1.5 py-1 rounded-full bg-black/30 border border-white/10">
            {[1, 2, 3, 4, 5, 6, 7].map((lvl) => {
              const isFilled = completedLevels.includes(lvl);
              const isCurrent = currentLevel === lvl && stage !== 'splash';
              return (
                <motion.div
                  key={lvl}
                  animate={isCurrent ? { scale: [1, 1.3, 1] } : {}}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="relative cursor-default"
                >
                  <Heart
                    className={`w-3.5 h-3.5 transition-colors duration-300 ${
                      isFilled
                        ? 'fill-rose-hot text-rose-hot drop-shadow-[0_0_6px_rgba(255,77,141,0.8)]'
                        : isCurrent
                        ? 'text-rose-glow fill-rose-glow/40 animate-pulse'
                        : 'text-white/25'
                    }`}
                  />
                </motion.div>
              );
            })}
          </div>

          {/* Action buttons: Sound Mute & Secret Reset */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleToggleAudio}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-90 text-rose-blush transition-all flex items-center gap-1"
              aria-label={soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-4 h-4 text-rose-soft" />
                  <div className="flex items-center gap-[1.5px] h-3">
                    <span className="w-[1.5px] h-2 bg-rose-hot rounded-full animate-pulse" />
                    <span className="w-[1.5px] h-3 bg-gold-accent rounded-full animate-pulse [animation-delay:150ms]" />
                    <span className="w-[1.5px] h-1.5 bg-rose-hot rounded-full animate-pulse [animation-delay:300ms]" />
                  </div>
                </>
              ) : (
                <VolumeX className="w-4 h-4 text-white/40" />
              )}
            </button>

            <button
              onClick={() => {
                sound.playTap();
                setShowScrapbook(true);
              }}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-90 text-rose-blush transition-all"
              title="Open Memory Scrapbook"
              aria-label="Open Memory Scrapbook"
            >
              <BookOpen className="w-4 h-4 text-gold-accent" />
            </button>

            <button
              onClick={() => setShowResetConfirm(true)}
              className="p-1.5 rounded-xl bg-white/5 hover:bg-white/15 active:scale-90 text-white/40 hover:text-white transition-all"
              title="Reset progress"
              aria-label="Reset Game"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Memory Scrapbook Drawer */}
      <MemoryDrawer
        isOpen={showScrapbook}
        onClose={() => setShowScrapbook(false)}
      />

      {/* Secret Easter Egg Modal */}
      <AnimatePresence>
        {showEggModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.85, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: 20 }}
              className="glass-card max-w-sm w-full p-6 rounded-3xl text-center relative border border-gold-accent/40"
            >
              <button
                onClick={() => setShowEggModal(false)}
                className="absolute top-4 right-4 p-1 rounded-full bg-white/10 text-white/60 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-14 h-14 mx-auto rounded-full bg-gold-accent/20 flex items-center justify-center text-3xl mb-3 shadow-[0_0_20px_rgba(255,207,107,0.4)]">
                ✨
              </div>

              <h3 className="text-xl font-bold text-gold-accent mb-2 font-script text-2xl">
                Secret Easter Egg Unlocked!
              </h3>
              <p className="text-sm text-rose-blush/90 leading-relaxed mb-5">
                {CONFIG.secretEasterEggMessage}
              </p>

              <button
                onClick={() => {
                  sound.playTap();
                  setShowEggModal(false);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-hot to-rose-glow text-white font-medium text-sm shadow-lg shadow-rose-hot/30 active:scale-95 transition-transform"
              >
                Continue Playing 💖
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reset Confirmation Modal */}
      <AnimatePresence>
        {showResetConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="glass-card max-w-xs w-full p-5 rounded-2xl text-center border border-rose-hot/30"
            >
              <h4 className="text-base font-bold text-white mb-2">Start Game Over?</h4>
              <p className="text-xs text-white/70 mb-4">
                This will reset your level progress back to Level 1.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 py-2 text-xs rounded-xl bg-white/10 text-white/80"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    sound.playTap();
                    resetGame();
                    setShowResetConfirm(false);
                  }}
                  className="flex-1 py-2 text-xs rounded-xl bg-rose-hot text-white font-semibold"
                >
                  Restart
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
