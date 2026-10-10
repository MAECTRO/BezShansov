import React, { useState } from 'react';
import { Sparkles, Check, RefreshCw } from 'lucide-react';
import { sound } from '../../utils/audio';

// ==========================================
// ✍️ PUNCHLINE-СТУДИЯ И ГЕНЕРАТОР ЧЕТВЕРОСТИШИЙ
// Компактный модуль для генерации стильных стихов в P.S.
// ==========================================

import type { AppLanguage } from '../../types/ticket';

export type PoetryVibe = 'lyrics' | 'bro' | 'rofl' | 'drama';

export interface PoetryStudioProps {
  onInsertPoem: (poem: string) => void;
  defaultVibe?: PoetryVibe;
  language?: AppLanguage;
}

const POETRY_DATABASE_RU: Record<PoetryVibe, string[]> = {
  lyrics: [
    'Сквозь сотни лиц и суету дорог / Я этот вечер для тебя сберег. ✨',
    'Среди обычных серых дней / С тобой весь мир вокруг светлей. ☕',
    'Не нужно поводов и громких фраз / Хочу увидеть блеск любимых глаз. ❤️',
    'Когда ты рядом — время замирает / Любой холодный вечер согревает. 💫',
    'Ты как любимый трек в ночи / Все важные слова сейчас шепчи. ✨',
    'Один лишь вечер, музыка и чай / Ты просто согласись и не скучай. 🌹',
  ],
  bro: [
    'Пусть суета уходит на покой, / Сегодня вечер чисто пацанской. 👊',
    'Братва на связи — значит всё путем / Шаурму заточим, плойку заведем! 🎮',
    'Сквозь будни, траблы и рабочий груз / Нам нужен сбор, чтоб зарядить союз. 🚗',
    'Кто игнорит братский созвон / Тот вносит хаос в наш район! 🍕',
    'Пацанский пакт скреплен рукопожатьем / Погнали в бар, хорош лежать в кровати! 🤜🤛',
    'Вопрос государственной важности возник / Бросай дела и прилетай на миг! 👊',
  ],
  rofl: [
    'Откажешь мне — обижусь навсегда, / Согласна быть красивой? Жми на "Да"! 😂',
    'Я выбирал локацию два дня / Не смей разбить надежду у меня! 🍰',
    'Кнопку "Нет" нажать не выйдет тут / Сдавайся сразу, выбор невелик! 🐙',
    'Мой психолог сказал: "Приглашай, не робей!" / Так что давай, надевай лук скорей! 🐱',
    'Я долго думал над крутым подкатом / Но проще накормить тебя салатом! 🍕',
    'Откажешь мне — обижусь навсегда, / Согласна быть красивой? Жми на "Да"! 😎',
  ],
  drama: [
    'Я был(а) не прав(а), признаю вину / Давай сотрём обиды как росу. 🍰',
    'Прости за глупость и дурной каприз / Мирный договор на стол кладу. 🕊️',
    'Белый флаг над крепостью поднят / Заключим вечный мирный договор. 🤍',
    'Я знаю, был неправ, погорячился зря / Давай обнимемся и выпьем чай. ☕',
    'Любой каприз сегодня за мой счёт / Пусть этот вечер нам растопит лёд. 🌸',
    'Прости меня за резкие слова / Давай начнем всё с чистого листа. 🕊️',
  ],
};

const POETRY_DATABASE_EN: Record<PoetryVibe, string[]> = {
  lyrics: [
    'Among a million passing stars so bright / I saved for you this unforgettable night. ✨',
    'In ordinary days of grey and routine / With you my world turns vibrant and serene. ☕',
    'No grand excuses needed anymore / Your smile is everything I came here for. ❤️',
    'Whenever you are close time stands so still / And every lonely chill turns to a thrill. 💫',
    'Just like my favorite song on late night drives / Your presence brings our sweetest memories alive. ✨',
    'Just coffee, warm cozy music and your grace / Say yes and brighten up this lovely place. 🌹',
  ],
  bro: [
    'Let busy chaos rest and take a break / Tonight a sacred homie bond we make! 👊',
    'The boys are online, pizza is on fire / PS5 matches are our one desire! 🎮',
    'Through daily hustle and work-day dread / Let us gather and get well-fed! 🚗',
    'Ignoring the bro call should be a crime / Grab a drink and let us have a prime time! 🍕',
    'Sealed with a fist bump, locked in for the night / Hit the bar and make the mood feel right! 🤜🤛',
    'Matter of state security has arisen / Show up homie, leave your work prison! 👊',
  ],
  rofl: [
    'Say no and I will be offended for a year / Just click on "Yes" and have no fear! 😂',
    'I scouted this location day and night / Do not crush my dream, make this right! 🍰',
    'The "No" button will run and jump away / Accept the date, enjoy the day! 🐙',
    'My therapist said: "Ask them out right now!" / So put your coolest outfit on right now! 🐱',
    'I thought of witty pickup lines so sweet / But simpler just to get you food to eat! 🍕',
    'Declining is not an option on this screen / Click "Yes" and rule the scene like queen! 😎',
  ],
  drama: [
    'I made mistakes and I admit the blame / Let us forgive and clear away the pain. 🍰',
    'Forgive my temper and my foolish mood / I bring you peace and lots of delicious food. 🕊️',
    'The white flag flies above the fortress wall / Let us make peace and have a lovely ball. 🤍',
    'I know I stumbled, words were said in haste / Let us hug tight and put our doubts to waste. ☕',
    'Whatever you desire is on my tab tonight / Let us melt ice and make our bond feel bright. 🌸',
    'Forgive my words, let past be in the past / A brand new chapter that will surely last. 🕊️',
  ],
};

const VIBE_CHIPS_RU: Array<{ id: PoetryVibe; label: string }> = [
  { id: 'lyrics', label: 'Лирика ❤️' },
  { id: 'bro', label: 'Пацанская база 👊' },
  { id: 'rofl', label: 'Ирония / Рофл 😂' },
  { id: 'drama', label: 'Драма / Прости 🥺' },
];

const VIBE_CHIPS_EN: Array<{ id: PoetryVibe; label: string }> = [
  { id: 'lyrics', label: 'Lyrics ❤️' },
  { id: 'bro', label: 'Bro Code 👊' },
  { id: 'rofl', label: 'Funny / Meme 😂' },
  { id: 'drama', label: 'Apology 🥺' },
];

export const PoetryStudio: React.FC<PoetryStudioProps> = ({
  onInsertPoem,
  defaultVibe = 'lyrics',
  language = 'ru',
}) => {
  const [selectedVibe, setSelectedVibe] = useState<PoetryVibe>(defaultVibe);
  const [lastIndex, setLastIndex] = useState<number>(-1);
  const [justGenerated, setJustGenerated] = useState(false);

  const isEn = language === 'en';
  const poetryDb = isEn ? POETRY_DATABASE_EN : POETRY_DATABASE_RU;
  const vibeChips = isEn ? VIBE_CHIPS_EN : VIBE_CHIPS_RU;

  const handleGenerate = () => {
    sound.coin();
    const list = poetryDb[selectedVibe];
    let nextIdx = Math.floor(Math.random() * list.length);
    if (list.length > 1 && nextIdx === lastIndex) {
      nextIdx = (nextIdx + 1) % list.length;
    }
    setLastIndex(nextIdx);
    const chosenPoem = list[nextIdx];
    onInsertPoem(chosenPoem);

    setJustGenerated(true);
    setTimeout(() => {
      setJustGenerated(false);
    }, 1800);
  };

  return (
    <div className="bg-[#181512] border border-amber-500/20 rounded-2xl p-3.5 space-y-3 shadow-inner">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-mono text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{isEn ? 'Punchline Studio & P.S. Poems' : 'Punchline-Студия & Стихи в P.S.'}</span>
        </span>
        {justGenerated && (
          <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 animate-fade-in font-bold">
            <Check className="w-3 h-3" /> {isEn ? 'Inserted into P.S.!' : 'Вставлено в P.S.!'}
          </span>
        )}
      </div>

      {/* 4 Чипса вайбов */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
        {vibeChips.map((chip) => {
          const isActive = selectedVibe === chip.id;
          return (
            <button
              key={chip.id}
              type="button"
              onClick={() => {
                sound.click();
                setSelectedVibe(chip.id);
              }}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer truncate text-center ${
                isActive
                  ? 'bg-amber-400 text-stone-950 shadow-md font-bold'
                  : 'bg-stone-900/80 text-stone-400 hover:text-stone-200 border border-stone-800'
              }`}
            >
              {chip.label}
            </button>
          );
        })}
      </div>

      {/* Кнопка генерации */}
      <button
        type="button"
        onClick={handleGenerate}
        className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500/20 via-amber-400/30 to-amber-500/20 hover:from-amber-500/30 hover:to-amber-500/30 border border-amber-400/40 text-amber-200 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98] shadow-sm"
      >
        <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
        <span>{isEn ? '✨ Generate Rhyme / Punchline' : '✨ Сгенерировать четверостишие'}</span>
        <RefreshCw className="w-3 h-3 text-amber-400/70" />
      </button>
    </div>
  );
};
