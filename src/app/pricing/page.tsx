'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RoleName } from '@/lib/permissions/rbac';

export default function PricingPage() {
  const [role, setRole] = useState<RoleName>('sale');
  const [area, setArea] = useState<number>(45);
  const [result, setResult] = useState<any>(null);

  const handleCompute = async () => {
    try {
      const res = await fetch('/api/estimates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          areaM2: area,
          effectSystemId: 'e1',
          vatRate: 10,
          laborFee: 2200000,
          shippingFee: 300000,
          discountAmount: 0,
        }),
      });
      const data = await res.json();
      setResult(data.data);
    } catch {
      // Fallback calculation
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FAF7F2]">
      <Sidebar currentRole={role} onRoleChange={setRole} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title="Kinh doanh · Bộ máy Dự toán" roleLabel={role} avatarInitial="D" />
        <main className="p-8 max-w-7xl w-full mx-auto space-y-6">
          <div>
            <h1 className="text-2xl font-serif font-bold text-[#1C2321]">Bộ Máy Tính Dự Toán</h1>
            <p className="text-sm text-[#6B6459] mt-1">Pricing Engine pure-function tính toán định mức vật tư, tỷ lệ hao hụt & VAT</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1C2321] mb-1">Diện tích thi công (m²)</label>
                <input
                  type="number"
                  value={area}
                  onChange={(e) => setArea(Number(e.target.value))}
                  className="w-full p-2.5 border border-[#DED6C6] rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1C2321] mb-1">Hệ sơn hiệu ứng</label>
                <select className="w-full p-2.5 border border-[#DED6C6] rounded-lg text-sm bg-white">
                  <option value="e1">Sơn hiệu ứng đá vân mây</option>
                  <option value="e2">Sơn hiệu ứng bê tông mờ</option>
                </select>
              </div>

              <Button variant="copper" className="w-full py-3" onClick={handleCompute}>
                Tính Dự Toán Chi Tiết
              </Button>
            </Card>

            <Card>
              <h3 className="font-bold text-sm text-[#1C2321] mb-3">Kết quả Dự toán Vật tư</h3>
              {result ? (
                <div className="space-y-3 text-xs">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#DED6C6] text-[#6B6459]">
                        <th className="py-2">Lớp sơn</th>
                        <th className="py-2">Khối lượng</th>
                        <th className="py-2">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F0EBE1]">
                      {result.items.map((i: any, idx: number) => (
                        <tr key={idx}>
                          <td className="py-2 font-semibold">{i.name}</td>
                          <td className="py-2 font-mono">{i.actualQty} kg/lít</td>
                          <td className="py-2 font-mono">{i.lineTotal.toLocaleString()} đ</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="border-t border-[#1C2321] pt-3 text-sm flex justify-between font-bold">
                    <span>TỔNG THÀNH TIỀN:</span>
                    <span className="text-[#A6592C] font-mono">{result.totalAmount.toLocaleString()} đ</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 text-sm text-[#6B6459]">Nhập diện tích m² và bấm "Tính Dự Toán".</div>
              )}
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
