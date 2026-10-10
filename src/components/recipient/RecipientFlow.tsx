import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { InvitationConfig, RecipientResponse, TicketData, AppLanguage } from '../../types/ticket';
import {
  getDefaultContractTerms,
  translateConfig,
  translateItem,
} from '../../types/ticket';
import { PhoneFrame } from '../ui/PhoneFrame';
import { Step0_Gesture } from './Step0_Gesture';
import { Step1_Question } from './Step1_Question';
import { Step2_Euphoria } from './Step2_Euphoria';
import { Step3_DateTime } from './Step3_DateTime';
import { Step4_Plan } from './Step4_Plan';
import { Step5_Ticket } from './Step5_Ticket';
import { sound } from '../../utils/audio';
import { TRANSLATIONS } from '../../locales/translations';

// ==========================================
// 📱 RECIPIENT FLOW (ПУТЬ ПОЛУЧАТЕЛЯ — 5 ШАГОВ)
// Плавные переходы framer-motion, тактильность
// ==========================================

export interface RecipientFlowProps {
  config: InvitationConfig;
  language?: AppLanguage;
  onToggleLanguage?: (lang: AppLanguage) => void;
  onExitToCreator?: () => void;
}

export const RecipientFlow: React.FC<RecipientFlowProps> = ({
  config,
  language,
  onToggleLanguage,
  onExitToCreator,
}) => {
  const [internalLang, setInternalLang] = useState<AppLanguage | null>(null);
  const currentLang: AppLanguage = internalLang || language || config.language || 'ru';
  const localizedConfig = translateConfig(config, currentLang);

  const t = TRANSLATIONS[currentLang];

  // Текущий шаг: 0, 1, 2, 3, 4, 5 (если в URL view=ticket или step=5, сразу открываем билет)
  const [currentStep, setCurrentStep] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search);
      if (p.get('view') === 'ticket' || p.get('step') === '5' || p.get('signed') === '1') {
        return 5;
      }
    }
    return 0;
  });

  // Стейт ответов получателя (считывает данные из URL-параметров, если переданы)
  const [response, setResponse] = useState<RecipientResponse>(() => {
    let urlDate = '';
    let urlTime = '';
    let urlLocation = '';
    let urlTreat = '';
    let urlDrink = '';

    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search);
      urlDate = p.get('date') || '';
      urlTime = p.get('time') || '';
      urlLocation = p.get('location') || '';
      urlTreat = p.get('treat') || '';
      urlDrink = p.get('drink') || '';
    }

    const initialContract: Record<string, boolean> = {};
    const terms =
      localizedConfig.contractTerms && localizedConfig.contractTerms.length > 0
        ? localizedConfig.contractTerms
        : getDefaultContractTerms(localizedConfig.occasion, currentLang);
    terms.forEach((term) => {
      initialContract[term] = false; // По ТЗ: получатель сам выбирает условия (не отмечены по умолчанию!)
    });

    const defaultPayment =
      localizedConfig.occasion === 'bro'
        ? (currentLang === 'en' ? 'Split like bros (50/50)' : 'Братский счёт (скидываемся)')
        : (currentLang === 'en' ? 'Crush treats' : 'Краш угощает');

    const defaultTreat =
      localizedConfig.occasion === 'bro'
        ? (currentLang === 'en' ? 'Shawarma 🌯' : 'Шаурма 🌯')
        : (currentLang === 'en' ? 'Pizza' : 'Роллы и суши');

    const defaultLocation =
      localizedConfig.occasion === 'bro'
        ? (currentLang === 'en' ? 'PC Gaming Club / PS5 🎮' : 'Компьютерный клуб / PS5 🎮')
        : (currentLang === 'en' ? 'Cozy Cafe' : 'Панорамная крыша');

    return {
      accepted: false,
      date: urlDate || new Date().toISOString().split('T')[0],
      time: urlTime || '19:30',
      selectedTreat: translateItem(urlTreat || localizedConfig.treats[0] || defaultTreat, currentLang),
      selectedDrink: translateItem(
        urlDrink || (localizedConfig.drinks && localizedConfig.drinks[0]) || (currentLang === 'en' ? 'Beer 🍺' : 'Пиво 🍺'),
        currentLang
      ),
      selectedLocation: translateItem(urlLocation || localizedConfig.locations[0] || defaultLocation, currentLang),
      selectedPayment: translateItem(localizedConfig.paymentOptions[0] || defaultPayment, currentLang),
      contractAccepted: initialContract,
      secretRevealed: false,
    };
  });

  const handleToggleLang = (l: AppLanguage) => {
    setInternalLang(l);
    onToggleLanguage?.(l);
    setResponse((prev) => {
      const translatedContract: Record<string, boolean> = {};
      Object.entries(prev.contractAccepted || {}).forEach(([k, v]) => {
        translatedContract[translateItem(k, l)] = v;
      });
      return {
        ...prev,
        selectedTreat: translateItem(prev.selectedTreat, l),
        selectedDrink: prev.selectedDrink ? translateItem(prev.selectedDrink, l) : prev.selectedDrink,
        selectedLocation: translateItem(prev.selectedLocation, l),
        selectedPayment: translateItem(prev.selectedPayment, l),
        contractAccepted: translatedContract,
      };
    });
  };

  // Синхронизация параметров билета в URL (для прямого шеринга и ответа)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search);
      const cleanAuthor = (localizedConfig.authorTelegram || localizedConfig.creatorTelegram || '').replace(/^@+/, '').trim();
      if (cleanAuthor) p.set('author', cleanAuthor);
      if (localizedConfig.telegramChatId) p.set('chatId', localizedConfig.telegramChatId);
      if (response.date) p.set('date', response.date);
      if (response.time) p.set('time', response.time);
      if (response.selectedLocation) p.set('location', response.selectedLocation);
      if (response.selectedTreat) p.set('treat', response.selectedTreat);
      if (response.selectedDrink) p.set('drink', response.selectedDrink);
      if (currentStep === 5) p.set('view', 'ticket');

      const currentSearch = window.location.search.replace(/^\?/, '');
      const newSearch = p.toString();
      if (currentSearch !== newSearch) {
        const newUrl = `${window.location.pathname}?${newSearch}`;
        window.history.replaceState(null, '', newUrl);
      }
    }
  }, [currentStep, response, localizedConfig]);

  const cleanAuthor = (localizedConfig.authorTelegram || localizedConfig.creatorTelegram || '').replace(/^@+/, '').trim();
  const fullTicketData: TicketData = {
    config: {
      ...localizedConfig,
      authorTelegram: cleanAuthor,
      creatorTelegram: cleanAuthor,
      language: currentLang,
    },
    response: {
      ...response,
      selectedTreat: translateItem(response.selectedTreat, currentLang),
      selectedDrink: response.selectedDrink ? translateItem(response.selectedDrink, currentLang) : response.selectedDrink,
      selectedLocation: translateItem(response.selectedLocation, currentLang),
      selectedPayment: translateItem(response.selectedPayment, currentLang),
    },
    authorTelegram: cleanAuthor,
    telegramChatId: localizedConfig.telegramChatId,
  };

  // Варианты анимаций для шагов
  const pageVariants = {
    initial: { opacity: 0, y: 15, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -15, scale: 0.98 },
  };

  return (
    <div className="w-full min-h-screen py-4 sm:py-8 px-2 sm:px-4 flex flex-col items-center justify-center">
      <PhoneFrame showStatusHeader={true}>
        {/* Верхняя полоса: возврат в конструктор и переключатель [ RU | EN ] */}
        <div className="w-full flex items-center justify-between px-5 pt-2 pb-1 z-30">
          {onExitToCreator ? (
            <button
              type="button"
              onClick={onExitToCreator}
              className="text-[11px] text-stone-400 hover:text-amber-400 transition-colors flex items-center gap-1 cursor-pointer"
            >
              {t.common.exitToCreator}
            </button>
          ) : (
            <div />
          )}

          <div className="flex bg-stone-900 border border-stone-800 p-0.5 rounded-lg text-[10px] font-mono">
            <button
              type="button"
              onClick={() => {
                sound.click();
                handleToggleLang('ru');
              }}
              className={`px-2 py-0.5 rounded font-bold transition-all cursor-pointer ${
                currentLang === 'ru'
                  ? 'bg-amber-400 text-stone-950 shadow-sm'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              RU
            </button>
            <button
              type="button"
              onClick={() => {
                sound.click();
                handleToggleLang('en');
              }}
              className={`px-2 py-0.5 rounded font-bold transition-all cursor-pointer ${
                currentLang === 'en'
                  ? 'bg-amber-400 text-stone-950 shadow-sm'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              EN
            </button>
          </div>
        </div>

        {/* Индикатор прогресса шагов (для шагов 1-5) */}
        {currentStep > 0 && currentStep < 5 && (
          <div className="px-6 pt-1 pb-1 flex items-center justify-center gap-1.5 z-20">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={`h-1 rounded-full transition-all duration-300 ${
                  s === currentStep
                    ? 'w-7 bg-amber-400'
                    : s < currentStep
                    ? 'w-3 bg-amber-600/70'
                    : 'w-3 bg-stone-800'
                }`}
              />
            ))}
          </div>
        )}

        <div className="flex-1 flex flex-col relative overflow-x-hidden">
          <AnimatePresence mode="wait">
            {/* ШАГ 0: Тактильный жест на входе */}
            {currentStep === 0 && (
              <motion.div
                key="step-0"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.25 }}
                className="flex-1 flex flex-col"
              >
                <Step0_Gesture
                  gesture={config.gesture}
                  crushName={config.crushName}
                  language={currentLang}
                  onComplete={() => setCurrentStep(1)}
                />
              </motion.div>
            )}

            {/* ШАГ 1: Вопрос и убегающая кнопка «Нет» */}
            {currentStep === 1 && (
              <motion.div
                key="step-1"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.25 }}
                className="flex-1 flex flex-col"
              >
                <Step1_Question
                  crushName={localizedConfig.crushName}
                  question={localizedConfig.question}
                  dodgeMode={localizedConfig.dodgeMode}
                  occasion={localizedConfig.occasion}
                  language={currentLang}
                  onAccept={() => {
                    setResponse((prev) => ({ ...prev, accepted: true }));
                    setCurrentStep(2);
                  }}
                />
              </motion.div>
            )}

            {/* ШАГ 2: Эйфория и конфетти */}
            {currentStep === 2 && (
              <motion.div
                key="step-2"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.25 }}
                className="flex-1 flex flex-col"
              >
                <Step2_Euphoria
                  crushName={localizedConfig.crushName}
                  occasion={localizedConfig.occasion}
                  language={currentLang}
                  onNext={() => setCurrentStep(3)}
                />
              </motion.div>
            )}

            {/* ШАГ 3: Выбор даты и времени */}
            {currentStep === 3 && (
              <motion.div
                key="step-3"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.25 }}
                className="flex-1 flex flex-col"
              >
                <Step3_DateTime
                  initialDate={response.date}
                  initialTime={response.time}
                  occasion={localizedConfig.occasion}
                  language={currentLang}
                  onNext={(date, time) => {
                    setResponse((prev) => ({ ...prev, date, time }));
                    setCurrentStep(4);
                  }}
                  onBack={() => setCurrentStep(2)}
                />
              </motion.div>
            )}

            {/* ШАГ 4: Программа свидания (Еда, Локация, Оплата + Рулетка) */}
            {currentStep === 4 && (
              <motion.div
                key="step-4"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.25 }}
                className="flex-1 flex flex-col"
              >
                <Step4_Plan
                  treats={localizedConfig.treats}
                  drinks={localizedConfig.drinks}
                  locations={localizedConfig.locations}
                  paymentOptions={localizedConfig.paymentOptions}
                  occasion={localizedConfig.occasion}
                  initialSelectedTreat={response.selectedTreat}
                  initialSelectedDrink={response.selectedDrink}
                  initialSelectedLocation={response.selectedLocation}
                  initialSelectedPayment={response.selectedPayment}
                  language={currentLang}
                  onNext={(selectedTreat, selectedDrink, selectedLocation, selectedPayment) => {
                    setResponse((prev) => ({
                      ...prev,
                      selectedTreat,
                      selectedDrink,
                      selectedLocation,
                      selectedPayment,
                    }));
                    setCurrentStep(5);
                  }}
                  onBack={() => setCurrentStep(3)}
                />
              </motion.div>
            )}

            {/* ШАГ 5: Финальный билет-артефакт */}
            {currentStep === 5 && (
              <motion.div
                key="step-5"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.25 }}
                className="flex-1 flex flex-col"
              >
                <Step5_Ticket
                  ticket={fullTicketData}
                  language={currentLang}
                  onUpdateTicket={(updated) => setResponse(updated.response)}
                  onBackToEdit={() => setCurrentStep(4)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </PhoneFrame>

      {/* Кнопка создания своего приглашения внизу */}
      {onExitToCreator && (
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={onExitToCreator}
            className="text-xs text-stone-500 hover:text-amber-400 underline transition-colors cursor-pointer"
          >
            {t.recipient.step5.createYourOwn}
          </button>
        </div>
      )}
    </div>
  );
};
