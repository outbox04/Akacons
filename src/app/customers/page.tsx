'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { RoleName } from '@/lib/permissions/rbac';

export default function CustomersPage() {
  const [role, setRole] = useState<RoleName>('sale');
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#FAF7F2]">
      <Sidebar currentRole={role} onRoleChange={setRole} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title="CRM · Khách hàng" roleLabel={role} avatarInitial="K" />
        <main className="p-8 max-w-7xl w-full mx-auto space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-2xl font-serif font-bold text-[#1C2321]">Quản lý Khách hàng</h1>
              <p className="text-sm text-[#6B6459] mt-1">Danh sách khách hàng & mã tự sinh KH-2026-XXXXXX</p>
            </div>
            <Button variant="copper" onClick={() => setIsModalOpen(true)}>+ Thêm khách hàng</Button>
          </div>

          <div className="bg-white rounded-xl border border-[#DED6C6] overflow-hidden shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#F0EBE1] text-xs uppercase text-[#6B6459] font-bold border-b border-[#DED6C6]">
                <tr>
                  <th className="p-3.5">Mã KH</th>
                  <th className="p-3.5">Họ tên / Đơn vị</th>
                  <th className="p-3.5">Điện thoại</th>
                  <th className="p-3.5">Địa chỉ</th>
                  <th className="p-3.5">Số dự án</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EBE1]">
                <tr>
                  <td className="p-3.5 font-mono text-xs">KH-2026-000001</td>
                  <td className="p-3.5 font-semibold">Nguyễn Văn Long</td>
                  <td className="p-3.5 font-mono">0912 345 678</td>
                  <td className="p-3.5">12 Trần Phú, Thái Bình</td>
                  <td className="p-3.5"><Badge variant="slate">2 công trình</Badge></td>
                </tr>
                <tr>
                  <td className="p-3.5 font-mono text-xs">KH-2026-000002</td>
                  <td className="p-3.5 font-semibold">Trần Thị Hoa</td>
                  <td className="p-3.5 font-mono">0987 654 321</td>
                  <td className="p-3.5">45 Lý Thường Kiệt, Hưng Yên</td>
                  <td className="p-3.5"><Badge variant="slate">1 công trình</Badge></td>
                </tr>
              </tbody>
            </table>
          </div>

          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Tạo Khách hàng mới"
            subtitle="Mã tự động sinh theo chuẩn KH-2026-XXXXXX"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Họ tên khách hàng</label>
                <input type="text" placeholder="Nguyễn Văn A" className="w-full p-2 border border-[#DED6C6] rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Số điện thoại</label>
                <input type="text" placeholder="09xx xxx xxx" className="w-full p-2 border border-[#DED6C6] rounded-lg text-sm" />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Hủy</Button>
                <Button variant="copper" onClick={() => setIsModalOpen(false)}>Lưu khách hàng</Button>
              </div>
            </div>
          </Modal>
        </main>
      </div>
    </div>
  );
}
