import React from 'react';
import { Flame, CheckCircle2, Shield, Users } from 'lucide-react';
import type { TicketData } from '../../types/ticket';
import { formatRussianDate } from '../../utils/share';

// ==========================================
// 👊 БРАТСКИЙ ПАКТ (BRO-PASS)
// Брутальный темный дизайн, неоновые оранжево-зеленые акценты,
// тактический протокол, печать «Скреплено кулачком»
// ==========================================

export interface BroPassProps {
  ticket: TicketData;
  className?: string;
  isExportMode?: boolean;
}

export const BroPass: React.FC<BroPassProps> = ({
  ticket,
  className = '',
}) => {
  const { config, response } = ticket;
  const isEn = config.language === 'en';
  const broName = config.crushName || (isEn ? 'Bro' : 'Бро');
  const displayDate = formatRussianDate(response.date, isEn ? 'en' : 'ru');
  const displayTime = response.time || '19:00';
  const location = response.selectedLocation || (isEn ? 'Squad HQ' : 'Точка сбора');
  const treat = response.selectedTreat || (isEn ? 'Burgers, pizza & gaming' : 'Шаурма, пицца и катка');
  const drink = response.selectedDrink || (isEn ? 'Beer 🍺' : 'Пиво 🍺');
  const payment = response.selectedPayment || (isEn ? 'Splitting the bill' : 'Скидываемся');

  return (
    <div
      className={`relative rounded-3xl bg-[#0D0F12] border-2 border-stone-800 text-stone-100 shadow-[0_20px_50px_rgba(0,0,0,0.85)] overflow-hidden transition-all select-none ${className}`}
    >
      {/* 1. Верхняя неоновая тактическая полоска (оранжевый / лайм) */}
      <div className="h-2 w-full bg-gradient-to-r from-orange-600 via-amber-500 to-emerald-500" />

      {/* 2. Шапка: Тактический сбор братвы */}
      <div className="p-5 pb-3 bg-[#13161B] border-b border-stone-800 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-500/15 border border-orange-500/40 flex items-center justify-center text-orange-400 shrink-0 shadow-[0_0_12px_rgba(249,115,22,0.25)]">
              <Flame className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <span className="text-[9px] tracking-widest text-emerald-400 uppercase font-mono block font-bold">
                ● TACTICAL BRO-PACT // SQUAD 2026
              </span>
              <span className="text-xs sm:text-sm font-black tracking-tight text-white flex items-center gap-1.5">
                {isEn ? 'BRO PACT' : 'БРАТСКИЙ ПАКТ'} <span className="text-orange-400">{isEn ? '#IN_THE_GAME' : '#В_ДЕЛЕ'}</span>
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[9px] sm:text-[10px] font-mono uppercase text-orange-400 bg-orange-500/10 border border-orange-500/30 px-2 py-0.5 rounded-full font-bold inline-block">
              {isEn ? 'ATTENDANCE 100%' : 'ЯВКА 100%'}
            </span>
          </div>
        </div>

        {/* Штамп «СКРЕПЛЕНО КУЛАЧКОМ 👊» */}
        <div className="mt-3 flex items-center justify-between">
          <div className="text-left">
            <span className="text-[9px] font-mono text-stone-400 uppercase block">
              {isEn ? 'Access level:' : 'Уровень доступа:'}
            </span>
            <span className="text-[11px] font-bold text-white font-mono flex items-center gap-1">
              <Shield className="w-3 h-3 text-emerald-400" /> {isEn ? 'BRO SQUAD' : 'ПАЦАНСКИЙ КОРПУС'}
            </span>
          </div>

          <div className="px-3.5 py-1.5 border-2 border-orange-500 text-orange-400 font-mono text-xs font-black tracking-wider uppercase rounded-xl rotate-[-3deg] shadow-[0_0_15px_rgba(249,115,22,0.35)] bg-orange-950/40">
            {isEn ? 'SEALED WITH FIST BUMP 👊' : 'СКРЕПЛЕНО КУЛАЧКОМ 👊'}
          </div>
        </div>

        {/* Метаданные по ТЗ */}
        <div className="mt-3 pt-2 border-t border-stone-800/80 flex items-center justify-between text-[9px] sm:text-[10px] font-mono text-stone-400">
          <span>{isEn ? 'OPERATION CODE:' : 'КОД ОПЕРАЦИИ:'} <strong className="text-orange-400">BRO-PASS</strong></span>
          <span className="text-stone-600">//</span>
          <span>{isEn ? 'STATUS:' : 'СТАТУС:'} <strong className="text-emerald-400">{isEn ? 'CONFIRMED' : 'В ДЕЛЕ'}</strong></span>
          <span className="text-stone-600">//</span>
          <span>{isEn ? 'EXPENSES:' : 'РАСХОДЫ:'} <strong className="text-white">{isEn ? 'SPLITTING' : 'СКИДЫВАЕМСЯ'}</strong></span>
        </div>
      </div>

      {/* 3. Основная тактическая информация */}
      <div className="p-5 space-y-3.5 text-left text-xs">
        {/* Имя бойца */}
        <div className="bg-stone-900/70 p-3 rounded-xl border border-stone-800/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-stone-400 uppercase block">
              {isEn ? 'Homie / Bro' : 'Боец / Братишка'}
            </span>
            <span className="text-sm font-black text-white truncate block">{broName}</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
            <Users className="w-3.5 h-3.5" />
            <span>{isEn ? 'DEPLOYED' : 'В СОСТАВЕ'}</span>
          </div>
        </div>

        {/* Вопрос / Повестка */}
        <div className="bg-stone-900/60 p-3 rounded-xl border border-stone-800/80">
          <span className="text-[10px] font-mono text-orange-400 uppercase block font-bold">
            {isEn ? 'Mission goal:' : 'Цель миссии:'}
          </span>
          <span className="text-xs font-semibold text-stone-200 block mt-0.5 leading-relaxed">
            «{config.question || (isEn ? 'Bro, we have urgent business to discuss...' : 'Брат, есть разговор государственной важности...')}»
          </span>
        </div>

        {/* Дата, Время и Расходы */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-stone-900/60 p-2.5 rounded-xl border border-stone-800/80">
            <span className="text-[10px] font-mono text-stone-400 uppercase block">
              {isEn ? 'Zero hour' : 'Время «Ч»'}
            </span>
            <span className="text-xs font-bold text-white block">
              {displayDate} {isEn ? 'at' : 'в'} {displayTime}
            </span>
          </div>
          <div className="bg-stone-900/60 p-2.5 rounded-xl border border-stone-800/80">
            <span className="text-[10px] font-mono text-stone-400 uppercase block">
              {isEn ? 'Bill payment' : 'Оплата счета'}
            </span>
            <span className="text-xs font-bold text-orange-400 block truncate">
              {payment}
            </span>
          </div>
        </div>

        {/* Атмосфера и меню */}
        <div className="bg-stone-900/40 p-3 rounded-2xl border border-stone-800/80">
          <span className="text-[10px] font-mono text-stone-400 uppercase block mb-1">
            {isEn ? 'Atmosphere & menu:' : 'Атмосфера и меню:'}
          </span>
          <p className="text-xs text-stone-200">
            📍 {isEn ? 'Location' : 'Локация'}: <strong className="text-white">{location}</strong>
          </p>
          <p className="text-xs text-stone-300 mt-0.5">
            🍕 {isEn ? 'Food' : 'Еда'}: <strong className="text-stone-200">{treat}</strong>
          </p>
          <p className="text-xs text-stone-300 mt-0.5">
            🥤 {isEn ? 'Drinks' : 'Напитки'}: <strong className="text-stone-200">{drink}</strong>
          </p>
        </div>

        {/* Секретное послание P.S. (если открыто) */}
        {response.secretRevealed && config.secretNote && (
          <div className="p-3 bg-orange-500/10 border border-orange-500/30 rounded-xl">
            <span className="text-[9px] font-mono uppercase text-orange-400 font-bold block mb-0.5">
              {isEn ? '🪙 SECRET BRO DIRECTIVE (P.S.):' : '🪙 СЕКРЕТНЫЙ ПРИКАЗ БРО (P.S.):'}
            </span>
            <p className="text-xs text-orange-200 italic font-serif leading-relaxed whitespace-pre-line">
              «{config.secretNote}»
            </p>
          </div>
        )}

        {/* Бейджи согласованных пацанских условий */}
        {response.contractAccepted && (
          <div className="flex flex-wrap gap-1.5 text-[9px] font-mono text-stone-400 pt-1.5">
            {Object.entries(response.contractAccepted)
              .filter(([, accepted]) => accepted)
              .slice(0, 3)
              .map(([term]) => (
                <span
                  key={term}
                  className="bg-stone-900 px-2.5 py-1 rounded-full border border-stone-800 flex items-center gap-1.5 text-emerald-300 leading-normal"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span className="break-words leading-normal max-w-[160px] truncate">{term}</span>
                </span>
              ))}
          </div>
        )}
      </div>

      {/* 4. Перфорация (Линия отрыва и полукруглые вырезы R=14px) */}
      <div className="relative py-2">
        <div className="absolute -left-3.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-[#0C0A09] border-r border-stone-800 z-20" />
        <div className="mx-6 border-b-2 border-dashed border-stone-700/60" />
        <div className="absolute -right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-[#0C0A09] border-l border-stone-800 z-20" />
      </div>

      {/* 5. Нижняя отрывная часть (Братская расписка с подписью) */}
      <div className="p-5 pt-3 bg-[#0A0C0E] space-y-3">
        <div className="flex items-center justify-between text-left">
          <div>
            <span className="text-[9px] font-mono text-stone-400 block uppercase">
              {isEn ? 'STUB BRO-PACT' : 'ОТРЫВНОЙ КОРЕШОК ПАКТА'}
            </span>
            <span className="text-xs font-bold text-white flex items-center gap-1">
              {broName} 👊
            </span>
          </div>
          <div className="text-right font-mono text-xs text-emerald-400 font-bold">
            {isEn ? 'NO RETREAT' : 'ОБРАТКИ НЕТ'}
          </div>
        </div>

        {/* Подпись бойца */}
        <div className="flex items-center justify-between border-t border-stone-800/80 pt-2 pb-1">
          <div className="text-left">
            <span className="text-[9px] font-mono text-stone-500 uppercase block">
              {isEn ? 'Homie signature:' : 'Личная подпись бойца:'}
            </span>
            <span className="text-[10px] text-stone-400 font-mono">
              {isEn ? 'Bro code confirmed' : 'Слово пацана скреплено'}
            </span>
          </div>
          <div className="h-8 max-w-[130px] flex items-center justify-end">
            {response.signature ? (
              <img
                src={response.signature}
                alt="Signature"
                className="max-h-8 max-w-[120px] object-contain drop-shadow-[0_0_6px_rgba(249,115,22,0.5)]"
              />
            ) : (
              <div className="border-b border-dashed border-orange-500/40 px-3 py-1 text-[9px] font-mono text-orange-400/70">
                {isEn ? 'Awaiting signature ✍️' : 'Ожидает подписи ✍️'}
              </div>
            )}
          </div>
        </div>

        {/* Штрихкод и тактический код */}
        <div className="pt-1 flex flex-col items-center">
          <div className="h-8 w-full flex items-center justify-between px-2 bg-stone-200 rounded py-1">
            {[3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 2, 4, 1, 2, 3, 1, 4, 2, 1, 3, 1, 2].map((w, i) => (
              <div
                key={i}
                className="h-full bg-stone-950 rounded-sm"
                style={{ width: `${w * 2}px` }}
              />
            ))}
          </div>
          <span className="font-mono text-[9px] text-stone-500 mt-1 tracking-widest">
            *BRO-PASS-TACTICAL-2026-CONFIRMED*
          </span>
        </div>
      </div>
    </div>
  );
};
