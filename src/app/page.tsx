// src/app/page.tsx
import DashboardLayout from "@/components/layout/DashboardLayout";
import Sidebar from "@/components/sections/Sidebar";
import HeaderBar from "@/components/sections/HeaderBar";
import MetricsGrid from "@/components/sections/MetricsGrid";
import ChartSection from "@/components/sections/ChartSection";
import ListSection from "@/components/sections/ListSection";

export default function DashboardPage() {
  return (
    <DashboardLayout
      sidebar={<Sidebar />}
      header={<HeaderBar />}
      metrics={<MetricsGrid />}
      chart={<ChartSection />}
      list={<ListSection />}
    />
  );
}
