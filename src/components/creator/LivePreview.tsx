import React, { useState } from 'react';
import { Eye, Smartphone, Ticket, Hand } from 'lucide-react';
import type { InvitationConfig, TicketData, AppLanguage } from '../../types/ticket';
import {
  DEFAULT_DRINKS,
  DEFAULT_DRINKS_EN,
  translateItem,
  translateArray,
} from '../../types/ticket';
import { PhoneFrame } from '../ui/PhoneFrame';
import { Step0_Gesture } from '../recipient/Step0_Gesture';
import { Step1_Question } from '../recipient/Step1_Question';
import { BoardingPass } from '../ticket-artifacts/BoardingPass';
import { Subpoena } from '../ticket-artifacts/Subpoena';
import { Receipt } from '../ticket-artifacts/Receipt';
import { BroPass } from '../ticket-artifacts/BroPass';
import { GirlsPass } from '../ticket-artifacts/GirlsPass';
import { RetroCinema } from '../ticket-artifacts/RetroCinema';
import { ClassifiedDossier } from '../ticket-artifacts/ClassifiedDossier';
import { sound } from '../../utils/audio';
import { TRANSLATIONS } from '../../locales/translations';

// ==========================================
// 📱 ЖИВОЙ ПРЕДПРОСМОТР (ПРАВАЯ STICKY-КОЛОНКА)
// Мгновенный интерактивный рендер в корпусе iPhone
// ==========================================

export interface LivePreviewProps {
  config: InvitationConfig;
  language?: AppLanguage;
  selectedTreat?: string;
  selectedDrink?: string;
  selectedLocation?: string;
}

export const LivePreview: React.FC<LivePreviewProps> = ({
  config,
  language,
  selectedTreat,
  selectedDrink,
  selectedLocation,
}) => {
  const lang: AppLanguage = language || config.language || 'ru';
  const t = TRANSLATIONS[lang];

  // Режим предпросмотра внутри рамки телефона:
  // 'question' - вопрос с кнопкой «Нет»
  // 'ticket' - готовый билет
  // 'gesture' - тактильный жест распаковки
  const [previewTab, setPreviewTab] = useState<'question' | 'ticket' | 'gesture'>('ticket');

  const treatsList =
    config.treats && config.treats.length > 0
      ? translateArray(config.treats, lang)
      : [lang === 'en' ? 'Rolls & sushi' : 'Роллы и суши'];
  const drinksList =
    config.drinks && config.drinks.length > 0
      ? translateArray(config.drinks, lang)
      : (lang === 'en' ? DEFAULT_DRINKS_EN : DEFAULT_DRINKS);
  const locationsList =
    config.locations && config.locations.length > 0
      ? translateArray(config.locations, lang)
      : [lang === 'en' ? 'Panoramic Rooftop' : 'Панорамная крыша'];

  const translatedSelectedTreat = selectedTreat ? translateItem(selectedTreat, lang) : undefined;
  const translatedSelectedDrink = selectedDrink ? translateItem(selectedDrink, lang) : undefined;
  const translatedSelectedLocation = selectedLocation ? translateItem(selectedLocation, lang) : undefined;

  // Фейковый билет для превью с поддержкой выбранных в конструкторе элементов
  const mockTicketData: TicketData = {
    config: {
      ...config,
      crushName: config.crushName || (lang === 'en' ? 'GUEST NAME' : 'ИМЯ ГОСТЯ'),
      question:
        translateItem(config.question, lang) ||
        (config.occasion === 'bro'
          ? (lang === 'en' ? 'Bro, are we rolling today?' : 'Бро, общий сбор пацанов сегодня?')
          : (lang === 'en' ? 'Will you go on a date with me?' : 'Пойдёшь со мной на свидание?')),
      secretNote: translateItem(config.secretNote, lang),
      subpoenaClause: config.subpoenaClause ? translateItem(config.subpoenaClause, lang) : config.subpoenaClause,
      contractTerms:
        config.contractTerms && config.contractTerms.length > 0
          ? translateArray(config.contractTerms, lang)
          : [],
      language: lang,
    },
    response: {
      accepted: true,
      date: '2026-10-14',
      time: '19:30',
      selectedTreat:
        translatedSelectedTreat && treatsList.includes(translatedSelectedTreat)
          ? translatedSelectedTreat
          : treatsList[0],
      selectedDrink:
        translatedSelectedDrink && drinksList.includes(translatedSelectedDrink)
          ? translatedSelectedDrink
          : drinksList[0],
      selectedLocation:
        translatedSelectedLocation && locationsList.includes(translatedSelectedLocation)
          ? translatedSelectedLocation
          : locationsList[0],
      selectedPayment:
        translateItem(config.paymentOptions?.[0], lang) ||
        (config.occasion === 'bro'
          ? (lang === 'en' ? 'Split like bros (50/50)' : 'Братский счёт')
          : (lang === 'en' ? 'Crush treats' : 'Краш угощает')),
      contractAccepted: {},
      secretRevealed: Boolean(config.secretNote),
    },
  };

  return (
    <div className="w-full flex flex-col items-center sticky top-6">
      {/* Переключатель режимов предпросмотра */}
      <div className="w-full max-w-[420px] mb-3 flex items-center justify-between px-2">
        <span className="text-xs font-mono uppercase text-stone-400 font-bold flex items-center gap-1.5">
          <Eye className="w-3.5 h-3.5 text-amber-400" />
          <span>LIVE PREVIEW</span>
        </span>

        <div className="flex bg-[#141210] p-1 rounded-xl border border-stone-800 text-xs gap-1">
          <button
            type="button"
            onClick={() => {
              sound.click();
              setPreviewTab('ticket');
            }}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1 ${
              previewTab === 'ticket'
                ? 'bg-amber-400 text-stone-950 font-bold shadow-sm'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <Ticket className="w-3 h-3" />
            <span>{t.common.ticket}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.click();
              setPreviewTab('question');
            }}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1 ${
              previewTab === 'question'
                ? 'bg-amber-400 text-stone-950 font-bold shadow-sm'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3 h-3" />
            <span>{t.common.question}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.click();
              setPreviewTab('gesture');
            }}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1 ${
              previewTab === 'gesture'
                ? 'bg-amber-400 text-stone-950 font-bold shadow-sm'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <Hand className="w-3 h-3" />
            <span>{t.common.gesture}</span>
          </button>
        </div>
      </div>

      {/* Корпус телефона */}
      <PhoneFrame showStatusHeader={true}>
        {/* 1. Превью билета */}
        {previewTab === 'ticket' && (
          <div className="p-4 space-y-4">
            <div className="text-center text-[10px] font-mono text-stone-500 uppercase">
              {lang === 'en' ? '★ ARTIFACT PREVIEW ★' : '★ ВНЕШНИЙ ВИД АРТЕФАКТА ★'}
            </div>

            {config.archetype === 'boarding-pass' && (
              <BoardingPass ticket={mockTicketData} />
            )}
            {config.archetype === 'subpoena' && (
              <Subpoena ticket={mockTicketData} />
            )}
            {config.archetype === 'receipt' && (
              <Receipt ticket={mockTicketData} />
            )}
            {config.archetype === 'bro-pass' && (
              <BroPass ticket={mockTicketData} />
            )}
            {config.archetype === 'girls-pass' && (
              <GirlsPass ticket={mockTicketData} />
            )}
            {config.archetype === 'retro-cinema' && (
              <RetroCinema ticket={mockTicketData} />
            )}
            {config.archetype === 'classified-dossier' && (
              <ClassifiedDossier ticket={mockTicketData} />
            )}

            <div className="p-3 bg-stone-900/60 rounded-xl border border-stone-800 text-[11px] text-stone-400 text-left">
              {lang === 'en'
                ? '💡 Date, time and location variables update dynamically as the guest answers.'
                : '💡 Переменные даты, времени и локации обновятся автоматически, когда гость заполнит свои ответы.'}
            </div>
          </div>
        )}

        {/* 2. Превью вопроса с кнопкой «Нет» */}
        {previewTab === 'question' && (
          <Step1_Question
            key={config.dodgeMode}
            crushName={config.crushName || (lang === 'en' ? 'GUEST NAME' : 'ИМЯ ГОСТЯ')}
            question={config.question || (lang === 'en' ? 'Will you go on a date with me?' : 'Пойдёшь со мной на свидание?')}
            dodgeMode={config.dodgeMode}
            language={lang}
            onAccept={() => {
              sound.celebration();
              setPreviewTab('ticket');
            }}
          />
        )}

        {/* 3. Превью тактильного жеста */}
        {previewTab === 'gesture' && (
          <Step0_Gesture
            key={config.gesture}
            gesture={config.gesture}
            crushName={config.crushName || (lang === 'en' ? 'GUEST NAME' : 'ИМЯ ГОСТЯ')}
            language={lang}
            onComplete={() => {
              sound.celebration();
              setPreviewTab('question');
            }}
          />
        )}
      </PhoneFrame>
    </div>
  );
};
