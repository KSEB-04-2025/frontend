'use client';
import React from 'react';

type Props = { total: number; page: number; pageSize: number };

export default function FooterPagination({ total, page, pageSize }: Props) {
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  return (
    <div className="flex items-center justify-between text-sm text-slate-400">
      <div className="rounded-lg border border-darkslategray/60 bg-[#0f1421] px-4 py-2">
        {start} - {end} of {total}
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs">Rows per page:</span>
        <select className="bg-[#0f1421] border border-darkslategray/60 rounded px-2 py-1 text-xs outline-none">
          {[20, 40, 80].map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>

        <div className="flex items-center gap-1">

          <NavBtn title="Prev">
            <svg width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M15 18l-6-6l6-6"/></svg>
          </NavBtn>
          <NavBtn title="Next">
            <svg width="16" height="16" viewBox="0 0 24 24" className="rotate-180"><path fill="currentColor" d="M15 18l-6-6l6-6"/></svg>
          </NavBtn>

        </div>
      </div>
    </div>
  );
}

function NavBtn({ title, children }: React.PropsWithChildren<{title: string}>) {
  return (
    <button
      title={title}
      className="grid place-items-center size-8 rounded border border-darkslategray/60 bg-[#0f1421] hover:bg-[#121a2b]"
    >
      {children}
    </button>
  );
}
