import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, CheckCircle2, Play, Sparkles } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { CONFIG } from '../config';
import { sound } from '../utils/sound';

interface MemoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MemoryDrawer: React.FC<MemoryDrawerProps> = ({ isOpen, onClose }) => {
  const { completedLevels, currentLevel } = useGameStore();

  const handleSelectLevel = (levelId: number) => {
    sound.playTap();
    useGameStore.setState({
      currentLevel: levelId,
      stage: 'playing',
      hasStarted: true,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="glass-card w-full max-w-md max-h-[85vh] rounded-3xl p-5 flex flex-col border border-white/25 shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/15 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📖</span>
                <div>
                  <h3 className="text-base font-bold text-white leading-tight">
                    Our Memory Scrapbook
                  </h3>
                  <p className="text-[11px] text-rose-blush/80">
                    {completedLevels.length} of 7 Memories Unlocked
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  sound.playTap();
                  onClose();
                }}
                className="p-1.5 rounded-full glass-pill hover:border-white/40 text-white/80 hover:text-white active:scale-95 transition-all"
                aria-label="Close Scrapbook"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable list of chapters */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {CONFIG.levels.map((lvl) => {
                const isCompleted = completedLevels.includes(lvl.id);
                const isCurrent = currentLevel === lvl.id;

                return (
                  <div
                    key={lvl.id}
                    className={`rounded-2xl p-3 border transition-all flex items-center gap-3 ${
                      isCompleted
                        ? 'glass-pill hover:border-rose-hot/50'
                        : isCurrent
                        ? 'bg-rose-hot/20 border border-rose-hot/50 shadow-[0_0_15px_rgba(255,77,141,0.25)]'
                        : 'bg-black/35 border-white/10 opacity-55'
                    }`}
                  >
                    {/* Thumbnail or Lock icon */}
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-plum-900 border border-white/10 flex-shrink-0 relative flex items-center justify-center shadow-sm">
                      {isCompleted ? (
                        <img
                          src={lvl.photoUrl}
                          alt={lvl.photoAlt}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="%2326123e"/><text x="50" y="55" font-size="24" text-anchor="middle" dominant-baseline="middle">💖</text></svg>`;
                          }}
                        />
                      ) : (
                        <Lock className="w-5 h-5 text-white/40" />
                      )}
                    </div>

                    {/* Chapter details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-semibold text-gold-accent">
                        <span>Level {lvl.id}</span>
                        {isCompleted && (
                          <span className="inline-flex items-center gap-0.5 text-emerald-400">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Unlocked</span>
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                        {lvl.title}
                      </h4>
                      <p className="text-[11px] text-rose-blush/70 truncate">
                        {isCompleted ? lvl.caption : lvl.subtitle}
                      </p>
                    </div>

                    {/* Action button */}
                    {isCompleted && (
                      <button
                        onClick={() => handleSelectLevel(lvl.id)}
                        className="p-2 rounded-xl bg-rose-hot/20 hover:bg-rose-hot/40 text-rose-blush text-xs flex items-center gap-1 active:scale-95 transition-all flex-shrink-0 cursor-pointer"
                        title="Replay this level"
                      >
                        <Play className="w-3.5 h-3.5 fill-rose-hot" />
                        <span className="text-[11px] font-semibold hidden sm:inline">Play</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="border-t border-white/10 pt-3 mt-3 text-center">
              <span className="text-[11px] text-white/50 flex items-center justify-center gap-1">
                <Sparkles className="w-3 h-3 text-gold-accent" />
                <span>Complete all 7 levels to unlock the special tribute!</span>
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
