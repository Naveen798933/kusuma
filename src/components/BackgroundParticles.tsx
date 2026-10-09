import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

export const BackgroundParticles: React.FC = () => {
  // Generate random twinkling stars and floating bokeh hearts
  const stars = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 3,
    }));
  }, []);

  const hearts = useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      x: Math.random() * 95 + 2,
      y: Math.random() * 100,
      size: Math.random() * 18 + 12,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5,
      opacity: Math.random() * 0.25 + 0.1,
    }));
  }, []);

  const [mouseOffset, setMouseOffset] = React.useState({ x: 0, y: 0 });

  React.useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const xRatio = (clientX / window.innerWidth - 0.5) * 20;
      const yRatio = (clientY / window.innerHeight - 0.5) * 20;
      setMouseOffset({ x: xRatio, y: yRatio });
    };

    window.addEventListener('pointermove', handleMove, { passive: true });
    return () => window.removeEventListener('pointermove', handleMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Deep cinematic gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-plum-900 via-plum-800 to-plum-900 opacity-95" />
      
      {/* Soft romantic radial glowing orbs with subtle parallax */}
      <motion.div
        animate={{ x: mouseOffset.x * 1.5, y: mouseOffset.y * 1.5 }}
        transition={{ type: 'spring', damping: 30 }}
        className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-rose-hot/15 blur-3xl animate-pulse-slow"
      />
      <motion.div
        animate={{ x: -mouseOffset.x * 1.5, y: -mouseOffset.y * 1.5 }}
        transition={{ type: 'spring', damping: 30 }}
        className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-gold-accent/15 blur-3xl animate-pulse-slow"
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-rose-glow/10 blur-3xl" />

      {/* Twinkling Stars */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
          }}
          animate={{
            opacity: [0.2, 0.9, 0.2],
            scale: [0.8, 1.3, 0.8],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Floating Bokeh Hearts */}
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          className="absolute select-none text-rose-soft"
          style={{
            left: `${heart.x}%`,
            fontSize: `${heart.size}px`,
            opacity: heart.opacity,
          }}
          initial={{ y: '110vh', rotate: 0 }}
          animate={{
            y: '-10vh',
            rotate: [0, 15, -15, 0],
            x: [`${heart.x}%`, `${heart.x + (Math.random() * 6 - 3)}%`, `${heart.x}%`],
          }}
          transition={{
            duration: heart.duration,
            repeat: Infinity,
            delay: heart.delay,
            ease: "linear",
          }}
        >
          💖
        </motion.div>
      ))}
    </div>
  );
};
