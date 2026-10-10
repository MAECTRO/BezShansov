import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Dices, Check, Plus, ArrowRight, Utensils, Wine, MapPin, CreditCard } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { sound } from '../../utils/audio';
import {
  DEFAULT_DRINKS,
  DEFAULT_DRINKS_EN,
  translateItem,
  translateArray,
  type AppLanguage,
  type Occasion,
} from '../../types/ticket';
import { TRANSLATIONS } from '../../locales/translations';

// ==========================================
// 🍕 ШАГ 4: ПРОГРАММА СВИДАНИЯ И РУЛЕТКА
// Сетка 2x2, рулетка судьбы, кастомные варианты
// ==========================================

export interface Step4PlanProps {
  treats: string[];
  drinks?: string[];
  locations: string[];
  paymentOptions: string[];
  occasion?: Occasion;
  language?: AppLanguage;
  initialSelectedTreat?: string;
  initialSelectedDrink?: string;
  initialSelectedLocation?: string;
  initialSelectedPayment?: string;
  onNext: (treat: string, drink: string, location: string, payment: string) => void;
  onBack: () => void;
}

export const Step4_Plan: React.FC<Step4PlanProps> = ({
  treats,
  drinks,
  locations,
  paymentOptions,
  occasion,
  language,
  initialSelectedTreat,
  initialSelectedDrink,
  initialSelectedLocation,
  initialSelectedPayment,
  onNext,
  onBack,
}) => {
  const isBro = occasion === 'bro';
  const lang: AppLanguage = language || 'ru';
  const t = TRANSLATIONS[lang];
  // Активная секция внутри шага: treats - Еда, drinks - Напитки, locations - Локация, payment - Оплата
  const [activeTab, setActiveTab] = useState<'treats' | 'drinks' | 'locations' | 'payment'>('treats');

  const fallbackDrinks = lang === 'en' ? DEFAULT_DRINKS_EN : DEFAULT_DRINKS;
  const defaultDrinks = drinks && drinks.length > 0 ? translateArray(drinks, lang) : fallbackDrinks;

  const defaultPaymentFallback = isBro
    ? (lang === 'en' ? 'Split like bros (50/50)' : 'Братский счёт (скидываемся)')
    : (lang === 'en' ? 'Crush treats' : 'Краш угощает');

  const defaultTreatFallback = isBro
    ? (lang === 'en' ? 'Shawarma 🌯' : 'Шаурма 🌯')
    : (lang === 'en' ? 'Rolls & sushi' : 'Роллы и суши');

  const defaultLocFallback = isBro
    ? (lang === 'en' ? 'PC Gaming Club / PS5 🎮' : 'Компьютерный клуб / PS5 🎮')
    : (lang === 'en' ? 'Cozy Cafe' : 'Уютная кофейня');

  // Стейты для ввода кастомных вариантов (строго разделены!)
  const [customTreatInput, setCustomTreatInput] = useState('');
  const [isAddingTreat, setIsAddingTreat] = useState(false);
  const [customTreats, setCustomTreats] = useState<string[]>([]);

  const [customDrinkInput, setCustomDrinkInput] = useState('');
  const [isAddingDrink, setIsAddingDrink] = useState(false);
  const [customDrinks, setCustomDrinks] = useState<string[]>([]);

  const [customLocationInput, setCustomLocationInput] = useState('');
  const [isAddingLocation, setIsAddingLocation] = useState(false);
  const [customLocations, setCustomLocations] = useState<string[]>([]);

  const localTreats = [
    ...(treats.length > 0 ? translateArray(treats, lang) : [defaultTreatFallback]),
    ...customTreats,
  ];
  const localDrinks = [...defaultDrinks, ...customDrinks];
  const localLocations = [
    ...(locations.length > 0 ? translateArray(locations, lang) : [defaultLocFallback]),
    ...customLocations,
  ];

  // Выбранные значения (автоматически переводятся при смене языка RU <-> EN)
  const [rawSelectedTreat, setSelectedTreat] = useState<string>(
    initialSelectedTreat || treats[0] || defaultTreatFallback
  );
  const [rawSelectedDrinks, setSelectedDrinks] = useState<string[]>(() => {
    if (initialSelectedDrink) {
      return initialSelectedDrink.split(',').map((s) => s.trim()).filter(Boolean);
    }
    return [defaultDrinks[0] || (lang === 'en' ? 'Beer 🍺' : 'Пиво 🍺')];
  });
  const [rawSelectedLocation, setSelectedLocation] = useState<string>(
    initialSelectedLocation || locations[0] || defaultLocFallback
  );
  const [rawSelectedPayment, setSelectedPayment] = useState<string>(
    initialSelectedPayment || paymentOptions[0] || defaultPaymentFallback
  );

  const selectedTreat = translateItem(rawSelectedTreat, lang);
  const selectedDrinks = translateArray(rawSelectedDrinks, lang);
  const selectedLocation = translateItem(rawSelectedLocation, lang);
  const selectedPayment = translateItem(rawSelectedPayment, lang);
  const selectedDrink = selectedDrinks.join(', ') || defaultDrinks[0] || (lang === 'en' ? 'Beer 🍺' : 'Пиво 🍺');

  // Состояние анимации Рулетки
  const [isSpinning, setIsSpinning] = useState(false);

  // 1. Обработчик добавления кастомной еды (СТРОГО в treats!)
  const handleAddCustomTreat = () => {
    const val = customTreatInput.trim();
    if (!val) return;
    setCustomTreats((prev) => [...prev, val]);
    setSelectedTreat(val);
    setCustomTreatInput('');
    setIsAddingTreat(false);
    sound.click();
  };

  // 2. Обработчик выбора / добавления напитка
  const toggleDrink = (drink: string) => {
    sound.click();
    setSelectedDrinks((prev) => {
      const currentTranslated = translateArray(prev, lang);
      if (currentTranslated.includes(drink)) {
        if (currentTranslated.length <= 1) return currentTranslated; // Сохраняем хотя бы один выбор
        return currentTranslated.filter((d) => d !== drink);
      }
      return [...currentTranslated, drink];
    });
  };

  const handleAddCustomDrink = () => {
    const val = customDrinkInput.trim();
    if (!val) return;
    setCustomDrinks((prev) => [...prev, val]);
    setSelectedDrinks((prev) => [...translateArray(prev, lang), val]);
    setCustomDrinkInput('');
    setIsAddingDrink(false);
    sound.click();
  };

  // 3. Обработчик добавления кастомной локации (СТРОГО в locations!)
  const handleAddCustomLocation = () => {
    const val = customLocationInput.trim();
    if (!val) return;
    setCustomLocations((prev) => [...prev, val]);
    setSelectedLocation(val);
    setCustomLocationInput('');
    setIsAddingLocation(false);
    sound.click();
  };

  // 🎰 Рулетка судьбы (генерирует случайное романтическое комбо)
  const spinRoulette = () => {
    if (isSpinning) return;
    setIsSpinning(true);

    let counter = 0;
    const interval = setInterval(() => {
      sound.rouletteTick();

      const randTreat = localTreats[Math.floor(Math.random() * localTreats.length)] || defaultTreatFallback;
      const randDrink = localDrinks[Math.floor(Math.random() * localDrinks.length)] || 'Пиво 🍺';
      const randLoc = localLocations[Math.floor(Math.random() * localLocations.length)] || defaultLocFallback;
      const randPay = paymentOptions[Math.floor(Math.random() * paymentOptions.length)] || defaultPaymentFallback;

      setSelectedTreat(randTreat);
      setSelectedDrinks([randDrink]);
      setSelectedLocation(randLoc);
      setSelectedPayment(randPay);

      counter++;
      if (counter >= 16) {
        clearInterval(interval);
        setIsSpinning(false);
        sound.coin();
        if (navigator.vibrate) navigator.vibrate([60, 40, 80]);
      }
    }, 85);
  };

  // Навигация по подшагам внутри шага 4
  const handleBack = () => {
    sound.click();
    if (activeTab === 'payment') setActiveTab('locations');
    else if (activeTab === 'locations') setActiveTab('drinks');
    else if (activeTab === 'drinks') setActiveTab('treats');
    else onBack();
  };

  const handleNextSubStep = () => {
    sound.click();
    if (activeTab === 'treats') setActiveTab('drinks');
    else if (activeTab === 'drinks') setActiveTab('locations');
    else if (activeTab === 'locations') setActiveTab('payment');
  };

  return (
    <div className="relative w-full h-full min-h-[580px] flex flex-col justify-between p-5 select-none">
      <div className="space-y-4">
        {/* Заголовок и кнопка рулетки */}
        <div className="flex items-center justify-between text-left">
          <div>
            <span className="text-[10px] font-mono tracking-widest uppercase text-amber-400 font-bold">
              {isBro
                ? (lang === 'en' ? 'STEP 4 OF 5 // SQUAD PLAN' : 'ШАГ 4 ИЗ 5 // ПОЛЯНА И СЧЁТ')
                : t.recipient.step4.stepLabel}
            </span>
            <h2 className="text-xl font-bold text-white mt-0.5">
              {isBro
                ? (lang === 'en' ? 'What are we eating and who covers the bill? 🍕' : 'Чем заправляем сбор и кто платит? 🍕')
                : t.recipient.step4.title}
            </h2>
          </div>

          {/* Кнопка «🎰 Рулетка судьбы» */}
          <button
            type="button"
            onClick={spinRoulette}
            disabled={isSpinning}
            className={`px-3 py-1.5 rounded-xl border border-amber-400/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer ${
              isSpinning ? 'animate-pulse ring-2 ring-amber-400' : ''
            }`}
          >
            <Dices className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
            <span>{t.recipient.step4.rouletteButton}</span>
          </button>
        </div>

        {/* Табы категорий (Еда, Напитки, Локация, Оплата) */}
        <div className="grid grid-cols-4 gap-1 bg-[#141210] p-1 rounded-2xl border border-stone-800">
          <button
            type="button"
            onClick={() => {
              sound.click();
              setActiveTab('treats');
            }}
            className={`py-2 px-1 rounded-xl text-[11px] sm:text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer ${
              activeTab === 'treats'
                ? 'bg-amber-400 text-stone-950 shadow-sm'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <Utensils className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>{isBro ? (lang === 'en' ? 'Food' : 'Поляна') : (lang === 'en' ? 'Food' : 'Еда')}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.click();
              setActiveTab('drinks');
            }}
            className={`py-2 px-1 rounded-xl text-[11px] sm:text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer ${
              activeTab === 'drinks'
                ? 'bg-amber-400 text-stone-950 shadow-sm'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <Wine className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>{lang === 'en' ? 'Drinks' : 'Напитки'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.click();
              setActiveTab('locations');
            }}
            className={`py-2 px-1 rounded-xl text-[11px] sm:text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer ${
              activeTab === 'locations'
                ? 'bg-amber-400 text-stone-950 shadow-sm'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>{isBro ? (lang === 'en' ? 'Spot' : 'Локация') : (lang === 'en' ? 'Place' : 'Место')}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.click();
              setActiveTab('payment');
            }}
            className={`py-2 px-1 rounded-xl text-[11px] sm:text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer ${
              activeTab === 'payment'
                ? 'bg-amber-400 text-stone-950 shadow-sm'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <CreditCard className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>{isBro ? (lang === 'en' ? 'Tab' : 'Счёт') : (lang === 'en' ? 'Bill' : 'Счет')}</span>
          </button>
        </div>

        {/* 1. ВКЛАДКА: ГАСТРОНОМИЯ / ЕДА */}
        {activeTab === 'treats' && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-left">
              {localTreats.map((item) => {
                const isSelected = selectedTreat === item;
                const isSingle = localTreats.length === 1;

                return (
                  <motion.button
                    key={item}
                    type="button"
                    onClick={() => {
                      sound.click();
                      setSelectedTreat(item);
                    }}
                    whileTap={{ scale: 0.96 }}
                    className={`p-3.5 rounded-2xl border transition-all text-xs font-medium cursor-pointer relative flex items-center justify-between ${
                      isSingle ? 'col-span-full' : ''
                    } ${
                      isSelected
                        ? 'bg-stone-850 border-amber-400 text-white ring-2 ring-amber-400/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                        : 'bg-[#141210] border-stone-800 text-stone-300 hover:border-stone-700 hover:text-white'
                    }`}
                  >
                    <span className="truncate pr-2">{item}</span>
                    {isSelected && (
                      <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Добавление своего варианта в treats */}
            {isAddingTreat ? (
              <div className="flex gap-2 items-center">
                <div className="flex-1">
                  <Input
                    value={customTreatInput}
                    onChange={(e) => setCustomTreatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddCustomTreat()}
                    placeholder={lang === 'en' ? 'E.g.: Favourite burgers' : 'Например: Любимые бургеры'}
                    autoFocus
                  />
                </div>
                <Button size="sm" variant="primary" onClick={handleAddCustomTreat}>
                  OK
                </Button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsAddingTreat(true)}
                className="w-full py-2.5 rounded-xl border border-dashed border-stone-700 hover:border-amber-400/60 text-stone-400 hover:text-amber-300 text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? '+ Add custom food item' : '+ Добавить свой вариант еды'}</span>
              </button>
            )}
          </div>
        )}

        {/* 2. ВКЛАДКА: НАПИТКИ */}
        {activeTab === 'drinks' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-[11px] text-stone-400 text-left">
              <span>{lang === 'en' ? 'Pick one or mix several drinks:' : 'Выбери один напиток или несколько (микс):'}</span>
              {selectedDrinks.length > 0 && (
                <span className="text-amber-400 font-mono text-[10px]">
                  {lang === 'en' ? 'Selected:' : 'Выбрано:'} {selectedDrinks.length}
                </span>
              )}
            </div>

            {/* Аккуратные чипсы напитков */}
            <div className="flex flex-wrap gap-2 text-left">
              {localDrinks.map((item) => {
                const isSelected = selectedDrinks.includes(item);

                return (
                  <motion.button
                    key={item}
                    type="button"
                    onClick={() => toggleDrink(item)}
                    whileTap={{ scale: 0.95 }}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium cursor-pointer transition-all duration-200 select-none border ${
                      isSelected
                        ? 'bg-amber-500/20 text-white border-amber-400/80 ring-2 ring-amber-400/40 shadow-[0_0_12px_rgba(245,158,11,0.25)] font-semibold'
                        : 'bg-[#181513] text-stone-300 border-stone-800 hover:border-amber-500/40 hover:text-white hover:bg-stone-850'
                    }`}
                  >
                    <span>{item}</span>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Добавление своего варианта в drinks */}
            {isAddingDrink ? (
              <div className="flex gap-2 items-center pt-1">
                <div className="flex-1">
                  <Input
                    value={customDrinkInput}
                    onChange={(e) => setCustomDrinkInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddCustomDrink()}
                    placeholder={lang === 'en' ? 'E.g.: Almond latte' : 'Например: Капучино на миндальном'}
                    autoFocus
                  />
                </div>
                <Button size="sm" variant="primary" onClick={handleAddCustomDrink}>
                  OK
                </Button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsAddingDrink(true)}
                className="w-full py-2.5 rounded-xl border border-dashed border-stone-700 hover:border-amber-400/60 text-stone-400 hover:text-amber-300 text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer mt-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? '+ Add custom drink' : '+ Добавить свой напиток'}</span>
              </button>
            )}
          </div>
        )}

        {/* 3. ВКЛАДКА: ЛОКАЦИИ */}
        {activeTab === 'locations' && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-left">
              {localLocations.map((item) => {
                const isSelected = selectedLocation === item;
                const isSingle = localLocations.length === 1;

                return (
                  <motion.button
                    key={item}
                    type="button"
                    onClick={() => {
                      sound.click();
                      setSelectedLocation(item);
                    }}
                    whileTap={{ scale: 0.96 }}
                    className={`p-3.5 rounded-2xl border transition-all text-xs font-medium cursor-pointer relative flex items-center justify-between ${
                      isSingle ? 'col-span-full' : ''
                    } ${
                      isSelected
                        ? 'bg-stone-850 border-amber-400 text-white ring-2 ring-amber-400/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                        : 'bg-[#141210] border-stone-800 text-stone-300 hover:border-stone-700 hover:text-white'
                    }`}
                  >
                    <span className="truncate pr-2">{item}</span>
                    {isSelected && (
                      <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Добавление своего варианта в locations */}
            {isAddingLocation ? (
              <div className="flex gap-2 items-center">
                <div className="flex-1">
                  <Input
                    value={customLocationInput}
                    onChange={(e) => setCustomLocationInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddCustomLocation()}
                    placeholder={lang === 'en' ? 'E.g.: Observation deck' : 'Например: Смотровая площадка'}
                    autoFocus
                  />
                </div>
                <Button size="sm" variant="primary" onClick={handleAddCustomLocation}>
                  OK
                </Button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsAddingLocation(true)}
                className="w-full py-2.5 rounded-xl border border-dashed border-stone-700 hover:border-amber-400/60 text-stone-400 hover:text-amber-300 text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? '+ Add custom location' : '+ Добавить своё место встречи'}</span>
              </button>
            )}
          </div>
        )}

        {/* 4. ВКЛАДКА: ОПЛАТА */}
        {activeTab === 'payment' && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-left">
              {translateArray(paymentOptions, lang).map((item) => {
                const isSelected = selectedPayment === item;
                const isSingle = paymentOptions.length === 1;

                return (
                  <motion.button
                    key={item}
                    type="button"
                    onClick={() => {
                      sound.click();
                      setSelectedPayment(item);
                    }}
                    whileTap={{ scale: 0.96 }}
                    className={`p-3.5 rounded-2xl border transition-all text-xs font-medium cursor-pointer relative flex items-center justify-between ${
                      isSingle ? 'col-span-full' : ''
                    } ${
                      isSelected
                        ? 'bg-stone-850 border-amber-400 text-white ring-2 ring-amber-400/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                        : 'bg-[#141210] border-stone-800 text-stone-300 hover:border-stone-700 hover:text-white'
                    }`}
                  >
                    <span className="truncate pr-2">{item}</span>
                    {isSelected && (
                      <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}

        {/* Итог выбранного набора */}
        <div className="p-3 bg-[#141210] rounded-xl border border-stone-800/80 text-[11px] text-stone-400 space-y-1 text-left font-mono">
          <div>🍴 {isBro ? (lang === 'en' ? 'Food' : 'Поляна') : (lang === 'en' ? 'Food' : 'Еда')}: <span className="text-white font-semibold">{selectedTreat}</span></div>
          <div>🥤 {lang === 'en' ? 'Drinks' : 'Напитки'}: <span className="text-white font-semibold">{selectedDrink}</span></div>
          <div>📍 {isBro ? (lang === 'en' ? 'Spot' : 'Локация') : (lang === 'en' ? 'Location' : 'Место')}: <span className="text-white font-semibold">{selectedLocation}</span></div>
          <div>💳 {isBro ? (lang === 'en' ? 'Tab' : 'Счёт') : (lang === 'en' ? 'Bill' : 'Оплата')}: <span className="text-white font-semibold">{selectedPayment}</span></div>
        </div>
      </div>

      {/* Навигация */}
      <div className="space-y-2 pt-3">
        <div className="flex gap-2.5">
          <Button variant="secondary" onClick={handleBack} size="md">
            {lang === 'en' ? '← Back' : 'Назад'}
          </Button>
          {activeTab !== 'payment' ? (
            <Button
              variant="primary"
              fullWidth
              size="md"
              onClick={handleNextSubStep}
              icon={<ArrowRight className="w-4 h-4 text-stone-950" />}
            >
              {activeTab === 'treats'
                ? (lang === 'en' ? 'Next: Drinks →' : 'Далее: К напиткам →')
                : activeTab === 'drinks'
                ? (lang === 'en' ? 'Next: Locations →' : (isBro ? 'Далее: К локации →' : 'Далее: К местам →'))
                : (lang === 'en' ? 'Next: Payment →' : (isBro ? 'Далее: К счёту →' : 'Далее: К оплате →'))}
            </Button>
          ) : (
            <Button
              variant="primary"
              fullWidth
              size="md"
              onClick={() => onNext(selectedTreat, selectedDrink, selectedLocation, selectedPayment)}
              icon={isBro ? <span className="text-base">👊</span> : <ArrowRight className="w-4 h-4 text-stone-950" />}
            >
              {isBro
                ? (lang === 'en' ? 'Sign the Bro Pact 👊' : 'Заверить Братский Пакт 👊')
                : t.recipient.step4.finishButton}
            </Button>
          )}
        </div>

        {/* Возможность пропустить подшаги и сразу перейти к билету */}
        {activeTab !== 'payment' && (
          <button
            type="button"
            onClick={() => onNext(selectedTreat, selectedDrink, selectedLocation, selectedPayment)}
            className="text-[11px] text-stone-400 hover:text-amber-300 font-mono underline underline-offset-2 transition-colors cursor-pointer block mx-auto pt-1"
          >
            {isBro
              ? (lang === 'en' ? 'Skip to Bro Pact →' : 'Пропустить и сразу к пакту →')
              : (lang === 'en' ? 'Skip to final ticket →' : 'Пропустить и сразу к билету →')}
          </button>
        )}
      </div>
    </div>
  );
};
