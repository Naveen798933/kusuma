import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { useGameStore } from './store/gameStore';
import { BackgroundParticles } from './components/BackgroundParticles';
import { TopBar } from './components/TopBar';
import { PhotoReveal } from './components/PhotoReveal';

// Level mini-games
import { SplashScreen } from './levels/SplashScreen';
import { Level1Spark } from './levels/Level1Spark';
import { Level2Memory } from './levels/Level2Memory';
import { Level3Puzzle } from './levels/Level3Puzzle';
import { Level4Catch } from './levels/Level4Catch';
import { Level5Stars } from './levels/Level5Stars';
import { Level6Quiz } from './levels/Level6Quiz';
import { Level7Proposal } from './levels/Level7Proposal';

export const App: React.FC = () => {
  const { stage, currentLevel } = useGameStore();

  const renderActiveScreen = () => {
    if (stage === 'splash') {
      return <SplashScreen key="splash" />;
    }

    if (stage === 'revealing') {
      return <PhotoReveal key={`reveal-${currentLevel}`} />;
    }

    if (stage === 'victory') {
      return <Level7Proposal key="victory" />;
    }

    // stage === 'playing'
    switch (currentLevel) {
      case 1:
        return <Level1Spark key="lvl-1" />;
      case 2:
        return <Level2Memory key="lvl-2" />;
      case 3:
        return <Level3Puzzle key="lvl-3" />;
      case 4:
        return <Level4Catch key="lvl-4" />;
      case 5:
        return <Level5Stars key="lvl-5" />;
      case 6:
        return <Level6Quiz key="lvl-6" />;
      case 7:
        return <Level7Proposal key="lvl-7" />;
      default:
        return <Level1Spark key="fallback" />;
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden bg-plum-900 text-rose-petal">
      {/* Background Animated Bokeh & Stars */}
      <BackgroundParticles />

      {/* Main Game Interface Container */}
      <div className="relative z-10 flex flex-col min-h-screen w-full max-w-lg mx-auto">
        <TopBar />

        <main className="flex-1 flex flex-col justify-center items-center py-2 w-full">
          <AnimatePresence mode="wait">
            {renderActiveScreen()}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default App;
