import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'copper' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-semibold border transition-all duration-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variants = {
      primary: 'bg-[#1C2321] text-white border-transparent hover:bg-[#2A322F] shadow-sm',
      copper: 'bg-[#A6592C] text-white border-transparent hover:bg-[#8E4922] shadow-sm',
      outline: 'bg-white text-[#242A28] border-[#DED6C6] hover:border-[#A6592C] hover:text-[#A6592C]',
      ghost: 'bg-transparent text-[#6B6459] border-transparent hover:bg-[#F0EBE1] hover:text-[#242A28]',
      danger: 'bg-[#9E2A2B] text-white border-transparent hover:bg-[#852324]',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-5 py-3 text-base',
    };

    return (
      <button
        ref={ref}
        className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
