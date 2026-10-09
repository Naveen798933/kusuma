import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Heart, Download } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { CONFIG } from '../config';
import { Typewriter } from './Typewriter';
import { sound } from '../utils/sound';
import { fireHeartConfetti } from '../utils/confetti';

// Pre-generated romantic SVG illustration fallbacks for each level if photo is not yet provided
const getPlaceholderSvg = (levelId: number, title: string) => {
  const icons = ['✨', '☕', '🧩', '💌', '🌌', '💭', '🌟'];
  const icon = icons[(levelId - 1) % icons.length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
    <defs>
      <radialGradient id="bg" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stop-color="#4a154b" />
        <stop offset="50%" stop-color="#2a0845" />
        <stop offset="100%" stop-color="#120422" />
      </radialGradient>
      <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ffcf6b" />
        <stop offset="100%" stop-color="#ff4d8d" />
      </linearGradient>
    </defs>
    <rect width="600" height="600" fill="url(#bg)" />
    <circle cx="300" cy="240" r="160" fill="#ffffff" fill-opacity="0.04" />
    <circle cx="300" cy="240" r="130" stroke="url(#goldGrad)" stroke-width="2" stroke-dasharray="8 6" fill="none" opacity="0.6"/>
    <text x="300" y="270" font-size="90" text-anchor="middle" dominant-baseline="middle">${icon}</text>
    <text x="300" y="440" font-family="sans-serif" font-weight="bold" font-size="28" fill="#ffd6e7" text-anchor="middle">Chapter ${levelId}: ${title}</text>
    <text x="300" y="480" font-family="sans-serif" font-size="18" fill="#ff75a0" text-anchor="middle">A Memory Of Us</text>
    <text x="300" y="520" font-family="sans-serif" font-size="14" fill="#ffffff" fill-opacity="0.4" text-anchor="middle">Replace with /public/photos/${levelId}.jpg</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const PhotoReveal: React.FC = () => {
  const { currentLevel, proceedToNextLevel } = useGameStore();
  const currentConfig = CONFIG.levels.find((l) => l.id === currentLevel) || CONFIG.levels[0];
  const [imageSrc, setImageSrc] = useState(currentConfig.photoUrl);
  const [showNextBtn, setShowNextBtn] = useState(false);

  useEffect(() => {
    // Fire celebratory effects on reveal
    sound.playLevelWin();
    fireHeartConfetti();
    setImageSrc(currentConfig.photoUrl);
    setShowNextBtn(false);

    // Ensure next button appears after caption begins typing
    const timer = setTimeout(() => {
      setShowNextBtn(true);
    }, 1800);

    return () => clearTimeout(timer);
  }, [currentLevel, currentConfig]);

  const handleNext = () => {
    sound.playTap();
    proceedToNextLevel();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.45 }}
      className="w-full max-w-sm mx-auto px-4 py-3 flex flex-col items-center justify-center flex-1"
    >
      {/* Victory Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="text-center mb-3"
      >
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-accent/20 border border-gold-accent/40 text-gold-accent text-xs font-bold uppercase tracking-wider mb-1">
          <Sparkles className="w-3.5 h-3.5 text-gold-accent" />
          <span>Level {currentLevel} Completed!</span>
          <Heart className="w-3.5 h-3.5 text-rose-hot fill-rose-hot" />
        </div>
        <h3 className="text-xl font-bold text-white font-sans">
          Memory Unlocked 💫
        </h3>
      </motion.div>

      {/* Polaroid Photo Frame with Washi Tape */}
      <motion.div
        initial={{ rotate: -2, y: 15, opacity: 0 }}
        animate={{ rotate: 1.5, y: 0, opacity: 1 }}
        transition={{ delay: 0.25, duration: 0.5, type: 'spring' }}
        className="polaroid-frame w-full max-w-[310px] mx-auto transition-transform hover:rotate-0 relative shadow-2xl"
      >
        {/* Pastel Washi Tape Sticker */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-5 bg-gradient-to-r from-amber-100/85 via-rose-100/90 to-amber-100/85 -rotate-2 shadow-sm border border-white/50 backdrop-blur-sm z-20 pointer-events-none rounded-[2px]" />

        <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-plum-900 border border-black/10 shadow-inner">
          <img
            src={imageSrc}
            alt={currentConfig.photoAlt}
            onLoad={(e) => {
              if (e.currentTarget.naturalWidth <= 10) {
                setImageSrc(getPlaceholderSvg(currentConfig.id, currentConfig.title));
              }
            }}
            onError={() => setImageSrc(getPlaceholderSvg(currentConfig.id, currentConfig.title))}
            className="w-full h-full object-cover select-none transition-transform duration-700 hover:scale-105"
            loading="eager"
          />
          {/* Heart watermark badge in corner */}
          <div className="absolute top-2 right-2 p-1.5 rounded-full bg-black/40 backdrop-blur-md text-xs text-rose-hot">
            💖
          </div>
        </div>

        {/* Polaroid handwritten caption title & Save option */}
        <div className="mt-3 text-center flex flex-col items-center">
          <span className="font-script text-2xl text-plum-800 font-bold tracking-wide">
            {currentConfig.title}
          </span>
          <a
            href={imageSrc}
            download={`Memory_${currentConfig.id}_Kusuma.jpg`}
            onClick={() => sound.playTap()}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-plum-800/60 hover:text-plum-900 mt-1 transition-colors cursor-pointer"
            title="Save this photo"
          >
            <Download className="w-3 h-3" />
            <span>Save to Photos</span>
          </a>
        </div>
      </motion.div>

      {/* Typewriter Romantic Caption Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="glass-card mt-3.5 p-3.5 rounded-2xl w-full border border-rose-soft/30 text-center relative"
      >
        <p className="text-xs sm:text-sm text-rose-blush leading-relaxed font-sans font-medium min-h-[50px]">
          <Typewriter
            text={currentConfig.caption}
            speed={28}
            delay={300}
            playSounds={true}
            onComplete={() => setShowNextBtn(true)}
          />
        </p>
      </motion.div>

      {/* Next Level Button */}
      {showNextBtn && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full mt-4"
        >
          <button
            onClick={handleNext}
            className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-rose-hot via-rose-glow to-rose-hot bg-[length:200%_auto] text-white font-bold text-sm tracking-wide shadow-lg shadow-rose-hot/40 flex items-center justify-center gap-2 active:scale-95 transition-all animate-glow hover:opacity-95"
          >
            <span>
              {currentLevel < 7 ? `Continue to Level ${currentLevel + 1}` : 'Enter The Final Level 🌟'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};
