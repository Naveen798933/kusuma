import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LevelShell } from '../components/LevelShell';
import { useGameStore } from '../store/gameStore';
import { sound } from '../utils/sound';
import { CONFIG } from '../config';
import { Sparkles } from 'lucide-react';

interface StarPoint {
  id: number;
  x: number; // percentage
  y: number; // percentage
  label: number;
}

// 8 dots outlining a heart constellation
const HEART_STARS: StarPoint[] = [
  { id: 0, x: 50, y: 32, label: 1 },
  { id: 1, x: 30, y: 20, label: 2 },
  { id: 2, x: 16, y: 38, label: 3 },
  { id: 3, x: 28, y: 64, label: 4 },
  { id: 4, x: 50, y: 84, label: 5 },
  { id: 5, x: 72, y: 64, label: 6 },
  { id: 6, x: 84, y: 38, label: 7 },
  { id: 7, x: 70, y: 20, label: 8 },
];

export const Level5Stars: React.FC = () => {
  const { completeCurrentLevel } = useGameStore();
  const [connectedIndexes, setConnectedIndexes] = useState<number[]>([0]); // Start with star 0 active
  const [isCompleted, setIsCompleted] = useState(false);

  const herInitial = CONFIG.herName ? CONFIG.herName.trim()[0].toUpperCase() : 'K';
  const myInitial = CONFIG.myName ? CONFIG.myName.trim()[0].toUpperCase() : 'N';

  const nextExpectedStar = connectedIndexes.length % HEART_STARS.length;

  const handleStarClick = (index: number) => {
    if (isCompleted) return;

    if (index === nextExpectedStar) {
      sound.playTap();
      const updated = [...connectedIndexes, index];
      setConnectedIndexes(updated);

      if (updated.length > HEART_STARS.length) {
        // Constellation completed!
        setIsCompleted(true);
        sound.playLevelWin();
        setTimeout(() => {
          completeCurrentLevel();
        }, 1800);
      }
    } else {
      // Gentle teasing sound
      sound.playBoing();
    }
  };

  return (
    <LevelShell
      levelNumber={5}
      title="Stars Align 🌌"
      subtitle="Connect the glowing stars in sequence to trace our constellation"
      badge={
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-hot/20 border border-rose-hot/40 text-xs font-semibold text-rose-blush shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-gold-accent" />
          <span>Tap Star: #{nextExpectedStar + 1}</span>
        </div>
      }
    >
      <div className="w-full max-w-[340px] aspect-square glass-card rounded-3xl relative overflow-hidden border border-rose-soft/20 shadow-2xl p-4 flex items-center justify-center select-none">
        {/* Constellation SVG Lines & Fill */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          <defs>
            <linearGradient id="starLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff4d8d" />
              <stop offset="100%" stopColor="#ffcf6b" />
            </linearGradient>
            <filter id="starGlow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Render lines between connected points */}
          {connectedIndexes.map((pointIndex, i) => {
            if (i === 0) return null;
            const prevPoint = HEART_STARS[connectedIndexes[i - 1]];
            const currPoint = HEART_STARS[pointIndex];

            return (
              <line
                key={`line-${i}`}
                x1={`${prevPoint.x}%`}
                y1={`${prevPoint.y}%`}
                x2={`${currPoint.x}%`}
                y2={`${currPoint.y}%`}
                stroke="url(#starLineGrad)"
                strokeWidth={isCompleted ? "3.5" : "2.5"}
                strokeDasharray={isCompleted ? "none" : "3 2"}
                filter="url(#starGlow)"
                className={isCompleted ? "animate-pulse" : ""}
              />
            );
          })}
        </svg>

        {/* Initials revealed inside the completed constellation */}
        <AnimatePresence>
          {isCompleted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25, duration: 0.6 }}
              className="absolute z-20 flex flex-col items-center justify-center text-center pointer-events-none"
            >
              <div className="text-3xl sm:text-4xl font-extrabold text-gold-accent drop-shadow-[0_0_15px_rgba(255,207,107,0.9)] tracking-widest font-script">
                {herInitial} + {myInitial}
              </div>
              <span className="text-[10px] font-bold text-rose-blush uppercase tracking-widest mt-1 bg-black/40 px-3 py-0.5 rounded-full border border-white/10">
                Written In The Stars ✨
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stars / Dots */}
        {HEART_STARS.map((star, idx) => {
          const isConnected = connectedIndexes.includes(idx);
          const isNext = idx === nextExpectedStar && !isCompleted;

          return (
            <div
              key={star.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
              }}
            >
              {/* Pulsing Guide Ring for the target star */}
              {isNext && (
                <div className="absolute inset-0 -m-1 rounded-full bg-gold-accent/40 animate-ping pointer-events-none" />
              )}

              <button
                onClick={() => handleStarClick(idx)}
                className="relative p-2 group transition-transform active:scale-125 touch-manipulation cursor-pointer"
                aria-label={`Star number ${star.label}`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-all shadow-md ${
                    isConnected
                      ? 'bg-rose-hot text-white shadow-[0_0_12px_rgba(255,77,141,0.9)] border border-white'
                      : isNext
                      ? 'bg-gold-accent text-plum-900 animate-pulse scale-110 shadow-[0_0_15px_rgba(255,207,107,0.9)] border-2 border-white'
                      : 'bg-white/20 text-white/70 border border-white/20 hover:bg-white/30'
                  }`}
                >
                  {star.label}
                </div>
              </button>
            </div>
          );
        })}
      </div>
    </LevelShell>
  );
};
