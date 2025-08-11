// src/apis/dashboard.ts
import { axioscommon as api } from './common';

export type Period = 'today' | 'week' | 'month';

// ─────────────────────────────────────────────
// 1) 요약(총 생산량 / A / B)
// GET /api/admin/dashboard/summary
// ─────────────────────────────────────────────
export type AdminSummaryRes = {
  totalProducts: number;
  aqualityProducts: number;
  bqualityProducts: number;
};

export async function getAdminDashboardSummary() {
  const { data } = await api.get<AdminSummaryRes>('/admin/dashboard/summary');
  return data;
}

// ─────────────────────────────────────────────
// 2) A/B 통계 (일/주/월)
// GET /api/admin/statistics/daily
// GET /api/admin/statistics/weekly
// GET /api/admin/statistics/monthly
//  ▶ today가 단건/배열 상관없이 항상 배열로 정규화
// ─────────────────────────────────────────────
export type DailyAB = {
  date: string; // "YYYY-MM-DD"
  acount: number;
  bcount: number;
};

export async function getABStats(period: Period) {
  const url =
    period === 'today'
      ? '/admin/statistics/daily'
      : `/admin/statistics/${period === 'week' ? 'weekly' : 'monthly'}`;

  const { data } = await api.get(url);

  if (Array.isArray(data)) return data as DailyAB[];
  if (data && typeof data === 'object') return [data as DailyAB];
  return [];
}

// ─────────────────────────────────────────────
// 3) 결함 통계 (일/주/월)
// GET /api/admin/dashboard/defect-rate/daily|weekly|monthly
//  ▶ today가 숫자/단건/배열 상관없이 배열로 정규화
// ─────────────────────────────────────────────
export type DefectItem = {
  date: string; // "YYYY-MM-DD"
  xcount: number; // 결함 개수
};

export async function getDefectStats(period: Period) {
  const path = period === 'today' ? 'daily' : period === 'week' ? 'weekly' : 'monthly';
  const { data } = await api.get(`/admin/dashboard/defect-rate/${path}`);

  if (Array.isArray(data)) return data as DefectItem[];

  if (typeof data === 'number') {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const today = `${yyyy}-${mm}-${dd}`;
    return [{ date: today, xcount: data }];
  }

  if (data && typeof data === 'object' && 'xcount' in data) {
    return [data as DefectItem];
  }

  return [];
}

// ─────────────────────────────────────────────
// 4) 균일도 / 군집도 (전체 조회)
// GET /api/admin/dashboard/uniformity
// ─────────────────────────────────────────────
export type UniformityItem = {
  id: string;
  label: 'A' | 'B';
  uniformity: number; // 0~1
  nclusters: number;
};

export async function getUniformity() {
  const { data } = await api.get<UniformityItem[]>('/admin/dashboard/uniformity');
  return data;
}

// ─────────────────────────────────────────────
// 5) 유틸 (합계)
// ─────────────────────────────────────────────
export function sumAB(list: DailyAB[]) {
  const a = list.reduce((s, d) => s + (d.acount ?? 0), 0);
  const b = list.reduce((s, d) => s + (d.bcount ?? 0), 0);
  return { a, b };
}

export function sumDefect(list: DefectItem[]) {
  return list.reduce((s, d) => s + (d.xcount ?? 0), 0);
}
