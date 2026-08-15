'use client';

import { useState } from 'react';
import MaterialCrm from '@/components/material-crm';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { RoleName } from '@/lib/permissions/rbac';

export default function MaterialCrmPage() {
  const [role, setRole] = useState<RoleName>('admin');
  return <div className="flex min-h-screen bg-[#F5F7F8]">
    <Sidebar currentRole={role} onRoleChange={setRole}/>
    <div className="flex-1 min-w-0">
      <Topbar title="Hệ thống · CRM vật liệu" roleLabel={role} avatarInitial="A"/>
      <MaterialCrm />
    </div>
  </div>;
}
