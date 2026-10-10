import React, { useState } from 'react';
import { Send, CheckCircle2, MessageSquareHeart } from 'lucide-react';
import type { AppLanguage } from '../../types/ticket';
import { sound } from '../../utils/audio';
import { sendNotification } from '../../services/notifyApi';

interface FeedbackFormProps {
  language?: AppLanguage;
}

export const FeedbackForm: React.FC<FeedbackFormProps> = ({ language = 'ru' }) => {
  const isEn = language === 'en';
  const [messageText, setMessageText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = messageText.trim();
    if (!trimmed || isSubmitting) return;

    setIsSubmitting(true);
    sound.coin();

    try {
      await sendNotification('FEEDBACK', { text: trimmed });

      setMessageText('');
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 4000);
    } catch (err) {
      console.error('Ошибка отправки отзыва:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative bg-[#141210] border border-stone-800 hover:border-amber-500/30 rounded-3xl p-5 sm:p-6 space-y-3.5 shadow-lg transition-all text-left">
      {/* Всплывающее уведомление (Toast) */}
      {showToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 max-w-[92vw] px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-stone-950 font-black text-xs sm:text-sm shadow-[0_10px_35px_rgba(245,158,11,0.7)] border-2 border-amber-200 flex items-center gap-2.5 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-stone-950 shrink-0" />
          <span>
            {isEn
              ? 'Спасибо за отзыв! Он уже у авторов проекта ❤️'
              : 'Спасибо за отзыв! Он уже у авторов проекта ❤️'}
          </span>
        </div>
      )}

      {/* Заголовок */}
      <div className="flex items-center gap-2.5">
        <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
          <MessageSquareHeart className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
            {isEn ? 'Есть идея или хочешь оставить отзыв?' : 'Есть идея или хочешь оставить отзыв?'}
          </h3>
          <p className="text-[11px] sm:text-xs text-stone-400">
            {isEn
              ? 'Tell us what feature or ticket to add. It goes straight to our Telegram!'
              : 'Напиши нам, какую фишку или билет добавить. Сообщение улетит напрямую создателям!'}
          </p>
        </div>
      </div>

      {/* Форма ввода */}
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 pt-1">
        <input
          type="text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder={isEn ? 'Your idea or feedback...' : 'Твоя идея или отзыв...'}
          className="flex-1 bg-stone-900 border border-stone-800 focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/50 rounded-xl px-4 py-2.5 text-xs text-stone-100 placeholder:text-stone-500 outline-none transition-all"
        />
        <button
          type="submit"
          disabled={!messageText.trim() || isSubmitting}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 text-xs font-black transition-all shadow-md active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
        >
          {isSubmitting ? (
            <span className="animate-spin text-sm">⏳</span>
          ) : (
            <Send className="w-3.5 h-3.5" />
          )}
          <span>{isEn ? 'Send' : 'Отправить'}</span>
        </button>
      </form>
    </div>
  );
};
