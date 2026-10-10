import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import type { TicketData } from '../../types/ticket';
import { formatRussianDate } from '../../utils/share';

// ==========================================
// 🧾 КАССОВЫЙ ЧЕК (RECEIPT)
// Моноширинный шрифт, аккуратные строки без слипания, подпись
// ==========================================

export interface ReceiptProps {
  ticket: TicketData;
  className?: string;
}

export const Receipt: React.FC<ReceiptProps> = ({
  ticket,
  className = '',
}) => {
  const { config, response } = ticket;
  const isEn = config.language === 'en';
  const guestName = config.crushName || (isEn ? 'Guest' : 'Гость');
  const displayDate = formatRussianDate(response.date, isEn ? 'en' : 'ru');
  const displayTime = response.time || '19:00';
  const location = response.selectedLocation || (isEn ? 'Secret Spot' : 'Секретная точка');
  const treat = response.selectedTreat || (isEn ? 'Romantic Dinner' : 'Романтический ужин');
  const drink = response.selectedDrink || (isEn ? 'Cola / Soda 🥤' : 'Кола / Газировка 🥤');
  const payment = response.selectedPayment || (isEn ? 'Covered by Crush' : 'Краш угощает');

  return (
    <div
      className={`relative rounded-3xl bg-[#141210] border border-stone-800 text-stone-200 font-mono text-xs shadow-[0_20px_50px_rgba(0,0,0,0.7)] overflow-hidden transition-all select-none ${className}`}
    >
      {/* Верхняя тонкая голографическая полоска металлического блеска по ТЗ */}
      <div className="h-2 w-full holographic-bar" />

      {/* 1. Шапка чека */}
      <div className="p-5 pb-3 text-center border-b border-dashed border-stone-800 space-y-1">
        <div className="text-sm font-black text-white tracking-widest uppercase">
          {isEn ? 'LLC «NO CHANCE»' : 'ООО «БЕЗ ШАНСОВ»'}
        </div>
        <div className="text-[10px] text-stone-400">
          {isEn ? 'TAX ID 77014022026 // REGISTER # 01' : 'ИНН 77014022026 // КАССА № 01'}
        </div>
        <div className="text-[11px] text-amber-400 font-bold pt-1">
          {isEn ? 'RECEIPT # 777 // EXCLUSIVE' : 'КАССОВЫЙ ЧЕК № 777 // ЭКСКЛЮЗИВ'}
        </div>
        <div className="text-[10px] text-stone-500">
          {displayDate} {displayTime}
        </div>
      </div>

      {/* 2. Позиции в чеке (flex justify-between без наложения!) */}
      <div className="p-5 space-y-2.5 text-left">
        <div className="flex justify-between items-start gap-2 border-b border-stone-900 pb-1.5">
          <span className="text-stone-300 flex-1 break-words pr-2">
            1. {isEn ? `Date with ${guestName}` : `Встреча с ${guestName}`}
          </span>
          <span className="font-bold text-white shrink-0">
            {isEn ? 'PRICELESS' : 'БЕСЦЕННО'}
          </span>
        </div>

        <div className="flex justify-between items-start gap-2 border-b border-stone-900 pb-1.5">
          <span className="text-stone-400 flex-1 break-words pr-2">
            2. 📍 {isEn ? 'Location' : 'Локация'}: {location}
          </span>
          <span className="text-emerald-400 font-bold shrink-0">
            {isEn ? '100% MATCH' : '100% МЭТЧ'}
          </span>
        </div>

        <div className="flex justify-between items-start gap-2 border-b border-stone-900 pb-1.5">
          <span className="text-stone-400 flex-1 break-words pr-2">
            3. 🍕 {isEn ? 'Food' : 'Еда'}: {treat}
          </span>
          <span className="text-amber-300 font-bold shrink-0">{isEn ? '$0.00' : '0.00 ₽'}</span>
        </div>

        <div className="flex justify-between items-start gap-2 border-b border-stone-900 pb-1.5">
          <span className="text-stone-400 flex-1 break-words pr-2">
            4. 🥤 {isEn ? 'Drinks' : 'Напитки'}: {drink}
          </span>
          <span className="text-amber-300 font-bold shrink-0">{isEn ? '$0.00' : '0.00 ₽'}</span>
        </div>

        <div className="flex justify-between items-start gap-2 border-b border-stone-900 pb-1.5">
          <span className="text-stone-400 flex-1 break-words pr-2">
            5. {isEn ? 'Payment' : 'Оплата'}: {payment}
          </span>
          <span className="text-stone-300 font-bold shrink-0">
            {isEn ? 'APPROVED' : 'ОДОБРЕНО'}
          </span>
        </div>

        {/* Секретное послание P.S. (если открыто) */}
        {response.secretRevealed && config.secretNote && (
          <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl my-1 text-left">
            <span className="text-[9px] uppercase text-amber-400 font-bold block mb-0.5">
              {isEn ? '🪙 SECRET NOTE ON RECEIPT (P.S.):' : '🪙 ТАЙНАЯ ЗАПИСКА К ЧЕКУ (P.S.):'}
            </span>
            <p className="text-[11px] text-amber-200 italic font-serif leading-relaxed whitespace-pre-line">
              «{config.secretNote}»
            </p>
          </div>
        )}

        {/* Условия */}
        {response.contractAccepted && (
          <div className="flex flex-wrap gap-1 text-[10px] font-mono text-stone-400 pt-1">
            {Object.entries(response.contractAccepted)
              .filter(([, accepted]) => accepted)
              .slice(0, 3)
              .map(([term]) => (
                <span
                  key={term}
                  className="bg-stone-900 px-2.5 py-1 rounded-full border border-stone-800 flex items-center gap-1.5 leading-normal"
                >
                  <CheckCircle2 className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                  <span className="break-words max-w-[140px]">{term}</span>
                </span>
              ))}
          </div>
        )}

        {/* Итог */}
        <div className="pt-2 border-t-2 border-stone-700/80 space-y-1">
          <div className="flex justify-between items-baseline text-sm">
            <span className="font-extrabold text-white">
              {isEn ? 'TOTAL TO PAY:' : 'ИТОГ К ОПЛАТЕ:'}
            </span>
            <span className="font-black text-base gold-foil">
              {isEn ? 'LOVE ❤️' : 'ЛЮБОВЬ ❤️'}
            </span>
          </div>
          <div className="flex justify-between items-center text-[10px] text-stone-500">
            <span>{isEn ? 'VAT 0%:' : 'НДС 0%:'}</span>
            <span>{isEn ? '$0.00' : '0.00 ₽'}</span>
          </div>
        </div>
      </div>

      {/* 3. Перфорация (Линия отрыва и полукруглые вырезы R=14px) */}
      <div className="relative py-2">
        <div className="absolute -left-3.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-[#0C0A09] border-r border-stone-800 z-20" />
        <div className="mx-6 border-b-2 border-dashed border-stone-700/60" />
        <div className="absolute -right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-[#0C0A09] border-l border-stone-800 z-20" />
      </div>

      {/* 4. Фискальный накопитель, подпись покупателя и штрих-код */}
      <div className="p-5 pt-3 bg-stone-950/60 text-center space-y-2">
        <div className="text-[10px] text-stone-400">
          FD: 000140226 // FP: 99824151
        </div>

        {/* Подпись покупателя */}
        <div className="flex items-center justify-between border-t border-stone-900 pt-2 pb-1 text-left">
          <div>
            <span className="text-[9px] text-stone-500 uppercase block">
              {isEn ? 'Guest signature:' : 'Подпись гостя:'}
            </span>
            <span className="text-[10px] text-stone-400">
              {isEn ? 'Order received, fully satisfied' : 'Товар получен, претензий нет'}
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
              <div className="border-b border-dashed border-stone-700 px-3 py-1 text-[9px] text-stone-500">
                {isEn ? 'Signature upon delivery ✍️' : 'Подпись при получении ✍️'}
              </div>
            )}
          </div>
        </div>

        <div className="text-[11px] text-stone-300 font-semibold pt-1">
          {isEn ? 'THANK YOU FOR CHOOSING US! 🌟' : 'СПАСИБО, ЧТО ВЫБРАЛИ НАС! 🌟'}
        </div>

        {/* Имитация QR кода и полосок */}
        <div className="pt-1 flex flex-col items-center">
          <div className="h-8 w-4/5 flex items-center justify-between px-2 bg-white/95 rounded">
            {[1, 3, 2, 1, 4, 2, 1, 3, 1, 2, 3, 4, 1, 2, 1, 3, 2, 4, 1, 2, 3].map((w, idx) => (
              <div
                key={idx}
                className="h-full bg-black"
                style={{ width: `${w * 2}px` }}
              />
            ))}
          </div>
          <span className="text-[9px] text-stone-500 mt-1 tracking-widest">
            CHECK-AUTH-CODE: #LOVE-ALWAYS
          </span>
        </div>
      </div>
    </div>
  );
};
