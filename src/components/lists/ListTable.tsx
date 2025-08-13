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
  
  sortKey?: 'id' | 'grade' | 'date';
  sortOrder?: 'asc' | 'desc';
  onSort?: (key: 'id' | 'grade' | 'date') => void;
};

export default function FigmaListCard({
  rows,
  page = 1,
  pageSize = 20,
  sortKey,
  sortOrder,
  onSort,
}: Props) {
  const start = (page - 1) * pageSize;
  const pageRows = rows.slice(start, start + pageSize);


  const arrowCls = (key: 'id' | 'grade' | 'date') =>
    `transition-transform duration-200 ${sortKey === key && sortOrder === 'desc' ? 'rotate-180' : ''}`;

  return (
    <div className="overflow-hidden rounded-xl border border-brand-border bg-box font-dm-sans text-heading">
      
      
      <div className="border-t border-brand-border" />

      
      <div className="hidden h-[56.8px] items-center px-5 text-lg md:grid">
  <div className="grid grid-cols-[minmax(0,1fr)_200px_150px] items-center md:grid-cols-[minmax(0,1fr)_500px_200px]">
          
          <button
            type="button"
            onClick={() => onSort?.('id')}
            className="flex items-center gap-1 pl-10 py-4 text-left hover:opacity-90"
          >
            <span>Id</span>
            <ArrowDown className={arrowCls('id')} />
          </button>

          {/* Grade */}
          <button
            type="button"
            onClick={() => onSort?.('grade')}
            className="flex items-center gap-2 pl-1 py-4 text-left hover:opacity-90"
          >
            <span>Grade</span>
    
          </button>

          
          <button
            type="button"
            onClick={() => onSort?.('date')}
            className="flex items-center gap-1 pl-2 py-4 text-left hover:opacity-90"
          >
            <span>Date</span>
            <ArrowDown className={arrowCls('date')} />
          </button>
        </div>
      </div>
      <div className="h-px border border-brand-border" /> 
      
      <div className="divide-y divide-list-sep">
        {pageRows.map((r, i) => (
          <div
            key={`${r.id}-${start + i}`}
            className={`px-5 py-5 hover:bg-white/5 ${(start + i) % 2 === 0 ? 'bg-box' : 'bg-[#0a1330]'}`}
          >
            
            <div className="hidden grid-cols-[minmax(0,1fr)_200px_150px] items-center md:grid md:grid-cols-[minmax(0,1fr)_500px_200px]">
              <Link
                href={`/list/${encodeURIComponent(r.id)}`}
                className="truncate pl-10 text-lg hover:underline"
                title={r.id}
              >
                {r.id}
              </Link>
              <span className={`pl-2 text-left text-lg font-semibold ${gradeColor(r.grade)}`}>{r.grade}</span>
              <span className="pl-2 text-left text-lg tabular-nums">{r.date}</span>
            </div>

            
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


function ArrowDown({ className = '' }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" className={`opacity-70 ${className}`}>
      <path fill="currentColor" d="m7 10 5 5 5-5z" />
    </svg>
  );
}
