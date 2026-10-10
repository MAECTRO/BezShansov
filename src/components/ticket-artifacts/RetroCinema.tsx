import React from 'react';
import { Film, Popcorn, Star } from 'lucide-react';
import type { TicketData } from '../../types/ticket';
import { formatRussianDate } from '../../utils/share';

// ==========================================
// 🎬 РЕТРО-БИЛЕТ В КИНО (RETRO CINEMA PASS)
// Винтажный золотисто-бордовый бархатный билет,
// зубчатые края, штамп «VIP ПРЕМЬЕРА»
// ==========================================

export interface RetroCinemaProps {
  ticket: TicketData;
  className?: string;
  isExportMode?: boolean;
}

export const RetroCinema: React.FC<RetroCinemaProps> = ({
  ticket,
  className = '',
}) => {
  const { config, response } = ticket;
  const isEn = config.language === 'en';
  const guestName = config.crushName || (isEn ? 'VIP GUEST' : 'VIP ГОСТЬ');
  const displayDate = formatRussianDate(response.date, isEn ? 'en' : 'ru');
  const displayTime = response.time || '20:00';
  const location = response.selectedLocation || (isEn ? 'Cinema / VIP Lounge' : 'Кинотеатр / VIP зал');
  const treat = response.selectedTreat || (isEn ? 'Popcorn & Nachos' : 'Попкорн и начос');
  const drink = response.selectedDrink || (isEn ? 'Cola / Soda 🥤' : 'Кола / Газировка 🥤');
  const payment = response.selectedPayment || (isEn ? 'Crush pays' : 'Краш угощает');

  return (
    <div
      className={`relative rounded-3xl bg-gradient-to-b from-[#2B0813] via-[#1B050C] to-[#0E0306] border-2 border-amber-500/40 text-stone-100 shadow-[0_20px_50px_rgba(217,119,6,0.18)] overflow-hidden transition-all select-none ${className}`}
    >
      {/* 1. Верхняя декоративная кинолента */}
      <div className="h-2.5 w-full bg-gradient-to-r from-amber-400 via-rose-500 to-amber-300" />

      {/* 2. Шапка винтажного кинотеатра */}
      <div className="p-5 pb-3 bg-rose-950/60 border-b border-amber-500/30 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0 shadow-[0_0_12px_rgba(245,158,11,0.25)]">
              <Film className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <span className="text-[9px] tracking-widest text-amber-400 uppercase font-mono block font-bold">
                ★ GRAND VINTAGE CINEMA ★
              </span>
              <span className="text-sm font-black tracking-wider text-white flex items-center gap-1 font-serif">
                CINEMA VIP LOUNGE
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-mono uppercase text-amber-200 font-semibold tracking-wider bg-amber-950/80 border border-amber-500/40 px-2.5 py-0.5 rounded-full inline-block">
              SERIES 2026
            </span>
          </div>
        </div>

        {/* Штамп «VIP ПРЕМЬЕРА» */}
        <div className="mt-3.5 flex items-center justify-between">
          <div className="text-left">
            <span className="text-[9px] font-mono text-amber-400/80 uppercase block">
              {isEn ? 'Ticket Category:' : 'Категория билета:'}
            </span>
            <span className="text-xs font-bold text-white font-mono flex items-center gap-1">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> {isEn ? 'LOVE SEATS' : 'МЕСТА ДЛЯ ПОЦЕЛУЕВ'}
            </span>
          </div>

          <div className="px-3.5 py-1.5 border-2 border-amber-400/90 text-amber-200 font-serif font-black text-xs tracking-wider uppercase rounded-xl -rotate-3 shadow-[0_0_15px_rgba(245,158,11,0.35)] bg-rose-950/90">
            {isEn ? '★ VIP PREMIERE ★' : '★ VIP ПРЕМЬЕРА ★'}
          </div>
        </div>

        {/* Метаданные по ТЗ */}
        <div className="mt-3 pt-2.5 border-t border-amber-500/20 flex flex-wrap items-center justify-between text-[9px] font-mono text-amber-200/90 gap-y-1">
          <span>{isEn ? 'ROW:' : 'РЯД:'} <strong className="text-amber-300 font-bold">1</strong></span>
          <span className="text-amber-500/40">//</span>
          <span>{isEn ? 'SEATS:' : 'МЕСТА:'} <strong className="text-rose-300 font-bold">{isEn ? 'LOVE SEATS' : 'ДЛЯ ПОЦЕЛУЕВ'}</strong></span>
          <span className="text-amber-500/40">//</span>
          <span>{isEn ? 'POPCORN:' : 'ПОПКОРН:'} <strong className="text-amber-300 font-bold">{isEn ? 'INCLUDED 🍿' : 'ВКЛЮЧЕН 🍿'}</strong></span>
        </div>
      </div>

      {/* 3. Основное тело билета */}
      <div className="p-5 space-y-4">
        {/* Данные сеанса */}
        <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-black/40 border border-amber-500/20 text-left">
          <div>
            <span className="text-[9px] font-mono text-amber-400/70 uppercase block leading-normal">
              {isEn ? 'VIP Guest:' : 'Гость программы:'}
            </span>
            <span className="text-xs sm:text-sm font-bold text-white tracking-wide block leading-normal py-0.5 break-words">
              {guestName}
            </span>
          </div>
          <div>
            <span className="text-[9px] font-mono text-amber-400/70 uppercase block leading-normal">
              {isEn ? 'Showtime:' : 'Сеанс:'}
            </span>
            <span className="text-xs sm:text-sm font-black text-amber-300 font-mono block leading-normal py-0.5">
              {displayDate} {isEn ? 'at' : 'в'} {displayTime}
            </span>
          </div>
        </div>

        {/* Атмосфера и угощения */}
        <div className="space-y-2 p-3.5 rounded-2xl bg-rose-950/30 border border-amber-500/20 text-left">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 mb-1">
            <Popcorn className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>{isEn ? 'SHOWTIME PROGRAM' : 'ПРОГРАММА СЕАНСА'}</span>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex items-start justify-between gap-2">
              <span className="text-stone-400 shrink-0">📍 {isEn ? 'Location:' : 'Локация:'}</span>
              <span className="text-stone-200 font-medium text-right break-words leading-relaxed">{location}</span>
            </div>
            <div className="flex items-start justify-between gap-2">
              <span className="text-stone-400 shrink-0">🍿 {isEn ? 'Food:' : 'Еда:'}</span>
              <span className="text-amber-200 font-medium text-right break-words leading-relaxed">{treat}</span>
            </div>
            <div className="flex items-start justify-between gap-2">
              <span className="text-stone-400 shrink-0">🥤 {isEn ? 'Drinks:' : 'Напитки:'}</span>
              <span className="text-rose-200 font-medium text-right break-words leading-relaxed">{drink}</span>
            </div>
            <div className="flex items-start justify-between gap-2 pt-1 border-t border-amber-500/20 text-[11px]">
              <span className="text-stone-400 shrink-0">💳 {isEn ? 'Tickets paid by:' : 'Билеты оплачивает:'}</span>
              <span className="text-amber-400 font-bold text-right break-words leading-relaxed">{payment}</span>
            </div>
          </div>
        </div>

        {/* Секретное послание P.S. (если открыто) */}
        {response.secretRevealed && config.secretNote && (
          <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-400/30 text-left">
            <span className="text-[9px] font-mono uppercase text-amber-400 font-bold block mb-1">
              {isEn ? '★ SECRET NOTE FROM CRUSH ★' : '★ СЕКРЕТНАЯ ЗАПИСКА ОТ КРАША ★'}
            </span>
            <p className="text-xs text-amber-200 italic font-serif leading-relaxed whitespace-pre-line">
              «{config.secretNote}»
            </p>
          </div>
        )}

        {/* Бейджи согласованных условий */}
        {response.contractAccepted && (
          <div className="flex flex-wrap gap-1.5 text-[9px] font-mono text-amber-200/90 pt-1.5">
            {Object.entries(response.contractAccepted)
              .filter(([, accepted]) => accepted)
              .slice(0, 3)
              .map(([term]) => (
                <span
                  key={term}
                  className="bg-black/60 px-2.5 py-1 rounded-full border border-amber-500/40 flex items-center gap-1.5 text-amber-300 leading-normal"
                >
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />
                  <span className="break-words leading-normal max-w-[160px] truncate">{term}</span>
                </span>
              ))}
          </div>
        )}
      </div>

      {/* 4. Перфорация билета (боковые вырезы 14px и линия отрыва) */}
      <div className="relative my-1">
        <div className="absolute -left-3.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-[#0C0A09] border-r-2 border-amber-500/40 z-10" />
        <div className="absolute -right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-[#0C0A09] border-l-2 border-amber-500/40 z-10" />
        <div className="border-b-2 border-dashed border-amber-500/30 mx-4" />
      </div>

      {/* 5. Корешок билета (Нижняя часть) */}
      <div className="p-5 pt-3 bg-black/40 flex items-center justify-between text-left">
        <div>
          <span className="text-[9px] font-mono text-stone-500 uppercase block">
            {isEn ? 'Stub Coupon:' : 'Контрольный купон:'}
          </span>
          <span className="text-xs font-mono font-bold text-amber-400 tracking-wider">
            PASS-CINEMA-2026
          </span>
          <span className="text-[10px] text-stone-400 block mt-0.5">
            {isEn ? 'Valid for 2 persons ❤️' : 'Действителен на 2 персоны ❤️'}
          </span>
        </div>

        {/* Подпись гостя (если есть) */}
        {response.signature ? (
          <div className="flex flex-col items-center">
            <span className="text-[8px] font-mono text-amber-300/80 uppercase mb-0.5">
              {isEn ? 'Signature:' : 'Подпись:'}
            </span>
            <img
              src={response.signature}
              alt={isEn ? 'Signature' : 'Подпись'}
              className="h-9 max-w-[90px] object-contain filter drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]"
            />
          </div>
        ) : (
          <div className="px-3 py-1.5 rounded-xl border border-dashed border-amber-500/40 text-[10px] font-mono text-amber-400/80">
            {isEn ? '[SIGNATURE]' : '[МЕСТО ПОДПИСИ]'}
          </div>
        )}
      </div>
    </div>
  );
};
