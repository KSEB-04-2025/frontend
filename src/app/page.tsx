import ChartSection from '@/components/sections/ChartSection';
import MetricsGrid from '@/components/sections/MetricsGrid';

export default function Page() {
  return (
    <div className="mx-auto max-w-[1400px] space-y-6 px-4 py-6 md:px-6">
      <ChartSection />
      <MetricsGrid />
    </div>
  );
}
