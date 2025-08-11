// src/components/charts/PieABDefect.tsx
'use client';
import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

type Props = { a: number; b: number; defect: number };

export default function PieABDefect({ a, b, defect }: Props) {
  // 보여줄 순서(예: B가 메인 웨지)
  const data = [
    { key: 'b', name: 'B', value: b },
    { key: 'a', name: 'A', value: a },
    { key: 'd', name: 'defect', value: defect },
  ];

  const color = {
    a: 'var(--tw-color-brand-a, #cb3cff)', // 보라
    b: 'var(--tw-color-brand-b, #0038ff)', // 파랑
    d: 'var(--tw-color-defect, #39c6ff)', // 하늘
    bg: 'var(--tw-color-bg', // 배경 비슷한 톤(스트로크용)
  } as const;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>

        {/* ── 메인 파이 ─────────────────────────── */}
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          // 12시 시작, 시계방향 회전
          startAngle={90}
          endAngle={-270}
          // 도넛이 아닌 꽉 찬 원: innerRadius 생략(또는 0)
          // 반응형 컨테이너에 맞춰 퍼센트 사용
          outerRadius="100%"
          paddingAngle={0} // 섹션간 아주 얇은 간격
          cornerRadius={0} // 끝 둥글게 X (이미지 느낌에 맞춤)
          stroke="none" // 배경색 계열로 얇은 링
          strokeWidth={0}
          isAnimationActive={false}
        >
          {data.map(d => (
            <Cell key={d.key} fill={d.key === 'a' ? color.a : d.key === 'b' ? color.b : color.d} />
          ))}
        </Pie>

        <Tooltip
          cursor={false}
          formatter={(v: any, n: any) => [v as number, n as string]}
          contentStyle={{ borderRadius: 8, fontSize: 12 }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
