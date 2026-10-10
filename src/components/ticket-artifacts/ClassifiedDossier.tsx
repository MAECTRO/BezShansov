import React from 'react';
import { ShieldAlert, FileText } from 'lucide-react';
import type { TicketData } from '../../types/ticket';
import { formatRussianDate } from '../../utils/share';

// ==========================================
// 🪪 СЕКРЕТНОЕ ДОСЬЕ (CLASSIFIED DOSSIER)
// Шпионский бланк секретных служб, красный штамп под 45°,
// зачерканные секретные строки (redacted black bars)
// ==========================================

export interface ClassifiedDossierProps {
  ticket: TicketData;
  className?: string;
  isExportMode?: boolean;
}

export const ClassifiedDossier: React.FC<ClassifiedDossierProps> = ({
  ticket,
  className = '',
}) => {
  const { config, response } = ticket;
  const isEn = config.language === 'en';
  const targetName = config.crushName || (isEn ? 'SURVEILLANCE TARGET' : 'ОБЪЕКТ НАБЛЮДЕНИЯ');
  const displayDate = formatRussianDate(response.date, isEn ? 'en' : 'ru');
  const displayTime = response.time || '21:00';
  const location = response.selectedLocation || (isEn ? 'Classified Safehouse' : 'Засекреченная явочная квартира');
  const treat = response.selectedTreat || (isEn ? 'Conspiratorial Dinner' : 'Конспиративный ужин');
  const drink = response.selectedDrink || (isEn ? 'Secret Serum 🥤' : 'Секретная сыворотка 🥤');
  const payment = response.selectedPayment || (isEn ? 'Special Op Budget' : 'Спецбюджет операции');

  return (
    <div
      className={`relative rounded-3xl bg-[#111215] border-2 border-stone-700/80 text-stone-200 shadow-[0_20px_50px_rgba(0,0,0,0.7)] overflow-hidden transition-all select-none font-mono ${className}`}
    >
      {/* 1. Верхняя черно-желтая лента предупреждения */}
      <div className="h-2 w-full bg-gradient-to-r from-red-600 via-amber-500 to-red-600" />

      {/* Красный штамп под 45 градусов в углу */}
      <div className="absolute right-3 top-7 rotate-12 pointer-events-none z-20">
        <div className="border-4 border-red-600/90 text-red-500 font-mono font-black text-xs sm:text-sm tracking-widest px-3 py-1 uppercase rounded-lg bg-red-950/70 shadow-[0_0_15px_rgba(239,68,68,0.4)]">
          TOP SECRET // {isEn ? 'EYES ONLY' : 'СОВЕРШЕННО СЕКРЕТНО'}
        </div>
      </div>

      {/* 2. Шапка досье */}
      <div className="p-5 pb-3 bg-stone-900/80 border-b border-stone-700/60 relative text-left">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0 shadow-inner">
            <ShieldAlert className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <span className="text-[9px] tracking-widest text-red-400 uppercase font-mono block font-bold">
              SPECIAL OPERATIONS // DOSSIER #2026-X
            </span>
            <span className="text-sm font-black tracking-wide text-white flex items-center gap-1.5 font-mono">
              CLASSIFIED DOSSIER
            </span>
          </div>
        </div>

        {/* Метаданные агента */}
        <div className="mt-4 pt-2.5 border-t border-stone-700/50 flex flex-wrap items-center justify-between text-[9px] text-stone-400 gap-y-1">
          <span>STATUS: <strong className="text-emerald-400 font-bold">ACTIVE</strong></span>
          <span className="text-stone-600">//</span>
          <span>CLEARANCE: <strong className="text-amber-400 font-bold">LEVEL 5</strong></span>
          <span className="text-stone-600">//</span>
          <span>CODED: <strong className="text-red-400 font-bold">NO-CHANCE</strong></span>
        </div>
      </div>

      {/* 3. Основное тело досье */}
      <div className="p-5 space-y-4 text-left">
        {/* Данные цели */}
        <div className="p-3.5 rounded-xl bg-black/60 border border-stone-800 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-stone-500 text-[10px] uppercase">
              {isEn ? 'Target Subject:' : 'Объект операции:'}
            </span>
            <span className="text-amber-300 font-bold tracking-wide">{targetName}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-stone-500 text-[10px] uppercase">
              {isEn ? 'Rendezvous Time:' : 'Время рандеву:'}
            </span>
            <span className="text-white font-bold">{displayDate} // {displayTime}</span>
          </div>
        </div>

        {/* Протокол встречи с зачерканными засекреченными строками */}
        <div className="p-3.5 rounded-xl bg-stone-900/60 border border-stone-800 space-y-2 text-xs">
          <div className="flex items-center gap-1.5 text-xs font-bold text-stone-300 border-b border-stone-800 pb-1.5">
            <FileText className="w-3.5 h-3.5 text-red-400" />
            <span>{isEn ? 'PROTOCOL OF OPERATION:' : 'ПРОТОКОЛ МЕРОПРИЯТИЯ:'}</span>
          </div>

          <div className="space-y-1.5 text-xs text-stone-300">
            <div className="flex items-start justify-between gap-2">
              <span className="text-stone-500 shrink-0 text-[11px]">
                📍 {isEn ? 'Safehouse Coordinates:' : 'Координаты явочной точки:'}
              </span>
              <span className="font-semibold text-right text-stone-200 break-words leading-relaxed">{location}</span>
            </div>
            <div className="flex items-start justify-between gap-2">
              <span className="text-stone-500 shrink-0 text-[11px]">
                🍕 {isEn ? 'Agent Rations:' : 'Питание агентов:'}
              </span>
              <span className="font-semibold text-right text-amber-300 break-words leading-relaxed">{treat}</span>
            </div>
            <div className="flex items-start justify-between gap-2">
              <span className="text-stone-500 shrink-0 text-[11px]">
                🥤 {isEn ? 'Covert Drinks:' : 'Конспиративные напитки:'}
              </span>
              <span className="font-semibold text-right text-cyan-300 break-words leading-relaxed">{drink}</span>
            </div>
            <div className="flex items-start justify-between gap-2 pt-1 border-t border-stone-800 text-[11px]">
              <span className="text-stone-500 shrink-0">
                💳 {isEn ? 'Funding:' : 'Финансирование:'}
              </span>
              <span className="font-bold text-red-400 text-right">{payment}</span>
            </div>
          </div>

          {/* Засекреченный блок с redacted-эффектом (наведи, чтобы прочесть) */}
          <div className="pt-2 border-t border-stone-800/80 text-[11px]">
            <span className="text-stone-500 block text-[9px] uppercase mb-1">
              {isEn ? '[Classified intelligence — hover cursor to decrypt]:' : '[Засекреченные разведданные — наведите курсор для расшифровки]:'}
            </span>
            <div className="p-2 rounded bg-black/40 text-stone-400 leading-relaxed group">
              {isEn ? (
                <>
                  Special operation approved by command.{' '}
                  <span className="bg-stone-800 text-stone-800 group-hover:text-amber-300 group-hover:bg-amber-950/60 transition-colors px-1 py-0.5 rounded cursor-help">
                    Refusal is strictly impossible.
                  </span>{' '}
                  Any escape attempt{' '}
                  <span className="bg-stone-800 text-stone-800 group-hover:text-red-300 group-hover:bg-red-950/60 transition-colors px-1 py-0.5 rounded cursor-help">
                    triggers Protocol «No-Chance».
                  </span>
                </>
              ) : (
                <>
                  Спецоперация подтверждена высшим командованием.{' '}
                  <span className="bg-stone-800 text-stone-800 group-hover:text-amber-300 group-hover:bg-amber-950/60 transition-colors px-1 py-0.5 rounded cursor-help">
                    Отказаться невозможно.
                  </span>{' '}
                  При попытке сбежать{' '}
                  <span className="bg-stone-800 text-stone-800 group-hover:text-red-300 group-hover:bg-red-950/60 transition-colors px-1 py-0.5 rounded cursor-help">
                    включается план «БезШансов».
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Секретное послание P.S. (если открыто) */}
        {response.secretRevealed && config.secretNote && (
          <div className="p-3 bg-red-950/30 rounded-xl border border-red-500/40 text-left">
            <span className="text-[9px] font-mono uppercase text-red-400 font-bold block mb-1">
              {isEn ? '★ DECRYPTED AGENT DISPATCH ★' : '★ РАСШИФРОВАННОЕ ДОНЕСЕНИЕ АГЕНТА ★'}
            </span>
            <p className="text-xs text-amber-200 italic leading-relaxed whitespace-pre-line font-mono">
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
                  className="bg-red-950/40 px-2.5 py-1 rounded border border-red-500/40 flex items-center gap-1.5 text-red-300 leading-normal"
                >
                  <ShieldAlert className="w-3 h-3 text-red-400 shrink-0" />
                  <span className="break-words leading-normal max-w-[160px] truncate">{term}</span>
                </span>
              ))}
          </div>
        )}
      </div>

      {/* 4. Перфорация билета (боковые вырезы 14px и линия отрыва) */}
      <div className="relative my-1">
        <div className="absolute -left-3.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-[#0C0A09] border-r-2 border-stone-700 z-10" />
        <div className="absolute -right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-[#0C0A09] border-l-2 border-stone-700 z-10" />
        <div className="border-b-2 border-dashed border-stone-700/60 mx-4" />
      </div>

      {/* 5. Нижняя визирующая часть */}
      <div className="p-5 pt-3 bg-stone-900/90 flex items-center justify-between text-left">
        <div>
          <span className="text-[9px] text-stone-500 uppercase block">
            {isEn ? 'Operation Code:' : 'Код операции:'}
          </span>
          <span className="text-xs font-bold text-red-400 tracking-wider">
            DOSSIER-ALPHA-77
          </span>
          <span className="text-[9px] text-stone-400 block mt-0.5">
            {isEn ? 'Subject to archiving after rendezvous 📁' : 'Подлежит архивации после свидания 📁'}
          </span>
        </div>

        {/* Подпись агента */}
        {response.signature ? (
          <div className="flex flex-col items-center">
            <span className="text-[8px] text-red-400 uppercase mb-0.5">
              {isEn ? 'Agent Visa:' : 'Виза агента:'}
            </span>
            <img
              src={response.signature}
              alt={isEn ? 'Signature' : 'Подпись'}
              className="h-9 max-w-[90px] object-contain filter drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]"
            />
          </div>
        ) : (
          <div className="px-3 py-1.5 rounded border border-dashed border-red-500/50 text-[10px] text-red-400">
            {isEn ? '[CLASSIFIED]' : '[ГРИФ СЕКРЕТНО]'}
          </div>
        )}
      </div>
    </div>
  );
};
