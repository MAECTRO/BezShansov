import LZString from 'lz-string';
import type { InvitationConfig, TicketData } from '../types/ticket';
import { DEFAULT_DRINKS } from '../types/ticket';

// ==========================================
// 🔗 СЖАТИЕ, ШЕРИНГ И КАЛЕНДАРЬ
// Zero-backend: всё состояние сериализуется в ?d=
// ==========================================

/**
 * Сжимает конфигурацию билета в безопасную строку для URL
 */
export function compressInvitation(config: InvitationConfig): string {
  try {
    const json = JSON.stringify(config);
    return LZString.compressToEncodedURIComponent(json);
  } catch (err) {
    console.error('Ошибка сжатия приглашения:', err);
    return '';
  }
}

/**
 * Распаковывает данные из URL-параметра ?d=
 */
export function decompressInvitation(encoded: string): InvitationConfig | null {
  try {
    if (!encoded) return null;
    const decompressed = LZString.decompressFromEncodedURIComponent(encoded);
    if (!decompressed) return null;
    const parsed = JSON.parse(decompressed) as InvitationConfig;
    if (!parsed.drinks || !Array.isArray(parsed.drinks) || parsed.drinks.length === 0) {
      parsed.drinks = [...DEFAULT_DRINKS];
    }
    return parsed;
  } catch (err) {
    console.error('Ошибка распаковки приглашения:', err);
    return null;
  }
}

export interface InvitationUrlParams {
  date?: string;
  time?: string;
  location?: string;
  selectedLocation?: string;
  treat?: string;
  selectedTreat?: string;
  drink?: string;
  selectedDrink?: string;
  author?: string;
  authorTelegram?: string;
}

/**
 * Генерирует полную ссылку на созданное приглашение со всеми параметрами билета
 */
export function generateInvitationUrl(
  config: InvitationConfig,
  extraParams?: InvitationUrlParams
): string {
  const d = compressInvitation(config);
  const cleanAuthor = (
    extraParams?.authorTelegram ||
    extraParams?.author ||
    config.authorTelegram ||
    config.creatorTelegram ||
    ''
  ).replace(/^(https?:\/\/)?(t\.me\/)?@?/i, '').trim();

  const loc =
    extraParams?.selectedLocation ||
    extraParams?.location ||
    config.locations?.[0] ||
    '';

  const trt =
    extraParams?.selectedTreat ||
    extraParams?.treat ||
    config.treats?.[0] ||
    '';

  const drk =
    extraParams?.selectedDrink ||
    extraParams?.drink ||
    (config.drinks && config.drinks[0]) ||
    '';

  const dt = extraParams?.date || '';
  const tm = extraParams?.time || '';

  const params = new URLSearchParams();
  if (d) params.set('d', d);
  if (cleanAuthor) params.set('author', cleanAuthor);
  if (config.telegramChatId) params.set('chatId', config.telegramChatId);
  if (loc) params.set('location', loc);
  if (trt) params.set('treat', trt);
  if (drk) params.set('drink', drk);
  if (dt) params.set('date', dt);
  if (tm) params.set('time', tm);
  if (config.language) params.set('lang', config.language);

  const queryString = params.toString();
  if (typeof window === 'undefined') return `?${queryString}`;
  const origin = window.location.origin;
  const pathname = window.location.pathname;
  return `${origin}${pathname}?${queryString}`;
}

/**
 * Формирует ссылку для прямого ответа создателю в Telegram
 */
export function generateTelegramReplyUrl(tgUsername: string, text: string): string {
  const cleanUsername = tgUsername.replace(/^(https?:\/\/)?(t\.me\/)?@?/i, '').trim();
  const encodedText = encodeURIComponent(text);
  if (!cleanUsername) {
    return `https://t.me/share/url?text=${encodedText}`;
  }
  return `https://t.me/${cleanUsername}?text=${encodedText}`;
}

/**
 * Преобразует строковые дату и время в реальные Date с корректным переходом через полночь
 */
export function parseEventDates(dateStr?: string, timeStr?: string, durationHours = 2.5) {
  const [y, m, d] = (dateStr || '').split('-').map(Number);
  const [h, min] = (timeStr || '').split(':').map(Number);

  const now = new Date();
  const year = !isNaN(y) && y > 2000 ? y : now.getFullYear();
  const month = !isNaN(m) && m >= 1 && m <= 12 ? m - 1 : now.getMonth();
  const day = !isNaN(d) && d >= 1 && d <= 31 ? d : now.getDate();
  const hours = !isNaN(h) && h >= 0 && h < 24 ? h : 19;
  const minutes = !isNaN(min) && min >= 0 && min < 60 ? min : 0;

  const startDate = new Date(year, month, day, hours, minutes, 0);
  const endDate = new Date(startDate.getTime() + durationHours * 3600 * 1000);

  const formatIso = (date: Date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const mi = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');
    return `${yyyy}${mm}${dd}T${hh}${mi}${ss}`;
  };

  return {
    startDate,
    endDate,
    startIso: formatIso(startDate),
    endIso: formatIso(endDate),
  };
}

const RUSSIAN_MONTHS_GENITIVE = [
  'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
];

const ENGLISH_MONTHS_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

/**
 * Преобразует ISO дату "2026-10-14" в понятную человеку форму "14 октября 2026 г." или "Oct 14, 2026"
 */
export function formatRussianDate(dateStr?: string, lang: 'ru' | 'en' = 'ru'): string {
  if (!dateStr) return lang === 'en' ? 'Soon' : 'Скоро';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parts[0];
      const monthIdx = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      if (monthIdx >= 0 && monthIdx < 12 && !isNaN(day)) {
        if (lang === 'en') {
          return `${ENGLISH_MONTHS_SHORT[monthIdx]} ${day}, ${year}`;
        }
        return `${day} ${RUSSIAN_MONTHS_GENITIVE[monthIdx]} ${year} г.`;
      }
    }
  } catch {}
  return dateStr;
}

/**
 * Генерирует ссылку для добавления свидания в Google Календарь
 */
export function generateGoogleCalendarUrl(ticket: TicketData): string {
  const { config, response } = ticket;
  const isBro = config.occasion === 'bro';
  const isGirls = config.occasion === 'girls';
  const isPeace = config.occasion === 'peace';
  const isEn = config.language === 'en';

  const title = isBro
    ? (isEn ? `Bro hangout with ${config.crushName || 'the squad'} 👊` : `Братский сбор с ${config.crushName || 'Бро'} 👊`)
    : isGirls
    ? (isEn ? `Girls night with ${config.crushName || 'Bestie'} 💅` : `Девичник с ${config.crushName || 'Подругой'} 💅`)
    : isPeace
    ? (isEn ? `Peace meeting with ${config.crushName || 'Special One'} 🕊️` : `Мирная встреча с ${config.crushName || 'Любимым человеком'} 🕊️`)
    : (isEn ? `Date with ${config.crushName || 'Crush'} ❤️` : `Свидание с ${config.crushName || 'Крашем'} ❤️`);

  const details = isBro
    ? `План пацанского сбора:\nЛокация: ${response.selectedLocation || 'Секретная точка'}\nПоляна: ${response.selectedTreat || 'Выбрано'}${response.selectedDrink ? `\nНапитки: ${response.selectedDrink}` : ''}\nСчёт: ${response.selectedPayment || 'По договоренности'}`
    : `План встречи:\nЛокация: ${response.selectedLocation || 'Сюрприз'}\nЕда: ${response.selectedTreat || 'Выбрано'}${response.selectedDrink ? `\nНапитки: ${response.selectedDrink}` : ''}\nОплата: ${response.selectedPayment || 'По договоренности'}`;

  const { startIso, endIso } = parseEventDates(response.date, response.time, 2.5);

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    details: details,
    location: response.selectedLocation || 'Город',
    dates: `${startIso}/${endIso}`,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Генерирует и скачивает универсальный файл события .ics (Apple, Outlook, Android)
 */
export function downloadICSFile(ticket: TicketData) {
  const { config, response } = ticket;
  const isBro = config.occasion === 'bro';
  const isGirls = config.occasion === 'girls';
  const isPeace = config.occasion === 'peace';
  const isEn = config.language === 'en';

  const title = isBro
    ? (isEn ? `Bro hangout with ${config.crushName || 'the squad'} 👊` : `Братский сбор с ${config.crushName || 'Бро'} 👊`)
    : isGirls
    ? (isEn ? `Girls night with ${config.crushName || 'Bestie'} 💅` : `Девичник с ${config.crushName || 'Подругой'} 💅`)
    : isPeace
    ? (isEn ? `Peace meeting with ${config.crushName || 'Special One'} 🕊️` : `Мирная встреча с ${config.crushName || 'Любимым человеком'} 🕊️`)
    : (isEn ? `Date with ${config.crushName || 'Crush'} ❤️` : `Свидание с ${config.crushName || 'Крашем'} ❤️`);

  const details = isBro
    ? `План сбора:\\nЛокация: ${response.selectedLocation || 'Секретная точка'}\\nПоляна: ${response.selectedTreat || 'Выбрано'}${response.selectedDrink ? `\\nНапитки: ${response.selectedDrink}` : ''}\\nСчет: ${response.selectedPayment || 'По договоренности'}`
    : `План встречи:\\nЛокация: ${response.selectedLocation || 'Сюрприз'}\\nЕда: ${response.selectedTreat || 'Выбрано'}${response.selectedDrink ? `\\nНапитки: ${response.selectedDrink}` : ''}\\nСчет: ${response.selectedPayment || 'По договоренности'}`;

  const reminderText = isBro
    ? 'Напоминание: Пацанский сбор через 2 часа! 👊'
    : 'Напоминание: Встреча через 2 часа!';

  const { startIso, endIso } = parseEventDates(response.date, response.time, 2.5);

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//BezShansov//Date Ticket//RU',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `SUMMARY:${title}`,
    `DESCRIPTION:${details}`,
    `LOCATION:${response.selectedLocation || 'Вместе'}`,
    `DTSTART:${startIso}`,
    `DTEND:${endIso}`,
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-PT2H',
    'ACTION:DISPLAY',
    `DESCRIPTION:${reminderText}`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', `date-${config.crushName?.toLowerCase() || 'ticket'}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
