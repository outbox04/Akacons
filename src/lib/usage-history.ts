export type UsageKind = 'render' | 'quote';

export interface UsageRecord {
  id: string;
  kind: UsageKind;
  employeeCode: string;
  createdAt: string;
  title: string;
  status: 'completed' | 'failed';
  details: Record<string, string | number>;
  resultImage?: string;
}

const STORAGE_KEY = 'akacons_usage_history_v1';

export function readUsageHistory(kind: UsageKind, employeeCode: string): UsageRecord[] {
  if (typeof window === 'undefined' || !employeeCode.trim()) return [];
  try {
    const records = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as UsageRecord[];
    return records
      .filter((item) => item.kind === kind && item.employeeCode.toUpperCase() === employeeCode.trim().toUpperCase())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch {
    return [];
  }
}

export function saveUsageRecord(record: Omit<UsageRecord, 'id' | 'createdAt'>): UsageRecord {
  const completed: UsageRecord = {
    ...record,
    employeeCode: record.employeeCode.trim().toUpperCase(),
    id: `${record.kind}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
  };
  const existing = readAll();
  localStorage.setItem(STORAGE_KEY, JSON.stringify([completed, ...existing].slice(0, 250)));
  return completed;
}

function readAll(): UsageRecord[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as UsageRecord[];
  } catch {
    return [];
  }
}
