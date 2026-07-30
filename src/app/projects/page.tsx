'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RoleName } from '@/lib/permissions/rbac';

export default function ProjectsPage() {
  const [role, setRole] = useState<RoleName>('sale');

  return (
    <div className="flex min-h-screen bg-[#FAF7F2]">
      <Sidebar currentRole={role} onRoleChange={setRole} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title="CRM · Công trình" roleLabel={role} avatarInitial="P" />
        <main className="p-8 max-w-7xl w-full mx-auto space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-2xl font-serif font-bold text-[#1C2321]">Danh sách Công trình</h1>
              <p className="text-sm text-[#6B6459] mt-1">Mã tự sinh theo chuẩn CT-2026-XXXXXX</p>
            </div>
            <Button variant="copper">+ Tạo công trình mới</Button>
          </div>

          <div className="bg-white rounded-xl border border-[#DED6C6] overflow-hidden shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#F0EBE1] text-xs uppercase text-[#6B6459] font-bold border-b border-[#DED6C6]">
                <tr>
                  <th className="p-3.5">Mã công trình</th>
                  <th className="p-3.5">Tên công trình</th>
                  <th className="p-3.5">Khách hàng</th>
                  <th className="p-3.5">Hạng mục</th>
                  <th className="p-3.5">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EBE1]">
                <tr className="hover:bg-[#FAF7F2] cursor-pointer">
                  <td className="p-3.5 font-mono text-xs">CT-2026-000001</td>
                  <td className="p-3.5 font-semibold">Biệt thự mặt tiền - Trần Phú</td>
                  <td className="p-3.5">Nguyễn Văn Long</td>
                  <td className="p-3.5"><Badge variant="dim">Ngoại thất</Badge></td>
                  <td className="p-3.5"><Badge variant="ochre">Chờ duyệt AI render</Badge></td>
                </tr>
                <tr className="hover:bg-[#FAF7F2] cursor-pointer">
                  <td className="p-3.5 font-mono text-xs">CT-2026-000002</td>
                  <td className="p-3.5 font-semibold">Phòng khách chung cư cao cấp</td>
                  <td className="p-3.5">Trần Thị Hoa</td>
                  <td className="p-3.5"><Badge variant="dim">Nội thất</Badge></td>
                  <td className="p-3.5"><Badge variant="copper">Đã gửi báo giá</Badge></td>
                </tr>
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
