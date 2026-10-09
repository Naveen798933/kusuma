import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Code2 } from 'lucide-react';
import { sound } from '../utils/sound';

export const Footer: React.FC = () => {
  const [showLoveNote, setShowLoveNote] = useState(false);

  const handleClick = () => {
    sound.playTap();
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(20);
      } catch {
        // Ignored
      }
    }
    setShowLoveNote(true);
    setTimeout(() => {
      setShowLoveNote(false);
    }, 2800);
  };

  return (
    <footer className="w-full py-4 px-4 flex flex-col items-center justify-center relative z-30 select-none pointer-events-auto">
      {/* Interactive Micro-Toast */}
      <AnimatePresence>
        {showLoveNote && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="mb-2 px-3.5 py-1 rounded-full glass-pill text-[11px] text-gold-accent border border-gold-accent/40 shadow-lg flex items-center gap-1.5"
          >
            <Sparkles className="w-3 h-3 text-gold-accent" />
            <span>Coded with 💖 especially for Kusuma ✨</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Glassy Floating Footer Capsule */}
      <motion.div
        onClick={handleClick}
        whileHover={{ scale: 1.04, y: -2 }}
        whileTap={{ scale: 0.96 }}
        className="glass-footer rounded-full px-5 py-2 flex items-center gap-2 cursor-pointer border border-white/25 shadow-xl transition-all"
        title="Tap to see developer note!"
      >
        <div className="flex items-center gap-1.5">
          <Code2 className="w-3.5 h-3.5 text-gold-accent" />
          <span className="text-xs text-white/80 font-medium tracking-wide">
            Developed by
          </span>
          <span className="font-extrabold text-xs tracking-wider bg-gradient-to-r from-rose-hot via-gold-accent to-rose-soft bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(255,77,141,0.5)]">
            Naveen
          </span>
        </div>

        <span className="text-white/30">•</span>

        <motion.div
          animate={{ scale: [1, 1.25, 1] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          className="flex items-center"
        >
          <Heart className="w-3.5 h-3.5 text-rose-hot fill-rose-hot drop-shadow-[0_0_6px_rgba(255,77,141,0.8)]" />
        </motion.div>
      </motion.div>
    </footer>
  );
};
