import confetti from 'canvas-confetti';

// ==========================================
// 🎊 КОНФИГУРАЦИИ САЛЮТОВ И КОНФЕТТИ
// Золотая палитра и сочные праздничные залпы
// ==========================================

export function fireGoldEuphoria() {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    zIndex: 9999,
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  // Золотые и янтарные тона роскоши
  const colors = ['#F59E0B', '#FDE68A', '#D97706', '#FFFFFF', '#FB7185'];

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
    colors,
  });
  fire(0.2, {
    spread: 60,
    colors,
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 1.1,
    colors,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.3,
    colors,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
    colors,
  });
}

export function fireTicketCelebration() {
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#F59E0B', '#FDE68A', '#E2E8F0', '#38BDF8'],
    zIndex: 9999,
  });
}
