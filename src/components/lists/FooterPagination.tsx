// src/components/lists/FooterPagination.tsx
'use client';
import React from 'react';

type Props = {
  total: number;
  page: number; // 1부터 시작
  pageSize: number;
  onChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
};

export default function FooterPagination({
  total,
  page,
  pageSize,
  onChange,
  onPageSizeChange,
}: Props) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const clampedPage = Math.min(Math.max(page, 1), totalPages);

  const start = total === 0 ? 0 : (clampedPage - 1) * pageSize + 1;
  const end = total === 0 ? 0 : Math.min(clampedPage * pageSize, total);

  const prevDisabled = clampedPage <= 1;
  const nextDisabled = clampedPage >= totalPages;

  return (
    <div className="flex items-center justify-between text-sm text-slate-400">
      <div className="border-darkslategray/60 rounded-lg border bg-[#0f1421] px-4 py-2">
        {start} - {end} of {total}
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs">Rows per page:</span>

        <select
          className="border-darkslategray/60 rounded border bg-[#0f1421] px-2 py-1 text-xs outline-none"
          value={pageSize}
          onChange={e => {
            const size = Number(e.target.value);
            onPageSizeChange?.(size);
            // 보통 페이지 크기 바꾸면 1페이지로
            onChange?.(1);
          }}
        >
          {[20, 40, 80].map(n => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-1">
          <NavBtn
            title="Prev"
            disabled={prevDisabled}
            onClick={() => !prevDisabled && onChange?.(clampedPage - 1)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path fill="currentColor" d="M15 18l-6-6l6-6" />
            </svg>
          </NavBtn>

          <NavBtn
            title="Next"
            disabled={nextDisabled}
            onClick={() => !nextDisabled && onChange?.(clampedPage + 1)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" className="rotate-180">
              <path fill="currentColor" d="M15 18l-6-6l6-6" />
            </svg>
          </NavBtn>
        </div>
      </div>
    </div>
  );
}

function NavBtn({
  title,
  children,
  disabled,
  onClick,
}: React.PropsWithChildren<{ title: string; disabled?: boolean; onClick?: () => void }>) {
  return (
    <button
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={`border-darkslategray/60 grid size-8 place-items-center rounded border ${disabled ? 'cursor-not-allowed opacity-40' : 'bg-[#0f1421] hover:bg-[#121a2b]'}`}
    >
      {children}
    </button>
  );
}
