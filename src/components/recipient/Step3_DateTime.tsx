import React, { useState } from 'react';
import { Clock, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { Chip } from '../ui/Chip';
import { sound } from '../../utils/audio';
import type { AppLanguage, Occasion } from '../../types/ticket';
import { TRANSLATIONS } from '../../locales/translations';

// ==========================================
// 📅 ШАГ 3: КАЛЕНДАРЬ И ВРЕМЯ
// Компактный календарь, пресеты, кастомный таймпикер
// ==========================================

export interface Step3DateTimeProps {
  initialDate?: string;
  initialTime?: string;
  occasion?: Occasion;
  language?: AppLanguage;
  onNext: (date: string, time: string) => void;
  onBack: () => void;
}

const MONTH_NAMES_RU = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
];

const MONTH_NAMES_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const MONTH_GENITIVE_RU = [
  'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
];

const MONTH_GENITIVE_EN = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

const DAYS_OF_WEEK_RU = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const DAYS_OF_WEEK_EN = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

const TIME_PRESETS = ['18:00', '19:00', '19:30', '20:00', '21:00', '22:00'];

export const Step3_DateTime: React.FC<Step3DateTimeProps> = ({
  initialDate,
  initialTime = '19:30',
  occasion,
  language,
  onNext,
  onBack,
}) => {
  const isBro = occasion === 'bro';
  const lang: AppLanguage = language || 'ru';
  const t = TRANSLATIONS[lang];
  const monthNames = lang === 'en' ? MONTH_NAMES_EN : MONTH_NAMES_RU;
  const daysOfWeek = lang === 'en' ? DAYS_OF_WEEK_EN : DAYS_OF_WEEK_RU;
  
  // Вычисляем текущую дату один раз при инициализации
  const [today] = useState(() => new Date());
  const [currentYear, setCurrentYear] = useState(() => today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(() => today.getMonth());

  const formatYMD = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const [selectedDate, setSelectedDate] = useState<string>(() =>
    initialDate || formatYMD(today)
  );
  const [selectedTime, setSelectedTime] = useState<string>(initialTime);

  // Переход по месяцам
  const prevMonth = () => {
    sound.click();
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    sound.click();
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  // Вычисление дней в месяце
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();
  // День недели первого дня (0 - понедельник, если вс = 0)
  const startDayOffset = (firstDayOfMonth.getDay() + 6) % 7;

  // Пустые ячейки перед первым днем месяца
  const daysInMonth = Array.from({ length: totalDays }, (_, idx) => {
    const dayNum = idx + 1;
    const dateObj = new Date(currentYear, currentMonth, dayNum);
    return {
      number: dayNum,
      iso: formatYMD(dateObj),
    };
  });

  // Быстрые пресеты дат
  const applyPresetDate = (daysAhead: number) => {
    const target = new Date(today);
    target.setDate(today.getDate() + daysAhead);
    setSelectedDate(formatYMD(target));
    setCurrentYear(target.getFullYear());
    setCurrentMonth(target.getMonth());
  };

  const getNextDayOfWeek = (targetDay: number) => {
    const d = new Date(today);
    const currentDay = d.getDay();
    let distance = (targetDay - currentDay + 7) % 7;
    if (distance === 0) distance = 7;
    d.setDate(d.getDate() + distance);
    return d;
  };

  // Тонкая настройка времени (+ / - часов и минут) с циклическим переносом через полночь
  const adjustHours = (delta: number) => {
    sound.click();
    const [h, m] = selectedTime.split(':').map(Number);
    const nextH = (h + delta + 24) % 24;
    setSelectedTime(`${String(nextH).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
  };

  const adjustMinutes = (delta: number) => {
    sound.click();
    const [h, m] = selectedTime.split(':').map(Number);
    const totalMinutes = (h * 60 + m + delta + 24 * 60) % (24 * 60);
    const nextH = Math.floor(totalMinutes / 60);
    const nextM = totalMinutes % 60;
    setSelectedTime(`${String(nextH).padStart(2, '0')}:${String(nextM).padStart(2, '0')}`);
  };

  // Красивый вывод выбранной даты на выбранном языке
  const formatDisplaySelectedDate = () => {
    const [y, m, d] = selectedDate.split('-').map(Number);
    if (lang === 'en') {
      return `${MONTH_GENITIVE_EN[m - 1]} ${d}, ${y}`;
    }
    return `${d} ${MONTH_GENITIVE_RU[m - 1]} ${y} года`;
  };

  return (
    <div className="relative w-full h-full min-h-[580px] flex flex-col justify-between p-5 select-none">
      <div className="space-y-4">
        {/* Заголовок */}
        <div className="text-left">
          <span className="text-[10px] font-mono tracking-widest uppercase text-amber-400 font-bold">
            {isBro
              ? (lang === 'en' ? 'STEP 3 OF 5 // SQUAD TIMING' : 'ШАГ 3 ИЗ 5 // ВРЕМЯ СБОРА')
              : t.recipient.step3.stepLabel}
          </span>
          <h2 className="text-xl font-bold text-white mt-0.5">
            {isBro
              ? (lang === 'en' ? 'When are the boys gathering? 🗓️' : 'Когда собираемся? 🗓️')
              : t.recipient.step3.title}
          </h2>
        </div>

        {/* Быстрые пресеты дат */}
        <div className="flex flex-wrap gap-1.5 pb-1">
          <Chip
            size="sm"
            label={t.recipient.step3.today}
            selected={selectedDate === formatYMD(today)}
            onClick={() => applyPresetDate(0)}
          />
          <Chip
            size="sm"
            label={t.recipient.step3.tomorrow}
            selected={
              selectedDate ===
              formatYMD(new Date(today.getTime() + 24 * 3600 * 1000))
            }
            onClick={() => applyPresetDate(1)}
          />
          <Chip
            size="sm"
            label={t.recipient.step3.friday}
            selected={selectedDate === formatYMD(getNextDayOfWeek(5))}
            onClick={() => {
              const d = getNextDayOfWeek(5);
              setSelectedDate(formatYMD(d));
              setCurrentYear(d.getFullYear());
              setCurrentMonth(d.getMonth());
            }}
          />
          <Chip
            size="sm"
            label={t.recipient.step3.saturday}
            selected={selectedDate === formatYMD(getNextDayOfWeek(6))}
            onClick={() => {
              const d = getNextDayOfWeek(6);
              setSelectedDate(formatYMD(d));
              setCurrentYear(d.getFullYear());
              setCurrentMonth(d.getMonth());
            }}
          />
        </div>

        {/* Интерактивный Календарь */}
        <div className="bg-[#141210] border border-stone-800 rounded-2xl p-3.5 shadow-md space-y-3">
          {/* Шапка календаря (Месяц и стрелки) */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-stone-100">
              {monthNames[currentMonth]} {currentYear}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={prevMonth}
                className="w-7 h-7 rounded-lg bg-stone-900 border border-stone-800 hover:border-amber-400/50 flex items-center justify-center text-stone-300 hover:text-white cursor-pointer transition-colors"
                aria-label={lang === 'en' ? 'Previous month' : 'Предыдущий месяц'}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={nextMonth}
                className="w-7 h-7 rounded-lg bg-stone-900 border border-stone-800 hover:border-amber-400/50 flex items-center justify-center text-stone-300 hover:text-white cursor-pointer transition-colors"
                aria-label={lang === 'en' ? 'Next month' : 'Следующий месяц'}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Дни недели */}
          <div className="grid grid-cols-7 gap-y-2 gap-x-1 w-full place-items-center text-center text-[10px] font-mono text-stone-300 font-semibold uppercase">
            {daysOfWeek.map((day) => (
              <div key={day} className="w-8 h-4 flex items-center justify-center">{day}</div>
            ))}
          </div>

          {/* Сетка дней месяца */}
          <div className="grid grid-cols-7 gap-y-2 gap-x-1 w-full place-items-center">
            {/* Пустые ячейки для сдвига первого дня */}
            {Array.from({ length: startDayOffset }).map((_, i) => (
              <div key={`empty-${i}`} className="w-8 h-8" />
            ))}

            {/* Числа месяца */}
            {daysInMonth.map((day) => {
              const isSelected = selectedDate === day.iso;
              return (
                <button
                  key={day.iso}
                  type="button"
                  onClick={() => {
                    sound.click();
                    setSelectedDate(day.iso);
                  }}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold leading-none transition-all relative ${
                    isSelected
                      ? 'bg-amber-400 text-stone-950 font-bold shadow-md scale-105'
                      : 'text-stone-200 hover:bg-stone-800'
                  }`}
                >
                  {day.number}
                </button>
              );
            })}
          </div>
        </div>

        {/* Выбор времени (кастомный таймпикер без дефолтных инпутов) */}
        <div className="bg-[#141210] border border-stone-800 rounded-2xl p-3.5 shadow-md text-left space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-200 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              {t.recipient.step3.timeLabel}
            </span>
            <span className="text-base font-mono font-black text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-lg border border-amber-400/20 shadow-inner">
              {selectedTime}
            </span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
            {TIME_PRESETS.map((itemTime) => (
              <button
                key={itemTime}
                type="button"
                onClick={() => {
                  sound.click();
                  setSelectedTime(itemTime);
                }}
                className={`py-1.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer border ${
                  selectedTime === itemTime
                    ? 'bg-amber-400 text-stone-950 border-amber-400 shadow-sm'
                    : 'bg-stone-900 text-stone-300 border-stone-800 hover:border-amber-400/40 hover:text-white'
                }`}
              >
                {itemTime}
              </button>
            ))}
          </div>

          {/* Кастомный степпер часов и минут */}
          <div className="flex items-center justify-between bg-stone-900/60 p-2 rounded-xl border border-stone-800/80 text-xs font-mono">
            <span className="text-[10px] text-stone-400 uppercase font-semibold">
              {lang === 'en' ? 'Fine tune:' : 'Точная настройка:'}
            </span>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => adjustHours(-1)}
                  className="w-6 h-6 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 flex items-center justify-center font-bold cursor-pointer"
                  title={lang === 'en' ? '-1 hour' : '-1 час'}
                >
                  -
                </button>
                <span className="text-amber-300 font-bold px-1">{selectedTime.split(':')[0]}{lang === 'en' ? 'h' : 'ч'}</span>
                <button
                  type="button"
                  onClick={() => adjustHours(1)}
                  className="w-6 h-6 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 flex items-center justify-center font-bold cursor-pointer"
                  title={lang === 'en' ? '+1 hour' : '+1 час'}
                >
                  +
                </button>
              </div>
              <span className="text-stone-600">:</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => adjustMinutes(-15)}
                  className="w-6 h-6 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 flex items-center justify-center font-bold cursor-pointer"
                  title={lang === 'en' ? '-15 minutes' : '-15 минут'}
                >
                  -
                </button>
                <span className="text-amber-300 font-bold px-1">{selectedTime.split(':')[1]}{lang === 'en' ? 'm' : 'м'}</span>
                <button
                  type="button"
                  onClick={() => adjustMinutes(15)}
                  className="w-6 h-6 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 flex items-center justify-center font-bold cursor-pointer"
                  title={lang === 'en' ? '+15 minutes' : '+15 минут'}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Текущий выбор */}
        <div className="text-center text-xs text-stone-400 font-mono">
          {lang === 'en' ? 'Selected:' : 'Выбрано:'} <span className="text-amber-300 font-bold">{formatDisplaySelectedDate()} {lang === 'en' ? 'at' : 'в'} {selectedTime}</span>
        </div>
      </div>

      {/* Навигация */}
      <div className="flex gap-2.5 pt-3">
        <Button variant="secondary" onClick={onBack} size="md">
          {t.recipient.step3.backButton}
        </Button>
        <Button
          variant="primary"
          fullWidth
          size="md"
          onClick={() => onNext(selectedDate, selectedTime)}
          icon={<ArrowRight className="w-4 h-4 text-stone-950" />}
        >
          {isBro
            ? (lang === 'en' ? 'Continue to venue & food →' : 'Продолжить к поляне →')
            : t.recipient.step3.nextButton}
        </Button>
      </div>
    </div>
  );
};
