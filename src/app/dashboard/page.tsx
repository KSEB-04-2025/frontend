// app/dashboard/page.tsx
'use client';

import ChartSection from '@/components/sections/ChartSection';
import MetricsGrid from '@/components/sections/MetricsGrid';

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-[1400px] px-4 md:px-6">
      <div className="grid gap-5">
        <ChartSection />
        <MetricsGrid />
      </div>
    </div>
  );
}
