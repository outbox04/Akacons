'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';

interface TopbarProps {
  title: string;
  roleLabel: string;
  avatarInitial: string;
}

export function Topbar({ title, roleLabel, avatarInitial }: TopbarProps) {
  return (
    <header className="h-14 border-b border-[#DED6C6] bg-[#FAF7F2]/80 backdrop-blur-md sticky top-0 z-15 flex items-center justify-between px-7">
      <div className="text-sm text-[#6B6459]">
        <b className="text-[#242A28] font-semibold">{title}</b> · Vai trò: {roleLabel}
      </div>
      <div className="flex items-center gap-3.5">
        <Badge variant="sage">● Supabase & OpenAI Connected</Badge>
        <div className="w-8 h-8 rounded-full bg-[#A6592C] text-white flex items-center justify-center font-bold text-xs shadow-md">
          {avatarInitial}
        </div>
      </div>
    </header>
  );
}
