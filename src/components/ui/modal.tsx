import React from 'react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, subtitle, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-lg p-7 shadow-2xl border border-[#DED6C6] transition-transform animate-scaleUp">
        <h3 className="text-xl font-bold font-serif text-[#1C2321]">{title}</h3>
        {subtitle && <p className="text-xs text-[#6B6459] mt-1 mb-5">{subtitle}</p>}
        <div>{children}</div>
      </div>
    </div>
  );
}
