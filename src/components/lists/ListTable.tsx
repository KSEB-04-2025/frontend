import Link from 'next/link';
import React from 'react';

export type Row = { id: string; grade: 'A' | 'B' | 'defect'; date: string };

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
    <div className="overflow-hidden rounded-xl border border-brand-border bg-box font-dm-sans text-heading">
      {/* 헤더 */}
      <div className="flex h-14 items-center px-5 text-lg">All Products</div>
      <div className="border-t border-brand-border" />

      {/* 테이블 헤더 */}
      <div className="hidden h-[56.8px] items-center px-5 text-lg md:grid">
        <div className="grid grid-cols-[minmax(0,1fr)_200px_150px] items-center md:grid-cols-[minmax(0,1fr)_500px_200px]">
          <div className="flex items-center gap-1 pl-10">
            <span>Id</span>
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

      {/* 데이터 */}
      <div className="divide-y divide-list-sep">
        {pageRows.map((r, i) => (
          <div
            key={`${r.id}-${start + i}`}
            className={`px-5 py-5 hover:bg-white/5 ${(start + i) % 2 === 0 ? 'bg-box' : 'bg-[#0a1330]'}`}
          >
            {/* 데스크탑: 3열 */}
            <div className="hidden grid-cols-[minmax(0,1fr)_200px_150px] items-center md:grid md:grid-cols-[minmax(0,1fr)_500px_200px]">
              <Link
                href={`/list/${encodeURIComponent(r.id)}`}
                className="truncate pl-10 text-lg hover:underline"
                title={r.id}
              >
                {r.id}
              </Link>
              <span className={`pl-2 text-left text-lg font-semibold ${gradeColor(r.grade)}`}>
                {r.grade}
              </span>
              <span className="pl-2 text-left text-lg tabular-nums">{r.date}</span>
            </div>

            {/* 모바일: 카드 형식 */}
            <div className="flex flex-col gap-1 md:hidden">
              <Link
                href={`/list/${encodeURIComponent(r.id)}`}
                className="text-m truncate font-semibold hover:underline"
                title={r.id}
              >
                ID: {r.id}
              </Link>
              <div className="text-m">
                Grade: <span className={`${gradeColor(r.grade)} font-semibold`}>{r.grade}</span>
              </div>
              <div className="text-s text-sub">Date: {r.date}</div>
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
      <path fill="currentColor" d="m7 10 5 5 5-5z" />
    </svg>
  );
}
