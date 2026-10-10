import React from 'react';
import { sound } from '../../utils/audio';

// ==========================================
// 🔘 БАЗОВАЯ КНОПКА (LUXURY PRIMITIVE)
// Категорический запрет на дефолтные теги HTML!
// ==========================================

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  withSound?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  withSound = true,
  icon,
  className = '',
  onClick,
  disabled,
  ...props
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (withSound) {
      sound.click();
    }
    onClick?.(e);
  };

  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 select-none active:scale-[0.97] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none rounded-2xl';

  const sizeStyles = {
    sm: 'text-xs px-3.5 py-2 gap-1.5',
    md: 'text-sm px-5 py-3 gap-2',
    lg: 'text-base px-6 py-4 gap-2.5',
  };

  const variantStyles = {
    primary: 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-stone-950 font-bold shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 hover:brightness-105 border-t border-amber-200/40',
    gold: 'bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 text-stone-950 font-extrabold shadow-[0_4px_20px_rgba(245,158,11,0.35)] hover:brightness-110 active:brightness-95 border border-amber-200/50',
    secondary: 'bg-stone-900/90 text-stone-200 border border-stone-800 hover:border-amber-500/50 hover:bg-stone-800/90 hover:text-white shadow-sm',
    ghost: 'bg-transparent text-stone-400 hover:text-amber-300 hover:bg-stone-800/40 border border-transparent',
    danger: 'bg-rose-950/60 text-rose-200 border border-rose-800/60 hover:bg-rose-900/60 hover:border-rose-700 active:scale-95',
  };

  return (
    <button
      type="button"
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      onClick={handleClick}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
