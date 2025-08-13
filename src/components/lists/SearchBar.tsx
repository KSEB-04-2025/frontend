import React from 'react';
import { AiOutlineSearch } from 'react-icons/ai';

type Props = {
  value?: string;
  placeholder?: string;
  onChange?: (v: string) => void;
  onSearch?: () => void;
};

function SearchBar({ value, placeholder = 'Search for...', onChange, onSearch }: Props) {
  return (
    <div className="flex w-full gap-2">
      <div className="relative h-[50px] flex-1 rounded border border-brand-border bg-box">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 opacity-80">
          <AiOutlineSearch size={18} />
        </span>

        <input
          type="text"
          value={value ?? ''}
          placeholder={placeholder}
          onChange={e => onChange?.(e.target.value)}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            const isComposing = (e.nativeEvent as KeyboardEvent).isComposing;
            if (e.key === 'Enter' && !isComposing) onSearch?.();
          }}
          className="absolute inset-0 h-full w-full bg-transparent pl-10 pr-3 text-sm text-heading outline-none placeholder:text-sub/80"
        />
      </div>

      <button
        onClick={onSearch}
        className="h-[50px] w-[80px] rounded-lg bg-button font-dm-sans text-lg text-white hover:opacity-90"
      >
        검색
      </button>
    </div>
  );
}

export default SearchBar;
