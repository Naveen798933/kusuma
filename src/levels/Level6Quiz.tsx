import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LevelShell } from '../components/LevelShell';
import { useGameStore } from '../store/gameStore';
import { sound } from '../utils/sound';
import { CONFIG } from '../config';
import { HelpCircle } from 'lucide-react';

export const Level6Quiz: React.FC = () => {
  const { completeCurrentLevel } = useGameStore();
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [playfulMessage, setPlayfulMessage] = useState<string | null>(null);
  const [wrongIndices, setWrongIndices] = useState<number[]>([]);

  const questions = CONFIG.quizQuestions;
  const currentQuestion = questions[currentQIndex] || questions[0];

  const handleOptionSelect = (optionIndex: number) => {
    if (optionIndex === currentQuestion.correctIndex) {
      // Correct!
      sound.playMatchPair();
      setPlayfulMessage(null);
      setWrongIndices([]);

      const nextQ = currentQIndex + 1;
      if (nextQ < questions.length) {
        setCurrentQIndex(nextQ);
      } else {
        // All 5 questions complete!
        sound.playLevelWin();
        setTimeout(() => {
          completeCurrentLevel();
        }, 600);
      }
    } else {
      // Wrong answer -> gentle playful teasing hint, never a block!
      sound.playBoing();
      setWrongIndices((prev) => [...prev, optionIndex]);
      setPlayfulMessage(currentQuestion.playfulHint);
    }
  };

  return (
    <LevelShell
      levelNumber={6}
      title="Guess Me 💭"
      subtitle="How well do you know us? (No wrong answers can break my heart!)"
      badge={
        <div className="flex items-center gap-1.5 px-3.5 py-1 rounded-full glass-pill border border-rose-hot/40 text-xs font-semibold text-rose-blush shadow-sm">
          <HelpCircle className="w-3.5 h-3.5 text-gold-accent" />
          <span>Question {currentQIndex + 1} of {questions.length}</span>
        </div>
      }
    >
      <div className="w-full max-w-sm glass-card p-5 rounded-3xl border border-white/20 shadow-2xl flex flex-col items-center">
        {/* Question Text */}
        <div className="w-full text-center mb-4 min-h-[50px] flex items-center justify-center">
          <h3 className="text-base sm:text-lg font-bold text-white leading-snug drop-shadow-sm">
            {currentQuestion.question}
          </h3>
        </div>

        {/* Options List */}
        <div className="w-full flex flex-col gap-2.5">
          {currentQuestion.options.map((opt, idx) => {
            const isMarkedWrong = wrongIndices.includes(idx);
            return (
              <motion.button
                key={`${currentQIndex}-${idx}`}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleOptionSelect(idx)}
                className={`w-full py-3.5 px-4 rounded-2xl text-left text-xs sm:text-sm font-medium border transition-all duration-200 flex items-center justify-between cursor-pointer ${
                  isMarkedWrong
                    ? 'bg-rose-hot/15 border-rose-hot/40 text-rose-blush/80'
                    : 'glass-pill hover:border-rose-hot/40 text-white active:bg-rose-hot/20 shadow-sm'
                }`}
                style={{ touchAction: 'manipulation' }}
              >
                <span>{opt}</span>
                {isMarkedWrong && <span className="text-xs">🙈</span>}
              </motion.button>
            );
          })}
        </div>

        {/* Playful Teasing Toast if she picked wrong */}
        <AnimatePresence>
          {playfulMessage && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-3 p-3 rounded-2xl bg-plum-700/90 border border-gold-accent/40 text-center text-xs text-gold-accent leading-relaxed shadow-lg w-full"
            >
              {playfulMessage}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </LevelShell>
  );
};
