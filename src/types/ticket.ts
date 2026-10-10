// ==========================================
// 📜 ТИПЫ ДАННЫХ И КОНФИГУРАЦИЯ БИЛЕТОВ
// ==========================================

export type TicketArchetype =
  | 'boarding-pass'
  | 'subpoena'
  | 'receipt'
  | 'bro-pass'
  | 'girls-pass'
  | 'retro-cinema'
  | 'classified-dossier';
export type TactileGesture = 'scratch' | 'ribbon' | 'seal' | 'fingerprint' | 'safe_dial';
export type DodgeMode = 'runaway' | 'shrink' | 'clone' | 'morph' | 'teleport' | 'captcha';
export type Occasion = 'romance' | 'bro' | 'girls' | 'peace';

export type AppLanguage = 'ru' | 'en';

/**
 * Конфигурация приглашения, создаваемая автором (зашивается в URL ?d=)
 */
export interface InvitationConfig {
  id: string;
  crushName: string;
  question: string;
  occasion?: Occasion;
  archetype: TicketArchetype;
  gesture: TactileGesture;
  dodgeMode: DodgeMode;
  creatorTelegram: string;
  authorTelegram?: string;
  telegramChatId?: string;
  secretNote: string;
  treats: string[];
  drinks: string[];
  locations: string[];
  paymentOptions: string[];
  subpoenaClause?: string;
  contractTerms?: string[];
  language?: AppLanguage;
  createdAt: number;
}

/**
 * Предустановленные напитки по умолчанию
 */
export const DEFAULT_DRINKS: string[] = [
  'Пиво 🍺',
  'Кола / Газировка 🥤',
  'Сидр 🍏',
  'Вино / Игристое 🍷',
  'Кофе / Чай ☕',
  'Сок / Вода 💧',
];

export const DEFAULT_DRINKS_EN: string[] = [
  'Beer 🍺',
  'Cola / Soda 🥤',
  'Cider 🍏',
  'Wine / Prosecco 🍷',
  'Coffee / Tea ☕',
  'Juice / Water 💧',
];

export const DEFAULT_BRO_DRINKS_RU: string[] = [
  'Пиво / Крафт 🍺',
  'Холодный квас 🍺',
  'Кола / Энергетик ⚡',
  'Чай / Кофе ☕',
  'Сок / Вода 💧',
];

export const DEFAULT_BRO_DRINKS_EN: string[] = [
  'Beer / Craft 🍺',
  'Cold cider / kvass 🍺',
  'Cola / Energy Drink ⚡',
  'Coffee / Tea ☕',
  'Juice / Water 💧',
];

export const DEFAULT_BRO_LOCATIONS_RU: string[] = [
  'Компьютерный клуб / PS5 🎮',
  'Спортбар / Паб 🍻',
  'Гараж / Шашлыки 🥩',
  'Кальянная / Лаундж 💨',
  'Бильярд / Боулинг 🎱',
  'Уютный диван и пицца 🍕',
];

export const DEFAULT_BRO_LOCATIONS_EN: string[] = [
  'PC Gaming Club / PS5 🎮',
  'Sports Bar / Pub 🍻',
  'Garage / BBQ 🥩',
  'Hookah / Lounge 💨',
  'Billiards / Bowling 🎱',
  'Couch & Pizza 🍕',
];

export const DEFAULT_BRO_PAYMENT_RU: string[] = [
  'Братский счёт (скидываемся)',
  'Инициатор поляны угощает',
  'Проигравший в плойку / фифу платит',
  'Цу-е-фа на весь чек',
];

export const DEFAULT_BRO_PAYMENT_EN: string[] = [
  'Split like bros (50/50)',
  'Host covers the tab',
  'Loser on FIFA/PS5 pays',
  'Rock-paper-scissors for the bill',
];

export const DEFAULT_CONTRACT_TERMS_RU: string[] = [
  'Без телефонов первые 40 минут 📵',
  'Опоздавший платит за десерт 🍰',
  'Никакого гостинга ✨',
  'Без разговоров о бывших 🚫',
  'Музыка в поездке — строго по очереди 🎶',
  'Минимум одно совместное селфи на память 📸',
  'Обнимашки при встрече обязательны 🫂',
  'Честный отзыв после встречи ⭐️',
];

export const DEFAULT_CONTRACT_TERMS_EN: string[] = [
  'No phones for first 40 min 📵',
  'Late arrival pays for dessert 🍰',
  'No ghosting ✨',
  'No exes talk 🚫',
  'Music playlist turns 🎶',
  'At least one photo together 📸',
  'Hugs upon arrival are mandatory 🫂',
  'Honest feedback after the date ⭐️',
];

export const DEFAULT_CONTRACT_TERMS_BRO_RU: string[] = [
  'Опоздавший на сбор проставляет напитки / закуски 🍻',
  'Слово пацана: явка железобетонная, без сливов 👊',
  'Телефоны экраном вниз — мы собрались общаться 📵',
  'Проигравший в плойку / фифу оплачивает поляну 🎮',
  'Разговоры чисто за жизнь, тачки, спорт и дела 🚗',
  'В катку до победного конца 🏆',
  'Что было на сборе — остаётся между нами 🤫',
  'Никакой духоты и жалоб на жизнь 🚫',
];

export const DEFAULT_CONTRACT_TERMS_BRO_EN: string[] = [
  'Late arrival buys the first round 🍻',
  'Ironclad bro code: no flaking allowed 👊',
  'Phones face down — real talk only 📵',
  'Loser on FIFA/PS5 pays for food 🎮',
  'Talk life, tech, gains and ventures 🚗',
  'Gaming till victory, sleep is optional 🏆',
  'What happens at the hangout stays with the squad 🤫',
  'Zero drama, good vibes only 🚫',
];

export const DEFAULT_CONTRACT_TERMS_GIRLS_RU: string[] = [
  'Все сплетни строго между нами 🤫',
  'Минимум 10 красивых фото для ленты 📸',
  'Без разговоров о токсичных бывших 🚫',
  'Опоздавшая угощает кофе / десертом ☕',
  'Искренние комплименты лукам обязательны ✨',
];

export const DEFAULT_CONTRACT_TERMS_GIRLS_EN: string[] = [
  'Gossip strictly stays between us 🤫',
  'At least 10 cute pics for the feed 📸',
  'No talk about toxic exes 🚫',
  'Late arrival buys coffee / dessert ☕',
  'Compliments on outfits are mandatory ✨',
];

export const DEFAULT_CONTRACT_TERMS_PEACE_RU: string[] = [
  'Безусловная амнистия всех взаимных обид 🕊️',
  'Слушаем друг друга без перебиваний 🤝',
  'Крепкие объятия при встрече 🫂',
  'Вкусный десерт в знак перемирия 🍰',
  'Старые ссоры больше никогда не вспоминаем 🚫',
];

export const DEFAULT_CONTRACT_TERMS_PEACE_EN: string[] = [
  'Total amnesty of past grievances 🕊️',
  'Listen to each other without interrupting 🤝',
  'Warm hugs upon meeting 🫂',
  'Sweet dessert as a peace offering 🍰',
  'Never bring up past arguments again 🚫',
];

export function getDefaultContractTerms(occasion?: Occasion, lang: AppLanguage = 'ru'): string[] {
  if (occasion === 'bro') {
    return lang === 'en' ? DEFAULT_CONTRACT_TERMS_BRO_EN : DEFAULT_CONTRACT_TERMS_BRO_RU;
  }
  if (occasion === 'girls') {
    return lang === 'en' ? DEFAULT_CONTRACT_TERMS_GIRLS_EN : DEFAULT_CONTRACT_TERMS_GIRLS_RU;
  }
  if (occasion === 'peace') {
    return lang === 'en' ? DEFAULT_CONTRACT_TERMS_PEACE_EN : DEFAULT_CONTRACT_TERMS_PEACE_RU;
  }
  return lang === 'en' ? DEFAULT_CONTRACT_TERMS_EN : DEFAULT_CONTRACT_TERMS_RU;
}

// ==========================================
// 🌐 ДВУСТОРОННИЙ СЛОВАРЬ ПЕРЕВОДА ПРЕСЕТОВ (RU <-> EN)
// Переводит еду, напитки, локации, оплату и условия на лету
// ==========================================

const PRESET_PAIRS: Array<[string, string]> = [
  // Еда (Romance)
  ['Роллы и суши', 'Rolls & sushi'],
  ['Пицца', 'Pizza'],
  ['Бургеры', 'Burgers'],
  ['Шаурма', 'Shawarma'],
  ['Тортик', 'Cake'],
  // Еда (Bro)
  ['Шаурма 🌯', 'Shawarma 🌯'],
  ['Бургеры 🍔', 'Burgers 🍔'],
  ['Пицца 🍕', 'Pizza 🍕'],
  ['Катка в PS5 🎮', 'PS5 Gaming 🎮'],
  ['Гараж и шашлык 🥩', 'Garage BBQ 🥩'],
  ['Шаурма, пицца и катка', 'Burgers, pizza & gaming'],
  // Еда (Girls)
  ['Матча-латте', 'Matcha latte'],
  ['Бранч и авокадо', 'Brunch & Avocado'],
  ['Паста', 'Pasta'],
  ['Шопинг', 'Shopping'],
  // Еда (Peace)
  ['Твой любимый десерт', 'Your favorite dessert'],
  ['Любой каприз за мой счет', 'Anything on my tab'],
  ['Кофе и объятия', 'Coffee & hugs'],

  // Напитки (Default & Romance)
  ['Пиво 🍺', 'Beer 🍺'],
  ['Кола / Газировка 🥤', 'Cola / Soda 🥤'],
  ['Сидр 🍏', 'Cider 🍏'],
  ['Вино / Игристое 🍷', 'Wine / Prosecco 🍷'],
  ['Кофе / Чай ☕', 'Coffee / Tea ☕'],
  ['Сок / Вода 💧', 'Juice / Water 💧'],
  // Напитки (Bro)
  ['Пиво / Крафт 🍺', 'Beer / Craft 🍺'],
  ['Холодный квас 🍺', 'Cold cider / kvass 🍺'],
  ['Кола / Энергетик ⚡', 'Cola / Energy Drink ⚡'],
  ['Чай / Кофе ☕', 'Tea / Coffee ☕'],
  // Напитки (Girls)
  ['Матча-латте 🍵', 'Matcha latte 🍵'],
  ['Просекко 🥂', 'Prosecco 🥂'],
  ['Коктейли 🍸', 'Cocktails 🍸'],
  ['Смузи 🍓', 'Smoothie 🍓'],
  ['Вода с лимоном 🍋', 'Water with lemon 🍋'],
  // Напитки (Peace)
  ['Горячий чай / Какао ☕', 'Hot tea / Cocoa ☕'],
  ['Вино перемирия 🍷', 'Peace wine 🍷'],
  ['Любимый кофе ☕', 'Favorite coffee ☕'],
  ['Сок 🧃', 'Juice 🧃'],

  // Локации (Default & Romance)
  ['Крыша / панорама', 'Rooftop / Panorama'],
  ['Панорамная крыша', 'Panoramic Rooftop'],
  ['Кино', 'Cinema'],
  ['Уютная кофейня', 'Cozy Cafe'],
  ['Ночной город', 'Night City Walk'],
  ['Набережная', 'Waterfront / Embankment'],
  ['Парк', 'Park'],
  // Локации (Bro)
  ['Компьютерный клуб / PS5 🎮', 'PC Gaming Club / PS5 🎮'],
  ['Спортбар / Паб 🍻', 'Sports Bar / Pub 🍻'],
  ['Гараж / Шашлыки 🥩', 'Garage / BBQ 🥩'],
  ['Кальянная / Лаундж 💨', 'Hookah / Lounge 💨'],
  ['Бильярд / Боулинг 🎱', 'Billiards / Bowling 🎱'],
  ['Уютный диван и пицца 🍕', 'Couch & Pizza 🍕'],
  ['Точка сбора', 'Squad HQ'],
  // Локации (Girls)
  ['Стильное кафе / Бранч', 'Cozy Cafe & Brunch'],
  ['Спа / Бьюти-день', 'Spa & Beauty Day'],
  ['Шопинг и молл', 'Shopping & Mall'],
  ['Винный бар', 'Wine Bar'],
  ['Пижамная вечеринка с кино', 'Movie Pajama Party'],
  // Локации (Peace)
  ['Наше любимое место', 'Our favorite spot'],
  ['Тихий парк для разговора', 'Quiet park bench'],
  ['Дома за вкусным ужином', 'At home with dessert'],

  // Оплата (Romance)
  ['Краш угощает', 'Crush treats'],
  ['Пополам (50/50)', 'Split (50/50)'],
  ['Битва у кассы', 'Battle at counter'],
  ['Цу-е-фа', 'Rock-paper-scissors'],
  // Оплата (Bro)
  ['Братский счёт (скидываемся)', 'Split like bros (50/50)'],
  ['Инициатор поляны угощает', 'Host covers the tab'],
  ['Проигравший в плойку / фифу платит', 'Loser on FIFA/PS5 pays'],
  ['Цу-е-фа на весь чек', 'Rock-paper-scissors for the bill'],
  ['Скидываемся', 'Splitting the bill'],
  ['Братский счёт', 'Split like bros'],
  // Оплата (Girls)
  ['Каждая за себя', 'Dutch bill'],
  ['Именинница отдыхает', 'Birthday girl relaxes'],
  ['Сегодня я угощаю подругу', 'I treat today'],
  ['Скидываемся пополам', 'Split 50/50'],
  // Оплата (Peace)
  ['Я угощаю (заглаживаю вину)', 'I pay (apology tab)'],
  ['Всё за мой счет 💳', 'My treat 100%'],
  ['Мирный компромисс', 'Compromise split'],

  // Условия контракта (Romance, Bro, Girls, Peace)
  ...DEFAULT_CONTRACT_TERMS_RU.map((ru, i): [string, string] => [ru, DEFAULT_CONTRACT_TERMS_EN[i]]),
  ...DEFAULT_CONTRACT_TERMS_BRO_RU.map((ru, i): [string, string] => [ru, DEFAULT_CONTRACT_TERMS_BRO_EN[i]]),
  ...DEFAULT_CONTRACT_TERMS_GIRLS_RU.map((ru, i): [string, string] => [ru, DEFAULT_CONTRACT_TERMS_GIRLS_EN[i]]),
  ...DEFAULT_CONTRACT_TERMS_PEACE_RU.map((ru, i): [string, string] => [ru, DEFAULT_CONTRACT_TERMS_PEACE_EN[i]]),

  // Вопросы, секретные записки и статьи повестки
  ['Пойдёшь со мной на свидание?', 'Will you go on a date with me?'],
  ['Брат, есть разговор государственной важности...', 'Bro, matter of national security...'],
  ['Бро, общий сбор пацанов сегодня?', 'Bro, are we rolling today?'],
  ['Любимая, пора обсудить все сплетни за неделю...', 'Bestie, time to spill the tea...'],
  ['Я был(а) не прав(а). Давай заключим мирный договор?', 'I was wrong. Shall we sign a peace treaty?'],
  [
    'Я давно хотел пригласить тебя. С тобой каждый момент особенный ❤️',
    'I have wanted to ask you out for so long. Every moment with you is special ❤️',
  ],
  [
    'Статья 105 УК РФ: Неосторожное похищение сердечка при отягчающих обстоятельствах (неотразимость). Апелляции не принимаются.',
    'Article 105: Reckless theft of heart with aggravating irresistible charm. No appeals.',
  ],
  [
    'Статья 228 УК Дружбы: Злостное игнорирование пацанского созвона.',
    'Section 228 Bro Code: Gross neglect of homie summons.',
  ],
  [
    'Статья 77: Критическая нехватка совместных фото и разговоров по душам.',
    'Section 77: Critical deficit of selfies & heart-to-heart chats.',
  ],
  [
    'Статья 1 УК Перемирия: Объявление безусловного перемирия, амнистия обид и сладкий десерт.',
    'Clause 1: Unconditional armistice, amnesty & sweet dessert.',
  ],
];

const RU_TO_EN_MAP = new Map<string, string>(PRESET_PAIRS);
const EN_TO_RU_MAP = new Map<string, string>(PRESET_PAIRS.map(([ru, en]) => [en, ru]));

/**
 * Переводит одиночное значение или список через запятую (например, несколько напитков)
 */
export function translateItem(text: string | undefined, targetLang: AppLanguage): string {
  if (!text) return '';
  const map = targetLang === 'en' ? RU_TO_EN_MAP : EN_TO_RU_MAP;
  if (map.has(text)) {
    return map.get(text)!;
  }
  // Если это строка с несколькими напитками через запятую: "Пиво 🍺, Сидр 🍏"
  if (text.includes(', ')) {
    return text
      .split(', ')
      .map((part) => {
        const trimmed = part.trim();
        return map.get(trimmed) || trimmed;
      })
      .join(', ');
  }
  return text;
}

/**
 * Переводит массив строк (еда, напитки, локации, оплата, условия) на целевой язык
 */
export function translateArray(items: string[] | undefined, targetLang: AppLanguage): string[] {
  if (!items || items.length === 0) return [];
  return items.map((item) => translateItem(item, targetLang));
}

/**
 * Полностью переводит все стандартные пресеты внутри конфигурации при переключении языка RU <-> EN
 */
export function translateConfig(config: InvitationConfig, targetLang: AppLanguage): InvitationConfig {
  return {
    ...config,
    language: targetLang,
    question: translateItem(config.question, targetLang),
    secretNote: translateItem(config.secretNote, targetLang),
    subpoenaClause: config.subpoenaClause ? translateItem(config.subpoenaClause, targetLang) : config.subpoenaClause,
    treats: translateArray(config.treats, targetLang),
    drinks: translateArray(config.drinks, targetLang),
    locations: translateArray(config.locations, targetLang),
    paymentOptions: translateArray(config.paymentOptions, targetLang),
    contractTerms:
      config.contractTerms && config.contractTerms.length > 0
        ? translateArray(config.contractTerms, targetLang)
        : [],
  };
}

/**
 * Данные, выбранные получателем в процессе прохождения флоу
 */
export interface RecipientResponse {
  accepted: boolean;
  date: string; // Формат "YYYY-MM-DD" или русское отображение
  time: string; // Формат "HH:MM"
  selectedTreat: string;
  selectedDrink?: string;
  selectedLocation: string;
  selectedPayment: string;
  signature?: string; // base64 холста подписи
  contractAccepted: Record<string, boolean>;
  secretRevealed: boolean;
}

/**
 * Полный стейт билета для рендера финального артефакта
 */
export interface TicketData {
  config: InvitationConfig;
  response: RecipientResponse;
  authorTelegram?: string;
  telegramChatId?: string;
}

