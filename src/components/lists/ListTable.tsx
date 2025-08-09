import Link from 'next/link';
import React from 'react';

export type Row = { id: string; grade: 'A'|'B'|'defect'; date: string };

function gradeColor(g: Row['grade']) {
  if (g === 'A') return 'text-gradea';
  if (g === 'B') return 'text-gradeb';
  return 'text-defect';
}

type Props = {
  rows: Row[];
  page?: number;          
  pageSize?: number;      
};

export default function FigmaListCard({ rows, page = 1, pageSize = 20 }: Props) {
  const start = (page - 1) * pageSize;
  const pageRows = rows.slice(start, start + pageSize);

  return (
    <div className="rounded-xl border border-brand-border bg-box text-heading font-dm-sans overflow-hidden">
      <div className="px-5 h-14 flex items-center text-lg">All Products</div>
      <div className="border-t border-brand-border" />

      <div className="px-5 h-[56.8px] grid items-center text-sub">
        <div className="grid grid-cols-[minmax(0,1fr)_500px_200px] items-center">
          <div className="flex items-center gap-1"><span>Id</span><ArrowDown/></div>
          <div className="flex items-center gap-1 pl-1"><span>Grade</span><ArrowDown/></div>
          <div className="flex items-center gap-1 pl-2"><span>Date</span><ArrowDown/></div>
        </div>
      </div>

      <div className="divide-y divide-list-sep">
        {pageRows.map((r, i) => (
          <div
            key={`${r.id}-${start + i}`}
            className={`px-5 h-[56.8px] grid items-center hover:bg-white/5 ${(start + i) % 2 === 0 ? 'bg-box' : 'bg-[#0a1330]'}`}
          >
            <div className="grid grid-cols-[minmax(0,1fr)_500px_200px] items-center">
              <Link href={`/list/${encodeURIComponent(r.id)}`} className="truncate hover:underline" title={r.id}>
                {r.id}
              </Link>
              <span className={`text-left pl-2 font-semibold ${gradeColor(r.grade)}`}>{r.grade}</span>
              <span className="text-left pl-2 text-sub tabular-nums">{r.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ArrowDown() {
  return <svg width="16" height="16" viewBox="0 0 24 24" className="opacity-70"><path fill="currentColor" d="m7 10 5 5 5-5z"/></svg>;
}
