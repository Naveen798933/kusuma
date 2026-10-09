import React from 'react';
import { motion } from 'framer-motion';

interface LevelShellProps {
  levelNumber: number;
  title: string;
  subtitle: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
}

export const LevelShell: React.FC<LevelShellProps> = ({
  levelNumber,
  title,
  subtitle,
  badge,
  children,
}) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 15, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -15, scale: 0.98 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="w-full max-w-md mx-auto px-4 py-2 flex flex-col flex-1"
    >
      {/* Header card with Title and Subtitle */}
      <div className="text-center mb-4 relative">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full glass-pill border border-white/20 text-rose-blush text-xs font-semibold tracking-wider uppercase mb-1.5 shadow-[0_0_15px_rgba(255,77,141,0.25)]">
          <span>Level {levelNumber}</span>
          <span className="text-gold-accent">•</span>
          <span>Challenge</span>
        </div>

        <h2 className="text-2xl font-extrabold tracking-tight text-white drop-shadow-md flex items-center justify-center gap-2">
          {title}
        </h2>

        <p className="text-xs text-rose-blush/85 max-w-xs mx-auto mt-1 font-medium">
          {subtitle}
        </p>

        {badge && (
          <div className="mt-2.5 flex justify-center">
            {badge}
          </div>
        )}
      </div>

      {/* Main Mini-game container */}
      <div className="flex-1 flex flex-col justify-center items-center w-full min-h-[380px] relative">
        {children}
      </div>
    </motion.section>
  );
};
