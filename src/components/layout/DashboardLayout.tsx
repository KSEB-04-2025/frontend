// src/components/layout/DashboardLayout.tsx
import React from 'react';

interface Props {
  sidebar: React.ReactNode;
  header: React.ReactNode;
  metrics: React.ReactNode | null;
  chart: React.ReactNode | null;
  list: React.ReactNode;
}

export default function DashboardLayout({ sidebar, header, metrics, chart, list }: Props) {
  return (
    <div className="flex h-full">
      {/* 1) 사이드바 */}
      <aside className="w-64 bg-nav p-4 shadow-side">{sidebar}</aside>

      {/* 2) 메인 */}
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto space-y-8 px-6 py-8">
          {header}
          {metrics}
          {chart}
          {list}
        </div>
      </main>
    </div>
  );
}
