import type { Metadata } from 'next';
import './globals.css';
import Shell from '@/components/Shell';

export const metadata: Metadata = {
  title: 'ZEZE ONE',
  description: 'Smart Factory Dashboard',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="text-foreground min-h-screen bg-bg antialiased">
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
