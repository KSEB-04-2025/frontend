import type { NextPage } from 'next';
import React from 'react';
import { MdFilterList } from 'react-icons/md';
import { AiOutlineCalendar } from 'react-icons/ai';
import IconBtn from './IconBtn';
import CalendarPopover from './CalendarPopover';

type Props = {
  sortOrder: 'asc' | 'desc';
  onToggleSort: () => void;
  onPickDate: (date: string | null) => void; // 'YYYY-MM-DD' or null
  currentDate?: string | null;
};

const Toolbar: NextPage<Props> = ({ sortOrder, onToggleSort, onPickDate, currentDate }) => {
  const [open, setOpen] = React.useState(false);
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  // 바깥 클릭 시 닫기
  React.useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  const selected = currentDate ? new Date(currentDate) : undefined;

  return (
    <div className="flex items-center gap-2">
      <IconBtn title="정렬" onClick={onToggleSort}>
        <MdFilterList size={20} />
      </IconBtn>

      <div className="relative" ref={wrapperRef}>
        <IconBtn title="날짜" onClick={() => setOpen((v) => !v)}>
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

      <span className="text-s text-sub">{sortOrder === 'asc' ? '날짜↑' : '날짜↓'}</span>
    </div>
  );
};

export default Toolbar;
