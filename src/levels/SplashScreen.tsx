import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Sparkles, Heart, Volume2 } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { CONFIG } from '../config';
import { sound } from '../utils/sound';
import { Typewriter } from '../components/Typewriter';

export const SplashScreen: React.FC = () => {
  const { playerName, setPlayerName, startGame } = useGameStore();
  const [inputName, setInputName] = useState(playerName || CONFIG.herName);
  const [logoTaps, setLogoTaps] = useState(0);
  const [badgeTaps, setBadgeTaps] = useState(0);
  const [showLevelJump, setShowLevelJump] = useState(false);
  const [easterEggActive, setEasterEggActive] = useState(false);

  // Time of day greeting
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Good morning, my favorite player ☀️';
    if (hour >= 12 && hour < 17) return 'Good afternoon, lovely 🌸';
    if (hour >= 17 && hour < 22) return 'Good evening, gorgeous ✨';
    return 'Hey night owl, welcome to our world 🌙';
  }, []);

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playTap();
    sound.startBgm(CONFIG.bgmAudioUrl);
    setPlayerName(inputName);
    startGame();
  };

  const handleLogoTap = () => {
    sound.playTap();
    const count = logoTaps + 1;
    setLogoTaps(count);
    if (count >= 5) {
      sound.playLevelWin();
      setEasterEggActive(true);
      setLogoTaps(0);
    }
  };

  // Developer quick-jump toggle
  const handleBadgeTap = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playTap();
    const count = badgeTaps + 1;
    setBadgeTaps(count);
    if (count >= 3) {
      setShowLevelJump(true);
      setBadgeTaps(0);
    }
  };

  const jumpToLevel = (lvl: number) => {
    sound.playTap();
    sound.startBgm(CONFIG.bgmAudioUrl);
    setPlayerName(inputName);
    useGameStore.setState({
      currentLevel: lvl,
      stage: lvl === 7 ? 'playing' : 'playing',
      hasStarted: true,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md mx-auto px-5 py-6 flex flex-col items-center justify-center flex-1 text-center"
    >
      {/* Time-of-day typing greeting badge */}
      <motion.div
        initial={{ y: -15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="glass-pill px-4 py-1.5 rounded-full text-xs text-rose-blush mb-6 border border-rose-soft/20 flex items-center gap-1.5 shadow-sm"
      >
        <Sparkles className="w-3.5 h-3.5 text-gold-accent" />
        <Typewriter text={greeting} speed={30} delay={150} />
      </motion.div>

      {/* Floating Animated Heart Game Logo */}
      <motion.div
        onClick={handleLogoTap}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.92 }}
        className="relative mb-5 cursor-pointer select-none"
        title="Tap 5 times for a secret!"
      >
        <div className="w-28 h-28 rounded-3xl bg-gradient-to-tr from-rose-glow via-rose-hot to-gold-accent p-[2px] shadow-[0_0_35px_rgba(255,77,141,0.5)]">
          <div className="w-full h-full bg-plum-800 rounded-3xl flex flex-col items-center justify-center relative overflow-hidden backdrop-blur-xl">
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
              className="text-5xl"
            >
              💖
            </motion.div>
            <span className="text-[10px] tracking-widest text-gold-accent font-mono uppercase mt-1">
              PRESS START
            </span>
          </div>
        </div>
        <div
          onClick={handleBadgeTap}
          className="absolute -bottom-1 -right-1 bg-rose-hot text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/30 shadow-md cursor-pointer active:scale-95"
          title="Tap 3 times for Level Picker"
        >
          7 LVLS
        </div>
      </motion.div>

      {/* Main Title */}
      <motion.div
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-4"
      >
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-1 drop-shadow-md">
          LEVEL UP
        </h1>
        <div className="font-script text-3xl sm:text-4xl text-rose-soft tracking-wide">
          Our Story
        </div>
      </motion.div>

      {/* Cute Opening Disguise */}
      <motion.div
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-4 rounded-2xl mb-4 max-w-xs border border-rose-soft/20 shadow-lg"
      >
        <p className="text-xs sm:text-sm text-rose-blush/90 leading-relaxed font-sans">
          "I made a small game for you 🎮. Complete all 7 levels to unlock a very special surprise."
        </p>
      </motion.div>

      {/* Volume hint */}
      <div className="flex items-center gap-1.5 text-[11px] text-rose-blush/80 mb-5 font-medium">
        <Volume2 className="w-3.5 h-3.5 text-gold-accent" />
        <span>Turn up your volume for romantic music & SFX 🎵</span>
      </div>

      {/* Name Input & Start Form */}
      <motion.form
        onSubmit={handleStart}
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="w-full max-w-xs flex flex-col gap-3.5"
      >
        <div className="text-left">
          <label className="text-[11px] font-semibold text-rose-blush/80 uppercase tracking-wider block mb-1.5 ml-1">
            What's your name, Player? 🌸
          </label>
          <div className="relative">
            <input
              type="text"
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              placeholder="Your name"
              className="w-full px-4 py-3 rounded-xl bg-plum-800/80 border border-rose-soft/30 text-white placeholder-white/30 text-sm focus:outline-none focus:border-rose-hot focus:ring-2 focus:ring-rose-hot/20 transition-all text-center font-medium shadow-inner"
              required
            />
            <Heart className="w-4 h-4 text-rose-hot absolute right-3.5 top-1/2 -translate-y-1/2 fill-rose-hot opacity-60 pointer-events-none" />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-hot via-rose-glow to-rose-hot bg-[length:200%_auto] text-white font-bold text-sm tracking-wide shadow-[0_0_25px_rgba(255,77,141,0.4)] flex items-center justify-center gap-2 active:scale-95 transition-all hover:opacity-95 cursor-pointer"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>START ADVENTURE</span>
        </button>
      </motion.form>

      {/* Quick Level Selector (Cheat for testing) */}
      <AnimatePresence>
        {showLevelJump && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="mt-4 p-3 rounded-2xl bg-black/80 border border-gold-accent/40 max-w-xs w-full text-center"
          >
            <div className="text-[11px] text-gold-accent font-bold uppercase tracking-wider mb-2">
              ⚡ Quick Jump (Testing Mode)
            </div>
            <div className="flex flex-wrap justify-center gap-1.5">
              {[1, 2, 3, 4, 5, 6, 7].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => jumpToLevel(lvl)}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-rose-hot text-xs font-semibold text-white transition-colors"
                >
                  L{lvl} {lvl === 7 ? '🌟' : ''}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Easter egg popup if discovered on splash */}
      {easterEggActive && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-4 p-3 rounded-xl bg-black/70 border border-gold-accent/40 text-xs text-gold-accent"
        >
          {CONFIG.secretEasterEggMessage}
        </motion.div>
      )}

      {/* Gentle Footer note */}
      <div className="mt-8 text-[11px] text-white/40 flex items-center gap-1">
        <span>A customized love story coded with</span>
        <Heart className="w-3 h-3 text-rose-hot fill-rose-hot inline" />
      </div>
    </motion.div>
  );
};
