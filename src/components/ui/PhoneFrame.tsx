import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { sound } from '../../utils/audio';

// ==========================================
// 📱 КОРПУС СМАРТФОНА (PHONE FRAME)
// Идеально для мобильного флоу и Live Preview
// ==========================================

export interface PhoneFrameProps {
  children: React.ReactNode;
  className?: string;
  showStatusHeader?: boolean;
  onReset?: () => void;
  title?: string;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({
  children,
  className = '',
  showStatusHeader = true,
  title,
}) => {
  const [isMuted, setIsMuted] = React.useState(sound.getMuted());
  const [timeString] = React.useState(() =>
    new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
  );

  const toggleSound = () => {
    const next = !isMuted;
    sound.setMuted(next);
    setIsMuted(next);
    if (!next) sound.click();
  };

  return (
    <div
      className={`w-[390px] h-[800px] max-h-[88vh] flex-shrink-0 flex flex-col rounded-[48px] border-[8px] border-stone-800/90 shadow-[0_25px_70px_rgba(0,0,0,0.6)] overflow-hidden relative mx-auto bg-[#0C0A09] ${className}`}
    >
      {/* Верхняя статусная панель (Dynamic Island & Time) */}
      {showStatusHeader && (
        <div className="shrink-0 relative z-30 px-5 pt-3 pb-2 flex items-center justify-between text-xs text-stone-400 select-none bg-gradient-to-b from-black/80 to-transparent">
          <span className="font-mono text-[11px] font-semibold text-stone-300">
            {timeString}
          </span>

          {/* Dynamic Island */}
          <div className="w-24 h-4.5 bg-black rounded-full border border-stone-800 flex items-center justify-center gap-1.5 shadow-inner">
            <div className="w-2 h-2 rounded-full bg-stone-900 border border-stone-700/60" />
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 animate-pulse" />
          </div>

          {/* Кнопка звука с иконками Lucide */}
          <button
            type="button"
            onClick={toggleSound}
            title={isMuted ? 'Включить звук' : 'Выключить звук'}
            className="cursor-pointer p-1 rounded-full text-stone-400 hover:text-amber-400 transition-colors"
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5 text-stone-500" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-amber-400" />
            )}
          </button>
        </div>
      )}

      {/* Заголовок экрана (если передан) */}
      {title && (
        <div className="shrink-0 px-5 py-1 text-center text-xs tracking-wider text-stone-400 uppercase font-mono z-20">
          {title}
        </div>
      )}

      {/* Внутренний контейнер экрана */}
      <div className="w-full h-full flex flex-col overflow-y-auto overscroll-contain pr-0.5 scroll-smooth relative z-10 flex-1 custom-scrollbar">
        {children}
      </div>

      {/* Нижняя полоска Home Indicator */}
      <div className="shrink-0 py-2 flex justify-center items-center pointer-events-none z-30 bg-gradient-to-t from-black/80 to-transparent">
        <div className="w-28 h-1 bg-stone-700/70 rounded-full" />
      </div>
    </div>
  );
};
