'use client';
import React, { useState } from 'react';

type Period = 'day' | 'week' | 'month';

const options: { label: string; value: Period }[] = [
  { label: '일별', value: 'day' },
  { label: '주별', value: 'week' },
  { label: '월별', value: 'month' },
];

export default function ChartSection() {
  const [period, setPeriod] = useState<Period>('day');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium">생산량 추이</h2>
        <div className="inline-flex overflow-hidden rounded border border-gray-700">
          {options.map(opt => (
            <button
              key={opt.value}
              onClick={() => setPeriod(opt.value)}
              className={`px-4 py-2 ${
                period === opt.value ? 'bg-brand-a text-white' : 'hover:bg-gray-700'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex h-48 items-center justify-center rounded bg-gray-800">[차트 영역]</div>
    </div>
  );
}
