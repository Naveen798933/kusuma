import React, { useState, useEffect } from 'react';
import { sound } from '../utils/sound';

interface TypewriterProps {
  text: string;
  speed?: number; // ms per character
  delay?: number; // ms initial delay
  className?: string;
  onComplete?: () => void;
  playSounds?: boolean;
}

export const Typewriter: React.FC<TypewriterProps> = ({
  text,
  speed = 35,
  delay = 200,
  className = '',
  onComplete,
  playSounds = false,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setDisplayedText('');
    setIsComplete(false);

    let charIndex = 0;
    let timer: ReturnType<typeof setTimeout>;

    const startTimeout = setTimeout(() => {
      timer = setInterval(() => {
        if (charIndex < text.length) {
          charIndex++;
          setDisplayedText(text.slice(0, charIndex));
          if (playSounds && charIndex % 3 === 0) {
            sound.playTap();
          }
        } else {
          clearInterval(timer);
          setIsComplete(true);
          if (onComplete) onComplete();
        }
      }, speed);
    }, delay);

    return () => {
      clearTimeout(startTimeout);
      clearInterval(timer);
    };
  }, [text, speed, delay, onComplete, playSounds]);

  return (
    <span className={`inline ${className}`}>
      {displayedText}
      {!isComplete && (
        <span className="inline-block w-[2px] h-[1em] ml-1 bg-rose-hot animate-pulse align-middle" />
      )}
    </span>
  );
};
