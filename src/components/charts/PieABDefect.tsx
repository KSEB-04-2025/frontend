// src/components/charts/PieABDefect.tsx
'use client';
import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

type Props = { a: number; b: number; defect: number };

type SliceKey = 'a' | 'b' | 'd';
type DataItem = { key: SliceKey; name: string; value: number };

export default function PieABDefect({ a, b, defect }: Props) {
  // 보여줄 순서(예: B가 메인 웨지)
  const data: DataItem[] = [
    { key: 'b', name: 'B', value: b },
    { key: 'a', name: 'A', value: a },
    { key: 'd', name: 'defect', value: defect },
  ];

  const color = {
    a: 'var(--tw-color-brand-a, #cb3cff)', // 보라
    b: 'var(--tw-color-brand-b, #0038ff)', // 파랑
    d: 'var(--tw-color-defect, #39c6ff)', // 하늘
    bg: 'var(--tw-color-bg, #0b1426)', // (미사용) 배경 톤
  } as const;

  // Tooltip 포매터: any 제거
  const tooltipFormatter = (value: number | string, name: string): [number, string] => {
    const v = typeof value === 'number' ? value : Number(value);
    return [v, name];
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          startAngle={90}
          endAngle={-270}
          outerRadius="100%"
          paddingAngle={0}
          cornerRadius={0}
          stroke="none"
          strokeWidth={0}
          isAnimationActive={false}
        >
          {data.map(d => (
            <Cell key={d.key} fill={d.key === 'a' ? color.a : d.key === 'b' ? color.b : color.d} />
          ))}
        </Pie>

        <Tooltip
          cursor={false}
          formatter={tooltipFormatter}
          contentStyle={{ borderRadius: 8, fontSize: 12 }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
