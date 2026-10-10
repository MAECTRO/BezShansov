import React from 'react';
import { Shield, Scale, FileText, CheckCircle2 } from 'lucide-react';
import type { TicketData } from '../../types/ticket';
import { formatRussianDate } from '../../utils/share';

// ==========================================
// ⚖️ СУДЕБНАЯ ПОВЕСТКА (SUBPOENA)
// Строгий протокол, герб, красный штамп, подпись
// ==========================================

export interface SubpoenaProps {
  ticket: TicketData;
  className?: string;
}

export const Subpoena: React.FC<SubpoenaProps> = ({
  ticket,
  className = '',
}) => {
  const { config, response } = ticket;
  const isEn = config.language === 'en';
  const defendantName = config.crushName || (isEn ? 'Citizen' : 'Гражданин(ка)');
  const displayDate = formatRussianDate(response.date, isEn ? 'en' : 'ru');
  const displayTime = response.time || '19:00';
  const courtPlace = response.selectedLocation || (isEn ? 'Romantic Court Chamber' : 'Зал романтических заседаний');
  const drink = response.selectedDrink || (isEn ? 'Juice / Water 💧' : 'Сок / Вода 💧');

  return (
    <div
      className={`relative rounded-3xl bg-[#141210] border-2 border-stone-800 text-stone-100 shadow-[0_20px_50px_rgba(0,0,0,0.7)] overflow-hidden transition-all select-none ${className}`}
    >
      {/* Тонкая голографическая полоска металлического блеска по ТЗ */}
      <div className="h-2 w-full holographic-bar" />

      {/* 1. Официальная шапка суда */}
      <div className="p-5 pb-3 text-center border-b border-stone-800/80 bg-stone-950/40 relative">
        <div className="text-[10px] tracking-widest font-mono text-stone-400 uppercase">
          {isEn ? 'SUPREME COURT OF LOVE' : 'ВЫСШИЙ СУДЕБНЫЙ ДЕПАРТАМЕНТ ЛЮБВИ'}
        </div>
        <div className="text-sm font-black tracking-tight text-white mt-0.5">
          {isEn ? 'COURT NOTICE // WARRANT # 14-02/2026' : 'СУДЕБНЫЙ ДЕПАРТАМЕНТ // ОРДЕР № 14-02/2026'}
        </div>

        {/* Герб и печать по центру */}
        <div className="flex flex-col items-center justify-center my-3 relative">
          <div className="w-14 h-14 rounded-2xl bg-stone-900 border border-stone-700 flex items-center justify-center shadow-inner text-amber-400">
            <Shield className="w-8 h-8" />
          </div>
          <span className="text-[9px] font-mono text-stone-500 uppercase tracking-widest mt-1">
            ★ SEAL OF JUSTICE ★
          </span>

          {/* Красный штамп под гербом со смещением и аккуратным наклоном */}
          <div className="mt-3 px-3.5 py-1.5 border-2 border-rose-600/90 text-rose-500 font-mono text-xs font-black tracking-widest uppercase rounded-lg rotate-[-4deg] shadow-[0_0_12px_rgba(225,29,72,0.35)] bg-rose-950/40">
            {isEn ? 'APPEARANCE MANDATORY' : 'ЯВКА СТРОГО ОБЯЗАТЕЛЬНА'}
          </div>
        </div>
      </div>

      {/* 2. Обвинение и детали */}
      <div className="p-5 space-y-3.5 text-left text-xs">
        <div className="bg-stone-900/60 p-3 rounded-xl border border-stone-800">
          <span className="text-[10px] font-mono text-stone-400 uppercase block">
            {isEn ? 'Defendant' : 'Обвиняемый(ая)'}
          </span>
          <span className="text-sm font-bold text-amber-300 block">{defendantName}</span>
        </div>

        <div className="bg-stone-900/60 p-3 rounded-xl border border-stone-800">
          <span className="text-[10px] font-mono text-rose-400 uppercase block font-semibold">
            {isEn ? 'Charge / Indictment' : 'Статья обвинения'}
          </span>
          <span className="text-xs font-medium text-stone-200 block mt-0.5 leading-relaxed">
            {config.subpoenaClause ||
              (isEn
                ? (config.occasion === 'bro'
                  ? 'Section 228 of Bro Code: Unlawful ignoring of homie squad calls.'
                  : config.occasion === 'girls'
                  ? 'Section 77: Critical lack of joint photos and heart-to-heart gossip.'
                  : config.occasion === 'peace'
                  ? 'Section 1 of Peace Treaty: Unconditional truce, amnesty of grievances and sweet dessert.'
                  : 'Section 105 of Love Penal Code: Reckless heart theft under irresistible circumstances. No appeals granted.')
                : (config.occasion === 'bro'
                  ? 'Статья 228 УК Дружбы: Злостное игнорирование пацанского созвона.'
                  : config.occasion === 'girls'
                  ? 'Статья 77: Критическая нехватка совместных фото и разговоров по душам.'
                  : config.occasion === 'peace'
                  ? 'Статья 1 УК Перемирия: Объявление безусловного перемирия, амнистия обид и сладкий десерт.'
                  : 'Статья 105 УК РФ: Неосторожное похищение сердечка при отягчающих обстоятельствах (неотразимость). Апелляции не принимаются.'))}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-stone-900/60 p-2.5 rounded-xl border border-stone-800">
            <span className="text-[10px] font-mono text-stone-400 uppercase block">
              {isEn ? 'Hearing Time' : 'Время заседания'}
            </span>
            <span className="text-xs font-bold text-white block">
              {displayDate} {isEn ? 'at' : 'в'} {displayTime}
            </span>
          </div>
          <div className="bg-stone-900/60 p-2.5 rounded-xl border border-stone-800">
            <span className="text-[10px] font-mono text-stone-400 uppercase block">
              {isEn ? 'Court Costs' : 'Судебные издержки'}
            </span>
            <span className="text-xs font-bold text-stone-200 block break-words leading-tight">
              {response.selectedPayment || (isEn ? 'Covered by Crush' : 'Краш угощает')}
            </span>
          </div>
        </div>

        <div className="bg-stone-900/40 p-3 rounded-xl border border-stone-800/80 text-left">
          <span className="text-[10px] font-mono text-stone-400 uppercase block mb-1">
            {isEn ? 'Atmosphere & menu:' : 'Атмосфера и меню:'}
          </span>
          <p className="text-xs text-stone-200">
            📍 {isEn ? 'Location' : 'Локация'}: <strong className="text-white">{courtPlace}</strong>
          </p>
          <p className="text-xs text-stone-300 mt-0.5">
            🍕 {isEn ? 'Food' : 'Еда'}: <strong className="text-white">{response.selectedTreat || (isEn ? 'Celebratory Set' : 'Праздничный сет')}</strong>
          </p>
          <p className="text-xs text-stone-300 mt-0.5">
            🥤 {isEn ? 'Drinks' : 'Напитки'}: <strong className="text-white">{drink}</strong>
          </p>
        </div>

        {/* Секретное послание P.S. (если открыто) */}
        {response.secretRevealed && config.secretNote && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-left">
            <span className="text-[9px] font-mono uppercase text-rose-400 font-bold block mb-0.5">
              {isEn ? '🪙 CONFIDENTIAL NOTE (P.S.):' : '🪙 ТАЙНАЯ ЗАПИСКА К ДЕЛУ (P.S.):'}
            </span>
            <p className="text-xs text-rose-200 italic font-serif leading-relaxed whitespace-pre-line">
              «{config.secretNote}»
            </p>
          </div>
        )}

        {/* Бейджи условий */}
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
                  <CheckCircle2 className="w-2.5 h-2.5 text-rose-400 shrink-0" />
                  <span className="break-words max-w-[140px]">{term}</span>
                </span>
              ))}
          </div>
        )}
      </div>

      {/* 3. Перфорация (Линия отрыва и полукруглые вырезы R=14px) */}
      <div className="relative py-2">
        <div className="absolute -left-3.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-[#0C0A09] border-r border-stone-800 z-20" />
        <div className="mx-6 border-b-2 border-dashed border-stone-700/60" />
        <div className="absolute -right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-[#0C0A09] border-l border-stone-800 z-20" />
      </div>

      {/* 4. Судебная расписка с подписью */}
      <div className="p-5 pt-3 bg-stone-950/80 space-y-2 text-left">
        <div className="flex items-center justify-between text-[10px] font-mono text-stone-400 uppercase">
          <span>{isEn ? 'JUDICIAL DIVISION' : 'СУДЕБНЫЙ КОРПУС'}</span>
          <span className="text-rose-400 font-bold">{isEn ? 'FINAL' : 'ОКОНЧАТЕЛЬНО'}</span>
        </div>
        <p className="text-[11px] text-stone-400 leading-tight">
          {isEn
            ? 'Failure to attend is punishable by lifetime barrage of wholesome memes and stickers.'
            : 'Неявка на свидание карается пожизненной отправкой милых стикеров и мемов.'}
        </p>

        {/* Подпись обвиняемого */}
        <div className="flex items-center justify-between border-t border-stone-800/80 pt-2 pb-1">
          <div className="text-left">
            <span className="text-[9px] font-mono text-stone-500 uppercase block">
              {isEn ? 'Acknowledgement of service:' : 'Расписка в получении:'}
            </span>
            <span className="text-[10px] text-stone-400 font-mono">
              {isEn ? 'Defendant signature' : 'Подпись обвиняемого(ой)'}
            </span>
          </div>
          <div className="h-8 max-w-[130px] flex items-center justify-end">
            {response.signature ? (
              <img
                src={response.signature}
                alt="Signature"
                className="max-h-8 max-w-[120px] object-contain drop-shadow-[0_0_6px_rgba(244,63,94,0.5)]"
              />
            ) : (
              <div className="border-b border-dashed border-rose-500/50 px-3 py-1 text-[9px] font-mono text-rose-400/70">
                {isEn ? 'Awaiting signature ✍️' : 'Ожидает подписи ✍️'}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5 text-stone-500 text-xs">
            <Scale className="w-3.5 h-3.5 text-amber-500" />
            <span className="font-mono text-[10px]">
              {isEn ? 'VERDICT IN FULL EFFECT' : 'ВЕРДИКТ ВСТУПИЛ В СИЛУ'}
            </span>
          </div>
          <FileText className="w-4 h-4 text-stone-600" />
        </div>
      </div>
    </div>
  );
};
