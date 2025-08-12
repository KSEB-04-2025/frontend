// src/components/Shell.tsx
'use client';

import { usePathname } from 'next/navigation';
import NavigationBar from '@/components/sections/NavigationBar';

export default function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuth = pathname.startsWith('/login');

  return (
    <div className={`grid min-h-dvh ${isAuth ? 'grid-cols-1' : 'grid-cols-[240px_1fr]'}`}>
      {!isAuth && <NavigationBar />}
      {/* ✅ 내용이 뷰포트 높이를 넘을 때만 스크롤이 생김 */}
      <main className="max-h-dvh min-h-dvh min-w-0 overflow-y-auto overscroll-contain px-6 py-4">
        {children}
      </main>
    </div>
  );
}
