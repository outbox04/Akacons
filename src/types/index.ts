export * from './database.types';
export * from '../lib/permissions/rbac';
export * from '../lib/pricing-engine/optimize-packages';

export interface Customer {
  id: string;
  code: string;
  name: string;
  phone: string;
  addr: string;
}

export interface Project {
  id: string;
  code: string;
  customerId: string;
  name: string;
  type: 'interior' | 'exterior';
  status: 'new' | 'in_progress' | 'render_review' | 'estimating' | 'quote_sent' | 'accepted' | 'rejected';
  assignedRole: string;
  images: any[];
  estimate: any;
  quotes: Quote[];
}

export interface QuoteItem {
  name: string;
  qty: number;
  unit: number;
  total: number;
}

export interface QuoteSnapshot {
  customerName: string;
  projectName: string;
  items: QuoteItem[];
  subtotal: number;
  vat: number;
  discount: number;
  labor: number;
  shipping: number;
  total: number;
}

export interface Quote {
  id: string;
  no: string;
  token: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
  total: number;
  createdAt: string;
  snapshot: QuoteSnapshot;
}

export interface AuditLogItem {
  t: string;
  actor: string;
  action: string;
  color: string;
}
