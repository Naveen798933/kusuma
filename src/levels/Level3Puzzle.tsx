import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LevelShell } from '../components/LevelShell';
import { useGameStore } from '../store/gameStore';
import { sound } from '../utils/sound';
import { CONFIG } from '../config';
import { Sparkles, Wand2 } from 'lucide-react';

interface Tile {
  id: number;       // Current position in grid (0-8)
  correctId: number;// Target correct position (0-8)
}

export const Level3Puzzle: React.FC = () => {
  const { completeCurrentLevel } = useGameStore();
  const currentConfig = CONFIG.levels.find((l) => l.id === 3) || CONFIG.levels[2];
  
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [selectedTileIndex, setSelectedTileIndex] = useState<number | null>(null);
  const [isSolved, setIsSolved] = useState(false);
  const [canAutoSolve, setCanAutoSolve] = useState(false);

  useEffect(() => {
    const initial: Tile[] = Array.from({ length: 9 }).map((_, idx) => ({
      id: idx,
      correctId: idx,
    }));

    // Pre-scramble slightly (3 swaps)
    const scrambled = [...initial];
    const swapPairs = [
      [0, 1],
      [3, 4],
      [7, 8],
    ];

    swapPairs.forEach(([a, b]) => {
      const temp = scrambled[a];
      scrambled[a] = scrambled[b];
      scrambled[b] = temp;
    });

    setTiles(scrambled);

    const timer = setTimeout(() => {
      setCanAutoSolve(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const checkSolution = (currentList: Tile[]) => {
    const allCorrect = currentList.every((tile, idx) => tile.correctId === idx);
    if (allCorrect) {
      setIsSolved(true);
      sound.playLevelWin();
      setTimeout(() => {
        completeCurrentLevel();
      }, 1200);
    }
  };

  const handleTileClick = (index: number) => {
    if (isSolved) return;
    sound.playTap();

    if (selectedTileIndex === null) {
      setSelectedTileIndex(index);
    } else {
      if (selectedTileIndex === index) {
        setSelectedTileIndex(null);
      } else {
        const nextList = [...tiles];
        const temp = nextList[selectedTileIndex];
        nextList[selectedTileIndex] = nextList[index];
        nextList[index] = temp;

        setTiles(nextList);
        setSelectedTileIndex(null);
        sound.playMatchPair();
        checkSolution(nextList);
      }
    }
  };

  const handleAutoSolve = () => {
    sound.playMatchPair();
    const solvedList: Tile[] = Array.from({ length: 9 }).map((_, idx) => ({
      id: idx,
      correctId: idx,
    }));
    setTiles(solvedList);
    setIsSolved(true);
    setTimeout(() => {
      sound.playLevelWin();
      completeCurrentLevel();
    }, 1000);
  };

  return (
    <LevelShell
      levelNumber={3}
      title="Puzzle of Us 🧩"
      subtitle={
        selectedTileIndex !== null
          ? `Tile #${tiles[selectedTileIndex].correctId + 1} chosen. Now tap another tile to swap!`
          : "Tap any tile, then tap another to swap them into place"
      }
      badge={
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3.5 py-1 rounded-full glass-pill border border-rose-hot/40 text-xs font-semibold text-rose-blush shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-gold-accent" />
            <span>{selectedTileIndex !== null ? 'Tile Selected 👆' : 'Tap 2 tiles to swap'}</span>
          </div>
          {canAutoSolve && !isSolved && (
            <button
              onClick={handleAutoSolve}
              className="flex items-center gap-1 px-3 py-1 rounded-full glass-pill border border-gold-accent/50 text-[11px] font-bold text-gold-accent hover:border-gold-accent active:scale-95 transition-all shadow-sm cursor-pointer"
            >
              <Wand2 className="w-3 h-3" />
              <span>Magic Solve</span>
            </button>
          )}
        </div>
      }
    >
      <div className="w-full max-w-[320px] aspect-square glass-card p-3 rounded-3xl border border-white/20 shadow-2xl relative flex items-center justify-center">
        {/* The 3x3 Puzzle Grid */}
        <div className="grid grid-cols-3 grid-rows-3 gap-1.5 w-full h-full rounded-2xl overflow-hidden relative">
          {tiles.map((tile, currentIndex) => {
            const isSelected = selectedTileIndex === currentIndex;
            const isCorrect = tile.correctId === currentIndex;

            const row = Math.floor(tile.correctId / 3);
            const col = tile.correctId % 3;
            const xPercent = col * 50;
            const yPercent = row * 50;

            return (
              <motion.div
                key={tile.correctId}
                layout
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                onClick={() => handleTileClick(currentIndex)}
                className={`relative rounded-xl overflow-hidden cursor-pointer border select-none transition-all ${
                  isSelected
                    ? 'ring-4 ring-gold-accent scale-95 z-20 shadow-lg'
                    : isCorrect && !isSolved
                    ? 'border-rose-soft/50'
                    : 'border-white/20 hover:border-white/50'
                }`}
                style={{ touchAction: 'manipulation' }}
              >
                {/* Image piece */}
                <div
                  className={`w-full h-full bg-cover transition-all duration-700 ${
                    isSolved ? 'filter-none' : 'blur-[1.5px]'
                  }`}
                  style={{
                    backgroundImage: `url(${currentConfig.photoUrl}), radial-gradient(circle, #ff4d8d 0%, #1a0b2e 100%)`,
                    backgroundPosition: `${xPercent}% ${yPercent}%`,
                    backgroundSize: '300% 300%',
                  }}
                />

                {/* Piece index number */}
                {!isSolved && (
                  <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-md bg-black/60 text-[10px] font-mono text-white font-bold backdrop-blur-sm">
                    {tile.correctId + 1}
                  </div>
                )}

                {/* Highlight ring on correct position */}
                {isCorrect && !isSolved && (
                  <div className="absolute top-1 left-1 text-[10px]">✨</div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </LevelShell>
  );
};
