import React, { useState } from 'react';
import { Heart, Sparkles, Compass, Flame, ChevronDown } from 'lucide-react';
import type { AppLanguage } from '../../types/ticket';

interface AboutProjectProps {
  language?: AppLanguage;
}

export const AboutProject: React.FC<AboutProjectProps> = ({ language = 'ru' }) => {
  const isEn = language === 'en';
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className="relative bg-gradient-to-b from-[#181512] to-[#12100E] border border-amber-500/25 hover:border-amber-500/40 rounded-3xl p-5 sm:p-7 shadow-2xl transition-all duration-300 text-left overflow-hidden">
      {/* Декоративное теплое свечение на фоне */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-rose-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Шапка секции */}
      <div className="relative z-10 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[10px] font-mono tracking-widest uppercase">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>{isEn ? 'ABOUT THE PROJECT // MANIFESTO' : 'О ПРОЕКТЕ // МАНИФЕСТ'}</span>
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug">
          {isEn ? (
            <>Bringing Back the <span className="gold-foil">Tactile Magic</span> of Dating</>
          ) : (
            <>Вернуть свиданиям трепет и <span className="gold-foil">тактильную магию</span></>
          )}
        </h3>

        <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-sans">
          {isEn
            ? 'In a world of dry messenger texts and rushed routines, we forgot the butterflies of a real invitation. Remember folded handwritten school notes or real paper movie tickets? «BezShansov» was born to revive that lost excitement.'
            : 'В мире сухих сообщений в Telegram и бесконечной спешки мы почти разучились приглашать на свидания по-настоящему. Помнишь сложенные вчетверо школьные записки или хрустящие бумажные билеты на вечерний сеанс в кино? Проект «БезШансов» создан, чтобы вернуть в отношения это забытое предвкушение.'}
        </p>
      </div>

      {/* 3 Ключевых столпа проекта */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
        {/* Карточка 1 */}
        <div className="bg-stone-900/70 border border-stone-800/80 rounded-2xl p-3.5 space-y-1.5 hover:border-amber-500/30 transition-all">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Flame className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-stone-100">
            {isEn ? 'Nostalgia & Sincerity' : 'Тепло и ностальгия'}
          </h4>
          <p className="text-[11px] text-stone-400 leading-relaxed">
            {isEn
              ? 'Wax seals, fogged glass to wipe, physical 1st-class boarding passes. Tangible gestures you never forget.'
              : 'Сургучные печати, запотевшее стекло, билеты первого класса. Физический жест внимания, который запоминается навсегда.'}
          </p>
        </div>

        {/* Карточка 2 */}
        <div className="bg-stone-900/70 border border-stone-800/80 rounded-2xl p-3.5 space-y-1.5 hover:border-amber-500/30 transition-all">
          <div className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <Heart className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-stone-100">
            {isEn ? 'Deeper Bonds' : 'Укрепление близости'}
          </h4>
          <p className="text-[11px] text-stone-400 leading-relaxed">
            {isEn
              ? 'Whether asking on a first date or reigniting a 5-year flame, thoughtful details speak louder than words.'
              : 'Будь то первое свидание, искра после 5 лет отношений или примирение после ссоры — забота говорит громче слов.'}
          </p>
        </div>

        {/* Карточка 3 */}
        <div className="bg-stone-900/70 border border-stone-800/80 rounded-2xl p-3.5 space-y-1.5 hover:border-amber-500/30 transition-all">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Compass className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-stone-100">
            {isEn ? 'Playful Connection' : 'Фан без неловкости'}
          </h4>
          <p className="text-[11px] text-stone-400 leading-relaxed">
            {isEn
              ? 'A runaway «No» button and roulette wheel ease any awkwardness into genuine shared laughter.'
              : 'Убегающая кнопка «Нет» и рулетка судьбы превращают волнение в лёгкую игру и искреннюю улыбку.'}
          </p>
        </div>
      </div>

      {/* Дополнительный раскрывающийся блок с романтической цитатой */}
      <div className="relative z-10 pt-4">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-amber-400/90 hover:text-amber-300 flex items-center gap-1.5 font-medium cursor-pointer transition-colors"
        >
          <span>
            {isExpanded
              ? (isEn ? 'Hide story' : 'Свернуть историю')
              : (isEn ? 'Read our full story ✨' : 'Читать полную историю создания ✨')}
          </span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
        </button>

        {isExpanded && (
          <div className="mt-3 p-4 rounded-2xl bg-black/40 border border-amber-500/20 text-xs text-stone-300 leading-relaxed space-y-2 animate-fade-in font-serif italic">
            <p>
              {isEn
                ? '«We got tired of ordinary "Wanna hang out tonight? — Idk". True intimacy starts long before you sit down for dinner. It starts with the sparkle in their eyes when they open something made just for them.»'
                : '«Нам надоело серое "Ну чё, пересечемся? — Не знаю". Настоящая романтика начинается задолго до встречи. Она начинается с искры в глазах, когда человек открывает персональное послание, созданное только для него.»'}
            </p>
            <p className="text-amber-300 font-sans not-italic font-bold text-[11px] pt-1 text-right">
              {isEn
                ? '— Because when an invite is made with so much soul, there is simply no chance to refuse. ❤️'
                : '— Потому что когда приглашение сделано с такой душой — отказаться просто нет шансов. ❤️'}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
