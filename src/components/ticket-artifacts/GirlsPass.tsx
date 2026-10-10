import React from 'react';
import { Sparkles, Crown, CheckCircle2, Heart } from 'lucide-react';
import type { TicketData } from '../../types/ticket';
import { formatRussianDate } from '../../utils/share';

// ==========================================
// 💅 КЛУБНАЯ КАРТА / VIP GOSSIP PASS
// Розово-золотой перламутровый билет, тонкий элегантный шрифт,
// штамп «CONFIRMED BY BESTIE 💋», неограниченный доступ к сплетням
// ==========================================

export interface GirlsPassProps {
  ticket: TicketData;
  className?: string;
  isExportMode?: boolean;
}

export const GirlsPass: React.FC<GirlsPassProps> = ({
  ticket,
  className = '',
}) => {
  const { config, response } = ticket;
  const isEn = config.language === 'en';
  const bestieName = config.crushName || (isEn ? 'Bestie / VIP Guest' : 'Любимая подруга');
  const displayDate = formatRussianDate(response.date, isEn ? 'en' : 'ru');
  const displayTime = response.time || '19:00';
  const location = response.selectedLocation || (isEn ? 'Aesthetic Brunch' : 'Эстетичный бранч');
  const treat = response.selectedTreat || (isEn ? 'Matcha, sparkling & pasta' : 'Матча, игристое и паста');
  const drink = response.selectedDrink || (isEn ? 'Wine / Champagne 🍷' : 'Вино / Игристое 🍷');
  const payment = response.selectedPayment || (isEn ? 'Any whim' : 'Любой каприз');

  return (
    <div
      className={`relative rounded-3xl bg-gradient-to-b from-[#1C111A] via-[#140E15] to-[#0D0A0E] border-2 border-pink-500/30 text-stone-100 shadow-[0_20px_50px_rgba(236,72,153,0.18)] overflow-hidden transition-all select-none ${className}`}
    >
      {/* 1. Верхняя перламутровая розово-золотая полоска */}
      <div className="h-2 w-full bg-gradient-to-r from-pink-400 via-rose-300 to-amber-200" />

      {/* 2. Шапка клубной карты */}
      <div className="p-5 pb-3 bg-pink-950/70 border-b border-pink-500/40 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-pink-500/15 border border-pink-400/40 flex items-center justify-center text-pink-300 shrink-0 shadow-[0_0_12px_rgba(244,114,182,0.3)]">
              <Crown className="w-5 h-5 text-pink-300" />
            </div>
            <div>
              <span className="text-[9px] tracking-widest text-pink-300 uppercase font-mono block font-bold">
                ★ GIRLS SECRET SOCIETY // VIP CLUB ★
              </span>
              <span className="text-xs sm:text-sm font-black tracking-tight text-white flex items-center gap-1.5 font-serif">
                VIP GOSSIP PASS <span className="text-pink-400">#ICONIC</span>
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[9px] sm:text-[10px] font-mono uppercase text-pink-100 font-semibold tracking-wide bg-pink-950/70 border border-pink-500/40 px-2.5 py-0.5 rounded-full inline-block">
              ALL ACCESS
            </span>
          </div>
        </div>

        {/* Штамп «CONFIRMED BY BESTIE 💋» */}
        <div className="mt-3 flex items-center justify-between">
          <div className="text-left">
            <span className="text-[9px] font-mono text-pink-300/80 uppercase block">
              {isEn ? 'Club Status:' : 'Клубный статус:'}
            </span>
            <span className="text-[11px] font-bold text-white font-mono flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-300" /> UNLIMITED GOSSIP
            </span>
          </div>

          <div className="px-3.5 py-1.5 border-2 border-pink-400/90 text-pink-300 font-serif font-black text-xs tracking-wider uppercase rounded-2xl rotate-[3deg] shadow-[0_0_15px_rgba(244,114,182,0.35)] bg-pink-950/70">
            CONFIRMED BY BESTIE 💋
          </div>
        </div>

        {/* Метаданные по ТЗ */}
        <div className="mt-3 pt-2 border-t border-pink-500/30 flex items-center justify-between text-[9px] sm:text-[10px] font-mono text-pink-200/90">
          <span>ACCESS: <strong className="text-pink-300">UNLIMITED GOSSIP</strong></span>
          <span className="text-pink-500/50">//</span>
          <span>DRESS-CODE: <strong className="text-amber-200">AESTHETIC</strong></span>
          <span className="text-pink-500/50">//</span>
          <span>MOOD: <strong className="text-white">10/10</strong></span>
        </div>
      </div>

      {/* 3. Основная информация карты */}
      <div className="p-5 space-y-3.5 text-left text-xs">
        {/* Имя подруги */}
        <div className="bg-pink-950/70 p-3 rounded-2xl border border-pink-500/40 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-pink-300/80 uppercase block">
              {isEn ? 'VIP Guest / Bestie' : 'VIP Гостья / Bestie'}
            </span>
            <span className="text-sm font-black text-white font-serif tracking-wide truncate block">{bestieName}</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-mono text-pink-100 font-semibold tracking-wide bg-pink-950/70 px-2.5 py-1 rounded-xl border border-pink-500/40">
            <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
            <span>TOP TIER</span>
          </div>
        </div>

        {/* Вопрос / Повод для сплетен */}
        <div className="bg-stone-900/50 p-3 rounded-2xl border border-pink-500/20">
          <span className="text-[10px] font-mono text-pink-400 uppercase block font-bold">
            {isEn ? 'Agenda:' : 'Повестка дня:'}
          </span>
          <span className="text-xs font-medium text-stone-200 block mt-0.5 leading-relaxed font-serif italic text-[13px]">
            «{config.question || (isEn ? 'Hey bestie, time to catch up on everything...' : 'Любимая, пора обсудить все сплетни за неделю...')}»
          </span>
        </div>

        {/* Дата, Время и Оплата */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-stone-900/50 p-2.5 rounded-xl border border-pink-500/20">
            <span className="text-[10px] font-mono text-pink-300/70 uppercase block">
              {isEn ? 'Brunch Time' : 'Время бранча'}
            </span>
            <span className="text-xs font-bold text-white block">
              {displayDate} {isEn ? 'at' : 'в'} {displayTime}
            </span>
          </div>
          <div className="bg-stone-900/50 p-2.5 rounded-xl border border-pink-500/20">
            <span className="text-[10px] font-mono text-pink-300/70 uppercase block">
              {isEn ? 'Bill / Deposit' : 'Счёт / Депозит'}
            </span>
            <span className="text-xs font-bold text-amber-200 block truncate">
              {payment}
            </span>
          </div>
        </div>

        {/* Атмосфера и меню: Локация, Еда и Напитки */}
        <div className="bg-pink-950/70 p-3 rounded-2xl border border-pink-500/40">
          <span className="text-[10px] font-mono text-pink-300 uppercase block mb-1 font-bold">
            {isEn ? 'Atmosphere & Menu:' : 'Атмосфера и меню:'}
          </span>
          <p className="text-xs text-stone-200">
            📍 {isEn ? 'Location' : 'Локация'}: <strong className="text-white">{location}</strong>
          </p>
          <p className="text-xs text-stone-200 mt-0.5">
            🍕 {isEn ? 'Food' : 'Еда'}: <strong className="text-pink-100">{treat}</strong>
          </p>
          <p className="text-xs text-stone-200 mt-0.5">
            🥤 {isEn ? 'Drinks' : 'Напитки'}: <strong className="text-pink-100">{drink}</strong>
          </p>
        </div>

        {/* Секретное послание P.S. (если открыто) */}
        {response.secretRevealed && config.secretNote && (
          <div className="p-3 bg-pink-500/15 border border-pink-500/40 rounded-2xl">
            <span className="text-[9px] font-mono uppercase text-pink-300 font-bold block mb-0.5">
              {isEn ? '🪙 SECRET BESTIE SPOILER (P.S.):' : '🪙 СЕКРЕТНЫЙ СПОЙЛЕР ДЛЯ ПОДРУГИ (P.S.):'}
            </span>
            <p className="text-xs text-pink-100 italic font-serif leading-relaxed whitespace-pre-line">
              «{config.secretNote}»
            </p>
          </div>
        )}

        {/* Бейджи согласованных условий */}
        {response.contractAccepted && (
          <div className="flex flex-wrap gap-1.5 text-[9px] font-mono text-stone-300 pt-1.5">
            {Object.entries(response.contractAccepted)
              .filter(([, accepted]) => accepted)
              .slice(0, 3)
              .map(([term]) => (
                <span
                  key={term}
                  className="bg-pink-950/70 px-2.5 py-1 rounded-full border border-pink-500/40 flex items-center gap-1.5 text-pink-100 font-semibold tracking-wide leading-normal"
                >
                  <CheckCircle2 className="w-3 h-3 text-pink-300 shrink-0" />
                  <span className="break-words leading-normal max-w-[160px] truncate">{term}</span>
                </span>
              ))}
          </div>
        )}
      </div>

      {/* 4. Перфорация (Линия отрыва и полукруглые вырезы R=14px) */}
      <div className="relative py-2">
        <div className="absolute -left-3.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-[#0C0A09] border-r border-pink-500/30 z-20" />
        <div className="mx-6 border-b-2 border-dashed border-pink-500/40" />
        <div className="absolute -right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-[#0C0A09] border-l border-pink-500/30 z-20" />
      </div>

      {/* 5. Нижняя отрывная часть (VIP членство с подписью) */}
      <div className="p-5 pt-3 bg-[#0E0B0E] space-y-3">
        <div className="flex items-center justify-between text-left">
          <div>
            <span className="text-[9px] font-mono text-pink-300/70 block uppercase">
              {isEn ? 'MEMBERSHIP PASS STUB' : 'ОТРЫВНОЙ КОРЕШОК ПАССА'}
            </span>
            <span className="text-xs font-bold text-white flex items-center gap-1 font-serif">
              {bestieName} 💋
            </span>
          </div>
          <div className="text-right font-mono text-xs text-pink-300 font-bold">
            NO EXCUSES
          </div>
        </div>

        {/* Подпись подруги */}
        <div className="flex items-center justify-between border-t border-pink-500/20 pt-2 pb-1">
          <div className="text-left">
            <span className="text-[9px] font-mono text-stone-400 uppercase block">
              {isEn ? "Bestie's autograph:" : 'Автограф подруги:'}
            </span>
            <span className="text-[10px] text-pink-300 font-serif italic">
              {isEn ? 'Personally approved' : 'Утверждено лично'}
            </span>
          </div>
          <div className="h-8 max-w-[130px] flex items-center justify-end">
            {response.signature ? (
              <img
                src={response.signature}
                alt={isEn ? "Bestie's signature" : "Подпись подруги"}
                className="max-h-8 max-w-[120px] object-contain drop-shadow-[0_0_6px_rgba(244,114,182,0.5)]"
              />
            ) : (
              <div className="border-b border-dashed border-pink-400/50 px-3 py-1 text-[9px] font-mono text-pink-400/70">
                {isEn ? 'Awaiting signature 💄' : 'Ожидает подписи 💄'}
              </div>
            )}
          </div>
        </div>

        {/* Штрихкод и клубный ID */}
        <div className="pt-1 flex flex-col items-center">
          <div className="h-8 w-full flex items-center justify-between px-2 bg-pink-100 rounded py-1">
            {[2, 1, 3, 2, 4, 1, 2, 3, 1, 4, 2, 1, 3, 2, 1, 4, 2, 1, 3, 1, 2, 4, 1, 3].map((w, i) => (
              <div
                key={i}
                className="h-full bg-stone-900 rounded-sm"
                style={{ width: `${w * 2}px` }}
              />
            ))}
          </div>
          <span className="font-mono text-[9px] text-pink-300/70 mt-1 tracking-widest">
            *VIP-BESTIE-GOSSIP-PASS-CONFIRMED*
          </span>
        </div>
      </div>
    </div>
  );
};
