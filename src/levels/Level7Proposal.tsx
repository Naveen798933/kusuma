import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Download, MessageCircle, CheckCircle2, ChevronRight } from 'lucide-react';
import { toPng } from 'html-to-image';
import { useGameStore } from '../store/gameStore';
import { CONFIG } from '../config';
import { sound } from '../utils/sound';
import { fireProposalFireworks } from '../utils/confetti';
import { RunawayButton } from '../components/RunawayButton';
import { Typewriter } from '../components/Typewriter';

type ProposalPhase = 'montage' | 'spotlight' | 'question' | 'celebration';

export const Level7Proposal: React.FC = () => {
  const { playerName, recordProposalYes, finalAnswerGiven } = useGameStore();
  const [phase, setPhase] = useState<ProposalPhase>(finalAnswerGiven ? 'celebration' : 'montage');
  const [photoIndex, setPhotoIndex] = useState(0);
  const [letterLineIndex, setLetterLineIndex] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [cardStatusMessage, setCardStatusMessage] = useState<string | null>(null);
  const [customReplyNote, setCustomReplyNote] = useState('');
  const cardRef = useRef<HTMLDivElement>(null);

  const herName = playerName || CONFIG.herName;
  const myName = CONFIG.myName;

  // Slideshow cycle
  useEffect(() => {
    if (phase !== 'montage') return;

    const photoInterval = setInterval(() => {
      setPhotoIndex((prev) => (prev + 1) % CONFIG.levels.length);
    }, 4500);

    return () => clearInterval(photoInterval);
  }, [phase]);

  // Advance love letter line-by-line automatically
  useEffect(() => {
    if (phase !== 'montage') return;

    const lineInterval = setInterval(() => {
      setLetterLineIndex((prev) => {
        if (prev < CONFIG.loveLetterLines.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 4500);

    return () => clearInterval(lineInterval);
  }, [phase]);

  const handleNextLetterLine = () => {
    sound.playTap();
    if (letterLineIndex < CONFIG.loveLetterLines.length - 1) {
      setLetterLineIndex((prev) => prev + 1);
    } else {
      handleProceedToSpotlight();
    }
  };

  const handleProceedToSpotlight = () => {
    sound.playTap();
    setPhase('spotlight');
    setTimeout(() => {
      setPhase('question');
    }, 3800);
  };

  const handleYes = () => {
    sound.playCelebrationFanfare();
    fireProposalFireworks();
    recordProposalYes();
    setPhase('celebration');
  };

  // Safe download moment card with html-to-image & graceful fallback
  const handleDownloadCard = async () => {
    if (!cardRef.current) return;
    try {
      sound.playTap();
      setIsDownloading(true);
      setCardStatusMessage('Rendering certificate...');

      const dataUrl = await toPng(cardRef.current, {
        quality: 0.98,
        cacheBust: true,
        backgroundColor: '#1a0b2e',
      });

      const link = document.createElement('a');
      link.download = `Our_Story_Proposal_${herName}_and_${myName}.png`;
      link.href = dataUrl;
      link.click();

      setCardStatusMessage('Saved to Photos! 📸');
      setTimeout(() => setCardStatusMessage(null), 3000);
    } catch (err) {
      console.warn('html-to-image fallback triggered:', err);
      // Fallback: Copy love message to clipboard
      if (navigator.clipboard) {
        navigator.clipboard.writeText(
          `Official Certificate of Best Friends Forever 💖✨\n${herName} and ${myName} - Best Friends Forever!\nDate: ${CONFIG.proposalDate}\n"Best friends through every chapter of life!"`
        );
        setCardStatusMessage('Moment copied to clipboard! 📋💖');
        setTimeout(() => setCardStatusMessage(null), 3500);
      }
    } finally {
      setIsDownloading(false);
    }
  };

  // WhatsApp & Native Web Share
  const getWhatsAppLink = () => {
    const phone = CONFIG.whatsAppNumber.replace(/[^0-9]/g, '');
    const combined = customReplyNote.trim()
      ? `${CONFIG.whatsAppMessage}\n\nNote from ${herName}: "${customReplyNote.trim()}"`
      : CONFIG.whatsAppMessage;
    const text = encodeURIComponent(combined);
    return `https://wa.me/${phone}?text=${text}`;
  };

  const handleShareMoment = async () => {
    sound.playTap();
    const shareMessage = customReplyNote.trim()
      ? `${CONFIG.whatsAppMessage}\n\n"${customReplyNote.trim()}"\n— ${herName} & ${myName}`
      : `${CONFIG.whatsAppMessage}\n\nBest friends forever: ${herName} & ${myName}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'LEVEL UP: OUR STORY 💖✨',
          text: shareMessage,
          url: window.location.href,
        });
        return;
      } catch {
        // User cancelled share or unsupported
      }
    }
    // Fallback directly to WhatsApp
    window.open(getWhatsAppLink(), '_blank');
  };

  const currentPhoto = CONFIG.levels[photoIndex] || CONFIG.levels[0];

  return (
    <div className="w-full max-w-md mx-auto px-4 py-2 flex flex-col flex-1 items-center justify-center min-h-[500px]">
      <AnimatePresence mode="wait">
        {/* ============================================================== */}
        {/* PHASE 1: SLOW-MOTION SLIDESHOW & LOVE LETTER                   */}
        {/* ============================================================== */}
        {phase === 'montage' && (
          <motion.div
            key="montage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full flex flex-col items-center justify-center"
          >
            <div className="text-center mb-3">
              <span className="text-xs uppercase tracking-widest text-gold-accent font-semibold flex items-center justify-center gap-1">
                <span>The Final Level</span>
                <span>•</span>
                <span>Our Journey</span>
              </span>
              <h2 className="text-2xl font-bold text-white font-script text-3xl">
                Every Road Led To You
              </h2>
            </div>

            {/* Slideshow frame */}
            <div className="polaroid-frame w-full max-w-[290px] mx-auto shadow-2xl relative mb-3.5">
              <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-plum-900 border border-black/10">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={photoIndex}
                    src={currentPhoto.photoUrl}
                    alt={currentPhoto.photoAlt}
                    initial={{ opacity: 0, scale: 1.08 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 1.2, ease: 'easeInOut' }}
                    className="w-full h-full object-cover"
                    onLoad={(e) => {
                      if (e.currentTarget.naturalWidth <= 10) {
                        e.currentTarget.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><defs><radialGradient id="grad" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="%23ff4d8d"/><stop offset="100%" stop-color="%231a0b2e"/></radialGradient></defs><rect width="400" height="400" fill="url(%23grad)"/><text x="200" y="190" font-size="70" text-anchor="middle" dominant-baseline="middle">💖</text><text x="200" y="260" font-family="sans-serif" font-weight="bold" font-size="20" fill="%23ffd6e7" text-anchor="middle">Chapter %23${photoIndex + 1}</text><text x="200" y="295" font-family="sans-serif" font-size="14" fill="%23ffcf6b" text-anchor="middle">Our Journey</text></svg>`;
                      }
                    }}
                    onError={(e) => {
                      e.currentTarget.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="%2326123e"/><text x="200" y="200" font-size="60" text-anchor="middle" dominant-baseline="middle">💖</text><text x="200" y="260" font-family="sans-serif" font-size="16" fill="%23ffd6e7" text-anchor="middle">Memory %23${photoIndex + 1}</text></svg>`;
                    }}
                  />
                </AnimatePresence>
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-black/50 text-[10px] text-white/80 font-mono">
                  {photoIndex + 1} / {CONFIG.levels.length}
                </div>
              </div>

              <div className="mt-2 text-center">
                <span className="font-script text-xl text-plum-800 font-semibold">
                  {currentPhoto.title}
                </span>
              </div>
            </div>

            {/* Handwritten Love Letter */}
            <div
              onClick={handleNextLetterLine}
              className="glass-card w-full p-4 rounded-2xl border border-rose-soft/30 text-center min-h-[95px] flex flex-col items-center justify-center mb-4 cursor-pointer relative hover:border-gold-accent/40 transition-colors"
              title="Tap to advance letter"
            >
              <p className="text-xs sm:text-sm text-rose-blush leading-relaxed font-sans font-medium">
                <Typewriter
                  key={letterLineIndex}
                  text={CONFIG.loveLetterLines[letterLineIndex]}
                  speed={30}
                  delay={100}
                />
              </p>
              <div className="mt-2 flex items-center gap-1 text-[10px] text-white/40">
                <span>Line {letterLineIndex + 1} of {CONFIG.loveLetterLines.length}</span>
                <ChevronRight className="w-3 h-3 text-gold-accent" />
              </div>
            </div>

            <button
              onClick={handleProceedToSpotlight}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-hot to-rose-glow text-white font-bold text-sm tracking-wide shadow-lg shadow-rose-hot/40 flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <span>Turn To The Last Page 💫</span>
            </button>
          </motion.div>
        )}

        {/* ============================================================== */}
        {/* PHASE 2: SPOTLIGHT FADE TO BLACK                               */}
        {/* ============================================================== */}
        {phase === 'spotlight' && (
          <motion.div
            key="spotlight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="fixed inset-0 z-50 bg-plum-900/98 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center"
          >
            <div className="w-72 h-72 rounded-full bg-rose-hot/15 blur-3xl absolute -top-10" />

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="text-4xl mb-4"
            >
              ✨
            </motion.div>

            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="text-2xl sm:text-3xl font-bold text-white mb-2 font-script text-3xl sm:text-4xl"
            >
              {herName}...
            </motion.h2>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.8 }}
              className="text-sm text-rose-blush/90 max-w-xs font-sans font-medium"
            >
              {CONFIG.proposalHeadline}
            </motion.p>
          </motion.div>
        )}

        {/* ============================================================== */}
        {/* PHASE 3: THE PROPOSAL QUESTION (YES vs RUNAWAY)                */}
        {/* ============================================================== */}
        {phase === 'question' && (
          <motion.div
            key="question"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="w-full glass-card p-6 rounded-3xl border border-rose-soft/30 shadow-[0_0_50px_rgba(255,77,141,0.25)] text-center flex flex-col items-center"
          >
            {/* Glowing Pinky Promise Icon */}
            <motion.div
              animate={{
                scale: [1, 1.15, 1],
                rotate: [0, 4, -4, 0],
              }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              className="w-20 h-20 rounded-full bg-gradient-to-tr from-rose-hot via-gold-accent to-rose-glow p-[2px] mb-4 shadow-[0_0_30px_rgba(255,207,107,0.6)]"
            >
              <div className="w-full h-full rounded-full bg-plum-800 flex items-center justify-center text-4xl">
                🤞
              </div>
            </motion.div>

            <span className="text-xs uppercase tracking-widest text-gold-accent font-semibold mb-1">
              Final Level Unlocked
            </span>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 leading-tight">
              {herName}
            </h3>

            <p className="text-base sm:text-lg text-rose-blush font-script text-2xl sm:text-3xl leading-relaxed mb-6 px-2">
              "{CONFIG.proposalQuestion}"
            </p>

            {/* Proposal Decision Buttons */}
            <div className="w-full flex flex-col gap-3 relative mt-2">
              <motion.button
                animate={{ scale: [1, 1.03, 1] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
                whileTap={{ scale: 0.96 }}
                onClick={handleYes}
                className="w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-rose-hot via-rose-glow to-rose-hot text-white font-extrabold text-lg tracking-wider shadow-[0_0_35px_rgba(255,77,141,0.7),inset_0_1px_1.5px_rgba(255,255,255,0.7)] border border-white/40 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Heart className="w-5 h-5 fill-white text-white animate-bounce" />
                <span>YES! 💖🤞</span>
              </motion.button>

              <div className="mt-1">
                <RunawayButton onYesSelected={handleYes} />
              </div>
            </div>
          </motion.div>
        )}

        {/* ============================================================== */}
        {/* PHASE 4: BEST FRIENDS FOREVER CELEBRATION & MOMENT CARD        */}
        {/* ============================================================== */}
        {phase === 'celebration' && (
          <motion.div
            key="celebration"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full flex flex-col items-center text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-pill border border-gold-accent/40 text-gold-accent text-xs font-bold uppercase tracking-widest mb-3 shadow-[0_0_15px_rgba(255,207,107,0.3)]">
              <Sparkles className="w-4 h-4 text-gold-accent" />
              <span>BEST FRIENDS FOREVER! 🎉💖</span>
              <Sparkles className="w-4 h-4 text-gold-accent" />
            </div>

            <h2 className="text-3xl font-extrabold text-white mb-1 font-script text-4xl text-rose-soft">
              Best Friends For Life
            </h2>

            <p className="text-xs text-rose-blush/90 max-w-xs mb-4 leading-relaxed">
              {CONFIG.finalSuccessMessage}
            </p>

            {/* The Downloadable Moment Certificate Card */}
            <div
              ref={cardRef}
              className="w-full max-w-sm rounded-3xl p-5 mb-4 relative overflow-hidden border border-white/30 shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_35px_rgba(255,77,141,0.25)] text-left"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.14) 0%, rgba(38, 18, 62, 0.85) 45%, rgba(13, 4, 23, 0.95) 100%)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
              }}
            >
              <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-rose-hot/25 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full bg-gold-accent/25 blur-3xl pointer-events-none" />

              <div className="flex items-center justify-between border-b border-white/15 pb-3 mb-3">
                <div>
                  <div className="text-[10px] tracking-widest uppercase text-gold-accent font-semibold">
                    LEVEL UP: OUR STORY
                  </div>
                  <div className="text-xs font-bold text-white">
                    Official Certificate of Best Friends Forever
                  </div>
                </div>
                <div className="text-2xl">🤞</div>
              </div>

              <div className="my-4 text-center">
                <div className="font-script text-3xl sm:text-4xl text-rose-hot font-bold mb-1">
                  {herName} & {myName}
                </div>
                <div className="inline-flex items-center gap-1 text-xs text-white/90 font-medium bg-white/10 px-3.5 py-1 rounded-full border border-white/15">
                  <CheckCircle2 className="w-3.5 h-3.5 text-rose-soft" />
                  <span>Officially Best Friends Forever & Ever 🤞✨</span>
                </div>
              </div>

              <div className="border-t border-white/15 pt-3 flex items-center justify-between text-[11px] text-white/70">
                <span>Date: {CONFIG.proposalDate}</span>
                <span className="text-rose-blush font-semibold">💖 100% Cleared</span>
              </div>
            </div>

            {/* Notification toast if saved or copied */}
            <AnimatePresence>
              {cardStatusMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-3 px-3.5 py-1.5 rounded-full glass-pill border border-gold-accent/40 text-xs text-gold-accent font-semibold"
                >
                  {cardStatusMessage}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Buttons: Save Moment & WhatsApp/Share */}
            <div className="w-full flex flex-col gap-2.5 max-w-sm">
              {/* Optional personal message to append */}
              <div className="text-left w-full">
                <input
                  type="text"
                  value={customReplyNote}
                  onChange={(e) => setCustomReplyNote(e.target.value)}
                  placeholder="Add a sweet message to send back... (optional)"
                  className="glass-input w-full px-4 py-3 rounded-2xl text-white placeholder-white/40 text-xs transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={handleDownloadCard}
                  disabled={isDownloading}
                  className="py-3 px-3 rounded-2xl glass-pill hover:border-gold-accent/50 text-white font-semibold text-xs active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Download className="w-4 h-4 text-gold-accent" />
                  <span>{isDownloading ? 'Saving...' : 'Save Card 📸'}</span>
                </button>

                <button
                  onClick={() => {
                    sound.playCelebrationFanfare();
                    fireProposalFireworks();
                  }}
                  className="py-3 px-3 rounded-2xl glass-button text-rose-blush font-semibold text-xs border border-rose-hot/40 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                >
                  <span>🎉 More Confetti!</span>
                </button>
              </div>

              <button
                onClick={handleShareMoment}
                className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:brightness-105 text-white font-extrabold text-xs sm:text-sm shadow-[0_0_25px_rgba(16,185,129,0.4),inset_0_1px_1.5px_rgba(255,255,255,0.4)] border border-white/30 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Send to {myName} on WhatsApp 💌</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
