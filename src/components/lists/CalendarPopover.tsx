import React from 'react';

type Props = {
  value?: Date;
  onSelect: (isoDate: string) => void;
  onClose?: () => void;
};

function fmtYYYYMMDD(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
const endOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth() + 1, 0);
const addMonths = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth() + n, 1);

const WEEK = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export default function CalendarPopover({ value, onSelect, onClose }: Props) {
  const [view, setView] = React.useState<Date>(
    value ? startOfMonth(value) : startOfMonth(new Date())
  );
  const selected = value ? fmtYYYYMMDD(value) : '';

  const start = startOfMonth(view);
  const end = endOfMonth(view);

  const days: (Date | null)[] = [];
  const pad = start.getDay(); // 0~6
  for (let i = 0; i < pad; i++) days.push(null);
  for (let d = 1; d <= end.getDate(); d++) {
    days.push(new Date(view.getFullYear(), view.getMonth(), d));
  }
  while (days.length % 7) days.push(null);

  const title = view.toLocaleDateString(undefined, { year: 'numeric', month: 'long' });
  const todayYmd = fmtYYYYMMDD(new Date()); // ← 이 이름과 일치하게 사용

  return (
    <div className="w-[260px] rounded-xl border border-brand-border bg-box p-3 text-heading shadow-side">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-xs opacity-80">{title}</div>
        <div className="flex items-center gap-1">
          <button
            className="grid h-6 w-6 place-items-center rounded bg-white/5 hover:bg-white/10"
            onClick={() => setView(v => addMonths(v, -1))}
          >
            ‹
          </button>
          <button
            className="grid h-6 w-6 place-items-center rounded bg-white/5 hover:bg-white/10"
            onClick={() => setView(v => addMonths(v, 1))}
          >
            ›
          </button>
        </div>
      </div>

      <div className="mb-1 grid grid-cols-7 text-[11px] text-sub/80">
        {WEEK.map((w, idx) => (
          <div key={`${w}-${idx}`} className="grid h-6 place-items-center">
            {w}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-1 text-sm">
        {days.map((d, i) => {
          if (!d) return <div key={`pad-${i}`} className="h-8" />; // 패딩칸

          const ymd = fmtYYYYMMDD(d);
          const isSelected = selected === ymd;
          const isToday = ymd === todayYmd; // ← 여기!

          return (
            <button
              key={`${ymd}-${i}`}
              onClick={() => {
                onSelect(ymd);
                onClose?.();
              }}
              className={[
                'mx-auto grid h-8 w-8 place-items-center rounded-full transition',
                isSelected ? 'bg-button text-white' : 'hover:bg-white/10',
                isToday && !isSelected ? 'ring-1 ring-brand-border' : '',
              ].join(' ')}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>

      {/* 푸터 */}
      <div className="mt-2 flex items-center justify-between text-xs text-sub">
        <button
          className="hover:underline"
          onClick={() => {
            onSelect('');
            onClose?.();
          }}
        >
          Clear
        </button>
        <button
          className="hover:underline"
          onClick={() => {
            onSelect(todayYmd);
            onClose?.();
          }}
        >
          Today
        </button>
      </div>
    </div>
  );
}
