import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { PartyPopper, Sparkles, ArrowRight, Heart } from 'lucide-react';
import { Button } from '../ui/Button';
import { fireGoldEuphoria } from '../../utils/confetti';
import { sound } from '../../utils/audio';
import type { AppLanguage, Occasion } from '../../types/ticket';
import { TRANSLATIONS } from '../../locales/translations';

// ==========================================
// 🎉 ШАГ 2: ЭЙФОРИЯ И КОНФЕТТИ
// Мгновенный взрыв салюта, виброотклик
// ==========================================

export interface Step2EuphoriaProps {
  crushName: string;
  occasion?: Occasion;
  language?: AppLanguage;
  onNext: () => void;
}

export const Step2_Euphoria: React.FC<Step2EuphoriaProps> = ({
  crushName,
  occasion,
  language,
  onNext,
}) => {
  const isBro = occasion === 'bro';
  const lang: AppLanguage = language || 'ru';
  const t = TRANSLATIONS[lang];

  useEffect(() => {
    // 1. Запуск салюта золотого конфетти
    fireGoldEuphoria();
    // 2. Виброотклик смартфона
    if (typeof window !== 'undefined' && 'navigator' in window && navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }
  }, []);

  return (
    <div className="relative w-full h-full min-h-[580px] flex flex-col justify-between p-6 text-center select-none">
      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Анимированный праздничный бейдж */}
        {isBro ? (
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="relative w-28 h-28 rounded-3xl bg-gradient-to-tr from-amber-500/20 via-stone-800 to-amber-400/30 border-2 border-amber-400/50 flex items-center justify-center shadow-[0_0_40px_rgba(245,158,11,0.3)] mb-6"
          >
            <div className="text-5xl select-none filter drop-shadow-[0_0_14px_rgba(245,158,11,0.6)]">👊</div>
            <motion.div
              animate={{ scale: [1, 1.25, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center shadow-lg text-sm"
            >
              🔥
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="relative w-28 h-28 rounded-3xl bg-gradient-to-tr from-amber-500/20 via-pink-500/20 to-amber-400/30 border border-amber-400/40 flex items-center justify-center shadow-[0_0_40px_rgba(245,158,11,0.3)] mb-6"
          >
            <PartyPopper className="w-14 h-14 text-amber-400" />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-rose-500 flex items-center justify-center shadow-lg"
            >
              <Heart className="w-4 h-4 text-white fill-white" />
            </motion.div>
          </motion.div>
        )}

        <span className="text-xs font-mono tracking-widest uppercase text-amber-400 font-bold mb-2">
          {isBro
            ? (lang === 'en' ? 'SQUAD ASSEMBLED // BRO CODE' : 'СБОР УТВЕРЖДЁН // СЛОВО ПАЦАНА')
            : (lang === 'en' ? '100% MUTUAL MATCH' : 'ВЗАИМНЫЙ МЭТЧ 100%')}
        </span>

        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          {isBro
            ? (crushName ? `${crushName}, база! 👊` : (lang === 'en' ? 'LFG! SQUAD CONFIRMED 👊' : 'БАЗА! СБОР УТВЕРЖДЁН 👊'))
            : `${crushName ? `${crushName}! ` : ''}${t.recipient.step2.title}`}
        </h2>

        <p className="text-sm text-stone-300 mt-3 max-w-xs leading-relaxed">
          {isBro
            ? (lang === 'en'
                ? 'Ironclad bro code. No flaking allowed! Let\'s lock in the time, venue and food.'
                : 'Слово пацана крепче стали. Слиться уже не получится! Погнали раскидаем тайминг и поляну.')
            : t.recipient.step2.subtitle}
        </p>

        {/* Дополнительная кнопка повторного салюта для фана */}
        <button
          type="button"
          onClick={() => {
            sound.coin();
            fireGoldEuphoria();
          }}
          className="mt-6 text-xs text-amber-400/80 hover:text-amber-300 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 cursor-pointer active:scale-95 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>
            {isBro
              ? (lang === 'en' ? '🔥 Fire victory sparks' : '🔥 Зарядить победный залп')
              : (lang === 'en' ? 'Fire confetti again' : 'Запустить салют ещё раз')}
          </span>
        </button>
      </div>

      <div className="w-full pb-2">
        <Button
          variant="primary"
          fullWidth
          size="lg"
          onClick={onNext}
          icon={<ArrowRight className="w-5 h-5 text-stone-950" />}
        >
          {isBro
            ? (lang === 'en' ? 'Choose time & venue →' : 'Выбрать время и поляну →')
            : t.recipient.step2.continueButton}
        </Button>
      </div>
    </div>
  );
};
