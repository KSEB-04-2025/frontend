'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BarChart2 } from 'lucide-react';

export default function NavigationBar() {
  const pathname = usePathname();
  const items = [
    { href: '/', label: 'Dashboard', icon: Home },
    { href: '/list', label: 'List', icon: BarChart2 },
  ];

  return (
    <aside className="border-muted sticky top-0 h-screen w-60 shrink-0 bg-nav shadow-side">
      <div className="flex h-16 items-center gap-2 px-5">
        <div className="bg-surface/20 grid h-8 w-8 place-items-center rounded-sm"></div>
        <span className="text-foreground/90 select-none text-2xl font-semibold tracking-wide">
          ZEZE
        </span>
        <span className="text-foreground/90 font-regular select-none text-2xl tracking-wide">
          ONE
        </span>
      </div>

      {/* 메뉴 */}
      <nav className="mt-2 flex flex-col gap-1 px-2">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
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
    </aside>
  );
}
