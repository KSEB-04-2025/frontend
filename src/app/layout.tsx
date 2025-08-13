import type { Metadata } from 'next';
import './globals.css';
import Shell from '@/components/Shell';
import RQProvider from './RQProvider'; // ✅ 추가

export const metadata: Metadata = {
  title: 'ZEZE ONE',
  description: 'Smart Factory Dashboard',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="text-foreground min-h-screen bg-bg antialiased">
        {/* ✅ 전역으로 감싸기 */}
        <RQProvider>
          <Shell>{children}</Shell>
        </RQProvider>
      </body>
    </html>
  );
}
