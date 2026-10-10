import React from 'react';
import { sound } from '../../utils/audio';

// ==========================================
// 💊 ИНТЕРАКТИВНЫЕ ЧИПСЫ / ТАБЛЕТКИ
// ==========================================

export interface ChipProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
  size?: 'sm' | 'md';
  className?: string;
  badge?: string;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  selected = false,
  onClick,
  icon,
  size = 'md',
  className = '',
  badge,
}) => {
  const handleClick = () => {
    sound.click();
    onClick?.();
  };

  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center justify-center font-medium rounded-full cursor-pointer transition-all duration-200 active:scale-95 select-none ${
        sizeClasses[size]
      } ${
        selected
          ? 'ring-2 ring-amber-400 bg-amber-500/20 text-amber-200 border-amber-400/50 shadow-[0_0_14px_rgba(245,158,11,0.25)] font-semibold'
          : 'bg-[#181513] text-stone-300 border border-stone-800 hover:border-amber-500/40 hover:text-white hover:bg-stone-800/60'
      } border ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{label}</span>
      {badge && (
        <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
          {badge}
        </span>
      )}
    </button>
  );
};
