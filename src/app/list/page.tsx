// src/app/list/page.tsx
import DashboardLayout from "@/components/layout/DashboardLayout";
import Sidebar from "@/components/sections/Sidebar";
import HeaderBar from "@/components/sections/HeaderBar";
import ListSection from "@/components/sections/ListSection";

export default function ListPage() {
  return (
    <DashboardLayout
      sidebar={<Sidebar />}
      header={<HeaderBar />}
      metrics={null}
      chart={null}
      list={<ListSection />}
    />
  );
}
