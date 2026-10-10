import React from 'react';

// ==========================================
// ✏️ БАЗОВЫЙ ИНПУТ (LUXURY PRIMITIVE)
// Темные фоны, янтарная подсветка фокуса
// ==========================================

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
  icon?: React.ReactNode;
  multiline?: boolean;
  rows?: number;
}

export const Input: React.FC<InputProps> = ({
  label,
  helperText,
  error,
  icon,
  className = '',
  id,
  multiline = false,
  rows = 3,
  ...props
}) => {
  const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);
  const baseClasses = `w-full bg-[#141210] border ${
    error ? 'border-rose-500/80 focus:border-rose-400 focus:ring-rose-500/20' : 'border-stone-800 focus:border-amber-400/80 focus:ring-amber-400/20'
  } text-stone-100 placeholder:text-stone-600 rounded-xl ${
    icon ? 'pl-10' : 'pl-4'
  } pr-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all duration-200 shadow-inner ${className}`;

  return (
    <div className="w-full flex flex-col gap-1.5 text-left">
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold tracking-wide text-stone-300 uppercase">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3.5 top-3.5 text-stone-500 pointer-events-none flex items-center">
            {icon}
          </div>
        )}
        {multiline ? (
          <textarea
            id={inputId}
            rows={rows}
            className={`${baseClasses} resize-y font-sans`}
            {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input
            id={inputId}
            className={baseClasses}
            {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
          />
        )}
      </div>
      {error && <span className="text-xs text-rose-400 mt-0.5">{error}</span>}
      {!error && helperText && <span className="text-[11px] text-stone-500 mt-0.5">{helperText}</span>}
    </div>
  );
};
