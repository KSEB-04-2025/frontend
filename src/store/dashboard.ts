'use client';
import { create } from 'zustand';
import type { Period } from '@/apis/dashboard';

type State = { period: Period };
type Actions = { setPeriod: (p: Period) => void };

export const useDashboard = create<State & Actions>(set => ({
  period: 'today',
  setPeriod: p => set({ period: p }),
}));
