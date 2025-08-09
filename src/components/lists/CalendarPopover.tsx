import React from 'react';

type Props = {
  value?: Date;                              // 선택된 날짜(옵션)
  onSelect: (isoDate: string) => void;       // 'YYYY-MM-DD' 로 전달
  onClose?: () => void;
};

function fmtYYYYMMDD(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function endOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}
function addMonths(d: Date, n: number) {
  return new Date(d.getFullYear(), d.getMonth() + n, 1);
}

const WEEK = ['S','M','T','W','T','F','S'];

export default function CalendarPopover({ value, onSelect, onClose }: Props) {
  const [view, setView] = React.useState<Date>(value ? startOfMonth(value) : startOfMonth(new Date()));
  const selected = value ? fmtYYYYMMDD(value) : '';

  const start = startOfMonth(view);
  const end = endOfMonth(view);

  // 달력 셀 구성 (이달 1일의 요일만큼 앞에 빈칸)
  const days: (Date | null)[] = [];
  const pad = start.getDay(); // 0~6
  for (let i = 0; i < pad; i++) days.push(null);
  for (let d = 1; d <= end.getDate(); d++) {
    days.push(new Date(view.getFullYear(), view.getMonth(), d));
  }
  // 7의 배수로 채우기
  while (days.length % 7) days.push(null);

  const title = view.toLocaleDateString(undefined, { year: 'numeric', month: 'long' }); // e.g., December 2021
  const todayYmd = fmtYYYYMMDD(new Date());

  return (
    <div className="w-[260px] rounded-xl border border-brand-border bg-box text-heading shadow-side p-3">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs opacity-80">{title}</div>
        <div className="flex items-center gap-1">
          <button className="h-6 w-6 grid place-items-center rounded bg-white/5 hover:bg-white/10"
                  onClick={() => setView((v) => addMonths(v, -1))}>‹</button>
          <button className="h-6 w-6 grid place-items-center rounded bg-white/5 hover:bg-white/10"
                  onClick={() => setView((v) => addMonths(v, 1))}>›</button>
        </div>
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 text-[11px] text-sub/80 mb-1">
        {WEEK.map((w) => <div key={w} className="h-6 grid place-items-center">{w}</div>)}
      </div>

      {/* 날짜 그리드 */}
      <div className="grid grid-cols-7 gap-y-1 text-sm">
        {days.map((d, i) => {
          if (!d) return <div key={i} className="h-8" />;
          const ymd = fmtYYYYMMDD(d);
          const isToday = ymd === todayYmd;
          const isSelected = ymd === selected;

          return (
            <button
              key={i}
              onClick={() => { onSelect(ymd); onClose?.(); }}
              className={[
                "h-8 w-8 mx-auto grid place-items-center rounded-full transition",
                isSelected ? "bg-button text-white" : "hover:bg-white/10",
                isToday && !isSelected ? "ring-1 ring-brand-border" : "",
              ].join(' ')}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>

      {/* 푸터 */}
      <div className="flex items-center justify-between mt-2 text-xs text-sub">
        <button className="hover:underline" onClick={() => { onSelect(''); onClose?.(); }}>
          Clear
        </button>
        <button className="hover:underline" onClick={() => { onSelect(todayYmd); onClose?.(); }}>
          Today
        </button>
      </div>
    </div>
  );
}
