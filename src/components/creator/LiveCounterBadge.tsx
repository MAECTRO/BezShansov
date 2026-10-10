import React, { useState, useEffect } from 'react';
import type { AppLanguage } from '../../types/ticket';

interface LiveCounterBadgeProps {
  language?: AppLanguage;
  count: number;
  isBumping?: boolean;
}

export const LiveCounterBadge: React.FC<LiveCounterBadgeProps> = ({
  language = 'ru',
  count,
  isBumping = false,
}) => {
  const isEn = language === 'en';
  const [displayCount, setDisplayCount] = useState<number>(0);

  // Анимация плавного отсчета (Count-Up) при первой загрузке или изменении
  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 800; // 0.8 секунды
    const startValue = Math.max(0, count - 30);
    const endValue = count;

    let frameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // ease-out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(startValue + (endValue - startValue) * easeOut);
      setDisplayCount(current);

      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      } else {
        setDisplayCount(endValue);
      }
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [count]);

  // Форматирование числа с пробелом/запятой (1 842 / 1,842)
  const formatted = isEn
    ? displayCount.toLocaleString('en-US')
    : displayCount.toLocaleString('ru-RU').replace(/\s/g, '\u00A0');

  return (
    <div
      className={`inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-neutral-900/80 border border-amber-500/30 backdrop-blur-md shadow-[0_0_20px_rgba(245,158,11,0.18)] transition-all duration-300 select-none ${
        isBumping
          ? 'scale-105 border-amber-400 ring-2 ring-amber-400/50 shadow-[0_0_25px_rgba(245,158,11,0.4)]'
          : 'scale-100 hover:border-amber-500/50'
      }`}
    >
      {/* Пульсирующая зелёная точка онлайна */}
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
      </span>

      {/* Текст с живым счетчиком */}
      <span className="text-xs font-mono font-semibold text-amber-200 tracking-wide flex items-center gap-1.5">
        <span className="text-sm">🔥</span>
        <span>
          {isEn
            ? `${formatted} dates generated`
            : `Сгенерировано ${formatted} ${getRussianWordEnding(displayCount)}`}
        </span>
      </span>
    </div>
  );
};

// Склонение слова "свидание" (1 свидание, 2 свидания, 5 свиданий)
function getRussianWordEnding(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 19) {
    return 'свиданий';
  }
  if (mod10 === 1) {
    return 'свидание';
  }
  if (mod10 >= 2 && mod10 <= 4) {
    return 'свидания';
  }
  return 'свиданий';
}
