// src/components/lists/SearchBar.tsx
import type { NextPage } from 'next';
import React from 'react';
import { AiOutlineSearch } from 'react-icons/ai';

type Props = {
  value?: string;
  placeholder?: string;
  onChange?: (v: string) => void;
  onSearch?: () => void;
};

const SearchBar: NextPage<Props> = ({
  value,
  placeholder = 'Search for...',
  onChange,
  onSearch,
}) => {
  return (
    <div className="flex w-full gap-2">
      {/* 검색 입력창 */}
      <div className="relative flex-1 h-[50px] rounded border border-brand-border bg-box">
        {/* 검색 아이콘 */}
        <span className="absolute left-3 top-1/2 -translate-y-1/2 opacity-80">
          <AiOutlineSearch size={18} />
        </span>

        <input
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange?.(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSearch?.();
          }}
          className="absolute inset-0 w-full h-full bg-transparent pl-10 pr-3 text-sm text-heading placeholder:text-sub/80 outline-none"
        />
      </div>

      {/* 검색 버튼 */}
      <button
        onClick={onSearch}
        className="w-[80px] h-[50px] rounded-lg bg-button hover:opacity-90 text-lg font-dm-sans text-white"
      >
        검색
      </button>
    </div>
  );
};

export default SearchBar;
