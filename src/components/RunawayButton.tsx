import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { sound } from '../utils/sound';

interface RunawayButtonProps {
  onYesSelected: () => void;
}

const PLAYFUL_REMARKS = [
  "Wait, think again! 😜",
  "Too slow! 🏃‍♀️💨",
  "You know you want to say YES! 🥰",
  "Nice reflex, but nope! 🙈",
  "Resistance is futile! 💖",
];

export const RunawayButton: React.FC<RunawayButtonProps> = ({ onYesSelected }) => {
  const [dodgeCount, setDodgeCount] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [remark, setRemark] = useState<string | null>(null);

  // If dodged 5 times, automatically converted to YES
  const isConverted = dodgeCount >= 5;

  const handleDodge = (e: React.MouseEvent | React.TouchEvent) => {
    if (e.cancelable) {
      e.preventDefault();
    }
    if (isConverted) {
      sound.playCelebrationFanfare();
      onYesSelected();
      return;
    }

    sound.playBoing();
    const nextCount = dodgeCount + 1;
    setDodgeCount(nextCount);

    if (nextCount >= 5) {
      setRemark("Okay, you caught me! Best friends for life anyway! 🥰🤞");
      setPosition({ x: 0, y: 0 });
      return;
    }

    // Safe bounds tailored for 360px-430px mobile screens
    const randomX = (Math.random() - 0.5) * 110;
    const randomY = (Math.random() - 0.5) * 60;
    setPosition({ x: randomX, y: randomY });

    setRemark(PLAYFUL_REMARKS[(nextCount - 1) % PLAYFUL_REMARKS.length]);
  };

  const scale = Math.max(0.72, 1 - dodgeCount * 0.06);

  if (isConverted) {
    return (
      <motion.button
        initial={{ scale: 0.8, rotate: -5 }}
        animate={{ scale: [1, 1.1, 1], rotate: [0, 3, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        onClick={() => {
          sound.playCelebrationFanfare();
          onYesSelected();
        }}
        className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-hot to-rose-glow text-white font-bold text-base shadow-[0_0_25px_rgba(255,77,141,0.8)] border border-white/40 active:scale-95 transition-all"
      >
        <span>BEST FRIENDS FOR LIFE, YES! 💖🤞</span>
      </motion.button>
    );
  }

  return (
    <div className="relative flex flex-col items-center justify-center">
      {remark && (
        <motion.div
          key={dodgeCount}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: -6 }}
          className="absolute -top-7 text-[11px] font-semibold text-gold-accent bg-black/60 px-2.5 py-0.5 rounded-full border border-gold-accent/30 pointer-events-none whitespace-nowrap shadow-md"
        >
          {remark}
        </motion.div>
      )}

      <motion.button
        animate={{ x: position.x, y: position.y, scale }}
        transition={{ type: 'spring', stiffness: 450, damping: 25 }}
        onMouseEnter={handleDodge}
        onTouchStart={handleDodge}
        onClick={handleDodge}
        className="w-full py-3 px-5 rounded-2xl bg-white/10 hover:bg-white/15 text-white/80 hover:text-white font-medium text-xs sm:text-sm border border-white/15 backdrop-blur-md active:scale-95 transition-all select-none cursor-pointer"
        style={{ touchAction: 'manipulation' }}
      >
        <span>Let me think... 🤔 ({5 - dodgeCount} tries left)</span>
      </motion.button>
    </div>
  );
};
