
import React from 'react';

export type Row = { id: string; grade: 'A' | 'B' | 'C'; date: string };

function gradeColor(grade: Row['grade']) {
  if (grade === 'A') return 'text-gradea';   // #14CA74
  if (grade === 'B') return 'text-gradeb';   // #FFCE20
  return 'text-defect';                      // #00c2ff
}

export default function FigmaListCard({ rows }: { rows: Row[] }) {
  return (
    <div className="rounded-xl border border-brand-border bg-box text-heading font-dm-sans overflow-hidden">
      {/* 상단 타이틀 바 */}
      <div className="px-5 h-14 flex items-center text-lg text-bg-heading">
        All Products
      </div>
      <div className="border-t border-brand-border" />

      {/* 헤더 라인 (Id / Grade / Date) */}
      <div className="px-5 h-[56.8px] grid items-center text-bg-heading">
        <div className="grid grid-cols-[minmax(0,1fr)_500px_200px] items-center">
          <div className="flex items-center gap-1">
            <span className="uppercase tracking-tight">Id</span>
            <ArrowDown />
          </div>
          <div className="flex items-center gap-1 pl-1">
            <span>Grade</span>
            <ArrowDown />
          </div>
          <div className="flex items-center gap-1 pl-2">
            <span>Date</span>
            <ArrowDown />
          </div>
        </div>
      </div>

      {/* 바디 */}
      <div className="divide-y divide-list-sep">
  {rows.map((r, i) => (
    <div
      key={`${r.id}-${i}`}
      className={`px-5 h-[56.8px] grid items-center hover:bg-white/5 
        ${i % 2 === 0 ? 'bg-box' : 'bg-[#0a1330]'}`}  // 번갈아 배경색 적용
    >
      <div className="grid grid-cols-[minmax(0,1fr)_500px_200px] items-center">
        <span className="truncate">{r.id}</span>
        <span className={`text-left pl-2 font-semibold ${gradeColor(r.grade)}`}>
          {r.grade}
        </span>
        <span className="text-left pl-2 text-sub tabular-nums">{r.date}</span>
      </div>
    </div>
  ))}
</div>
    </div>
  );
}

function ArrowDown() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" className="opacity-70">
      <path fill="currentColor" d="m7 10l5 5l5-5z" />
    </svg>
  );
}
