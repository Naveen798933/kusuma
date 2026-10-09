import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LevelShell } from '../components/LevelShell';
import { useGameStore } from '../store/gameStore';
import { sound } from '../utils/sound';
import { Sparkles, Timer } from 'lucide-react';

interface FloatingTarget {
  id: number;
  x: number;
  y: number;
  scale: number;
  color: string;
}

const TARGET_COUNT = 10;
const INITIAL_TIME = 35;

export const Level1Spark: React.FC = () => {
  const { completeCurrentLevel } = useGameStore();
  const [collected, setCollected] = useState(0);
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  const [hearts, setHearts] = useState<FloatingTarget[]>([]);
  const [tapEffects, setTapEffects] = useState<{ id: number; x: number; y: number }[]>([]);
  const nextId = useRef(1);
  const hasWon = useRef(false);

  const colors = ['#ff4d8d', '#ff75a0', '#ffd6e7', '#ffcf6b'];

  const spawnHeart = () => {
    return {
      id: nextId.current++,
      x: Math.random() * 74 + 13, // 13% to 87%
      y: Math.random() * 66 + 17, // 17% to 83%
      scale: Math.random() * 0.25 + 0.9,
      color: colors[Math.floor(Math.random() * colors.length)],
    };
  };

  // Initial population of hearts
  useEffect(() => {
    const initialList: FloatingTarget[] = [];
    for (let i = 0; i < 5; i++) {
      initialList.push(spawnHeart());
    }
    setHearts(initialList);
  }, []);

  // Timer countdown independent of tap frequency
  useEffect(() => {
    const timer = setInterval(() => {
      if (hasWon.current) return;
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Generously extend time so no one fails
          return 15;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Handle heart tap
  const handleHeartTap = (id: number, x: number, y: number) => {
    if (hasWon.current) return;
    sound.playHeartCollect();

    setTapEffects((prev) => [...prev, { id: Date.now() + Math.random(), x, y }]);
    setTimeout(() => {
      setTapEffects((prev) => prev.filter((eff) => Date.now() - eff.id < 600));
    }, 600);

    setCollected((prev) => {
      const nextCount = prev + 1;
      if (nextCount >= TARGET_COUNT && !hasWon.current) {
        hasWon.current = true;
        setTimeout(() => {
          completeCurrentLevel();
        }, 500);
      }
      return nextCount;
    });

    setHearts((prev) => {
      const filtered = prev.filter((h) => h.id !== id);
      return [...filtered, spawnHeart()];
    });
  };

  return (
    <LevelShell
      levelNumber={1}
      title="First Spark ✨"
      subtitle="Tap the floating glowing sparks before time runs out!"
      badge={
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full glass-pill border border-rose-hot/40 text-xs font-semibold text-rose-blush shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-rose-glow" />
            <span>Sparks: {collected} / {TARGET_COUNT}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full glass-pill border border-white/15 text-xs font-semibold text-white/90">
            <Timer className="w-3.5 h-3.5 text-gold-accent" />
            <span>{timeLeft}s</span>
          </div>
        </div>
      }
    >
      <div className="w-full h-80 sm:h-96 glass-card rounded-3xl relative overflow-hidden border border-white/20 shadow-2xl flex items-center justify-center select-none">
        <div className="absolute top-3 text-[11px] text-white/40 tracking-wider uppercase font-medium pointer-events-none">
          Tap each glowing spark!
        </div>

        {/* Floating Sparks */}
        <AnimatePresence>
          {hearts.map((h) => (
            <motion.button
              key={h.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [h.scale, h.scale * 1.15, h.scale],
                opacity: 1,
                y: [0, -8, 0],
              }}
              exit={{ scale: 1.4, opacity: 0 }}
              transition={{
                repeat: Infinity,
                duration: 2.2 + (h.id % 2),
                ease: 'easeInOut',
              }}
              onClick={() => handleHeartTap(h.id, h.x, h.y)}
              className="absolute p-3 rounded-full active:scale-125 transition-transform cursor-pointer glow-rose touch-manipulation"
              style={{
                left: `${h.x}%`,
                top: `${h.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              aria-label="Collect Spark"
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-lg border border-white/50 backdrop-blur-sm"
                style={{
                  background: `radial-gradient(circle, ${h.color} 0%, rgba(38,18,62,0.7) 100%)`,
                }}
              >
                💖
              </div>
            </motion.button>
          ))}
        </AnimatePresence>

        {/* Tap Floating Ripple / +1 Popups */}
        {tapEffects.map((eff) => (
          <motion.div
            key={eff.id}
            initial={{ opacity: 1, y: 0, scale: 0.8 }}
            animate={{ opacity: 0, y: -40, scale: 1.3 }}
            transition={{ duration: 0.6 }}
            className="absolute pointer-events-none text-gold-accent font-bold text-sm drop-shadow-[0_0_8px_rgba(255,207,107,0.8)]"
            style={{
              left: `${eff.x}%`,
              top: `${eff.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            +1 ✨
          </motion.div>
        ))}
      </div>
    </LevelShell>
  );
};
