import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import { toPng } from 'html-to-image';
import {
  Send,
  Calendar,
  Download,
  Share2,
  CheckSquare,
  Square,
  PenTool,
  RotateCcw,
  Clock,
  Coins,
} from 'lucide-react';
import type { TicketData, AppLanguage } from '../../types/ticket';
import {
  getDefaultContractTerms,
  translateItem,
  translateArray,
} from '../../types/ticket';
import { BoardingPass } from '../ticket-artifacts/BoardingPass';
import { Subpoena } from '../ticket-artifacts/Subpoena';
import { Receipt } from '../ticket-artifacts/Receipt';
import { BroPass } from '../ticket-artifacts/BroPass';
import { GirlsPass } from '../ticket-artifacts/GirlsPass';
import { RetroCinema } from '../ticket-artifacts/RetroCinema';
import { ClassifiedDossier } from '../ticket-artifacts/ClassifiedDossier';
import { Button } from '../ui/Button';
import { sound } from '../../utils/audio';
import { fireTicketCelebration } from '../../utils/confetti';
import {
  generateGoogleCalendarUrl,
  downloadICSFile,
  parseEventDates,
  formatRussianDate,
} from '../../utils/share';
import { APP_CONFIG } from '../../config/appConfig';
import { TRANSLATIONS } from '../../locales/translations';
import { notifyAuthorOnRSVP } from '../../services/telegramService';

// ==========================================
// 🎟️ ШАГ 5: ФИНАЛЬНЫЙ БИЛЕТ-АРТЕФАКТ
// Таймер, подпись, монетка, чекбоксы и экспорт
// ==========================================

export interface Step5TicketProps {
  ticket: TicketData;
  language?: AppLanguage;
  onUpdateTicket?: (updated: TicketData) => void;
  onBackToEdit?: () => void;
}

export const Step5_Ticket: React.FC<Step5TicketProps> = ({
  ticket,
  language,
  onUpdateTicket,
  onBackToEdit,
}) => {
  const { config, response } = ticket;
  const lang: AppLanguage = language || config.language || 'ru';
  const t = TRANSLATIONS[lang];

  const ticketRef = useRef<HTMLDivElement | null>(null);
  const sigCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Состояние живого обратного отсчета
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPassed: false,
  });

  const isBro = config.occasion === 'bro';

  // Динамические условия романтического контракта / пакта
  const presetTerms = getDefaultContractTerms(config.occasion, lang);
  const activeTerms =
    config.contractTerms !== undefined
      ? translateArray(config.contractTerms, lang)
      : presetTerms;

  const [rawContractTerms, setContractTerms] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    activeTerms.forEach((term) => {
      // По ТЗ: получатель САМ выбирает условия (не отмечены по умолчанию!)
      initial[term] = Boolean(response.contractAccepted?.[term]);
    });
    return initial;
  });

  const contractTerms: Record<string, boolean> = {};
  Object.entries(rawContractTerms).forEach(([k, v]) => {
    contractTerms[translateItem(k, lang)] = v;
  });

  // Скретч монетки для P.S.
  const [psRevealed, setPsRevealed] = useState(response.secretRevealed || false);

  // Рисование подписи
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(Boolean(response.signature));
  const [isExporting, setIsExporting] = useState(false);

  // Всплывающий тост и защита от повторной отправки в Telegram
  const [showToast, setShowToast] = useState(false);
  const telegramNotifiedRef = useRef(false);

  const cleanAuthorTg = (
    ticket.authorTelegram ||
    config.authorTelegram ||
    config.creatorTelegram ||
    ''
  ).replace(/^@+/, '').trim();

  const displayDate = formatRussianDate(response.date, lang) || response.date || 'Скоро';
  const displayTime = response.time || '19:30';
  const location = response.selectedLocation || (lang === 'en' ? 'Secret spot' : 'Секретное место');
  const treat = response.selectedTreat || (lang === 'en' ? 'Treats' : 'Вкусняшки');

  const ticketData = {
    date: displayDate,
    time: displayTime,
    location: location,
    treat: treat,
    drink: response.selectedDrink || '',
    authorTelegram: cleanAuthorTg,
  };

  const sendTelegramNotification = () => {
    if (telegramNotifiedRef.current) return;
    telegramNotifiedRef.current = true;

    const rules = Object.entries(contractTerms)
      .filter(([, accepted]) => accepted)
      .map(([term]) => term);

    const targetChatId = (
      config.telegramChatId ||
      ticket.telegramChatId ||
      ''
    ).trim();

    if (targetChatId) {
      notifyAuthorOnRSVP({
        guestName: config.crushName || '',
        date: ticketData.date,
        time: ticketData.time,
        location: ticketData.location,
        treat: ticketData.treat,
        drink: ticketData.drink,
        rules,
        secretNote: config.secretNote,
        chatId: targetChatId,
      });
    }

    // Уведомление на бекенд (Админу и Автору)
    fetch('/api/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'TICKET_SIGNED',
        payload: {
          ticketId: config.id,
          guestName: config.crushName || '',
          date: ticketData.date,
          time: ticketData.time,
          location: ticketData.location,
          food: ticketData.treat,
          drinks: ticketData.drink,
          conditions: rules.length > 0 ? rules.join(', ') : 'Стандартные',
        }
      })
    }).catch(console.error);

    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3500);
  };

  const handleConfirmAndNotify = () => {
    sound.celebration();

    const currentTicketUrl = typeof window !== 'undefined' ? window.location.href : '';

    // 1. Формирует текст со ссылкой на просмотр текущего билета
    const replyText =
      isBro
        ? (lang === 'en'
            ? `Bro, count me in! 👊 Bro pact signed!\n📅 ${ticketData.date} at ${ticketData.time}\n📍 ${ticketData.location}\nCheck our pact: ${currentTicketUrl} 🍻`
            : `Брат, я в деле! 👊 Пакт подписан!\n📅 ${ticketData.date} в ${ticketData.time}\n📍 ${ticketData.location}\nЗацени наш пакт: ${currentTicketUrl} 🍻`)
        : (lang === 'en'
            ? `I said YES to the date! 🎟️ Ticket signed!\n📅 ${ticketData.date} at ${ticketData.time}\n📍 ${ticketData.location}\nView our ticket: ${currentTicketUrl} ✍️❤️`
            : `Я согласна на свидание! 🎟️ Билет подписан!\n📅 ${ticketData.date} в ${ticketData.time}\n📍 ${ticketData.location}\nПосмотреть наш билет: ${currentTicketUrl} ✍️❤️`);

    const cleanAuthor = (ticketData.authorTelegram || '').replace(/^(https?:\/\/)?(t\.me\/)?@?/i, '').trim();
    const authorChatUrl = cleanAuthor
      ? `https://t.me/${cleanAuthor}?text=${encodeURIComponent(replyText)}`
      : `https://t.me/share/url?text=${encodeURIComponent(replyText)}`;

    window.open(authorChatUrl, '_blank');

    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3500);
  };

  const handleSendTelegramNotification = handleConfirmAndNotify;

  // 1. ЖИВОЙ ТАЙМЕР ОБРАТНОГО ОТСЧЕТА (setInterval 1000мс)
  useEffect(() => {
    const calculateTime = () => {
      const datePart = response.date || new Date().toISOString().split('T')[0];
      const timePart = response.time || '19:00';
      const { startDate } = parseEventDates(datePart, timePart);
      const now = new Date();
      const diff = startDate.getTime() - now.getTime();

      if (isNaN(diff) || diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPassed: true });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds, isPassed: false });
    };

    calculateTime();
    const timerId = setInterval(calculateTime, 1000);
    return () => clearInterval(timerId);
  }, [response.date, response.time]);

  // 2. ИНТЕРАКТИВНЫЙ ХОЛСТ ПОДПИСИ
  useEffect(() => {
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const getCanvasCoords = (clientX: number, clientY: number) => {
    const canvas = sigCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / (rect.width || 1);
    const scaleY = canvas.height / (rect.height || 1);
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const startSign = (clientX: number, clientY: number) => {
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const coords = getCanvasCoords(clientX, clientY);
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    setIsDrawing(true);
  };

  const drawSign = (clientX: number, clientY: number) => {
    if (!isDrawing) return;
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const coords = getCanvasCoords(clientX, clientY);
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopSign = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    sound.click();
    const canvas = sigCanvasRef.current;
    if (canvas && onUpdateTicket) {
      const dataUrl = canvas.toDataURL();
      onUpdateTicket({
        ...ticket,
        response: {
          ...ticket.response,
          signature: dataUrl,
        },
      });
      // При завершении подписи автоматически уведомляем автора в Telegram
      sendTelegramNotification();
    }
  };

  const clearSign = () => {
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
    sound.click();
    if (onUpdateTicket) {
      onUpdateTicket({
        ...ticket,
        response: {
          ...ticket.response,
          signature: undefined,
        },
      });
    }
  };

  // 3. ОТКРЫТИЕ СЕКРЕТНОГО P.S. (СКРЕТЧ МОНЕТКИ)
  const revealSecretPS = () => {
    if (psRevealed) return;
    sound.coin();
    if (navigator.vibrate) navigator.vibrate([40, 30, 70]);
    setPsRevealed(true);
    if (onUpdateTicket) {
      onUpdateTicket({
        ...ticket,
        response: {
          ...ticket.response,
          secretRevealed: true,
        },
      });
    }
  };

  // 4. ПЕРЕКЛЮЧЕНИЕ ЧЕКБОКСОВ
  const toggleTerm = (term: string) => {
    sound.click();
    const updated = { ...contractTerms, [term]: !contractTerms[term] };
    setContractTerms(updated);
    if (onUpdateTicket) {
      onUpdateTicket({
        ...ticket,
        response: {
          ...ticket.response,
          contractAccepted: updated,
        },
      });
    }
  };

  // 5. ЭКСПОРТ В PNG С ИДЕАЛЬНЫМ ШРИФТОМ (NATIVE TO-PNG)
  const handleDownloadPNG = async () => {
    if (!ticketRef.current) return;
    try {
      setIsExporting(true);
      sound.click();
      fireTicketCelebration();

      // Нативный рендеринг через SVG ForeignObject для идеального качества без обрезания букв
      let dataUrl: string;
      try {
        dataUrl = await toPng(ticketRef.current, {
          cacheBust: true,
          quality: 1.0,
          pixelRatio: 2.5,
          backgroundColor: '#0C0A09',
        });
      } catch (toPngErr) {
        console.warn('Fallback to html2canvas:', toPngErr);
        const canvas = await html2canvas(ticketRef.current, {
          backgroundColor: '#0C0A09',
          scale: 2,
          useCORS: true,
          allowTaint: true,
          logging: false,
        });
        dataUrl = canvas.toDataURL('image/png');
      }

      const link = document.createElement('a');
      link.download = `date-ticket-${config.crushName ? config.crushName.toLowerCase().replace(/\s+/g, '-') : 'bez-shansov'}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Ошибка экспорта билета в PNG:', err);
    } finally {
      setIsExporting(false);
    }
  };

  // 6. ЭКСПОРТ В STORIES 9:16
  const handleStoriesExport = async () => {
    if (!ticketRef.current) return;
    try {
      setIsExporting(true);
      sound.click();
      fireTicketCelebration();

      // Создаем временную контейнерную обертку формата 9:16
      const clone = ticketRef.current.cloneNode(true) as HTMLElement;
      const wrapper = document.createElement('div');
      wrapper.style.width = '1080px';
      wrapper.style.height = '1920px';
      wrapper.style.position = 'fixed';
      wrapper.style.left = '0';
      wrapper.style.top = '0';
      wrapper.style.zIndex = '-9999';
      wrapper.style.opacity = '1';
      wrapper.style.pointerEvents = 'none';
      wrapper.style.background = '#0C0A09';
      wrapper.style.backgroundImage = 'radial-gradient(circle at center, rgba(180,83,9,0.3) 0%, #0C0A09 75%)';
      wrapper.style.display = 'flex';
      wrapper.style.flexDirection = 'column';
      wrapper.style.alignItems = 'center';
      wrapper.style.justifyContent = 'center';
      wrapper.style.gap = '36px';
      wrapper.style.padding = '60px 40px';
      wrapper.style.boxSizing = 'border-box';

      // Добавляем штамп «УТВЕРЖДЕНО»
      const stamp = document.createElement('div');
      stamp.innerHTML = lang === 'en' ? '★ OFFICIALLY APPROVED ★' : '★ ОФИЦИАЛЬНО УТВЕРЖДЕНО ★';
      stamp.style.fontFamily = 'monospace';
      stamp.style.fontSize = '26px';
      stamp.style.fontWeight = '900';
      stamp.style.color = '#F59E0B';
      stamp.style.border = '4px solid #F59E0B';
      stamp.style.padding = '12px 36px';
      stamp.style.borderRadius = '18px';
      stamp.style.marginBottom = '0';
      stamp.style.transform = 'rotate(-2.5deg)';
      stamp.style.letterSpacing = '4px';
      stamp.style.background = 'rgba(245, 158, 11, 0.12)';
      stamp.style.boxShadow = '0 0 25px rgba(245, 158, 11, 0.25)';

      clone.style.width = '840px';
      clone.style.maxWidth = '840px';
      clone.style.transform = 'none';

      wrapper.appendChild(stamp);
      wrapper.appendChild(clone);
      document.body.appendChild(wrapper);

      const dataUrl = await toPng(wrapper, { quality: 0.95, skipFonts: true });
      document.body.removeChild(wrapper);

      const link = document.createElement('a');
      link.download = `stories-ticket-${config.crushName || 'vip'}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Ошибка экспорта Stories:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="relative w-full h-full p-4 sm:p-5 pb-14 select-none space-y-6">
      {/* Тост уведомления автора о согласии */}
      {showToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 max-w-[92vw] px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-stone-950 font-black text-xs sm:text-sm shadow-[0_10px_35px_rgba(245,158,11,0.7)] border-2 border-amber-200 flex items-center gap-2 animate-bounce">
          <span>{t.recipient.step5.authorNotifiedToast}</span>
        </div>
      )}

      {/* 1. Живой таймер обратного отсчета */}
      <div className="bg-[#141210] border border-amber-500/30 rounded-2xl p-3.5 shadow-lg text-center">
        <div className="flex items-center justify-center gap-1.5 text-xs font-mono uppercase text-amber-400 font-bold mb-1.5">
          <Clock className="w-3.5 h-3.5" />
          <span>
            {isBro
              ? (lang === 'en' ? 'COUNTDOWN TO SQUAD GATHERING:' : 'ДО ПАЦАНСКОГО СБОРА ОСТАЛОСЬ:')
              : t.recipient.step5.countdownTitle}
          </span>
        </div>

        <div className="flex items-center justify-center gap-2 font-mono">
          <div className="bg-stone-900 px-2 py-1.5 rounded-lg border border-stone-800">
            <span className="text-base sm:text-lg font-black text-white">
              {String(timeLeft.days).padStart(2, '0')}
            </span>
            <span className="block text-[8px] text-stone-500">{t.recipient.step5.days}</span>
          </div>
          <span className="text-amber-500 font-bold">:</span>
          <div className="bg-stone-900 px-2 py-1.5 rounded-lg border border-stone-800">
            <span className="text-base sm:text-lg font-black text-white">
              {String(timeLeft.hours).padStart(2, '0')}
            </span>
            <span className="block text-[8px] text-stone-500">{t.recipient.step5.hours}</span>
          </div>
          <span className="text-amber-500 font-bold">:</span>
          <div className="bg-stone-900 px-2 py-1.5 rounded-lg border border-stone-800">
            <span className="text-base sm:text-lg font-black text-white">
              {String(timeLeft.minutes).padStart(2, '0')}
            </span>
            <span className="block text-[8px] text-stone-500">{t.recipient.step5.minutes}</span>
          </div>
          <span className="text-amber-500 font-bold">:</span>
          <div className="bg-stone-900 px-2 py-1.5 rounded-lg border border-stone-800">
            <span className="text-base sm:text-lg font-black text-amber-400">
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
            <span className="block text-[8px] text-stone-500">{t.recipient.step5.seconds}</span>
          </div>
        </div>
      </div>

      {/* 2. Контейнер физического билета-артефакта для рендера и скачивания */}
      <div ref={ticketRef} className="w-full transition-transform">
        {config.archetype === 'boarding-pass' && <BoardingPass ticket={ticket} />}
        {config.archetype === 'subpoena' && <Subpoena ticket={ticket} />}
        {config.archetype === 'receipt' && <Receipt ticket={ticket} />}
        {config.archetype === 'bro-pass' && <BroPass ticket={ticket} />}
        {config.archetype === 'girls-pass' && <GirlsPass ticket={ticket} />}
        {config.archetype === 'retro-cinema' && <RetroCinema ticket={ticket} />}
        {config.archetype === 'classified-dossier' && <ClassifiedDossier ticket={ticket} />}
      </div>

      {/* 3. Секретное P.S. (Скретч-слой монетки) */}
      <div className="bg-[#141210] border border-stone-800 rounded-2xl p-4 text-left space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-stone-400 uppercase font-semibold flex items-center gap-1.5">
            <Coins className="w-4 h-4 text-amber-400" />
            {t.recipient.step5.secretPsTitle}
          </span>
          {!psRevealed && (
            <span className="text-[10px] text-amber-400 font-mono animate-pulse">
              [{t.recipient.step5.scratchCoinHint}]
            </span>
          )}
        </div>

        {psRevealed ? (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs italic font-serif leading-relaxed animate-fade-in whitespace-pre-line">
            «{config.secretNote ||
              (isBro
                ? (lang === 'en' ? 'Bro code confirmed. See you soon!' : 'Слово пацана скреплено. До встречи на сборе!')
                : (lang === 'en' ? 'I really like you. See you soon!' : 'Ты мне безумно нравишься. До встречи!'))}»
          </div>
        ) : (
          <button
            type="button"
            onClick={revealSecretPS}
            className="w-full py-3.5 rounded-xl bg-stone-900 border border-amber-500/40 hover:bg-stone-850 flex items-center justify-center gap-2 text-xs text-amber-300 font-bold cursor-pointer active:scale-95 transition-all shadow-inner"
          >
            <span className="text-lg">🪙</span>
            <span>{t.recipient.step5.scratchCoinSub}</span>
          </button>
        )}
      </div>

      {/* 4. Интерактивная подпись пальцем/мышкой */}
      <div className="bg-[#141210] border border-stone-800 rounded-2xl p-4 text-left space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-stone-400 uppercase font-semibold flex items-center gap-1.5">
            <PenTool className="w-4 h-4 text-amber-400" />
            {isBro
              ? (lang === 'en' ? 'Bro code confirmation (signature):' : 'Фиксация словом пацана (роспись):')
              : t.recipient.step5.signatureTitle}
          </span>
          {hasSignature && (
            <button
              type="button"
              onClick={clearSign}
              className="text-[10px] text-stone-500 hover:text-rose-400 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              {t.recipient.step5.clearSign}
            </button>
          )}
        </div>

        <div className="relative w-full h-24 bg-stone-950 rounded-xl border border-dashed border-stone-800 overflow-hidden">
          <canvas
            ref={sigCanvasRef}
            width={340}
            height={96}
            style={{ touchAction: 'none' }}
            className="w-full h-full cursor-crosshair touch-none select-none"
            onMouseDown={(e) => startSign(e.clientX, e.clientY)}
            onMouseMove={(e) => drawSign(e.clientX, e.clientY)}
            onMouseUp={stopSign}
            onMouseLeave={stopSign}
            onTouchStart={(e) => {
              const t = e.touches[0];
              if (t) startSign(t.clientX, t.clientY);
            }}
            onTouchMove={(e) => {
              const t = e.touches[0];
              if (t) drawSign(t.clientX, t.clientY);
            }}
            onTouchEnd={stopSign}
          />
          {!hasSignature && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-[11px] text-stone-600 font-mono">
              {isBro
                ? (lang === 'en' ? 'Sign here bro ✍️' : 'Чиркани росчерк или подпись пальцем ✍️')
                : t.recipient.step5.signPlaceholder}
            </div>
          )}
        </div>
      </div>

      {/* 5. Условия контракта (Динамические Чекбоксы) */}
      <div className="bg-[#141210] border border-stone-800 rounded-2xl p-4 text-left space-y-2.5">
        <span className="text-xs font-mono text-stone-400 uppercase font-semibold block mb-1">
          {isBro
            ? (lang === 'en' ? 'BRO PACT TERMS 👊 (CHOOSE YOUR CONDITIONS):' : 'ПУНКТЫ ПАЦАНСКОГО ДОГОВОРА 👊 (ВЫБЕРИ СВОИ УСЛОВИЯ):')
            : t.recipient.step5.contractTitle}
        </span>

        {activeTerms.map((term) => {
          const isChecked = Boolean(contractTerms[term]);
          return (
            <button
              key={term}
              type="button"
              onClick={() => toggleTerm(term)}
              className="w-full flex items-center gap-2.5 text-xs text-stone-300 hover:text-white cursor-pointer text-left transition-colors"
            >
              {isChecked ? (
                <CheckSquare className="w-4 h-4 text-amber-400 shrink-0" />
              ) : (
                <Square className="w-4 h-4 text-stone-600 shrink-0" />
              )}
              <span>{term}</span>
            </button>
          );
        })}
      </div>

      {/* 6. Кнопки действий (Шеринг, Календарь, Скачивание, Stories) */}
      <div className="space-y-3 pt-2">
        {/* а) Кнопка «📸 Скачать билет (PNG)» */}
        <Button
          variant="secondary"
          size="lg"
          fullWidth
          onClick={handleDownloadPNG}
          disabled={isExporting}
          className="border-amber-500/30 hover:border-amber-400 font-bold text-amber-200 hover:text-white transition-all shadow-md active:scale-[0.98]"
        >
          {isExporting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin">⏳</span>
              <span>{lang === 'en' ? 'Capturing ticket...' : 'Снимок билета...'}</span>
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2 text-sm sm:text-base">
              <span>📸</span>
              <span>{t.recipient.step5.downloadPng}</span>
            </span>
          )}
        </Button>

        {/* б) Кнопка «Ответить в Telegram ✈️» */}
        <button
          type="button"
          onClick={handleSendTelegramNotification}
          className="w-full inline-flex items-center justify-center font-black text-sm sm:text-base py-4 px-6 rounded-2xl bg-gradient-to-r from-sky-400 via-sky-500 to-blue-600 text-white shadow-xl shadow-sky-500/30 hover:brightness-110 active:scale-[0.98] transition-all gap-2 cursor-pointer border border-sky-300/40"
        >
          <Send className="w-5 h-5 fill-white" />
          <span>{t.recipient.step5.replyTelegram}</span>
        </button>

        {/* Дополнительно: Календарь и Stories */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <a
            href={generateGoogleCalendarUrl(ticket)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => sound.click()}
            className="py-2.5 px-3 rounded-xl bg-stone-900 border border-stone-800 hover:border-amber-500/50 text-stone-300 text-xs font-semibold flex items-center justify-center gap-2 text-center transition-all"
          >
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.recipient.step5.googleCalendar}</span>
          </a>

          <Button
            variant="gold"
            size="md"
            onClick={handleStoriesExport}
            disabled={isExporting}
            icon={<Share2 className="w-3.5 h-3.5" />}
          >
            {t.recipient.step5.toStories}
          </Button>
        </div>

        {/* Скачивание .ics */}
        <button
          type="button"
          onClick={() => {
            sound.click();
            downloadICSFile(ticket);
          }}
          className="w-full py-2 px-3 rounded-xl bg-stone-900/60 border border-stone-800/80 hover:border-stone-700 text-stone-400 hover:text-stone-200 text-[11px] font-mono flex items-center justify-center gap-1.5 cursor-pointer transition-all"
        >
          <Download className="w-3 h-3 text-amber-400" />
          <span>{t.recipient.step5.downloadIcs} (Apple / Outlook)</span>
        </button>

        {/* Возможность изменить параметры (если нужно) */}
        {onBackToEdit && (
          <button
            type="button"
            onClick={onBackToEdit}
            className="text-xs text-stone-500 hover:text-stone-300 underline py-2 block mx-auto cursor-pointer"
          >
            {t.recipient.step5.backToEdit}
          </button>
        )}

        {/* Кнопка "Поддержать автора" */}
        <div className="pt-2 text-center">
          <a
            href={APP_CONFIG.donateUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => sound.coin()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-900 border border-stone-800 hover:border-amber-500/50 text-stone-400 hover:text-amber-300 text-xs transition-all shadow-sm cursor-pointer"
            title="Поддержать автора проекта"
          >
            <span>{t.common.donate}</span>
          </a>
        </div>
      </div>
    </div>
  );
};
