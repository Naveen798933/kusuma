import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LevelShell } from '../components/LevelShell';
import { useGameStore } from '../store/gameStore';
import { sound } from '../utils/sound';
import { Sparkles } from 'lucide-react';

interface CardItem {
  id: number;
  icon: string;
  name: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const PAIRS = [
  { icon: '💖', name: 'Hearts' },
  { icon: '🌸', name: 'Flowers' },
  { icon: '☕', name: 'Coffee' },
  { icon: '📸', name: 'Camera' },
  { icon: '⭐', name: 'Stars' },
  { icon: '🍕', name: 'Pizza' },
];

export const Level2Memory: React.FC = () => {
  const { completeCurrentLevel } = useGameStore();
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [isLocked, setIsLocked] = useState(false);
  const [matchesCount, setMatchesCount] = useState(0);

  // Initialize shuffled cards
  useEffect(() => {
    const deck: CardItem[] = [];
    let id = 1;
    [...PAIRS, ...PAIRS].forEach((item) => {
      deck.push({
        id: id++,
        icon: item.icon,
        name: item.name,
        isFlipped: false,
        isMatched: false,
      });
    });

    // Fisher-Yates shuffle
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    setCards(deck);
  }, []);

  const handleCardClick = (clickedCard: CardItem) => {
    if (isLocked || clickedCard.isFlipped || clickedCard.isMatched) return;

    sound.playTap();

    // Flip the clicked card
    const updatedCards = cards.map((c) =>
      c.id === clickedCard.id ? { ...c, isFlipped: true } : c
    );
    setCards(updatedCards);

    const newFlipped = [...flippedIds, clickedCard.id];
    setFlippedIds(newFlipped);

    if (newFlipped.length === 2) {
      setIsLocked(true);
      const firstCard = updatedCards.find((c) => c.id === newFlipped[0])!;
      const secondCard = updatedCards.find((c) => c.id === newFlipped[1])!;

      if (firstCard.name === secondCard.name) {
        // MATCH!
        setTimeout(() => {
          sound.playMatchPair();
          setCards((prev) =>
            prev.map((c) =>
              c.id === firstCard.id || c.id === secondCard.id
                ? { ...c, isMatched: true }
                : c
            )
          );
          setFlippedIds([]);
          setIsLocked(false);
          const newMatchTotal = matchesCount + 1;
          setMatchesCount(newMatchTotal);

          if (newMatchTotal === PAIRS.length) {
            setTimeout(() => {
              completeCurrentLevel();
            }, 600);
          }
        }, 400);
      } else {
        // NO MATCH -> Flip back after slight pause
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === firstCard.id || c.id === secondCard.id
                ? { ...c, isFlipped: false }
                : c
            )
          );
          setFlippedIds([]);
          setIsLocked(false);
        }, 900);
      }
    }
  };

  return (
    <LevelShell
      levelNumber={2}
      title="Memory Lane 🧠"
      subtitle="Find all 6 pairs of memories we cherish"
      badge={
        <div className="flex items-center gap-1.5 px-3.5 py-1 rounded-full glass-pill border border-rose-hot/40 text-xs font-semibold text-rose-blush shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-gold-accent" />
          <span>Pairs Matched: {matchesCount} / {PAIRS.length}</span>
        </div>
      }
    >
      <div className="w-full glass-card p-3 sm:p-4 rounded-3xl border border-white/20 shadow-2xl flex flex-col items-center">
        {/* 3x4 Grid of cards */}
        <div className="grid grid-cols-4 gap-2 sm:gap-2.5 w-full max-w-[340px]">
          {cards.map((card) => {
            const isRevealed = card.isFlipped || card.isMatched;
            return (
              <motion.button
                key={card.id}
                whileTap={{ scale: 0.94 }}
                onClick={() => handleCardClick(card)}
                className={`aspect-square rounded-2xl flex items-center justify-center text-2xl sm:text-3xl relative transition-all duration-300 cursor-pointer shadow-md border ${
                  card.isMatched
                    ? 'bg-rose-hot/25 border-rose-hot/60 opacity-90 shadow-[0_0_15px_rgba(255,77,141,0.5)]'
                    : isRevealed
                    ? 'glass-card border-gold-accent/50 shadow-[0_0_15px_rgba(255,207,107,0.3)]'
                    : 'glass-pill hover:border-white/40 active:scale-95'
                }`}
                style={{ touchAction: 'manipulation' }}
                aria-label={`Memory card ${card.id}`}
              >
                {isRevealed ? (
                  <motion.span
                    initial={{ scale: 0.5, rotateY: 90 }}
                    animate={{ scale: 1, rotateY: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {card.icon}
                  </motion.span>
                ) : (
                  <span className="text-rose-soft/40 text-lg">❓</span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </LevelShell>
  );
};
