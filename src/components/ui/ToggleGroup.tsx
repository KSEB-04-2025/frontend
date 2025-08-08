import React from 'react';

export default function ToggleGroup<T extends string>({
  options,
  selected,
  onChange,
}: {
  options: { label: string; value: T }[];
  selected: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="inline-flex overflow-hidden rounded border">
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-4 py-2 ${selected === opt.value ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
