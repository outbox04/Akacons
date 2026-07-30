'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RoleName } from '@/lib/permissions/rbac';

export default function AdminPage() {
  const [role, setRole] = useState<RoleName>('admin');
  const [killSwitch, setKillSwitch] = useState(false);

  const toggleKill = async () => {
    const next = !killSwitch;
    setKillSwitch(next);
    await fetch('/api/admin/kill-switch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ killSwitch: next }),
    });
  };

  return (
    <div className="flex min-h-screen bg-[#FAF7F2]">
      <Sidebar currentRole={role} onRoleChange={setRole} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title="Hệ thống · Quản trị Admin" roleLabel={role} avatarInitial="A" />
        <main className="p-8 max-w-7xl w-full mx-auto space-y-6">
          <div>
            <h1 className="text-2xl font-serif font-bold text-[#1C2321]">Quản Trị Hệ Thống</h1>
            <p className="text-sm text-[#6B6459] mt-1">Cấu hình AI Provider Adapter, Kill Switch và Audit Logs bảo mật</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="space-y-4">
              <h3 className="font-bold text-sm text-[#1C2321]">Cấu Hình AI Provider Adapter</h3>
              <div>
                <label className="block text-xs font-semibold text-[#6B6459] mb-1">Provider đang chạy</label>
                <select className="w-full p-2 border border-[#DED6C6] rounded-lg text-sm bg-white">
                  <option>OpenAI Image Adapter (DALL-E 3)</option>
                  <option>Google Imagen Adapter (Vertex AI)</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-3 bg-[#FAF7F2] rounded-lg border border-[#DED6C6]">
                <div>
                  <div className="font-semibold text-xs text-[#1C2321]">Kill Switch Khẩn Cấp</div>
                  <div className="text-[11px] text-[#6B6459]">Khóa tức thì mọi request AI Render</div>
                </div>
                <Button variant={killSwitch ? 'danger' : 'outline'} size="sm" onClick={toggleKill}>
                  {killSwitch ? 'ĐANG BẬT KILL SWITCH' : 'Tắt Kill Switch'}
                </Button>
              </div>
            </Card>

            <Card className="space-y-3">
              <h3 className="font-bold text-sm text-[#1C2321]">Audit Logs Hoạt Động</h3>
              <div className="space-y-2 text-xs divide-y divide-[#F0EBE1]">
                <div className="pt-2">
                  <span className="font-semibold">sale.minh</span> — Phát hành báo giá BG-2026-000001
                </div>
                <div className="pt-2">
                  <span className="font-semibold">ai.system</span> — Composite ảnh thành công CT-2026-000002
                </div>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
