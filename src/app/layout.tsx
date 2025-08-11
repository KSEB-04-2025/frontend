import type { Metadata } from 'next';
import './globals.css';
import NavigationBar from '@/components/sections/NavigationBar';

export const metadata: Metadata = {
  title: 'ZEZE ONE',
  description: 'Smart Factory Dashboard',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="text-foreground min-h-screen bg-bg antialiased">
        <div className="grid grid-cols-[240px_1fr]">
          <NavigationBar />
          <main className="h-dvh overflow-hidden px-6 py-4">{children}</main>
        </div>
      </body>
    </html>
  );
}
