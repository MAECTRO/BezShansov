import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';
import type { DodgeMode, AppLanguage, Occasion } from '../../types/ticket';
import { sound } from '../../utils/audio';
import { TRANSLATIONS } from '../../locales/translations';

// ==========================================
// ❓ ШАГ 1: ВОПРОС И ИГРОВАЯ КНОПКА «НЕТ»
// Убегает, уменьшается или размножается
// ==========================================

export interface Step1QuestionProps {
  crushName: string;
  question: string;
  dodgeMode: DodgeMode;
  occasion?: Occasion;
  language?: AppLanguage;
  onAccept: () => void;
}

const PERSUASION_CHIPS_RU = [
  'Подумай ещё! 😉',
  'Подумай ещё! 🥺',
  'Подумай ещё! 🍰',
  'Подумай ещё! 👀',
  'Подумай ещё! 💖',
  'Подумай ещё! Без шансов ✨',
  'Подумай ещё! Кнопка сломалась 🛠️',
];

const PERSUASION_CHIPS_EN = [
  'Think again! 😉',
  'Think again! 🥺',
  'Think again! 🍰',
  'Think again! 👀',
  'Think again! 💖',
  'No chance ✨',
  'Button broken 🛠️',
];

const PERSUASION_CHIPS_BRO_RU = [
  'Не сливайся! 👊',
  'А как же катка? 🎮',
  'Кто пиццу будет? 🍕',
  'Слово пацана забыл? 👀',
  'Без шансов соскочить ⚡',
  'Братва не поймёт 🚫',
  'Кнопка сломалась 🛠️',
];

const PERSUASION_CHIPS_BRO_EN = [
  'Don\'t flake! 👊',
  'What about gaming? 🎮',
  'Who eats the pizza? 🍕',
  'Bro code applies! 👀',
  'No backing out ⚡',
  'The boys are waiting 🚫',
  'Button broken 🛠️',
];

const CAPTCHA_CARDS_RU = [
  { id: 1, label: 'Мурчащий котик', emoji: '🐱' },
  { id: 2, label: 'Горячая пицца', emoji: '🍕' },
  { id: 3, label: 'Вкусный кофе', emoji: '☕' },
  { id: 4, label: 'Кино и попкорн', emoji: '🎬' },
  { id: 5, label: 'Сладкий тортик', emoji: '🍰' },
  { id: 6, label: 'Закат на крыше', emoji: '🌅' },
];

const CAPTCHA_CARDS_EN = [
  { id: 1, label: 'Purring kitty', emoji: '🐱' },
  { id: 2, label: 'Hot pizza', emoji: '🍕' },
  { id: 3, label: 'Tasty coffee', emoji: '☕' },
  { id: 4, label: 'Movie & popcorn', emoji: '🎬' },
  { id: 5, label: 'Sweet cake', emoji: '🍰' },
  { id: 6, label: 'Rooftop sunset', emoji: '🌅' },
];

const CAPTCHA_CARDS_BRO_RU = [
  { id: 1, label: 'Сочная шаурма', emoji: '🌯' },
  { id: 2, label: 'Катка в плойку', emoji: '🎮' },
  { id: 3, label: 'Холодное пенное', emoji: '🍺' },
  { id: 4, label: 'Горячая пицца', emoji: '🍕' },
  { id: 5, label: 'Братский респект', emoji: '👊' },
  { id: 6, label: 'Душевный разговор', emoji: '🗣️' },
];

const CAPTCHA_CARDS_BRO_EN = [
  { id: 1, label: 'Juicy shawarma', emoji: '🌯' },
  { id: 2, label: 'Console gaming', emoji: '🎮' },
  { id: 3, label: 'Cold brew', emoji: '🍺' },
  { id: 4, label: 'Hot pizza', emoji: '🍕' },
  { id: 5, label: 'Bro respect', emoji: '👊' },
  { id: 6, label: 'Heart-to-heart talk', emoji: '🗣️' },
];

export const Step1_Question: React.FC<Step1QuestionProps> = ({
  crushName,
  question,
  dodgeMode,
  occasion,
  language,
  onAccept,
}) => {
  const isBro = occasion === 'bro';
  const lang: AppLanguage = language || 'ru';
  const t = TRANSLATIONS[lang];
  const persuasionChips = isBro
    ? (lang === 'en' ? PERSUASION_CHIPS_BRO_EN : PERSUASION_CHIPS_BRO_RU)
    : (lang === 'en' ? PERSUASION_CHIPS_EN : PERSUASION_CHIPS_RU);
  const captchaCards = isBro
    ? (lang === 'en' ? CAPTCHA_CARDS_BRO_EN : CAPTCHA_CARDS_BRO_RU)
    : (lang === 'en' ? CAPTCHA_CARDS_EN : CAPTCHA_CARDS_RU);
  // Позиция для режима «Убегает»
  const [dodgeOffset, setDodgeOffset] = useState({ x: 0, y: 0 });
  // Позиция для режима «Телепорт»
  const [teleportIndex, setTeleportIndex] = useState(0);
  const [smokeEffect, setSmokeEffect] = useState(false);
  // Состояние для режима «Морфинг»
  const [isMorphed, setIsMorphed] = useState(false);
  // Состояние для режима «Капча»
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [captchaSelected, setCaptchaSelected] = useState<number[]>([]);
  const [captchaError, setCaptchaError] = useState<string | null>(null);

  // Масштаб для режима «Уменьшается»
  const [noScale, setNoScale] = useState(1);
  const [yesScale, setYesScale] = useState(1);
  // Массив клонов-чипсов для режима «Размножается»
  const [spawnedChips, setSpawnedChips] = useState<Array<{ id: number; text: string; x: number; y: number }>>([]);
  const [noCount, setNoCount] = useState(0);

  const containerRef = useRef<HTMLDivElement | null>(null);

  const TELEPORT_POSITIONS = [
    { x: -110, y: -260 },
    { x: 110, y: -260 },
    { x: -115, y: -130 },
    { x: 115, y: -130 },
    { x: -95, y: -20 },
    { x: 95, y: -20 },
  ];

  // Телепорт в случайный угол с эффектом дыма
  const triggerTeleport = () => {
    if (dodgeMode !== 'teleport') return;
    sound.woosh();
    setSmokeEffect(true);
    setTeleportIndex((prev) => (prev + 1 + Math.floor(Math.random() * (TELEPORT_POSITIONS.length - 1))) % TELEPORT_POSITIONS.length);
    setTimeout(() => setSmokeEffect(false), 300);
    setNoCount((prev) => prev + 1);
  };

  // Убегание кнопки от курсора/пальца (молниеносный уворот с большим радиусом)
  const triggerRunaway = () => {
    if (dodgeMode !== 'runaway') return;
    sound.woosh();
    if (navigator.vibrate) navigator.vibrate(20);
    const signX = Math.random() > 0.5 ? 1 : -1;
    const randomX = signX * (75 + Math.random() * 80);
    // Уворот вверх в свободную область над кнопками
    const randomY = -(55 + Math.random() * 105);
    setDodgeOffset({ x: randomX, y: randomY });
    setNoCount((prev) => prev + 1);
  };

  // Наведение / касание на кнопку «Нет»
  const handleNoPointerEnter = () => {
    if (dodgeMode === 'runaway') {
      triggerRunaway();
    } else if (dodgeMode === 'teleport') {
      triggerTeleport();
    } else if (dodgeMode === 'morph') {
      if (!isMorphed) {
        sound.click();
        setIsMorphed(true);
      }
    }
  };

  // Клик по шуточному чипсу убеждения
  const handleChipClick = (id: number) => {
    sound.coin();
    if (navigator.vibrate) navigator.vibrate([40, 30, 50]);
    // Увеличиваем кнопку «Да» при клике на уговоры
    setYesScale((prev) => Math.min(1.35, prev + 0.06));
    // Убираем кликнутый чипс
    setSpawnedChips((prev) => prev.filter((c) => c.id !== id));
  };

  // Клик по кнопке «Нет»
  const handleNoClick = (e: React.MouseEvent) => {
    e.preventDefault();

    if (dodgeMode === 'morph') {
      // Превращенная кнопка регистрирует согласие
      sound.celebration();
      onAccept();
      return;
    }

    if (dodgeMode === 'captcha') {
      sound.click();
      setShowCaptcha(true);
      return;
    }

    if (dodgeMode === 'teleport') {
      triggerTeleport();
      return;
    }

    sound.click();

    if (dodgeMode === 'runaway') {
      triggerRunaway();
    } else if (dodgeMode === 'shrink') {
      // 1.0 -> 0.75 -> 0.5 -> 0.25 по ТЗ
      const shrinkLevels = [1.0, 0.75, 0.5, 0.25];
      const nextIdx = Math.min(noCount + 1, shrinkLevels.length - 1);
      setNoScale(shrinkLevels[nextIdx]);
      setYesScale(1 + nextIdx * 0.08);
      setNoCount((prev) => prev + 1);
    } else if (dodgeMode === 'clone') {
      const chipIndex = noCount % persuasionChips.length;
      const newChip = {
        id: Date.now() + Math.random(),
        text: persuasionChips[chipIndex],
        x: (Math.random() - 0.5) * 180,
        y: (Math.random() - 0.5) * 120,
      };
      setSpawnedChips((prev) => [...prev.slice(-8), newChip]);
      setYesScale((prev) => Math.min(1.35, prev + 0.05));
      setNoCount((prev) => prev + 1);
    }
  };

  // Динамический забавный текст на кнопке «Нет»
  const getNoButtonText = () => {
    if (dodgeMode === 'morph') {
      if (isMorphed) {
        return isBro ? (lang === 'en' ? 'Bro, count me in! 👊' : 'База, я в деле! 👊') : t.recipient.step1.noButtonMorph;
      }
      return isBro ? (lang === 'en' ? 'Flake out 😴' : 'Слиться 😴') : t.recipient.step1.noButtonDefault;
    }
    if (dodgeMode === 'teleport') {
      return noCount > 0
        ? (isBro ? (lang === 'en' ? 'Catch me! 💨' : 'Не догонишь! 💨') : t.recipient.step1.noButtonCatchMe)
        : (isBro ? (lang === 'en' ? 'Pass 😴' : 'Слиться 😴') : t.recipient.step1.noButtonDefault);
    }
    if (dodgeMode === 'captcha') {
      return isBro ? (lang === 'en' ? 'Pass 😴' : 'Не, не пойду 🙃') : t.recipient.step1.noButtonDefault;
    }
    if (dodgeMode === 'shrink') {
      if (isBro) {
        if (noCount >= 3) return '🤏 ...';
        if (noCount === 2) return lang === 'en' ? 'Fading away?! 🙈' : 'Куда я исчезаю?! 🙈';
        if (noCount === 1) return lang === 'en' ? 'Think again bro 👊' : 'Подумай ещё, бро 👊';
        return lang === 'en' ? 'Pass 😴' : 'Слиться 😴';
      }
      if (noCount >= 3) return t.recipient.step1.noButtonShrink3;
      if (noCount === 2) return t.recipient.step1.noButtonShrink2;
      if (noCount === 1) return t.recipient.step1.noButtonShrink1;
      return t.recipient.step1.noButtonDefault;
    }
    if (isBro) {
      if (noCount > 2) return lang === 'en' ? 'Kidding... No 🙈' : 'Шучу, шучу... Нет 🙈';
      if (noCount === 2) return lang === 'en' ? 'You serious bro? 🤔' : 'Ты серьёзно, бро? 🤔';
      return lang === 'en' ? 'Pass 😴' : 'Слиться 😴';
    }
    if (noCount > 2) return t.recipient.step1.noButtonPersuade2;
    if (noCount === 2) return t.recipient.step1.noButtonPersuade1;
    return t.recipient.step1.noButtonDefault;
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[580px] flex flex-col justify-between p-6 select-none"
    >
      {/* 1. Верхний визуальный блок (Анимированный стикер) */}
      <div className="flex flex-col items-center pt-4 text-center">
        {isBro ? (
          <motion.div
            animate={{
              scale: [1, 1.06, 1],
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="relative w-24 h-24 rounded-3xl bg-gradient-to-tr from-amber-500/20 via-stone-800 to-amber-500/10 border border-amber-500/40 flex items-center justify-center shadow-lg shadow-amber-500/10 mb-5"
          >
            <div className="text-4xl select-none filter drop-shadow-[0_0_14px_rgba(245,158,11,0.5)]">👊</div>
          </motion.div>
        ) : (
          <motion.div
            animate={{
              scale: [1, 1.08, 1],
              rotate: [0, 3, -3, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="relative w-24 h-24 rounded-3xl bg-gradient-to-tr from-amber-500/20 via-rose-500/10 to-amber-400/20 border border-amber-500/30 flex items-center justify-center shadow-lg shadow-amber-500/10 mb-5"
          >
            <div className="absolute -inset-1 rounded-3xl bg-amber-400/10 blur-sm pointer-events-none" />
            <Heart className="w-12 h-12 text-rose-500 fill-rose-500 drop-shadow-[0_4px_12px_rgba(244,63,94,0.4)]" />
            <Sparkles className="w-5 h-5 text-amber-300 absolute top-2 right-2 animate-pulse" />
          </motion.div>
        )}

        <span className="text-[11px] font-mono tracking-widest uppercase text-amber-400/80 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20 mb-3">
          {isBro ? (lang === 'en' ? 'HOMIE SUMMONS 👊' : 'БРАТСКИЙ ВЫЗОВ 👊') : t.recipient.step1.badge}
        </span>

        {/* Имя и вопрос */}
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
          {isBro ? (
            crushName ? (
              <>
                <span className="gold-foil">{crushName}</span>, общий сбор пацанов!
              </>
            ) : (
              'Общий сбор пацанов...'
            )
          ) : crushName ? (
            <>
              <span className="gold-foil">{crushName}</span>{t.recipient.step1.questionIntro}
            </>
          ) : (
            t.recipient.step1.questionImportant
          )}
        </h2>

        <p className="text-sm text-stone-300 mt-3 font-serif italic text-lg leading-relaxed px-2">
          «{question ||
            (isBro
              ? (lang === 'en' ? 'Bro, are we rolling out or what?' : 'Брат, погнали зависнем? Поляна ждёт 👊')
              : (lang === 'en' ? 'Will you go on a date with me?' : 'Пойдёшь со мной на свидание?'))}»
        </p>
      </div>

      {/* 2. Размножающиеся чипсы (если включен режим «Размножается») */}
      <div className="relative w-full h-20 flex items-center justify-center my-2 pointer-events-none">
        <AnimatePresence>
          {spawnedChips.map((chip) => (
            <motion.div
              key={chip.id}
              initial={{ opacity: 0, scale: 0.5, y: 10 }}
              animate={{ opacity: 1, scale: 1, x: chip.x, y: chip.y }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileTap={{ scale: 0.9 }}
              className="absolute px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-200 text-xs font-semibold shadow-md backdrop-blur-sm pointer-events-auto cursor-pointer select-none active:scale-95 transition-transform"
              onClick={() => handleChipClick(chip.id)}
            >
              {chip.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 3. Кнопки «Да» и «Нет» */}
      <div className="w-full flex flex-col gap-3 pb-2 relative z-20">
        {/* Кнопка «Да» */}
        <motion.button
          type="button"
          onClick={() => {
            sound.celebration();
            onAccept();
          }}
          animate={{ scale: yesScale }}
          whileHover={{ scale: yesScale * 1.02 }}
          whileTap={{ scale: yesScale * 0.96 }}
          className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-stone-950 font-black text-base py-4 rounded-2xl w-full shadow-lg shadow-amber-500/25 active:scale-95 cursor-pointer flex items-center justify-center gap-2 border-t border-amber-200/50"
        >
          {isBro ? <span className="text-xl">👊</span> : <Sparkles className="w-5 h-5 fill-stone-950" />}
          <span>{isBro ? (lang === 'en' ? 'Let\'s roll! 👊' : 'Погнали! Без вариантов 👊') : t.recipient.step1.yesButton}</span>
        </motion.button>

        {/* Кнопка «Нет» с уворотом / телепортом / морфингом */}
        <div className="relative w-full flex justify-center h-12">
          {smokeEffect && (
            <motion.div
              initial={{ opacity: 0.9, scale: 0.6 }}
              animate={{ opacity: 0, scale: 1.8 }}
              transition={{ duration: 0.3 }}
              className="absolute text-2xl pointer-events-none z-30"
              style={{
                left: `calc(50% + ${TELEPORT_POSITIONS[teleportIndex]?.x ?? 0}px)`,
                top: `${TELEPORT_POSITIONS[teleportIndex]?.y ?? 0}px`,
              }}
            >
              💨
            </motion.div>
          )}

          <motion.button
            type="button"
            onClick={handleNoClick}
            onMouseEnter={handleNoPointerEnter}
            onPointerDown={handleNoPointerEnter}
            onPointerOver={handleNoPointerEnter}
            onTouchStart={handleNoPointerEnter}
            animate={{
              x:
                dodgeMode === 'runaway'
                  ? dodgeOffset.x
                  : dodgeMode === 'teleport'
                  ? TELEPORT_POSITIONS[teleportIndex]?.x ?? 0
                  : 0,
              y:
                dodgeMode === 'runaway'
                  ? dodgeOffset.y
                  : dodgeMode === 'teleport'
                  ? TELEPORT_POSITIONS[teleportIndex]?.y ?? 0
                  : 0,
              scale: noScale,
            }}
            transition={{
              type: 'spring',
              stiffness: 1200,
              damping: 24,
              mass: 0.15,
            }}
            className={`px-6 py-2.5 rounded-xl text-xs transition-all cursor-pointer select-none border ${
              dodgeMode === 'morph' && isMorphed
                ? 'bg-gradient-to-r from-emerald-500/25 via-amber-500/20 to-emerald-500/25 text-emerald-300 border-emerald-400 font-bold shadow-lg shadow-emerald-500/20 animate-pulse'
                : 'bg-stone-900/80 text-stone-400 font-medium border-stone-800 hover:text-stone-300 hover:border-stone-700'
            }`}
          >
            {getNoButtonText()}
          </motion.button>
        </div>
      </div>

      {/* 4. Модальное окно Капчи (DodgeMode = 'captcha') */}
      <AnimatePresence>
        {showCaptcha && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute inset-0 z-50 bg-[#0C0A09]/95 backdrop-blur-md rounded-[40px] p-5 flex flex-col justify-between text-center border-2 border-amber-500/30"
          >
            <div className="pt-2">
              <div className="w-10 h-10 mx-auto mb-2 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-xl">
                {isBro ? '👊' : '🛡️'}
              </div>
              <h3 className="text-base font-bold text-white tracking-tight">
                {isBro ? (lang === 'en' ? 'Bro Code Verification' : 'Проверка на пацана 👊') : t.recipient.step1.captchaTitle}
              </h3>
              <p className="text-xs text-stone-400 mt-1 max-w-[280px] mx-auto leading-relaxed">
                {isBro
                  ? (lang === 'en'
                      ? 'Prove you are not flaking on the boys. Select the hangout essentials:'
                      : 'Докажи, что ты не сливаешь сбор. Выбери базу для пацанского вечера:')
                  : t.recipient.step1.captchaSubtitle}
              </p>

              {/* Сетка фоток/карточек */}
              <div className="grid grid-cols-3 gap-2 mt-4">
                {captchaCards.map((item) => {
                  const isChecked = captchaSelected.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        sound.click();
                        setCaptchaError(
                          isBro
                            ? (lang === 'en'
                                ? 'Error! Bro code strictly forbids flaking 👊'
                                : 'Ошибка! Пацанский кодекс строго запрещает сливаться 👊')
                            : (lang === 'en'
                                ? 'Error! Your heart simply will not let you reject this ❤️'
                                : 'Ошибка! Сердце не позволяет отказаться от этого ❤️')
                        );
                        setCaptchaSelected((prev) =>
                          prev.includes(item.id)
                            ? prev.filter((x) => x !== item.id)
                            : [...prev, item.id]
                        );
                      }}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                        isChecked
                          ? (isBro
                              ? 'bg-amber-500/25 border-amber-400 ring-1 ring-amber-400/40 text-amber-200'
                              : 'bg-rose-500/20 border-rose-500 ring-1 ring-rose-400/40 text-rose-200')
                          : 'bg-stone-900 border-stone-800 hover:border-stone-700 text-stone-300'
                      }`}
                    >
                      <span className="text-2xl">{item.emoji}</span>
                      <span className="text-[10px] font-medium leading-tight">
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {captchaError && (
                <div className={`mt-2.5 p-2 rounded-lg border text-[11px] font-medium ${
                  isBro
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                }`}>
                  {captchaError}
                </div>
              )}
            </div>

            {/* Единственная доступная кнопка */}
            <div className="pt-3 pb-1">
              <button
                type="button"
                onClick={() => {
                  sound.celebration();
                  setShowCaptcha(false);
                  onAccept();
                }}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-stone-950 font-black text-sm shadow-lg shadow-amber-500/20 cursor-pointer active:scale-95 transition-transform flex items-center justify-center gap-2"
              >
                {isBro ? <span className="text-base">👊</span> : <Sparkles className="w-4 h-4 fill-stone-950" />}
                <span>{isBro ? (lang === 'en' ? 'Alright, I\'m rolling with the boys! 👊' : 'База, я с пацанами! 👊') : t.recipient.step1.captchaAgreeButton}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowCaptcha(false)}
                className="text-[10px] text-stone-500 hover:text-stone-300 mt-2 font-mono"
              >
                {t.recipient.step1.captchaCloseButton}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
