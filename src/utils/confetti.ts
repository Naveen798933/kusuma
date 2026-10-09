import confetti from 'canvas-confetti';

export function fireHeartConfetti() {
  const duration = 2.5 * 1000;
  const animationEnd = Date.now() + duration;

  const frame = () => {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors: ['#ff4d8d', '#ffd6e7', '#ffcf6b', '#ffffff'],
      shapes: ['circle'],
      scalar: 1.2,
    });
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors: ['#ff4d8d', '#ffd6e7', '#ffcf6b', '#ffffff'],
      shapes: ['circle'],
      scalar: 1.2,
    });

    if (Date.now() < animationEnd) {
      requestAnimationFrame(frame);
    }
  };

  frame();
}

export function fireProposalFireworks() {
  const duration = 6 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

  const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

  const interval: ReturnType<typeof setInterval> = setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    
    // Fireworks bursting from both sides
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      colors: ['#ff4d8d', '#ffd6e7', '#ffcf6b', '#ffffff', '#ff2d78'],
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      colors: ['#ff4d8d', '#ffd6e7', '#ffcf6b', '#ffffff', '#ff2d78'],
    });
  }, 250);
}
