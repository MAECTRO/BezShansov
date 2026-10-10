import React from 'react';
import { Plane, Sparkles, Heart, CheckCircle2 } from 'lucide-react';
import type { TicketData } from '../../types/ticket';
import { formatRussianDate } from '../../utils/share';

// ==========================================
// 🎫 ПОСАДОЧНЫЙ ТАЛОН (1ST CLASS LOVE-2026)
// Голограмма, золотое тиснение, перфорация, подпись
// ==========================================

export interface ArtifactProps {
  ticket: TicketData;
  className?: string;
  isExportMode?: boolean;
}

export const BoardingPass: React.FC<ArtifactProps> = ({
  ticket,
  className = '',
}) => {
  const { config, response } = ticket;
  const isEn = config.language === 'en';
  const passengerName = config.crushName || (isEn ? 'Special Someone' : 'Любимый Человек');
  const displayDate = formatRussianDate(response.date, isEn ? 'en' : 'ru');
  const displayTime = response.time || '19:00';
  const destination = response.selectedLocation || (isEn ? 'Romantic Sunset' : 'Романтический закат');
  const treat = response.selectedTreat || (isEn ? 'Gourmet Dinner' : 'Изысканный ужин');
  const drink = response.selectedDrink || (isEn ? 'Wine / Bubbly 🍷' : 'Вино / Игристое 🍷');

  return (
    <div
      className={`relative rounded-3xl bg-[#141210] border border-stone-800 text-stone-100 shadow-[0_20px_50px_rgba(0,0,0,0.7)] overflow-hidden transition-all select-none ${className}`}
    >
      {/* 1. Верхняя голографическая полоска металлического блеска */}
      <div className="h-2 w-full holographic-bar" />

      {/* 2. Верхняя шапка билета */}
      <div className="p-5 pb-4 border-b border-stone-800/80 bg-stone-900/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Plane className="w-4 h-4 rotate-45" />
            </div>
            <div>
              <span className="text-[9px] tracking-widest text-stone-400 uppercase font-mono block">
                AIRLINES OF DESTINY
              </span>
              <span className="text-xs sm:text-sm font-black tracking-tight text-white flex items-center gap-1">
                FIRST CLASS <span className="gold-foil">LOVE-2026</span>
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[9px] sm:text-[10px] font-mono uppercase text-amber-400/90 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full font-bold inline-block">
              GATE: TONIGHT
            </span>
          </div>
        </div>

        {/* Строка параметров по ТЗ: FLIGHT: LOVE-2026 // GATE: TONIGHT // CLASS: FIRST */}
        <div className="mt-2.5 pt-2 border-t border-stone-800/60 flex items-center justify-between text-[9px] sm:text-[10px] font-mono text-stone-400">
          <span>FLIGHT: <strong className="text-white">LOVE-2026</strong></span>
          <span className="text-stone-600">//</span>
          <span>GATE: <strong className="text-amber-400">TONIGHT</strong></span>
          <span className="text-stone-600">//</span>
          <span>CLASS: <strong className="gold-foil">FIRST</strong></span>
        </div>
      </div>

      {/* 3. Основная информация о рейсе */}
      <div className="p-5 space-y-4">
        {/* Маршрут: LON -> HAP */}
        <div className="flex items-center justify-between py-2 border-b border-stone-800/50">
          <div>
            <span className="text-2xl font-mono font-bold text-stone-300">LON</span>
            <span className="text-[11px] block text-stone-500">{isEn ? 'Loneliness' : 'Одиночество'}</span>
          </div>
          <div className="flex flex-col items-center px-3">
            <Plane className="w-4 h-4 text-amber-400" />
            <div className="w-20 border-t border-dashed border-amber-500/40 my-1" />
            <span className="text-[9px] font-mono text-stone-400 tracking-wider">NON-STOP</span>
          </div>
          <div className="text-right">
            <span className="text-2xl font-mono font-bold gold-foil">HAP</span>
            <span className="text-[11px] block text-amber-300/80">{isEn ? 'Happiness' : 'Счастье'}</span>
          </div>
        </div>

        {/* Пассажир и Место */}
        <div className="grid grid-cols-2 gap-3 text-left">
          <div className="bg-stone-900/60 p-2.5 rounded-xl border border-stone-800/60">
            <span className="text-[10px] font-mono text-stone-400 block uppercase">
              {isEn ? 'Passenger' : 'Пассажир'}
            </span>
            <span className="text-sm font-bold text-white truncate block">{passengerName}</span>
          </div>
          <div className="bg-stone-900/60 p-2.5 rounded-xl border border-stone-800/60">
            <span className="text-[10px] font-mono text-stone-400 block uppercase">
              {isEn ? 'Seat / Class' : 'Место / Класс'}
            </span>
            <span className="text-sm font-bold text-amber-300">1A // {isEn ? 'VIP Romantic' : 'VIP Романтик'}</span>
          </div>
        </div>

        {/* Дата, Время и Оплата */}
        <div className="grid grid-cols-2 gap-3 text-left">
          <div className="bg-stone-900/60 p-2.5 rounded-xl border border-stone-800/60">
            <span className="text-[10px] font-mono text-stone-400 block uppercase">
              {isEn ? 'Date & Time' : 'Дата и Время'}
            </span>
            <span className="text-xs font-bold text-stone-200 block">
              {displayDate} {isEn ? 'at' : 'в'} {displayTime}
            </span>
          </div>
          <div className="bg-stone-900/60 p-2.5 rounded-xl border border-stone-800/60">
            <span className="text-[10px] font-mono text-stone-400 block uppercase">
              {isEn ? 'Payment' : 'Оплата'}
            </span>
            <span className="text-xs font-bold text-stone-200 truncate block">
              {response.selectedPayment || (isEn ? 'Covered by Crush' : 'Краш угощает')}
            </span>
          </div>
        </div>

        {/* Атмосфера и меню */}
        <div className="bg-stone-900/40 p-3 rounded-2xl border border-stone-800/80 text-left">
          <div className="flex items-center gap-1.5 text-xs text-amber-400 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="font-semibold">{isEn ? 'Atmosphere & menu:' : 'Атмосфера и меню:'}</span>
          </div>
          <p className="text-xs text-stone-300 break-words leading-relaxed">
            📍 {isEn ? 'Location' : 'Локация'}: <strong className="text-white">{destination}</strong>
          </p>
          <p className="text-xs text-stone-300 break-words leading-relaxed mt-0.5">
            🍕 {isEn ? 'Food' : 'Еда'}: <strong className="text-white">{treat}</strong>
          </p>
          <p className="text-xs text-stone-300 break-words leading-relaxed mt-0.5">
            🥤 {isEn ? 'Drinks' : 'Напитки'}: <strong className="text-white">{drink}</strong>
          </p>
        </div>

        {/* Секретное послание P.S. (если открыто) */}
        {response.secretRevealed && config.secretNote && (
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-left">
            <span className="text-[9px] font-mono uppercase text-amber-400 font-bold block mb-0.5">
              {isEn ? '🪙 SECRET MESSAGE (P.S.):' : '🪙 СЕКРЕТНОЕ ПОСЛАНИЕ (P.S.):'}
            </span>
            <p className="text-xs text-amber-200 italic font-serif leading-relaxed whitespace-pre-line">
              «{config.secretNote}»
            </p>
          </div>
        )}

        {/* Бейджи согласованных условий контракта */}
        {response.contractAccepted && (
          <div className="flex flex-wrap gap-1.5 text-[9px] font-mono text-stone-400 pt-1.5">
            {Object.entries(response.contractAccepted)
              .filter(([, accepted]) => accepted)
              .slice(0, 3)
              .map(([term]) => (
                <span
                  key={term}
                  className="bg-stone-900 px-2.5 py-1 rounded-full border border-stone-800 flex items-center gap-1.5 text-stone-300 leading-normal"
                >
                  <CheckCircle2 className="w-3 h-3 text-amber-400 shrink-0" />
                  <span className="break-words leading-normal max-w-[160px] truncate">{term}</span>
                </span>
              ))}
          </div>
        )}
      </div>

      {/* 4. Перфорация (Линия отрыва и полукруглые вырезы R=14px) */}
      <div className="relative py-2">
        {/* Левый полукруглый вырез радиусом 14px (диаметр 28px) */}
        <div className="absolute -left-3.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-[#0C0A09] border-r border-stone-800 z-20" />
        {/* Пунктирная линия отрыва по ТЗ */}
        <div className="mx-6 border-b-2 border-dashed border-stone-700/60" />
        {/* Правый полукруглый вырез радиусом 14px (диаметр 28px) */}
        <div className="absolute -right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-[#0C0A09] border-l border-stone-800 z-20" />
      </div>

      {/* 5. Нижняя отрывная часть (Купон посадки с подписью и штрихкодом) */}
      <div className="p-5 pt-3 bg-stone-950/60 space-y-3">
        <div className="flex items-center justify-between text-left">
          <div>
            <span className="text-[9px] font-mono text-stone-400 block uppercase">STUB BOARDING PASS</span>
            <span className="text-xs font-bold text-white flex items-center gap-1">
              {passengerName} <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
            </span>
          </div>
          <div className="text-right font-mono text-xs text-amber-400 font-bold">
            NO RETURN
          </div>
        </div>

        {/* Подпись пассажира на билете */}
        <div className="flex items-center justify-between border-t border-stone-800/60 pt-2 pb-1">
          <div className="text-left">
            <span className="text-[9px] font-mono text-stone-500 uppercase block">
              {isEn ? 'Passenger signature:' : 'Подпись пассажира:'}
            </span>
            <span className="text-[10px] text-stone-400 font-serif italic">
              {isEn ? 'Officially endorsed' : 'Лично утверждено'}
            </span>
          </div>
          <div className="h-8 max-w-[130px] flex items-center justify-end">
            {response.signature ? (
              <img
                src={response.signature}
                alt="Signature"
                className="max-h-8 max-w-[120px] object-contain drop-shadow-[0_0_6px_rgba(245,158,11,0.5)]"
              />
            ) : (
              <div className="border-b border-dashed border-amber-400/40 px-4 py-1 text-[9px] font-mono text-amber-400/60">
                {isEn ? 'Awaiting signature ✍️' : 'Ожидает подписи ✍️'}
              </div>
            )}
          </div>
        </div>

        {/* Штрихкод */}
        <div className="pt-1 flex flex-col items-center">
          <div className="h-8 w-full flex items-center justify-between px-2 bg-white/95 rounded py-1">
            {[2, 1, 3, 1, 4, 1, 2, 3, 1, 2, 4, 2, 1, 3, 2, 1, 4, 1, 2, 3, 1, 2, 4, 1, 3, 2, 1, 3].map((w, i) => (
              <div
                key={i}
                className="h-full bg-black rounded-sm"
                style={{ width: `${w * 2}px` }}
              />
            ))}
          </div>
          <span className="font-mono text-[9px] text-stone-400 mt-1 tracking-widest">
            *LOVE-2026-FIRST-CLASS-RSVP*
          </span>
        </div>
      </div>
    </div>
  );
};
