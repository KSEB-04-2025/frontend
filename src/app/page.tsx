import ChartSection from '@/components/sections/ChartSection';
import MetricsGrid from '@/components/sections/MetricsGrid';

export default function Page() {
  return (
    <div className="mx-auto h-full min-h-0 max-w-[1400px] px-4 md:px-6">
      <div className="grid h-full min-h-0 grid-rows-[420px_1fr] gap-5">
        <ChartSection />
        <MetricsGrid />
      </div>
    </div>
  );
}
