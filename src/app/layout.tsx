import "@/app/globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="flex h-screen">
        {/* ── 사이드바 (네비) */}
        <aside className="hidden md:block w-64 border-r border-gray-200 p-4">
          <div className="placeholder h-12 flex items-center justify-center">
            NAV
          </div>
        </aside>

        {/* ── 메인 컨텐트 */}
        <main className="flex-1 overflow-auto">{children}</main>
      </body>
    </html>
  );
}
