import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Fingerprint, CheckCircle2, Lock, Unlock } from 'lucide-react';
import type { TactileGesture, AppLanguage } from '../../types/ticket';
import { sound } from '../../utils/audio';
import { TRANSLATIONS } from '../../locales/translations';

// ==========================================
// 🖐️ ШАГ 0: ТАКТИЛЬНЫЙ ЖЕСТ НА ВХОДЕ
// Скретч-слой, лента, сургуч, Touch ID или сейф
// ==========================================

export interface Step0GestureProps {
  gesture: TactileGesture;
  crushName: string;
  language?: AppLanguage;
  onComplete: () => void;
}

export const Step0_Gesture: React.FC<Step0GestureProps> = ({
  gesture,
  crushName,
  language,
  onComplete,
}) => {
  const lang: AppLanguage = language || 'ru';
  const t = TRANSLATIONS[lang];
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isScratching, setIsScratching] = useState(false);
  const [scratchProgress, setScratchProgress] = useState(0);
  const [isCracked, setIsCracked] = useState(false);
  const [ribbonOffset, setRibbonOffset] = useState(0);
  const [isUnraveling, setIsUnraveling] = useState(false);
  const completedRef = useRef(false);

  // 4. ТАКТИЛЬНЫЙ СКАНЕР: TOUCH ID (FINGERPRINT)
  const [fpProgress, setFpProgress] = useState(0);
  const [fpHolding, setFpHolding] = useState(false);
  const [fpVerified, setFpVerified] = useState(false);
  const fpIntervalRef = useRef<number | null>(null);

  const startFpHold = (e: React.PointerEvent) => {
    if (fpVerified || completedRef.current) return;
    try {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    } catch {}
    setFpHolding(true);
    sound.click();
    if (navigator.vibrate) navigator.vibrate(50);

    const startTime = Date.now();
    const duration = 1500;

    if (fpIntervalRef.current) clearInterval(fpIntervalRef.current);

    fpIntervalRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, (elapsed / duration) * 100);
      setFpProgress(pct);

      if (Math.floor(elapsed / 400) !== Math.floor((elapsed - 50) / 400)) {
        if (navigator.vibrate) navigator.vibrate(30);
      }

      if (pct >= 100) {
        if (fpIntervalRef.current) {
          clearInterval(fpIntervalRef.current);
          fpIntervalRef.current = null;
        }
        setFpProgress(100);
        setFpVerified(true);
        completedRef.current = true;
        sound.celebration();
        if (navigator.vibrate) navigator.vibrate([80, 40, 100]);
        setTimeout(() => {
          onComplete(); // переход на Шаг 1 (Вопрос)
        }, 300);
      }
    }, 40);
  };

  const stopFpHold = (e?: React.PointerEvent) => {
    if (fpVerified || completedRef.current) return;
    if (e) {
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {}
    }
    setFpHolding(false);
    setFpProgress(0);
    if (fpIntervalRef.current) {
      clearInterval(fpIntervalRef.current);
      fpIntervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (fpIntervalRef.current) clearInterval(fpIntervalRef.current);
    };
  }, []);

  // 5. МЕТАЛЛИЧЕСКИЙ ДИСК СЕЙФА (SAFE_DIAL)
  const [dialAngle, setDialAngle] = useState(0);
  const [totalRotation, setTotalRotation] = useState(0);
  const [isSafeOpened, setIsSafeOpened] = useState(false);
  const totalRotationRef = useRef(0);
  const isDraggingDialRef = useRef(false);
  const dialRef = useRef<HTMLDivElement | null>(null);
  const lastAngleRef = useRef<number | null>(null);
  const lastTickDegRef = useRef(0);

  const triggerSafeUnlock = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    isDraggingDialRef.current = false;
    setIsSafeOpened(true);
    setTotalRotation(360);
    totalRotationRef.current = 360;
    sound.crack();
    sound.celebration();
    if (navigator.vibrate) navigator.vibrate([100, 50, 150]);
    setTimeout(() => {
      onComplete(); // переход на Шаг 1 (Вопрос)
    }, 400);
  };

  const handleDialPointerDown = (e: React.PointerEvent) => {
    if (isSafeOpened || completedRef.current) return;
    isDraggingDialRef.current = true;
    try {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    } catch {}

    if (dialRef.current) {
      const rect = dialRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const rad = Math.atan2(e.clientY - cy, e.clientX - cx);
      lastAngleRef.current = rad * (180 / Math.PI);
    }
  };

  const handleDialPointerMove = (e: React.PointerEvent) => {
    if (!isDraggingDialRef.current || isSafeOpened || completedRef.current || !dialRef.current) return;

    const rect = dialRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const currentDeg = Math.atan2(e.clientY - cy, e.clientX - cx) * (180 / Math.PI);

    if (lastAngleRef.current !== null) {
      let delta = currentDeg - lastAngleRef.current;
      if (delta > 180) delta -= 360;
      if (delta < -180) delta += 360;

      totalRotationRef.current += Math.abs(delta);
      const currentTotal = totalRotationRef.current;
      const newAngle = dialAngle + delta;

      setDialAngle(newAngle);
      setTotalRotation(currentTotal);

      if (Math.abs(currentTotal - lastTickDegRef.current) >= 25) {
        lastTickDegRef.current = currentTotal;
        sound.click();
        if (navigator.vibrate) navigator.vibrate(20);
      }

      const progress = Math.min(100, Math.round((currentTotal / 360) * 100));
      if (progress >= 100 && !completedRef.current) {
        triggerSafeUnlock();
      }
    }

    lastAngleRef.current = currentDeg;
  };

  const handleDialPointerUp = (e: React.PointerEvent) => {
    isDraggingDialRef.current = false;
    lastAngleRef.current = null;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  const handleDialClick = () => {
    if (isSafeOpened || completedRef.current) return;
    totalRotationRef.current += 90;
    const currentTotal = totalRotationRef.current;
    setDialAngle((prev) => prev + 90);
    setTotalRotation(currentTotal);
    sound.click();
    if (navigator.vibrate) navigator.vibrate(25);
    const progress = Math.min(100, Math.round((currentTotal / 360) * 100));
    if (progress >= 100 && !completedRef.current) {
      triggerSafeUnlock();
    }
  };

  // ----------------------------------------------------
  // 1. СКРЕТЧ: Запотевшее стекло / Золотой скретч-слой
  // ----------------------------------------------------
  useEffect(() => {
    if (gesture !== 'scratch') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const width = rect.width > 50 ? rect.width : 340;
    const height = rect.height > 50 ? rect.height : 425;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Рисуем матовое золотисто-обсидиановое напыление
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#26221E');
    grad.addColorStop(0.5, '#38322C');
    grad.addColorStop(1, '#1A1715');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Текстура капель/инея
    ctx.fillStyle = 'rgba(245, 158, 11, 0.12)';
    for (let i = 0; i < 40; i++) {
      ctx.beginPath();
      ctx.arc(
        Math.random() * width,
        Math.random() * height,
        Math.random() * 20 + 5,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

    // Подсказка на холсте
    ctx.font = '600 14px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#FDE68A';
    ctx.textAlign = 'center';
    ctx.fillText(
      lang === 'en' ? '✨ Rub off the frosted glass ✨' : '✨ Сотри запотевшее стекло ✨',
      width / 2,
      height / 2 - 10
    );
    ctx.font = '400 12px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#A8A29E';
    ctx.fillText(
      lang === 'en' ? 'swipe with your finger or pointer' : 'проведи пальцем или мышкой',
      width / 2,
      height / 2 + 15
    );
  }, [gesture, lang]);

  const handleScratch = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 32, 0, Math.PI * 2);
    ctx.fill();

    // Каждые несколько движений считаем процент очистки
    checkScratchProgress();
  };

  const checkScratchProgress = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Выборочная проверка для производительности
    const w = canvas.width;
    const h = canvas.height;
    try {
      const imgData = ctx.getImageData(0, 0, w, h);
      const data = imgData.data;
      let clearPixels = 0;
      const step = 32; // Сэмплируем каждый 32-й пиксель
      let totalSamples = 0;

      for (let i = 3; i < data.length; i += 4 * step) {
        totalSamples++;
        if (data[i] < 128) {
          clearPixels++;
        }
      }

      const percent = Math.round((clearPixels / totalSamples) * 100);
      setScratchProgress(percent);

      if (percent >= 50 && !completedRef.current) {
        completedRef.current = true;
        sound.coin();
        if (navigator.vibrate) navigator.vibrate([40, 20, 60]);
        setTimeout(() => {
          onComplete();
        }, 300);
      }
    } catch {}
  };

  // ----------------------------------------------------
  // 2. СУРГУЧНАЯ ПЕЧАТЬ
  // ----------------------------------------------------
  const handleCrackSeal = () => {
    if (isCracked) return;
    sound.crack();
    if (navigator.vibrate) navigator.vibrate([50, 30, 80]);
    setIsCracked(true);
    setTimeout(() => {
      onComplete();
    }, 600);
  };

  // ----------------------------------------------------
  // 3. АТЛАСНАЯ ЛЕНТА
  // ----------------------------------------------------
  const handleRibbonDragEnd = (_: any, info: any) => {
    if (info.offset.x > 130) {
      sound.woosh();
      if (navigator.vibrate) navigator.vibrate(50);
      setIsUnraveling(true);
      setTimeout(() => {
        onComplete();
      }, 550);
    } else {
      setRibbonOffset(0);
    }
  };

  return (
    <div className="relative w-full h-full min-h-[580px] flex flex-col items-center justify-center p-6 text-center select-none">
      {/* 1. Жест: Скретч */}
      {gesture === 'scratch' && (
        <div className="relative w-full max-w-[340px] aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-stone-800 flex items-center justify-center">
          {/* Слой под скретчем (что открывается) */}
          <div className="absolute inset-0 bg-gradient-to-b from-stone-900 via-obsidian-900 to-black p-6 flex flex-col items-center justify-center text-center">
            <span className="text-3xl mb-2">💌</span>
            <span className="text-xs font-mono text-amber-400 tracking-widest uppercase">
              {t.recipient.step0.scratchHeader}
            </span>
            <h3 className="text-xl font-bold text-white mt-1">
              {t.recipient.step0.scratchForYou.replace('{name}', (crushName || (lang === 'en' ? 'YOU' : 'ТЕБЯ')).toUpperCase())}
            </h3>
            <p className="text-xs text-stone-400 mt-2">
              {t.recipient.step0.scratchSub}
            </p>
          </div>

          {/* Холст скретча */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full cursor-pointer touch-none select-none z-10 transition-opacity duration-500"
            style={{ opacity: scratchProgress >= 50 ? 0 : 1, touchAction: 'none' }}
            onMouseDown={(e) => {
              setIsScratching(true);
              handleScratch(e.clientX, e.clientY);
            }}
            onMouseUp={() => setIsScratching(false)}
            onMouseLeave={() => setIsScratching(false)}
            onMouseMove={(e) => {
              if (isScratching) handleScratch(e.clientX, e.clientY);
            }}
            onTouchStart={(e) => {
              setIsScratching(true);
              if (e.touches[0]) handleScratch(e.touches[0].clientX, e.touches[0].clientY);
            }}
            onTouchEnd={() => setIsScratching(false)}
            onTouchMove={(e) => {
              const touch = e.touches[0];
              if (touch) handleScratch(touch.clientX, touch.clientY);
            }}
          />
        </div>
      )}

      {/* 2. Жест: Сургучная печать */}
      {gesture === 'seal' && (
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="text-stone-400 text-xs font-mono tracking-widest uppercase">
            {t.recipient.step0.sealHeader.replace('{name}', (crushName || (lang === 'en' ? 'YOU' : 'ТЕБЯ')).toUpperCase())}
          </div>

          <motion.button
            type="button"
            onClick={handleCrackSeal}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative cursor-pointer group"
          >
            {/* Внешнее свечение печати */}
            <div className="absolute -inset-4 rounded-full bg-amber-500/10 blur-xl group-hover:bg-amber-500/20 transition-all" />

            {/* Тело 3D сургучной печати */}
            <div className={`w-32 h-32 rounded-full bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 border-4 border-amber-500/60 shadow-[0_15px_35px_rgba(180,83,9,0.5)] flex flex-col items-center justify-center text-amber-200 transition-all duration-300 relative overflow-hidden ${
              isCracked ? 'scale-110 opacity-0 blur-sm' : ''
            }`}>
              {/* Трещина по диагонали при клике */}
              {isCracked && (
                <div className="absolute inset-0 bg-stone-950/80 skew-x-12 animate-ping" />
              )}
              <Sparkles className="w-8 h-8 mb-1 animate-pulse" />
              <span className="font-serif font-black text-xs tracking-wider uppercase">
                TOUCH
              </span>
              <span className="text-[9px] font-mono text-amber-300/80">
                {t.recipient.step0.sealButton}
              </span>
            </div>

            {/* Эффект трещин и распада при клике */}
            {isCracked && (
              <motion.div
                initial={{ scale: 0.8, opacity: 1 }}
                animate={{ scale: 1.6, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <span className="text-5xl">💥</span>
              </motion.div>
            )}
          </motion.button>

          <p className="text-xs text-stone-400 max-w-xs">
            {t.recipient.step0.sealSub}
          </p>
        </div>
      )}

      {/* 3. Жест: Атласная лента */}
      {gesture === 'ribbon' && (
        <div className="w-full max-w-xs flex flex-col items-center space-y-6">
          <div className="text-xs font-mono text-stone-400 tracking-widest uppercase">
            {t.recipient.step0.ribbonHeader.replace('{name}', (crushName || (lang === 'en' ? 'YOU' : 'ТЕБЯ')).toUpperCase())}
          </div>

          <div className="relative w-full h-20 bg-stone-900/90 rounded-2xl border border-stone-800 flex items-center px-3 shadow-inner">
            {/* Текст внутри слайдера */}
            <span className="absolute inset-0 flex items-center justify-center text-xs text-stone-400 font-medium pointer-events-none px-4 pl-14 text-center">
              {isUnraveling ? t.recipient.step0.ribbonDone : t.recipient.step0.ribbonSwipe}
            </span>

            {/* Анимация распускания ленты */}
            {isUnraveling && (
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                className="absolute inset-0 bg-gradient-to-r from-amber-400/30 via-amber-300/50 to-transparent flex items-center justify-center pointer-events-none"
              >
                <motion.span
                  initial={{ scale: 0.8, rotate: 0 }}
                  animate={{ scale: 1.8, rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-4xl"
                >
                  🎀✨
                </motion.span>
              </motion.div>
            )}

            {/* Ползунок ленты */}
            <motion.div
              drag={!isUnraveling ? 'x' : false}
              dragConstraints={{ left: 0, right: 180 }}
              dragElastic={0.1}
              dragSnapToOrigin={!isUnraveling}
              onDragEnd={handleRibbonDragEnd}
              animate={{
                x: isUnraveling ? 180 : ribbonOffset,
                scale: isUnraveling ? 1.15 : 1,
              }}
              className="w-14 h-14 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30 cursor-grab active:cursor-grabbing z-10"
            >
              <ArrowRight className="w-6 h-6 text-stone-950 font-bold" />
            </motion.div>
          </div>

          <p className="text-xs text-stone-400">
            {t.recipient.step0.ribbonSub}
          </p>
        </div>
      )}

      {/* 4. Жест: Сканер Touch ID (fingerprint) */}
      {gesture === 'fingerprint' && (
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="text-xs font-mono text-stone-400 tracking-widest uppercase">
            {t.recipient.step0.fpHeader.replace('{name}', (crushName || (lang === 'en' ? 'GUEST' : 'ГОСТЬ')).toUpperCase())}
          </div>

          <div
            className="relative w-44 h-44 rounded-full flex items-center justify-center cursor-pointer select-none touch-none group"
            onPointerDown={startFpHold}
            onPointerUp={stopFpHold}
            onPointerLeave={stopFpHold}
            onPointerCancel={stopFpHold}
          >
            {/* Круговой SVG прогресс */}
            <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
              <circle
                cx="88"
                cy="88"
                r="78"
                className="stroke-stone-800"
                strokeWidth="6"
                fill="none"
              />
              <circle
                cx="88"
                cy="88"
                r="78"
                className={`transition-all ${
                  fpVerified
                    ? 'stroke-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.8)]'
                    : 'stroke-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.6)]'
                }`}
                strokeWidth="6"
                strokeDasharray={2 * Math.PI * 78}
                strokeDashoffset={(2 * Math.PI * 78) * (1 - fpProgress / 100)}
                strokeLinecap="round"
                fill="none"
              />
            </svg>

            {/* Внутренняя контактная площадка сканера */}
            <div
              className={`w-36 h-36 rounded-full flex flex-col items-center justify-center transition-all duration-300 relative overflow-hidden ${
                fpVerified
                  ? 'bg-emerald-950/80 border-2 border-emerald-400 shadow-[0_0_30px_rgba(52,211,153,0.5)]'
                  : fpHolding
                  ? 'bg-amber-950/50 border-2 border-amber-400/80 scale-95 shadow-[0_0_25px_rgba(245,158,11,0.4)]'
                  : 'bg-stone-900/90 border-2 border-stone-700/80 hover:border-amber-500/50 hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]'
              }`}
            >
              {/* Сканирующий световой луч во время удержания */}
              {fpHolding && !fpVerified && (
                <motion.div
                  animate={{ y: [-50, 50, -50] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute inset-x-0 h-1 bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,1)] pointer-events-none z-10"
                />
              )}

              {fpVerified ? (
                <CheckCircle2 className="w-16 h-16 text-emerald-400 animate-bounce" />
              ) : (
                <Fingerprint
                  className={`w-16 h-16 transition-colors duration-300 ${
                    fpHolding ? 'text-amber-400 animate-pulse' : 'text-stone-400 group-hover:text-amber-300'
                  }`}
                />
              )}
            </div>
          </div>

          <div className="flex flex-col items-center gap-1.5">
            {fpVerified ? (
              <span className="text-sm font-mono font-black text-emerald-400 tracking-wider flex items-center gap-1.5 animate-pulse">
                {t.recipient.step0.fpVerified}
              </span>
            ) : fpHolding ? (
              <span className="text-xs font-mono font-bold text-amber-400 tracking-wider animate-pulse">
                {t.recipient.step0.fpScanning.replace('{percent}', String(Math.round(fpProgress)))}
              </span>
            ) : (
              <span className="text-xs font-mono text-stone-300 font-medium">
                {t.recipient.step0.fpPrompt}
              </span>
            )}
            <p className="text-[11px] text-stone-500">
              {fpVerified ? t.recipient.step0.fpSub : (lang === 'en' ? 'Sensor active, touch the screen' : 'Сенсор активен, нажмите на экран')}
            </p>
          </div>
        </div>
      )}

      {/* 5. Жест: Сейфовый замок (safe_dial) */}
      {gesture === 'safe_dial' && (
        <div className="flex flex-col items-center justify-center space-y-5">
          <div className="text-xs font-mono text-stone-400 tracking-widest uppercase">
            {t.recipient.step0.safeHeader.replace('{name}', (crushName || (lang === 'en' ? 'GUEST' : 'ГОСТЬ')).toUpperCase())}
          </div>

          {/* Корпус сейфа */}
          <div
            className={`relative w-64 h-64 rounded-3xl bg-gradient-to-b from-stone-800 via-stone-900 to-black border-4 transition-all duration-700 flex items-center justify-center shadow-2xl ${
              isSafeOpened
                ? 'border-emerald-500/80 shadow-[0_0_40px_rgba(52,211,153,0.4)]'
                : 'border-amber-500/40 shadow-[0_15px_40px_rgba(0,0,0,0.8)]'
            }`}
            style={{
              perspective: '1000px',
            }}
          >
            {/* Заклепки сейфа по углам */}
            <div className="absolute top-2.5 left-2.5 w-2 h-2 rounded-full bg-stone-500 shadow-inner" />
            <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-stone-500 shadow-inner" />
            <div className="absolute bottom-2.5 left-2.5 w-2 h-2 rounded-full bg-stone-500 shadow-inner" />
            <div className="absolute bottom-2.5 right-2.5 w-2 h-2 rounded-full bg-stone-500 shadow-inner" />

            {/* Створка сейфа (распахивается при 360°) */}
            <motion.div
              animate={{
                rotateY: isSafeOpened ? -75 : 0,
                opacity: isSafeOpened ? 0.4 : 1,
              }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              style={{ transformOrigin: 'left center' }}
              className="absolute inset-0 flex items-center justify-center"
            >
              {/* Стрелка-указатель сверху диска */}
              <div className="absolute top-3 text-amber-400 text-xs font-mono font-bold z-20">
                ▲
              </div>

              {/* Интерактивный поворотный диск */}
              <div
                ref={dialRef}
                onPointerDown={handleDialPointerDown}
                onPointerMove={handleDialPointerMove}
                onPointerUp={handleDialPointerUp}
                onPointerCancel={handleDialPointerUp}
                onClick={handleDialClick}
                style={{
                  transform: `rotate(${dialAngle}deg)`,
                }}
                className="w-40 h-40 rounded-full bg-gradient-to-tr from-stone-900 via-stone-700 to-stone-800 border-4 border-amber-500/60 shadow-[0_10px_30px_rgba(0,0,0,0.9)] flex items-center justify-center cursor-grab active:cursor-grabbing select-none touch-none relative"
              >
                {/* Метки насечек по кругу */}
                {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                  <div
                    key={deg}
                    style={{ transform: `rotate(${deg}deg) translateY(-68px)` }}
                    className="absolute w-1 h-3 bg-amber-400/80 rounded-full pointer-events-none"
                  />
                ))}

                {/* Центральная рукоятка с замком */}
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-stone-950 to-stone-800 border-2 border-amber-400/50 shadow-inner flex flex-col items-center justify-center pointer-events-none">
                  {isSafeOpened ? (
                    <Unlock className="w-8 h-8 text-emerald-400 animate-pulse" />
                  ) : (
                    <Lock className="w-8 h-8 text-amber-400" />
                  )}
                  <span className="text-[8px] font-mono text-stone-400 mt-0.5">360°</span>
                </div>
              </div>
            </motion.div>

            {/* Внутренность сейфа при открытии */}
            {isSafeOpened && (
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center z-10"
              >
                <span className="text-4xl">💎🔓</span>
                <div className="text-xs font-mono text-emerald-400 font-bold mt-1">
                  {lang === 'en' ? 'ACCESS GRANTED!' : 'ДОСТУП ОТКРЫТ!'}
                </div>
              </motion.div>
            )}
          </div>

          <div className="flex flex-col items-center gap-1.5 w-full max-w-[260px]">
            <span className="text-xs font-mono font-bold text-amber-400">
              {isSafeOpened
                ? t.recipient.step0.safeDone
                : t.recipient.step0.safePrompt.replace('{percent}', String(Math.min(100, Math.round((totalRotation / 360) * 100))))}
            </span>
            {!isSafeOpened && (
              <input
                type="range"
                min="0"
                max="100"
                value={Math.min(100, Math.round((totalRotation / 360) * 100))}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  totalRotationRef.current = (val / 100) * 360;
                  setTotalRotation(totalRotationRef.current);
                  setDialAngle(totalRotationRef.current);
                  sound.click();
                  if (val >= 100 && !completedRef.current) {
                    triggerSafeUnlock();
                  }
                }}
                className="w-full h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            )}
            <p className="text-[11px] text-stone-400 max-w-[260px] text-center">
              {isSafeOpened
                ? (lang === 'en' ? 'Accessing classified materials...' : 'Переход к секретным материалам...')
                : t.recipient.step0.safeSub}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
