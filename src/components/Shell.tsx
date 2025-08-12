'use client';

import { usePathname } from 'next/navigation';
import NavigationBar from '@/components/sections/NavigationBar';

export default function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideSidebar = pathname.startsWith('/login');

  if (hideSidebar) {
    return <main className="h-dvh overflow-hidden px-6 py-4">{children}</main>;
  }

  return (
    <div className="grid grid-cols-[240px_1fr]">
      <NavigationBar />
      <main className="h-dvh overflow-hidden px-6 py-4">{children}</main>
    </div>
  );
}
