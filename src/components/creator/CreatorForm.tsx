import React, { useState, useEffect } from 'react';
import {
  Heart,
  Share2,
  Copy,
  Check,
  QrCode,
  ExternalLink,
  Plus,
  X,
  Send,
  Lock,
  Layers,
  MousePointer,
  Hand,
  CheckSquare,
  Square,
  FileText,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import type {
  InvitationConfig,
  TactileGesture,
  DodgeMode,
  Occasion,
  TicketArchetype,
  AppLanguage,
} from '../../types/ticket';
import {
  DEFAULT_DRINKS,
  DEFAULT_DRINKS_EN,
  DEFAULT_BRO_DRINKS_RU,
  DEFAULT_BRO_DRINKS_EN,
  DEFAULT_BRO_LOCATIONS_RU,
  DEFAULT_BRO_LOCATIONS_EN,
  DEFAULT_BRO_PAYMENT_RU,
  DEFAULT_BRO_PAYMENT_EN,
  DEFAULT_CONTRACT_TERMS_RU,
  DEFAULT_CONTRACT_TERMS_EN,
  DEFAULT_CONTRACT_TERMS_BRO_RU,
  DEFAULT_CONTRACT_TERMS_BRO_EN,
  DEFAULT_CONTRACT_TERMS_GIRLS_RU,
  DEFAULT_CONTRACT_TERMS_GIRLS_EN,
  DEFAULT_CONTRACT_TERMS_PEACE_RU,
  DEFAULT_CONTRACT_TERMS_PEACE_EN,
  getDefaultContractTerms,
} from '../../types/ticket';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { sound } from '../../utils/audio';
import { generateInvitationUrl } from '../../utils/share';
import { PoetryStudio } from './PoetryStudio';
import { LiveCounterBadge } from './LiveCounterBadge';
import { FeedbackForm } from './FeedbackForm';
import { AboutProject } from './AboutProject';
import { APP_CONFIG } from '../../config/appConfig';
import { TRANSLATIONS } from '../../locales/translations';

// ==========================================
// 🛠️ КОНСТРУКТОР ПРИГЛАШЕНИЯ (ЛЕВАЯ КОЛОНКА)
// Форма настройки всех параметров
// ==========================================

export interface CreatorFormProps {
  config: InvitationConfig;
  onChange: (updated: InvitationConfig) => void;
  onPreviewFlow?: () => void;
  language?: AppLanguage;
  onToggleLanguage?: (lang: AppLanguage) => void;
  selectedTreat?: string;
  selectedDrink?: string;
  selectedLocation?: string;
  onSelectTreat?: (treat: string) => void;
  onSelectDrink?: (drink: string) => void;
  onSelectLocation?: (location: string) => void;
}

export const CreatorForm: React.FC<CreatorFormProps> = ({
  config,
  onChange,
  onPreviewFlow,
  language,
  onToggleLanguage,
  selectedTreat,
  selectedDrink,
  selectedLocation,
  onSelectTreat,
  onSelectDrink,
  onSelectLocation,
}) => {
  const lang: AppLanguage = language || config.language || 'ru';
  const t = TRANSLATIONS[lang];

  const [copied, setCopied] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  // Живой счётчик генераций: CountAPI + стартовая база 124
  const BASE_OFFSET = 124;
  const [createdCount, setCreatedCount] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bezshansov_counter_v6');
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed) && parsed >= 0) return parsed;
      }
    }
    return BASE_OFFSET;
  });
  const [isBumping, setIsBumping] = useState(false);

  // 1. При загрузке страницы: GET https://countapi.mileshilliard.com/api/v1/get/bezshansov_invites_v1
  useEffect(() => {
    let isMounted = true;
    const fetchCounter = async () => {
      try {
        const res = await fetch('https://countapi.mileshilliard.com/api/v1/get/bezshansov_invites_v1');
        if (res.ok) {
          const data = await res.json();
          const countVal = typeof data?.value === 'number' ? data.value : null;
          if (countVal !== null && isMounted) {
            const finalVal = countVal + BASE_OFFSET;
            setCreatedCount(finalVal);
            if (typeof window !== 'undefined') {
              localStorage.setItem('bezshansov_counter_v6', String(finalVal));
            }
          }
        }
      } catch (err) {
        console.warn('CountAPI fetch error:', err);
      }
    };

    fetchCounter();
    return () => {
      isMounted = false;
    };
  }, []);

  // Локальные инпуты для добавления новых пунктов
  const [newTreat, setNewTreat] = useState('');
  const [newDrink, setNewDrink] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newContractTerm, setNewContractTerm] = useState('');

  // 1. Изменение простых полей
  const updateField = <K extends keyof InvitationConfig>(
    field: K,
    val: InvitationConfig[K]
  ) => {
    onChange({
      ...config,
      [field]: val,
    });
  };

  // Выбор повода с умными пресетами
  const handleSelectOccasion = (occ: Occasion) => {
    sound.click();
    let newQuestion = config.question;
    let newTreats = config.treats;
    let newDrinks = config.drinks;
    let newLocations = config.locations;
    let newPayment = config.paymentOptions;
    let newTerms = config.contractTerms;
    let newArchetype: TicketArchetype = config.archetype;
    let newSubpoenaClause = config.subpoenaClause;

    if (occ === 'bro') {
      newQuestion =
        lang === 'en'
          ? 'Bro, matter of national security...'
          : 'Брат, есть разговор государственной важности...';
      newTreats =
        lang === 'en'
          ? ['Shawarma 🌯', 'Burgers 🍔', 'Pizza 🍕', 'PS5 Gaming 🎮', 'Garage BBQ 🥩']
          : ['Шаурма 🌯', 'Бургеры 🍔', 'Пицца 🍕', 'Катка в PS5 🎮', 'Гараж и шашлык 🥩'];
      newDrinks = lang === 'en' ? [...DEFAULT_BRO_DRINKS_EN] : [...DEFAULT_BRO_DRINKS_RU];
      newLocations = lang === 'en' ? [...DEFAULT_BRO_LOCATIONS_EN] : [...DEFAULT_BRO_LOCATIONS_RU];
      newPayment = lang === 'en' ? [...DEFAULT_BRO_PAYMENT_EN] : [...DEFAULT_BRO_PAYMENT_RU];
      newTerms = lang === 'en' ? [...DEFAULT_CONTRACT_TERMS_BRO_EN] : [...DEFAULT_CONTRACT_TERMS_BRO_RU];
      newArchetype = 'bro-pass';
      newSubpoenaClause =
        lang === 'en'
          ? 'Section 228 Bro Code: Gross neglect of homie summons.'
          : 'Статья 228 УК Дружбы: Злостное игнорирование пацанского созвона.';
    } else if (occ === 'girls') {
      newQuestion =
        lang === 'en'
          ? 'Bestie, time to spill the tea...'
          : 'Любимая, пора обсудить все сплетни за неделю...';
      newTreats =
        lang === 'en'
          ? ['Matcha latte', 'Brunch & Avocado', 'Pasta', 'Shopping', 'Cake']
          : ['Матча-латте', 'Бранч и авокадо', 'Паста', 'Шопинг', 'Тортик'];
      newDrinks =
        lang === 'en'
          ? ['Matcha latte 🍵', 'Prosecco 🥂', 'Cocktails 🍸', 'Smoothie 🍓', 'Water with lemon 🍋']
          : ['Матча-латте 🍵', 'Просекко 🥂', 'Коктейли 🍸', 'Смузи 🍓', 'Вода с лимоном 🍋'];
      newLocations =
        lang === 'en'
          ? ['Cozy Cafe & Brunch', 'Spa & Beauty Day', 'Shopping & Mall', 'Wine Bar', 'Movie Pajama Party']
          : ['Стильное кафе / Бранч', 'Спа / Бьюти-день', 'Шопинг и молл', 'Винный бар', 'Пижамная вечеринка с кино'];
      newPayment =
        lang === 'en'
          ? ['Split 50/50', 'Birthday girl relaxes', 'I treat today', 'Dutch bill']
          : ['Каждая за себя', 'Именинница отдыхает', 'Сегодня я угощаю подругу', 'Скидываемся пополам'];
      newTerms = lang === 'en' ? [...DEFAULT_CONTRACT_TERMS_GIRLS_EN] : [...DEFAULT_CONTRACT_TERMS_GIRLS_RU];
      newArchetype = 'girls-pass';
      newSubpoenaClause =
        lang === 'en'
          ? 'Section 77: Critical deficit of selfies & heart-to-heart chats.'
          : 'Статья 77: Критическая нехватка совместных фото и разговоров по душам.';
    } else if (occ === 'peace') {
      newQuestion =
        lang === 'en'
          ? 'I was wrong. Shall we sign a peace treaty?'
          : 'Я был(а) не прав(а). Давай заключим мирный договор?';
      newTreats =
        lang === 'en'
          ? ['Your favorite dessert', 'Anything on my tab', 'Coffee & hugs']
          : ['Твой любимый десерт', 'Любой каприз за мой счет', 'Кофе и объятия'];
      newDrinks =
        lang === 'en'
          ? ['Hot tea / Cocoa ☕', 'Peace wine 🍷', 'Favorite coffee ☕', 'Juice 🧃']
          : ['Горячий чай / Какао ☕', 'Вино перемирия 🍷', 'Любимый кофе ☕', 'Сок 🧃'];
      newLocations =
        lang === 'en'
          ? ['Our favorite spot', 'Quiet park bench', 'Cozy cafe', 'At home with dessert']
          : ['Наше любимое место', 'Тихий парк для разговора', 'Уютная кофейня', 'Дома за вкусным ужином'];
      newPayment =
        lang === 'en'
          ? ['I pay (apology tab)', 'My treat 100%', 'Compromise split']
          : ['Я угощаю (заглаживаю вину)', 'Всё за мой счет 💳', 'Мирный компромисс'];
      newTerms = lang === 'en' ? [...DEFAULT_CONTRACT_TERMS_PEACE_EN] : [...DEFAULT_CONTRACT_TERMS_PEACE_RU];
      newArchetype = 'subpoena';
      newSubpoenaClause =
        lang === 'en'
          ? 'Clause 1: Unconditional armistice, amnesty & sweet dessert.'
          : 'Статья 1 УК Перемирия: Объявление безусловного перемирия, амнистия обид и сладкий десерт.';
    } else if (occ === 'romance') {
      newQuestion =
        lang === 'en'
          ? 'Will you go on a date with me?'
          : 'Пойдёшь со мной на свидание?';
      newTreats =
        lang === 'en'
          ? ['Rolls & sushi', 'Pizza', 'Burgers', 'Shawarma', 'Cake']
          : ['Роллы и суши', 'Пицца', 'Бургеры', 'Шаурма', 'Тортик'];
      newDrinks = lang === 'en' ? [...DEFAULT_DRINKS_EN] : [...DEFAULT_DRINKS];
      newLocations =
        lang === 'en'
          ? [
              'Rooftop / Panorama',
              'Cinema',
              'Cozy Cafe',
              'Night City Walk',
              'Waterfront / Embankment',
              'Park',
            ]
          : [
              'Крыша / панорама',
              'Кино',
              'Уютная кофейня',
              'Ночной город',
              'Набережная',
              'Парк',
            ];
      newPayment =
        lang === 'en'
          ? ['Crush treats', 'Split (50/50)', 'Battle at counter', 'Rock-paper-scissors']
          : ['Краш угощает', 'Пополам (50/50)', 'Битва у кассы', 'Цу-е-фа'];
      newTerms = lang === 'en' ? [...DEFAULT_CONTRACT_TERMS_EN] : [...DEFAULT_CONTRACT_TERMS_RU];
      newArchetype = 'boarding-pass';
      newSubpoenaClause =
        lang === 'en'
          ? 'Article 105: Reckless theft of heart with aggravating irresistible charm. No appeals.'
          : 'Статья 105 УК РФ: Неосторожное похищение сердечка при отягчающих обстоятельствах (неотразимость). Апелляции не принимаются.';
    }

    onChange({
      ...config,
      occasion: occ,
      question: newQuestion,
      treats: newTreats,
      drinks: newDrinks,
      locations: newLocations,
      paymentOptions: newPayment,
      contractTerms: newTerms,
      archetype: newArchetype,
      subpoenaClause: newSubpoenaClause,
    });
  };

  // Обработчики романтического контракта
  const activeContractTerms =
    config.contractTerms && config.contractTerms.length > 0
      ? config.contractTerms
      : getDefaultContractTerms(config.occasion, lang);

  const presetContractTerms = getDefaultContractTerms(config.occasion, lang);

  const toggleContractTerm = (term: string) => {
    sound.click();
    if (activeContractTerms.includes(term)) {
      if (activeContractTerms.length <= 1) return; // Не удаляем последнее условие
      updateField(
        'contractTerms',
        activeContractTerms.filter((t) => t !== term)
      );
    } else {
      updateField('contractTerms', [...activeContractTerms, term]);
    }
  };

  const addContractTerm = () => {
    const val = newContractTerm.trim();
    if (!val || activeContractTerms.includes(val)) return;
    updateField('contractTerms', [...activeContractTerms, val]);
    setNewContractTerm('');
    sound.click();
  };

  const removeContractTerm = (termToRemove: string) => {
    if (activeContractTerms.length <= 1) return;
    updateField(
      'contractTerms',
      activeContractTerms.filter((t) => t !== termToRemove)
    );
    sound.click();
  };

  // 2. Добавление/удаление угощений (СТРОГО treats)
  const addTreat = () => {
    const val = newTreat.trim();
    if (!val || config.treats.includes(val)) return;
    updateField('treats', [...config.treats, val]);
    setNewTreat('');
    sound.click();
  };

  const removeTreat = (idx: number) => {
    if (config.treats.length <= 1) return; // Не удаляем последний вариант
    updateField(
      'treats',
      config.treats.filter((_, i) => i !== idx)
    );
    sound.click();
  };

  const drinksList =
    config.drinks && config.drinks.length > 0
      ? config.drinks
      : (lang === 'en' ? DEFAULT_DRINKS_EN : DEFAULT_DRINKS);

  // 3. Добавление/удаление напитков (СТРОГО drinks)
  const addDrink = () => {
    const val = newDrink.trim();
    if (!val || drinksList.includes(val)) return;
    updateField('drinks', [...drinksList, val]);
    setNewDrink('');
    sound.click();
  };

  const removeDrink = (idx: number) => {
    if (drinksList.length <= 1) return; // Не удаляем последний вариант
    updateField(
      'drinks',
      drinksList.filter((_, i) => i !== idx)
    );
    sound.click();
  };

  // 4. Добавление/удаление локаций (СТРОГО locations)
  const addLocation = () => {
    const val = newLocation.trim();
    if (!val || config.locations.includes(val)) return;
    updateField('locations', [...config.locations, val]);
    setNewLocation('');
    sound.click();
  };

  const removeLocation = (idx: number) => {
    if (config.locations.length <= 1) return; // Не удаляем последний вариант
    updateField(
      'locations',
      config.locations.filter((_, i) => i !== idx)
    );
    sound.click();
  };

  // 4. Генерация ссылки и шеринг
  const handleGenerateLink = () => {
    sound.coin();
    const cleanAuthor = (config.authorTelegram || config.creatorTelegram || '').replace(/^(https?:\/\/)?(t\.me\/)?@?/i, '').trim();
    const url = generateInvitationUrl(config, {
      selectedLocation: selectedLocation || config.locations?.[0],
      selectedTreat: selectedTreat || config.treats?.[0],
      selectedDrink: selectedDrink || config.drinks?.[0],
      authorTelegram: cleanAuthor,
    });
    setShareUrl(url);

    // Уведомление о создании билета
    fetch('/api/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'TICKET_CREATED', payload: { ticketId: config.id } })
    }).catch(console.error);

    // 2. Отправляем GET-запрос на увеличение: https://countapi.mileshilliard.com/api/v1/hit/bezshansov_invites_v1
    fetch('https://countapi.mileshilliard.com/api/v1/hit/bezshansov_invites_v1').catch((err) => {
      console.warn('CountAPI increment error:', err);
    });

    // Локально сразу прибавляем +1 к цифре на экране
    const nextCount = createdCount + 1;
    setCreatedCount(nextCount);
    if (typeof window !== 'undefined') {
      localStorage.setItem('bezshansov_counter_v6', String(nextCount));
    }
    setIsBumping(true);
    setTimeout(() => setIsBumping(false), 500);

    // Копирование в буфер обмена
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      });
    }
    setShowQRModal(true);
  };

  return (
    <div className="w-full space-y-6 text-left">
      {/* Шапка конструктора */}
      <div className="border-b border-stone-800 pb-5">
        <div className="flex flex-wrap items-center justify-end gap-3 mb-2">
          {/* Языковой переключатель [ RU | EN ] и кнопка Доната */}
          <div className="flex items-center gap-2">
            {/* RU / EN Toggle Pill */}
            <div className="flex bg-stone-900 border border-stone-800 p-0.5 rounded-xl text-xs font-mono">
              <button
                type="button"
                onClick={() => {
                  sound.click();
                  if (onToggleLanguage) {
                    onToggleLanguage('ru');
                  } else {
                    updateField('language', 'ru');
                  }
                }}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  lang === 'ru'
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
                  if (onToggleLanguage) {
                    onToggleLanguage('en');
                  } else {
                    updateField('language', 'en');
                  }
                }}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  lang === 'en'
                    ? 'bg-amber-400 text-stone-950 shadow-sm'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                EN
              </button>
            </div>

            {/* Кнопка Поддержать автора */}
            <a
              href={APP_CONFIG.donateUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sound.coin()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/15 to-amber-600/10 border border-amber-500/40 hover:border-amber-400 text-amber-200 text-xs font-medium transition-all shadow-[0_0_15px_rgba(245,158,11,0.15)] hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] cursor-pointer"
              title="Поддержать автора проекта"
            >
              <span>{t.common.donate}</span>
            </a>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          {lang === 'en' ? 'Service ' : 'Сервис «'}<span className="gold-foil">{t.common.appName}</span>{lang === 'en' ? '' : '»'}
        </h1>
        <p className="text-stone-400 text-xs sm:text-sm mt-1">
          {t.creator.headerSubtitle}
        </p>

        {/* Живой счётчик созданных приглашений */}
        <div className="pt-2.5">
          <LiveCounterBadge
            language={lang}
            count={createdCount}
            isBumping={isBumping}
          />
        </div>
      </div>

      {/* 1. Имя краша, повод и вопрос */}
      <div className="bg-[#141210] border border-stone-800 rounded-3xl p-5 space-y-4 shadow-md">
        <div className="flex items-center gap-2 text-sm font-bold text-white">
          <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
          <span>{t.creator.step1Title}</span>
        </div>

        {/* Селектор повода (Occasion) */}
        <div>
          <label className="text-xs font-semibold text-stone-300 uppercase block mb-2">
            {t.creator.occasionLabel}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              {
                id: 'romance' as Occasion,
                label: t.creator.occasions.romance.label,
                subtitle: t.creator.occasions.romance.desc,
              },
              {
                id: 'bro' as Occasion,
                label: t.creator.occasions.bro.label,
                subtitle: t.creator.occasions.bro.desc,
              },
              {
                id: 'girls' as Occasion,
                label: t.creator.occasions.girls.label,
                subtitle: t.creator.occasions.girls.desc,
              },
              {
                id: 'peace' as Occasion,
                label: t.creator.occasions.peace.label,
                subtitle: t.creator.occasions.peace.desc,
              },
            ].map((occ) => {
              const isSelected = (config.occasion || 'romance') === occ.id;
              return (
                <button
                  key={occ.id}
                  type="button"
                  onClick={() => handleSelectOccasion(occ.id)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-400 ring-2 ring-amber-400/30'
                      : 'bg-stone-900 border-stone-800 hover:border-stone-700'
                  }`}
                >
                  <div className="text-xs font-bold text-white flex items-center justify-between">
                    <span>{occ.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  </div>
                  <div className="text-[11px] text-stone-400 mt-0.5">
                    {occ.subtitle}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <Input
          label={
            config.occasion === 'bro'
              ? t.creator.nameLabel.bro
              : config.occasion === 'girls'
              ? t.creator.nameLabel.girls
              : config.occasion === 'peace'
              ? t.creator.nameLabel.peace
              : t.creator.nameLabel.romance
          }
          placeholder={t.creator.namePlaceholder}
          value={config.crushName}
          onChange={(e) => updateField('crushName', e.target.value)}
        />

        <Input
          label={t.creator.questionLabel}
          placeholder={t.creator.questionPlaceholder}
          value={config.question}
          onChange={(e) => updateField('question', e.target.value)}
        />
      </div>

      {/* 2. Архетип физического билета */}
      <div className="bg-[#141210] border border-stone-800 rounded-3xl p-5 space-y-4 shadow-md">
        <div className="flex items-center gap-2 text-sm font-bold text-white">
          <Layers className="w-4 h-4 text-amber-400" />
          <span>{t.creator.step2Title}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {/* 1st Class Love */}
          <button
            type="button"
            onClick={() => {
              sound.click();
              updateField('archetype', 'boarding-pass');
            }}
            className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
              config.archetype === 'boarding-pass'
                ? 'bg-amber-500/10 border-amber-400 ring-2 ring-amber-400/30'
                : 'bg-stone-900 border-stone-800 hover:border-stone-700'
            }`}
          >
            <div className="text-xs font-bold text-white flex items-center justify-between">
              <span>{t.creator.archetypes.boardingPass.title}</span>
              {config.archetype === 'boarding-pass' && (
                <Check className="w-3.5 h-3.5 text-amber-400" />
              )}
            </div>
            <div className="text-[11px] text-stone-400 mt-1">
              {t.creator.archetypes.boardingPass.desc}
            </div>
          </button>

          {/* Судебная повестка */}
          <button
            type="button"
            onClick={() => {
              sound.click();
              updateField('archetype', 'subpoena');
            }}
            className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
              config.archetype === 'subpoena'
                ? 'bg-amber-500/10 border-amber-400 ring-2 ring-amber-400/30'
                : 'bg-stone-900 border-stone-800 hover:border-stone-700'
            }`}
          >
            <div className="text-xs font-bold text-white flex items-center justify-between">
              <span>{t.creator.archetypes.subpoena.title}</span>
              {config.archetype === 'subpoena' && (
                <Check className="w-3.5 h-3.5 text-amber-400" />
              )}
            </div>
            <div className="text-[11px] text-stone-400 mt-1">
              {t.creator.archetypes.subpoena.desc}
            </div>
          </button>

          {/* Кассовый чек */}
          <button
            type="button"
            onClick={() => {
              sound.click();
              updateField('archetype', 'receipt');
            }}
            className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
              config.archetype === 'receipt'
                ? 'bg-amber-500/10 border-amber-400 ring-2 ring-amber-400/30'
                : 'bg-stone-900 border-stone-800 hover:border-stone-700'
            }`}
          >
            <div className="text-xs font-bold text-white flex items-center justify-between">
              <span>{t.creator.archetypes.receipt.title}</span>
              {config.archetype === 'receipt' && (
                <Check className="w-3.5 h-3.5 text-amber-400" />
              )}
            </div>
            <div className="text-[11px] text-stone-400 mt-1">
              {t.creator.archetypes.receipt.desc}
            </div>
          </button>

          {/* Братский Пакт */}
          <button
            type="button"
            onClick={() => {
              sound.click();
              updateField('archetype', 'bro-pass');
            }}
            className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
              config.archetype === 'bro-pass'
                ? 'bg-orange-500/15 border-orange-400 ring-2 ring-orange-400/30'
                : 'bg-stone-900 border-stone-800 hover:border-stone-700'
            }`}
          >
            <div className="text-xs font-bold text-white flex items-center justify-between">
              <span>{t.creator.archetypes.broPass.title}</span>
              {config.archetype === 'bro-pass' && (
                <Check className="w-3.5 h-3.5 text-orange-400" />
              )}
            </div>
            <div className="text-[11px] text-stone-400 mt-1">
              {t.creator.archetypes.broPass.desc}
            </div>
          </button>

          {/* Клубная Карта / VIP Gossip Pass */}
          <button
            type="button"
            onClick={() => {
              sound.click();
              updateField('archetype', 'girls-pass');
            }}
            className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
              config.archetype === 'girls-pass'
                ? 'bg-pink-500/15 border-pink-400 ring-2 ring-pink-400/30'
                : 'bg-stone-900 border-stone-800 hover:border-stone-700'
            }`}
          >
            <div className="text-xs font-bold text-white flex items-center justify-between">
              <span>{t.creator.archetypes.girlsPass.title}</span>
              {config.archetype === 'girls-pass' && (
                <Check className="w-3.5 h-3.5 text-pink-400" />
              )}
            </div>
            <div className="text-[11px] text-stone-400 mt-1">
              {t.creator.archetypes.girlsPass.desc}
            </div>
          </button>

          {/* Ретро Кино */}
          <button
            type="button"
            onClick={() => {
              sound.click();
              updateField('archetype', 'retro-cinema');
            }}
            className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
              config.archetype === 'retro-cinema'
                ? 'bg-amber-500/15 border-amber-400 ring-2 ring-amber-400/30'
                : 'bg-stone-900 border-stone-800 hover:border-stone-700'
            }`}
          >
            <div className="text-xs font-bold text-white flex items-center justify-between">
              <span>{t.creator.archetypes.retroCinema.title}</span>
              {config.archetype === 'retro-cinema' && (
                <Check className="w-3.5 h-3.5 text-amber-400" />
              )}
            </div>
            <div className="text-[11px] text-stone-400 mt-1">
              {t.creator.archetypes.retroCinema.desc}
            </div>
          </button>

          {/* Секретное Досье */}
          <button
            type="button"
            onClick={() => {
              sound.click();
              updateField('archetype', 'classified-dossier');
            }}
            className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
              config.archetype === 'classified-dossier'
                ? 'bg-red-500/15 border-red-400 ring-2 ring-red-400/30'
                : 'bg-stone-900 border-stone-800 hover:border-stone-700'
            }`}
          >
            <div className="text-xs font-bold text-white flex items-center justify-between">
              <span>{t.creator.archetypes.classifiedDossier.title}</span>
              {config.archetype === 'classified-dossier' && (
                <Check className="w-3.5 h-3.5 text-red-400" />
              )}
            </div>
            <div className="text-[11px] text-stone-400 mt-1">
              {t.creator.archetypes.classifiedDossier.desc}
            </div>
          </button>
        </div>
      </div>

      {/* 3. Тактильный жест на входе и поведение кнопки «Нет» */}
      <div className="bg-[#141210] border border-stone-800 rounded-3xl p-5 space-y-5 shadow-md">
        {/* Жест */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <Hand className="w-4 h-4 text-amber-400" />
            <span>{t.creator.step3Title}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { id: 'scratch' as TactileGesture, title: t.creator.gestures.scratch.title, desc: t.creator.gestures.scratch.desc },
              { id: 'seal' as TactileGesture, title: t.creator.gestures.seal.title, desc: t.creator.gestures.seal.desc },
              { id: 'ribbon' as TactileGesture, title: t.creator.gestures.ribbon.title, desc: t.creator.gestures.ribbon.desc },
              { id: 'fingerprint' as TactileGesture, title: t.creator.gestures.fingerprint.title, desc: t.creator.gestures.fingerprint.desc },
              { id: 'safe_dial' as TactileGesture, title: t.creator.gestures.safeDial.title, desc: t.creator.gestures.safeDial.desc },
            ].map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => {
                  sound.click();
                  updateField('gesture', g.id);
                }}
                className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                  config.gesture === g.id
                    ? 'bg-amber-500/10 border-amber-400 ring-2 ring-amber-400/30 text-white'
                    : 'bg-stone-900 border-stone-800 text-stone-300 hover:border-stone-700'
                }`}
              >
                <div className="text-xs font-bold">{g.title}</div>
                <div className="text-[10px] text-stone-500 mt-0.5">{g.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Поведение кнопки «Нет» */}
        <div className="space-y-3 pt-2 border-t border-stone-800/80">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <MousePointer className="w-4 h-4 text-amber-400" />
            <span>{t.creator.step4Title}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { id: 'runaway' as DodgeMode, title: t.creator.dodgeModes.runaway.title, desc: t.creator.dodgeModes.runaway.desc },
              { id: 'shrink' as DodgeMode, title: t.creator.dodgeModes.shrink.title, desc: t.creator.dodgeModes.shrink.desc },
              { id: 'clone' as DodgeMode, title: t.creator.dodgeModes.clone.title, desc: t.creator.dodgeModes.clone.desc },
              { id: 'morph' as DodgeMode, title: t.creator.dodgeModes.morph.title, desc: t.creator.dodgeModes.morph.desc },
              { id: 'teleport' as DodgeMode, title: t.creator.dodgeModes.teleport.title, desc: t.creator.dodgeModes.teleport.desc },
              { id: 'captcha' as DodgeMode, title: t.creator.dodgeModes.captcha.title, desc: t.creator.dodgeModes.captcha.desc },
            ].map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => {
                  sound.click();
                  updateField('dodgeMode', d.id);
                }}
                className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                  config.dodgeMode === d.id
                    ? 'bg-amber-500/10 border-amber-400 ring-2 ring-amber-400/30 text-white'
                    : 'bg-stone-900 border-stone-800 text-stone-300 hover:border-stone-700'
                }`}
              >
                <div className="text-xs font-bold">{d.title}</div>
                <div className="text-[10px] text-stone-500 mt-0.5">{d.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Варианты программы свидания (Еда, Напитки и Локации) */}
      <div className="bg-[#141210] border border-stone-800 rounded-3xl p-5 space-y-4 shadow-md">
        <div className="text-sm font-bold text-white flex items-center justify-between">
          <span>{t.creator.step5Title}</span>
        </div>

        {/* 1. ГАСТРОНОМИЯ (ЕДА) */}
        <div>
          <label className="text-xs font-semibold text-stone-300 uppercase block mb-1.5">
            {t.creator.treatsLabel} <span className="text-[10px] text-amber-400/80 font-normal lowercase">{t.creator.treatsHint}</span>
          </label>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {config.treats.map((tr, idx) => {
              const isSelected = selectedTreat ? selectedTreat === tr : idx === 0;
              return (
                <span
                  key={tr}
                  onClick={() => {
                    sound.click();
                    onSelectTreat?.(tr);
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs rounded-full border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500/20 border-amber-400 text-amber-200 ring-1 ring-amber-400/40 shadow-sm'
                      : 'bg-stone-900 border-stone-800 text-stone-300 hover:border-stone-700 hover:text-white'
                  }`}
                  title="Кликните, чтобы выбрать для превью в билете"
                >
                  <span className="font-medium">{tr}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeTreat(idx);
                    }}
                    className="text-stone-500 hover:text-rose-400 cursor-pointer p-0.5 rounded-full"
                    title="Удалить вариант"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              );
            })}
          </div>
          <div className="flex gap-2 items-center">
            <div className="flex-1">
              <Input
                value={newTreat}
                onChange={(e) => setNewTreat(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTreat()}
                placeholder={t.creator.addTreatPlaceholder}
              />
            </div>
            <Button size="sm" variant="secondary" onClick={addTreat} icon={<Plus className="w-3.5 h-3.5" />}>
              {t.creator.addButton}
            </Button>
          </div>
        </div>

        {/* 2. НАПИТКИ (ЧЕМ ЗАПИВАЕМ?) */}
        <div className="pt-2">
          <label className="text-xs font-semibold text-stone-300 uppercase block mb-1.5">
            {t.creator.drinksLabel} <span className="text-[10px] text-amber-400/80 font-normal lowercase">{t.creator.treatsHint}</span>
          </label>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {drinksList.map((d, idx) => {
              const isSelected = selectedDrink ? selectedDrink === d : idx === 0;
              return (
                <span
                  key={d}
                  onClick={() => {
                    sound.click();
                    onSelectDrink?.(d);
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs rounded-full border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500/20 border-amber-400 text-amber-200 ring-1 ring-amber-400/40 shadow-sm'
                      : 'bg-stone-900 border-stone-800 text-stone-300 hover:border-stone-700 hover:text-white'
                  }`}
                  title="Кликните, чтобы выбрать для превью в билете"
                >
                  <span className="font-medium">{d}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeDrink(idx);
                    }}
                    className="text-stone-500 hover:text-rose-400 cursor-pointer p-0.5 rounded-full"
                    title="Удалить вариант"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              );
            })}
          </div>
          <div className="flex gap-2 items-center">
            <div className="flex-1">
              <Input
                value={newDrink}
                onChange={(e) => setNewDrink(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addDrink()}
                placeholder={t.creator.addDrinkPlaceholder}
              />
            </div>
            <Button size="sm" variant="secondary" onClick={addDrink} icon={<Plus className="w-3.5 h-3.5" />}>
              {t.creator.addButton}
            </Button>
          </div>
        </div>

        {/* 3. ЛОКАЦИИ (МЕСТА ВСТРЕЧИ) */}
        <div className="pt-2">
          <label className="text-xs font-semibold text-stone-300 uppercase block mb-1.5">
            {t.creator.locationsLabel} <span className="text-[10px] text-amber-400/80 font-normal lowercase">{t.creator.treatsHint}</span>
          </label>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {config.locations.map((loc, idx) => {
              const isSelected = selectedLocation ? selectedLocation === loc : idx === 0;
              return (
                <span
                  key={loc}
                  onClick={() => {
                    sound.click();
                    onSelectLocation?.(loc);
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs rounded-full border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500/20 border-amber-400 text-amber-200 ring-1 ring-amber-400/40 shadow-sm'
                      : 'bg-stone-900 border-stone-800 text-stone-300 hover:border-stone-700 hover:text-white'
                  }`}
                  title="Кликните, чтобы выбрать для превью в билете"
                >
                  <span className="font-medium">{loc}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeLocation(idx);
                    }}
                    className="text-stone-500 hover:text-rose-400 cursor-pointer p-0.5 rounded-full"
                    title="Удалить вариант"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              );
            })}
          </div>
          <div className="flex gap-2 items-center">
            <div className="flex-1">
              <Input
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addLocation()}
                placeholder={t.creator.addLocationPlaceholder}
              />
            </div>
            <Button size="sm" variant="secondary" onClick={addLocation} icon={<Plus className="w-3.5 h-3.5" />}>
              {t.creator.addButton}
            </Button>
          </div>
        </div>
      </div>

      {/* 6. Условия романтического контракта */}
      <div className="bg-[#141210] border border-stone-800 rounded-3xl p-5 space-y-4 shadow-md">
        <div className="flex items-center gap-2 text-sm font-bold text-white">
          <FileText className="w-4 h-4 text-amber-400" />
          <span>{t.creator.step6Title}</span>
        </div>

        <p className="text-xs text-stone-400">
          {t.creator.contractSubtitle}
        </p>

        {/* Интерактивные чипсы условий */}
        <div className="flex flex-wrap gap-2">
          {Array.from(new Set([...presetContractTerms, ...activeContractTerms])).map((term) => {
            const isActive = activeContractTerms.includes(term);
            const isCustom = !presetContractTerms.includes(term);

            return (
              <span
                key={term}
                onClick={() => toggleContractTerm(term)}
                className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs rounded-full border transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-500/20 border-amber-400 text-amber-200 ring-1 ring-amber-400/40 shadow-sm'
                    : 'bg-stone-900 border-stone-800 text-stone-500 hover:border-stone-700 hover:text-stone-300'
                }`}
                title={isActive ? 'Условие включено (клик для отключения)' : 'Условие выключено (клик для включения)'}
              >
                {isActive ? (
                  <CheckSquare className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                ) : (
                  <Square className="w-3.5 h-3.5 text-stone-600 shrink-0" />
                )}
                <span className="font-medium">{term}</span>
                {isCustom && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeContractTerm(term);
                    }}
                    className="text-stone-500 hover:text-rose-400 cursor-pointer p-0.5 rounded-full ml-0.5"
                    title="Удалить условие"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </span>
            );
          })}
        </div>

        {/* Добавление кастомного условия */}
        <div className="flex gap-2 items-center pt-1">
          <div className="flex-1">
            <Input
              value={newContractTerm}
              onChange={(e) => setNewContractTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addContractTerm()}
              placeholder={t.creator.addContractTermPlaceholder}
            />
          </div>
          <Button size="sm" variant="secondary" onClick={addContractTerm} icon={<Plus className="w-3.5 h-3.5" />}>
            {t.creator.addButton}
          </Button>
        </div>
      </div>

      {/* 7. Секретное P.S. и Telegram автора */}
      <div className="bg-[#141210] border border-stone-800 rounded-3xl p-5 space-y-4 shadow-md">
        <div className="flex items-center gap-2 text-sm font-bold text-white">
          <Lock className="w-4 h-4 text-amber-400" />
          <span>{t.creator.step7Title}</span>
        </div>

        {/* Punchline-Студия и генератор стихов */}
        <PoetryStudio
          key={config.occasion}
          language={lang}
          onInsertPoem={(poem) => updateField('secretNote', poem)}
          defaultVibe={
            config.occasion === 'bro'
              ? 'bro'
              : config.occasion === 'peace'
              ? 'drama'
              : config.occasion === 'girls'
              ? 'rofl'
              : 'lyrics'
          }
        />

        <Input
          label={t.creator.secretNoteLabel}
          placeholder={t.creator.secretNotePlaceholder}
          value={config.secretNote}
          onChange={(e) => updateField('secretNote', e.target.value)}
          helperText={t.creator.secretNoteHelper}
        />

        <Input
          label={t.creator.telegramLabel}
          placeholder={t.creator.telegramPlaceholder}
          value={config.authorTelegram || config.creatorTelegram ? `@${(config.authorTelegram || config.creatorTelegram).replace(/^@+/, '')}` : ''}
          onChange={(e) => {
            const raw = e.target.value;
            const cleaned = raw.replace(/^@+/, '').trim();
            onChange({
              ...config,
              creatorTelegram: cleaned,
              authorTelegram: cleaned,
            });
          }}
          helperText={t.creator.telegramHelper}
          icon={<Send className="w-4 h-4" />}
        />
      </div>

      {/* Большая кнопка создания ссылки */}
      <div className="space-y-3 pt-2">
        <Button
          variant="gold"
          size="lg"
          fullWidth
          onClick={handleGenerateLink}
          icon={<Share2 className="w-5 h-5 text-stone-950" />}
        >
          {copied ? t.creator.linkCopied : t.creator.generateButton}
        </Button>

        {onPreviewFlow && (
          <Button
            variant="secondary"
            size="md"
            fullWidth
            onClick={onPreviewFlow}
            icon={<ExternalLink className="w-4 h-4 text-amber-400" />}
          >
            {t.creator.testFlowButton}
          </Button>
        )}
      </div>

      {/* Манифест и история создания проекта */}
      <AboutProject language={lang} />

      {/* Блок обратной связи («Есть идея или хочешь оставить отзыв?») */}
      <FeedbackForm language={lang} />

      {/* Модальное окно / карточка с QR-кодом и готовой ссылкой */}
      {showQRModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141210] border border-amber-500/40 rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setShowQRModal(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="inline-flex p-3 rounded-2xl bg-amber-400/10 text-amber-400">
              <QrCode className="w-8 h-8" />
            </div>

            <h3 className="text-lg font-bold text-white">
              {t.creator.qrTitle}
            </h3>

            <p className="text-xs text-stone-400">
              {config.occasion === 'bro'
                ? (lang === 'en' ? 'Send this link to your bro or show the QR code' : 'Отправь эту ссылку братишке или покажи QR-код на экране')
                : config.occasion === 'girls'
                ? (lang === 'en' ? 'Send this link to your bestie or show the QR code' : 'Отправь эту ссылку подруге или покажи QR-код на экране')
                : t.creator.qrSubtitle}
            </p>

            {/* QR-код */}
            <div className="p-4 bg-white rounded-2xl inline-block shadow-lg mx-auto">
              <QRCodeSVG value={shareUrl} size={180} />
            </div>

            {/* Кнопка уведомления */}
            <div className="pt-2 pb-2">
              <a
                href={`https://t.me/bezshansov_me_bot?start=ticket_${config.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-[#2AABEE] text-white text-xs font-bold shadow-lg hover:bg-[#229ED9] transition-all"
              >
                🔔 Уведомить в Telegram, когда подпишут
              </a>
            </div>

            {/* Поле со ссылкой и кнопка копирования */}
            <div className="flex gap-2">
              <input
                readOnly
                value={shareUrl}
                className="flex-1 bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-300 truncate"
              />
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(shareUrl);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>

            <div className="pt-2">
              <a
                href={shareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-1.5 py-3 rounded-xl bg-stone-900 border border-stone-800 text-stone-200 text-xs font-semibold hover:border-amber-400 hover:text-white transition-all"
              >
                <ExternalLink className="w-4 h-4 text-amber-400" />
                <span>{t.creator.openInNewTab}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
