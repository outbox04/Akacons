import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export function Card({ className, hoverable = false, children, ...props }: CardProps) {
  return (
    <div
      className={twMerge(
        clsx(
          'bg-white border border-[#DED6C6] rounded-xl p-5 shadow-sm transition-all duration-200',
          hoverable && 'hover:border-[#C4B9A5] hover:-translate-y-0.5 hover:shadow-md cursor-pointer',
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
}
