import React, { useState, useEffect, useRef, useCallback } from 'react';
import { LevelShell } from '../components/LevelShell';
import { useGameStore } from '../store/gameStore';
import { sound } from '../utils/sound';
import { Trophy, Sparkles } from 'lucide-react';

interface FallingItem {
  id: number;
  x: number; // 10% to 90%
  y: number; // 0% to 100%
  type: 'heart' | 'letter' | 'broken';
  speed: number;
}

interface CatchEffect {
  id: number;
  x: number;
  text: string;
  color: string;
}

const TARGET_SCORE = 10;

export const Level4Catch: React.FC = () => {
  const { completeCurrentLevel } = useGameStore();
  const [score, setScore] = useState(0);
  const [basketDisplayX, setBasketDisplayX] = useState(50);
  const [items, setItems] = useState<FallingItem[]>([]);
  const [catchEffects, setCatchEffects] = useState<CatchEffect[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const basketXRef = useRef(50);
  const scoreRef = useRef(0);
  const isDraggingRef = useRef(false);
  const nextIdRef = useRef(1);
  const hasWonRef = useRef(false);

  // Update basket position safely
  const updateBasketPosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const relativeX = clientX - rect.left;
    const clampedPercent = Math.max(12, Math.min(88, (relativeX / rect.width) * 100));
    basketXRef.current = clampedPercent;
    setBasketDisplayX(clampedPercent);
  }, []);

  // Pointer drag listeners attached to container and window for silky smooth touch tracking
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    updateBasketPosition(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDraggingRef.current) {
      updateBasketPosition(e.clientX);
    }
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  // Main 60fps Game Loop decoupled from react state thrashing
  useEffect(() => {
    let animId: number;
    let spawnTimer: ReturnType<typeof setInterval>;

    // Spawn falling items every 750ms
    spawnTimer = setInterval(() => {
      if (hasWonRef.current) return;

      const types: ('heart' | 'letter' | 'broken')[] = ['heart', 'heart', 'letter', 'broken'];
      const chosenType = types[Math.floor(Math.random() * types.length)];

      setItems((prev) => [
        ...prev,
        {
          id: nextIdRef.current++,
          x: Math.random() * 76 + 12, // 12% to 88%
          y: -8,
          type: chosenType,
          speed: Math.random() * 0.7 + 1.2,
        },
      ]);
    }, 700);

    // Physics & Collision loop
    const loop = () => {
      if (hasWonRef.current) return;

      setItems((prevItems) => {
        const remaining: FallingItem[] = [];
        const currentBasketX = basketXRef.current;

        for (const item of prevItems) {
          const nextY = item.y + item.speed;

          // Check collision near basket zone (between 76% and 88% height)
          if (nextY >= 76 && nextY <= 88) {
            const distance = Math.abs(item.x - currentBasketX);
            if (distance < 15) {
              // CAUGHT ITEM!
              if (item.type === 'heart') {
                sound.playHeartCollect();
                const newScore = Math.min(TARGET_SCORE, scoreRef.current + 1);
                scoreRef.current = newScore;
                setScore(newScore);

                setCatchEffects((prevEff) => [
                  ...prevEff,
                  { id: Date.now() + Math.random(), x: currentBasketX, text: '+1 💖', color: '#ff4d8d' }
                ]);
              } else if (item.type === 'letter') {
                sound.playMatchPair();
                const newScore = Math.min(TARGET_SCORE, scoreRef.current + 2);
                scoreRef.current = newScore;
                setScore(newScore);

                setCatchEffects((prevEff) => [
                  ...prevEff,
                  { id: Date.now() + Math.random(), x: currentBasketX, text: '+2 💌', color: '#ffcf6b' }
                ]);
              } else if (item.type === 'broken') {
                sound.playBoing();
                const newScore = Math.max(0, scoreRef.current - 1);
                scoreRef.current = newScore;
                setScore(newScore);

                setCatchEffects((prevEff) => [
                  ...prevEff,
                  { id: Date.now() + Math.random(), x: currentBasketX, text: '-1 💔', color: '#ff75a0' }
                ]);
              }

              // Check victory
              if (scoreRef.current >= TARGET_SCORE && !hasWonRef.current) {
                hasWonRef.current = true;
                setTimeout(() => {
                  completeCurrentLevel();
                }, 600);
              }

              // Do not add to remaining (it was caught)
              continue;
            }
          }

          // Keep item if it hasn't fallen off bottom
          if (nextY < 105) {
            remaining.push({ ...item, y: nextY });
          }
        }

        return remaining;
      });

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      clearInterval(spawnTimer);
      cancelAnimationFrame(animId);
    };
  }, [completeCurrentLevel]);

  // Clean up floating catch effects
  useEffect(() => {
    if (catchEffects.length === 0) return;
    const timer = setTimeout(() => {
      setCatchEffects((prev) => prev.slice(1));
    }, 700);
    return () => clearTimeout(timer);
  }, [catchEffects]);

  return (
    <LevelShell
      levelNumber={4}
      title="Catch Good Vibes 💌"
      subtitle="Slide the basket to catch hearts & letters, dodge broken hearts!"
      badge={
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3.5 py-1 rounded-full glass-pill border border-rose-hot/40 text-xs font-semibold text-rose-blush shadow-sm">
            <Trophy className="w-3.5 h-3.5 text-gold-accent" />
            <span>Score: {score} / {TARGET_SCORE}</span>
          </div>
          <div className="flex items-center gap-1 px-3 py-1 rounded-full glass-pill border border-white/15 text-[11px] font-medium text-white/90">
            <Sparkles className="w-3 h-3 text-gold-accent" />
            <span>💌 = +2</span>
          </div>
        </div>
      }
    >
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="w-full h-80 sm:h-96 glass-card rounded-3xl relative overflow-hidden border border-white/20 shadow-2xl select-none cursor-ew-resize touch-none"
      >
        {/* Falling objects */}
        {items.map((item) => (
          <div
            key={item.id}
            className="absolute transform -translate-x-1/2 pointer-events-none"
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
            }}
          >
            {item.type === 'heart' && (
              <span className="text-2xl drop-shadow-[0_0_8px_rgba(255,77,141,0.8)] filter">
                💖
              </span>
            )}
            {item.type === 'letter' && (
              <span className="text-2xl drop-shadow-[0_0_8px_rgba(255,207,107,0.8)] filter">
                💌
              </span>
            )}
            {item.type === 'broken' && (
              <span className="text-2xl opacity-75">
                💔
              </span>
            )}
          </div>
        ))}

        {/* Floating popups (+1, +2, -1) */}
        {catchEffects.map((eff) => (
          <div
            key={eff.id}
            className="absolute -translate-x-1/2 font-extrabold text-sm drop-shadow-md pointer-events-none animate-bounce"
            style={{
              left: `${eff.x}%`,
              bottom: '24%',
              color: eff.color,
            }}
          >
            {eff.text}
          </div>
        ))}

        {/* Player Basket */}
        <div
          className="absolute bottom-6 transform -translate-x-1/2 flex flex-col items-center pointer-events-none transition-transform duration-75"
          style={{ left: `${basketDisplayX}%` }}
        >
          <div className="text-4xl drop-shadow-[0_0_15px_rgba(255,77,141,0.7)] select-none">
            🧺
          </div>
          <div className="w-12 h-1.5 bg-gradient-to-r from-rose-hot via-gold-accent to-rose-hot rounded-full blur-[1px] opacity-80 -mt-1" />
        </div>

        {/* Instruction footer */}
        <div className="absolute bottom-1 w-full text-center text-[10px] text-white/40 uppercase tracking-widest pointer-events-none">
          👈 Drag finger left & right to move 👉
        </div>
      </div>
    </LevelShell>
  );
};
