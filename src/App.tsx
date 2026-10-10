import React, { useState } from 'react';
import type { InvitationConfig, AppLanguage } from './types/ticket';
import {
  DEFAULT_DRINKS,
  DEFAULT_CONTRACT_TERMS_RU,
  DEFAULT_CONTRACT_TERMS_EN,
  translateConfig,
  translateItem,
} from './types/ticket';
import { decompressInvitation } from './utils/share';
import { CreatorForm } from './components/creator/CreatorForm';
import { LivePreview } from './components/creator/LivePreview';
import { RecipientFlow } from './components/recipient/RecipientFlow';

// ==========================================
// 🚀 ГЛАВНЫЙ РОУТЕР И ПРИЛОЖЕНИЕ (APP.TSX)
// Маршрутизация по ?d= и Serverless State
// ==========================================

const DEFAULT_CONFIG: InvitationConfig = {
  id: 'ticket-default',
  crushName: '',
  question: '',
  occasion: 'romance',
  archetype: 'boarding-pass',
  gesture: 'scratch',
  dodgeMode: 'runaway',
  creatorTelegram: '',
  authorTelegram: '',
  telegramChatId: '',
  secretNote: 'Я давно хотел пригласить тебя. С тобой каждый момент особенный ❤️',
  treats: [
    'Роллы и суши',
    'Пицца',
    'Бургеры',
    'Шаурма',
    'Тортик',
  ],
  drinks: [...DEFAULT_DRINKS],
  locations: [
    'Крыша / панорама',
    'Кино',
    'Уютная кофейня',
    'Ночной город',
    'Набережная',
    'Парк',
  ],
  paymentOptions: [
    'Краш угощает',
    'Пополам (50/50)',
    'Битва у кассы',
    'Цу-е-фа',
  ],
  contractTerms: [...DEFAULT_CONTRACT_TERMS_RU],
  language: 'ru',
  createdAt: Date.now(),
};

export const App: React.FC = () => {
  // Стейт языка интерфейса (RU / EN), чтение из ?lang= или ?d=
  const [language, setLanguage] = useState<AppLanguage>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const langParam = params.get('lang');
      if (langParam === 'en' || langParam === 'ru') return langParam;
      const d = params.get('d');
      if (d) {
        const decoded = decompressInvitation(d);
        if (decoded?.language) return decoded.language;
      }
    }
    return 'ru';
  });

  // Стейт выбранных элементов для интерактивного превью билета
  const [previewTreat, setPreviewTreat] = useState<string | undefined>(undefined);
  const [previewDrink, setPreviewDrink] = useState<string | undefined>(undefined);
  const [previewLocation, setPreviewLocation] = useState<string | undefined>(undefined);

  // Стейт конфигурации приглашения (синхронное чтение ?d= при старте)
  const [config, setConfig] = useState<InvitationConfig>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const d = params.get('d');
      const chatIdParam = params.get('chatId') || params.get('chat_id');
      const authorParam = params.get('author') || params.get('authorTelegram') || params.get('author_tg');
      const locationParam = params.get('location');
      const treatParam = params.get('treat');
      const drinkParam = params.get('drink');

      if (d) {
        const decoded = decompressInvitation(d);
        if (decoded) {
          const targetLang: AppLanguage = decoded.language || language;
          const cleanAuthor = (
            authorParam
              ? authorParam.replace(/^@+/, '').trim()
              : (decoded.authorTelegram || decoded.creatorTelegram || '')
          ).replace(/^@+/, '');

          const locations = [...(decoded.locations || [])];
          if (locationParam && !locations.includes(locationParam)) {
            locations.unshift(locationParam);
          }

          const treats = [...(decoded.treats || [])];
          if (treatParam && !treats.includes(treatParam)) {
            treats.unshift(treatParam);
          }

          const drinks = [...(decoded.drinks || DEFAULT_DRINKS)];
          if (drinkParam && !drinks.includes(drinkParam)) {
            drinks.unshift(drinkParam);
          }

          return translateConfig(
            {
              ...decoded,
              authorTelegram: cleanAuthor,
              creatorTelegram: cleanAuthor,
              locations,
              treats,
              drinks,
              telegramChatId: chatIdParam || decoded.telegramChatId || '',
              language: targetLang,
              contractTerms:
                decoded.contractTerms && decoded.contractTerms.length > 0
                  ? decoded.contractTerms
                  : (targetLang === 'en' ? DEFAULT_CONTRACT_TERMS_EN : DEFAULT_CONTRACT_TERMS_RU),
            },
            targetLang
          );
        }
      }
    }
    return translateConfig(DEFAULT_CONFIG, language);
  });

  // Переключение языка интерфейса (переводит все пресеты еды, напитков, локаций, оплаты и условий)
  const handleToggleLanguage = (newLang: AppLanguage) => {
    setLanguage(newLang);
    setConfig((prev) => translateConfig(prev, newLang));
    setPreviewTreat((prev) => (prev ? translateItem(prev, newLang) : prev));
    setPreviewDrink((prev) => (prev ? translateItem(prev, newLang) : prev));
    setPreviewLocation((prev) => (prev ? translateItem(prev, newLang) : prev));
  };

  // Режим экрана: 'recipient' (получатель) или 'creator' (конструктор)
  const [mode, setMode] = useState<'creator' | 'recipient'>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const d = params.get('d');
      if (d && decompressInvitation(d)) return 'recipient';
    }
    return 'creator';
  });

  return (
    <main className="min-h-screen bg-[#0C0A09] bg-amber-spotlight text-stone-100 flex flex-col items-center">
      {/* 1. РЕЖИМ ПОЛУЧАТЕЛЯ (если есть ?d= или запущен тест) */}
      {mode === 'recipient' && (
        <div className="w-full">
          <RecipientFlow
            config={config}
            language={language}
            onToggleLanguage={handleToggleLanguage}
            onExitToCreator={() => {
              // Очищаем ?d= из адресной строки и переходим в конструктор
              window.history.replaceState({}, '', window.location.pathname);
              setMode('creator');
            }}
          />
        </div>
      )}

      {/* 2. РЕЖИМ КОНСТРУКТОРА С LIVE PREVIEW */}
      {mode === 'creator' && (
        <div className="w-full max-w-6xl mx-auto px-4 py-8 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Левая колонка: Форма настроек (7 колонок) */}
            <div className="lg:col-span-7">
              <CreatorForm
                config={config}
                onChange={setConfig}
                onPreviewFlow={() => setMode('recipient')}
                language={language}
                onToggleLanguage={handleToggleLanguage}
                selectedTreat={previewTreat}
                selectedDrink={previewDrink}
                selectedLocation={previewLocation}
                onSelectTreat={setPreviewTreat}
                onSelectDrink={setPreviewDrink}
                onSelectLocation={setPreviewLocation}
              />
            </div>

            {/* Правая колонка: Sticky Live Preview (5 колонок) */}
            <div className="lg:col-span-5 sticky top-6">
              <LivePreview
                config={config}
                language={language}
                selectedTreat={previewTreat}
                selectedDrink={previewDrink}
                selectedLocation={previewLocation}
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default App;
