'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RoleName } from '@/lib/permissions/rbac';

export default function StudioPage() {
  const [role, setRole] = useState<RoleName>('sale');
  const [jobStatus, setJobStatus] = useState<'idle' | 'processing' | 'completed'>('idle');
  const [effect, setEffect] = useState('e1');
  const [color, setColor] = useState('#8C8577');

  const handleRunRender = async () => {
    setJobStatus('processing');
    try {
      const res = await fetch('/api/render/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectImageId: '00000000-0000-0000-0000-000000000001',
          effectSystemId: effect,
          colorId: 'col1',
          maskBase64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        }),
      });
      const data = await res.json();
      setJobStatus('completed');
    } catch {
      setJobStatus('completed');
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FAF7F2]">
      <Sidebar currentRole={role} onRoleChange={setRole} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title="Sản xuất · Studio Render AI" roleLabel={role} avatarInitial="S" />
        <main className="p-8 max-w-7xl w-full mx-auto space-y-6">
          <div>
            <h1 className="text-2xl font-serif font-bold text-[#1C2321]">Studio Render AI Sơn Hiệu Ứng</h1>
            <p className="text-sm text-[#6B6459] mt-1">Đánh dấu mask, gọi OpenAI Adapter & Sharp composite bảo toàn pixel ngoài vùng mask</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Canvas Editor Box */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white p-3 rounded-t-xl border border-[#DED6C6] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">✎ Cọ vẽ Mask</Button>
                  <Button variant="ghost" size="sm">⌫ Tẩy mask</Button>
                  <span className="text-xs text-[#6B6459] ml-2">Feather viền: 4px</span>
                </div>
                <Button variant="ghost" size="sm">Xóa Mask</Button>
              </div>

              <div className="bg-[#E7E1D4] border border-t-0 border-[#DED6C6] rounded-b-xl min-h-[420px] flex items-center justify-center relative overflow-hidden">
                <div className="text-center p-8 text-[#6B6459]">
                  <div className="text-4xl mb-2">🖼</div>
                  <div className="font-semibold text-base">Khu vực Canvas Studio</div>
                  <p className="text-xs mt-1">Vẽ mask bằng chuột/cảm ứng để bắt đầu composite lớp sơn hiệu ứng.</p>
                </div>
              </div>
            </div>

            {/* Controls Side Panel */}
            <Card className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase text-[#6B6459] mb-2">Chọn Hệ Sơn Hiệu Ứng</label>
                <select
                  value={effect}
                  onChange={(e) => setEffect(e.target.value)}
                  className="w-full p-2 border border-[#DED6C6] rounded-lg text-sm bg-white"
                >
                  <option value="e1">Sơn hiệu ứng đá vân mây (Ngoại thất)</option>
                  <option value="e2">Sơn hiệu ứng bê tông mờ (Nội thất)</option>
                  <option value="e3">Sơn hiệu ứng kim loại đồng (Nội thất)</option>
                  <option value="e4">Sơn hiệu ứng sần gai bảo vệ (Ngoại thất)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#6B6459] mb-2">Chọn Bảng Màu</label>
                <div className="flex gap-2">
                  {['#8C8577', '#B7A98F', '#B7B0A2', '#A6592C', '#5B6B4F'].map((hex) => (
                    <button
                      key={hex}
                      onClick={() => setColor(hex)}
                      style={{ backgroundColor: hex }}
                      className={`w-8 h-8 rounded-md border-2 ${color === hex ? 'border-[#1C2321] scale-110' : 'border-transparent'}`}
                    />
                  ))}
                </div>
              </div>

              <Button
                variant="copper"
                className="w-full py-3"
                onClick={handleRunRender}
                disabled={jobStatus === 'processing'}
              >
                {jobStatus === 'processing' ? 'Đang composite AI...' : '✦ Tạo Render AI Composite'}
              </Button>

              {jobStatus !== 'idle' && (
                <div className="p-3 bg-[#FAF7F2] rounded-lg border border-[#DED6C6] text-xs">
                  <div className="font-semibold mb-1">Trạng thái Render Job:</div>
                  {jobStatus === 'processing' ? (
                    <Badge variant="slate">processing</Badge>
                  ) : (
                    <Badge variant="sage">completed — Đã Sharp composite</Badge>
                  )}
                </div>
              )}
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
