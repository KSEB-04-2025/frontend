'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import useSWR from 'swr';
import LogoutButton from '@/components/sections/LogoutButton';

import { Home, BarChart2, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';

type Health = {
  ok?: boolean;
  timestamp?: string;
  defect?: string;
  classify?: string;
  ir1?: string;
  ir2?: string;
};

const fetcher = (url: string) =>
  fetch(url, { cache: 'no-store' }).then(r => {
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
  });

export default function NavigationBar() {
  const pathname = usePathname();
  const items = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/list', label: 'List', icon: BarChart2 },
  ];

  const [fetchedAt, setFetchedAt] = useState<number | null>(null);
  const { data, error, isLoading } = useSWR<Health>('/api/health', fetcher, {
    refreshInterval: 40000,
    dedupingInterval: 5000,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    refreshWhenHidden: false,
    onSuccess: () => setFetchedAt(Date.now()),
  });

  return (
    <aside className="border-muted relative sticky top-0 h-dvh w-60 shrink-0 bg-nav shadow-side">
      {/* 로고 */}
      <div className="flex h-16 items-center gap-2 px-5">
        <div className="grid h-8 w-8 place-items-center rounded-sm bg-nav" />
        <span className="select-none text-2xl font-semibold tracking-wide text-heading/90">
          ZEZE
        </span>
        <span className="font-regular select-none text-2xl tracking-wide text-heading/90">ONE</span>
      </div>

      {/* 메뉴 */}
      <nav className="mt-2 flex flex-col gap-1 px-2">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? 'page' : undefined}
              className={[
                'group relative flex items-center gap-3 rounded-md px-4 py-2.5 transition',
                active ? 'text-brand-a' : 'text-sub hover:text-heading',
                'hover:bg-white/5',
                'text-[20px]',
              ].join(' ')}
            >
              <Icon className="size-[18px]" />
              <span className="truncate">{label}</span>

              {active && (
                <span className="pointer-events-none absolute right-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded bg-brand-a" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* 헬스체크 */}
      <div className="absolute inset-x-0 bottom-6 p-3">
        {(() => {
          const norm = (v?: string) =>
            String(v ?? '')
              .trim()
              .toLowerCase();

          const Icon = (state?: string) => {
            if (isLoading) return <RefreshCw className="size-4 animate-spin text-sub" />;
            if (error || !data) return <AlertTriangle className="size-4 text-red-500" />;

            const s = norm(state);
            if (['ok', 'connected'].includes(s)) {
              return (
                <span className="grid h-6 w-6 place-items-center rounded-full bg-emerald-600/20">
                  <CheckCircle2 className="size-4 text-emerald-500" />
                </span>
              );
            }
            if (['error', 'fail'].includes(s)) {
              return (
                <span className="grid h-6 w-6 place-items-center rounded-full bg-red-600/20">
                  <AlertTriangle className="size-4 text-red-500" />
                </span>
              );
            }
            return (
              <span className="grid h-6 w-6 place-items-center rounded-full bg-yellow-500/20">
                <AlertTriangle className="size-4 text-yellow-500" />
              </span>
            );
          };

          const rows = [
            { label: '분류 서버', value: data?.classify },
            { label: '결함 서버', value: data?.defect },
            { label: '카메라1', value: data?.ir1 },
            { label: '카메라2', value: data?.ir2 },
          ];

          return (
            <div className="rounded-lg border border-brand-border p-3">
              {/* 헤더 */}
              <div className="mb-2 flex items-center justify-between px-2 text-xs font-semibold tracking-wide text-sub">
                <span>NAME</span>
                <span>STATUS</span>
              </div>

              {/* 행들 */}
              <div className="-mx-3 divide-y divide-list-sep">
                {rows.map((r, idx) => (
                  <div
                    key={`${r.label}-${idx}`}
                    className={`flex items-center justify-between px-5 py-3 hover:bg-white/5 ${
                      idx === 1 || idx === 3 ? 'bg-[#0a1330]' : ''
                    }`}
                  >
                    <span className="truncate text-[15px]">{r.label}</span>
                    {Icon(r.value)}
                  </div>
                ))}
              </div>

              {/* 업데이트 시간(있으면 표시) */}
              <div className="mt-3 text-[11px] text-sub">
                Updated: {fetchedAt ? new Date(fetchedAt).toLocaleString() : '—'}
              </div>
            </div>
          );
        })()}

        {/* 헬스체크 박스 아래 로그아웃 버튼 */}
        <LogoutButton className="mt-3" />
      </div>
    </aside>
  );
}
