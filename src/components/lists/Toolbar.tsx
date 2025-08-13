'use client';

import React from 'react';
import { AiOutlineCalendar } from 'react-icons/ai';
import IconBtn from './IconBtn';
import CalendarPopover from './CalendarPopover';

export type Grade = 'A' | 'B' | 'defect';

type Props = {
  sortOrder: 'asc' | 'desc';
  onToggleSort: () => void;
  onPickDate: (date: string | null) => void;
  currentDate?: string | null;

  currentGrade?: Grade | null;
  onPickGrade?: (g: Grade | null) => void;
};

const Toolbar: React.FC<Props> = ({
  sortOrder,
  onToggleSort,
  onPickDate,
  currentDate,
  currentGrade = null,
  onPickGrade,
}) => {
  const [open, setOpen] = React.useState(false);
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  
  React.useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const selected = currentDate ? new Date(currentDate) : undefined;

  
  const GradePill = ({ label }: { label: Grade }) => {
    const active = currentGrade === label;
    return (
      <button
        type="button"
        onClick={() => onPickGrade?.(active ? null : label)} 
        aria-pressed={active}
        className={[
          'px-3 py-1 rounded-md text-sm transition',
          active ? 'bg-white/15 text-heading' : 'bg-white/5 text-sub hover:bg-white/10',
          'focus:outline-none focus:ring-2 focus:ring-white/20',
        ].join(' ')}
        title={label}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="flex items-center gap-2">
      {/* Grade 토글 */}
      <div className="flex h-[50px] items-center gap-1 rounded border border-brand-border bg-box px-2">
  <GradePill label="A" />
  <GradePill label="B" />
  <GradePill label="defect" />
</div>


      {/* 캘린더 */}
      <div className="relative" ref={wrapperRef}>
        <IconBtn title="날짜" onClick={() => setOpen(v => !v)}>
          <AiOutlineCalendar size={20} />
        </IconBtn>

        {open && (
          <div className="absolute left-0 top-[calc(100%+8px)] z-50">
            <CalendarPopover
              value={selected}
              onSelect={(ymd) => onPickDate(ymd || null)}
              onClose={() => setOpen(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Toolbar;
