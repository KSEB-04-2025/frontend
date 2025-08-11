'use client';

import React from 'react';
import { useDashboard } from '@/store/dashboard';

const LABEL: Record<'today' | 'week' | 'month', string> = {
  today: 'Today',
  week: 'Week',
  month: 'Month',
};

export default function ToggleDropdown() {
  const period = useDashboard(s => s.period);
  const setPeriod = useDashboard(s => s.setPeriod);
  const [open, setOpen] = React.useState(false);
  const btnRef = React.useRef<HTMLButtonElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);

  // 바깥 클릭 닫기
  React.useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!open) return;
      const t = e.target as Node;
      if (!menuRef.current?.contains(t) && !btnRef.current?.contains(t)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (!open) return;
      if (e.key === 'Escape') setOpen(false);
    }
    window.addEventListener('mousedown', onClick);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('mousedown', onClick);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const handleSelect = (p: 'today' | 'week' | 'month') => {
    setPeriod(p);
    setOpen(false);
    btnRef.current?.focus();
  };

  return (
    <div className="relative inline-block text-left">
      {/* 트리거 버튼 */}
      <button
        ref={btnRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen(v => !v)}
        className="font-regular inline-flex items-center gap-2 rounded-md bg-day px-4 py-2 text-xl text-heading hover:bg-day/80 focus:outline-none"
      >
        {LABEL[period]}
        <svg
          className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.127l3.71-3.896a.75.75 0 111.08 1.04l-4.24 4.46a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* 드롭다운 메뉴 */}
      {open && (
        <div
          ref={menuRef}
          role="listbox"
          aria-activedescendant={`period-${period}`}
          tabIndex={-1}
          className="absolute z-50 mt-2 w-36 overflow-hidden rounded-md border border-brand-border bg-day shadow-side outline-none"
        >
          {(['today', 'week', 'month'] as const).map(p => {
            const active = p === period;
            return (
              <button
                key={p}
                id={`period-${p}`}
                role="option"
                aria-selected={active}
                onClick={() => handleSelect(p)}
                className={`flex w-full items-center justify-between px-3 py-2 text-lg transition ${active ? 'bg-day text-white' : 'text-list-sep hover:bg-white/5 hover:text-heading'}`}
              >
                <span>{LABEL[p]}</span>
                {active && (
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M5 13l4 4L19 7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
