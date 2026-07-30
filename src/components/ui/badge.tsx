import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'sage' | 'copper' | 'ochre' | 'slate' | 'crimson' | 'dim';
}

export function Badge({ className, variant = 'dim', children, ...props }: BadgeProps) {
  const variants = {
    sage: 'bg-[#E4E9DC] text-[#5B6B4F]',
    copper: 'bg-[#F2E1D2] text-[#A6592C]',
    ochre: 'bg-[#F5E9D2] text-[#B8862B]',
    slate: 'bg-[#E3E8ED] text-[#46586B]',
    crimson: 'bg-[#FADBD8] text-[#9E2A2B]',
    dim: 'bg-[#EEEAE1] text-[#6B6459]',
  };

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold leading-relaxed',
          variants[variant],
          className
        )
      )}
      {...props}
    >
      {children}
    </span>
  );
}
