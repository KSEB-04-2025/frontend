// src/app/layout.tsx
import './globals.css';
import Sidebar from '@/components/sections/Sidebar';
import HeaderBar from '@/components/sections/HeaderBar';

export const metadata = {
  title: 'ZEZE ONE',
  description: 'Manufacturing Dashboard',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="flex h-screen bg-[#0B0E1C] text-white">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-auto">
          <HeaderBar />
          <main className="p-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
