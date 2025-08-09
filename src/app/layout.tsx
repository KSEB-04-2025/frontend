// src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/sections/Sidebar';
import HeaderBar from '@/components/sections/HeaderBar';

export const metadata: Metadata = {
  title: 'ZEZE ONE Dashboard',
  description: 'Smart Factory Dashboard',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-[#0A0D1A] text-white antialiased">
        <div className="grid grid-cols-[auto_1fr]">
          <Sidebar />
          <div className="min-h-screen overflow-y-auto">
            <HeaderBar />
            <main className="px-6 py-8">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
