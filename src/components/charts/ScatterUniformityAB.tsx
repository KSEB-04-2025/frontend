// src/components/charts/ScatterUniformityAB.tsx
'use client';

import React from 'react';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceLine,
  ReferenceArea,
} from 'recharts';
import type { UniformityItem } from '@/apis/dashboard';

type Props = {
  points: UniformityItem[];
  xDomain?: [number, number]; // Number of Clusters
  yDomain?: [number, number]; // Uniformity
  height?: number;
  xCut?: number; // 임계선(옵션)
  yCut?: number; // 임계선(옵션)
  shadeARegion?: boolean; // A 예측영역(왼쪽-위) 음영
  regionOpacity?: number; // 음영 투명도
};

interface TooltipPayloadLike {
  payload?: { x?: number; y?: number };
}
type DotProps = { cx?: number; cy?: number; fill?: string };
const DotA = ({ cx = 0, cy = 0, fill = '#cb3cff' }: DotProps) => (
  <circle cx={cx} cy={cy} r={4} fill={fill} stroke="rgba(255,255,255,0.85)" strokeWidth={0.6} />
);
const DotB = ({ cx = 0, cy = 0, fill = '#3d63ff' }: DotProps) => (
  <circle cx={cx} cy={cy} r={3} fill={fill} />
);
export default function ScatterUniformityAB({
  points,
  xDomain = [0, 120],
  yDomain = [0.6, 1.0],
  height = 320,
  xCut,
  yCut,
  shadeARegion = true,
  regionOpacity = 0.12,
}: Props) {
  /** 약한 지터로 겹침 완화 */
  const jitter = (v: number, index: number, amt = 0.4) => {
    // 인덱스 기반 고정 오프셋으로 일관된 지터 생성
    const hash = (index * 2654435761) % 2147483647;
    const normalizedHash = (hash / 2147483647 - 0.5) * 2;
    return v + normalizedHash * amt;
  };

  const aPts = React.useMemo(
    () =>
      points
        .filter(p => p.label === 'A')
        .map((p, i) => ({ x: jitter(p.nclusters, i), y: p.uniformity })),
    [points]
  );

  const bPts = React.useMemo(
    () =>
      points
        .filter(p => p.label === 'B')
        .map((p, i) => ({ x: jitter(p.nclusters, i + 1000), y: p.uniformity })),
    [points]
  );

  /** 축 눈금 고정 */
  const XTICKS = React.useMemo(() => {
    const [min, max] = xDomain;
    const step = (max - min) / 4;
    return [min, min + step, min + step * 2, min + step * 3, max].map(v => Math.round(v));
  }, [xDomain]);
  const YTICKS: number[] = [0.6, 0.7, 0.8, 0.9, 1.0];

  const [showA, setShowA] = React.useState(true);
  const [showB, setShowB] = React.useState(true);

  // 범례 클릭으로 시리즈 토글 (타입을 좁혀서 any 제거)
  type LegendClickArg = { value?: string } | undefined;
  const handleLegendClick = (o: LegendClickArg) => {
    if (o?.value === 'A') setShowA(v => !v);
    if (o?.value === 'B') setShowB(v => !v);
  };

  /** 커스텀 점 (크기/외곽선 조정) - 필요한 속성만 명시 */

  const drawRegion = shadeARegion && xCut != null && yCut != null;

  return (
    <div className="w-full min-w-0" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%" debounce={80}>
        <ScatterChart margin={{ top: 8, right: 16, bottom: 36, left: 48 }}>
          <CartesianGrid stroke="rgba(255,255,255,0.08)" />

          <XAxis
            type="number"
            dataKey="x"
            domain={xDomain}
            ticks={XTICKS}
            tick={{ fill: 'rgba(255,255,255,0.75)', fontSize: 12 }}
            tickFormatter={(v: number) => `${v}`}
            axisLine={{ stroke: 'rgba(255,255,255,0.25)' }}
            tickLine={{ stroke: 'rgba(255,255,255,0.25)' }}
            label={{
              value: 'Number of Clusters',
              position: 'bottom',
              offset: 0,
              fill: 'rgba(255,255,255,0.8)',
              fontSize: 12,
            }}
          />

          <YAxis
            type="number"
            dataKey="y"
            domain={yDomain}
            ticks={YTICKS}
            tick={{ fill: 'rgba(255,255,255,0.75)', fontSize: 12 }}
            tickFormatter={(v: number) => v.toFixed(2)}
            axisLine={{ stroke: 'rgba(255,255,255,0.25)' }}
            tickLine={{ stroke: 'rgba(255,255,255,0.25)' }}
            label={{
              value: 'Uniformity',
              angle: -90,
              position: 'insideLeft',
              offset: -4,
              fill: 'rgba(255,255,255,0.8)',
              fontSize: 12,
            }}
          />

          {/* 임계영역 (A: x ≤ xCut & y ≥ yCut) */}
          {drawRegion && (
            <ReferenceArea
              x1={xDomain[0]}
              x2={xCut!}
              y1={yCut!}
              y2={yDomain[1]}
              stroke="none"
              fill="var(--tw-color-brand-a, #cb3cff)"
              fillOpacity={regionOpacity}
            />
          )}

          {/* 임계선 */}
          {xCut != null && (
            <ReferenceLine x={xCut} stroke="rgba(255,255,255,0.55)" strokeDasharray="4 4" />
          )}
          {yCut != null && (
            <ReferenceLine y={yCut} stroke="rgba(255,255,255,0.55)" strokeDasharray="4 4" />
          )}

          <Tooltip
            cursor={{ stroke: 'rgba(255,255,255,0.2)' }}
            formatter={(
              _v: number | string,
              name: string,
              payload: TooltipPayloadLike
            ): [string, string] => {
              const p = (payload?.payload ?? {}) as { x?: number; y?: number };
              const x = Number(p.x ?? 0).toFixed(1);
              const y = Number(p.y ?? 0).toFixed(2);
              return [`${name}\t(${x}, ${y})`, ''];
            }}
            labelFormatter={() => ''}
            contentStyle={{
              background: '#0b1426',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 8,
              color: '#fff',
              padding: '6px 8px',
            }}
          />

          <Legend
            verticalAlign="top"
            align="right"
            iconSize={10}
            wrapperStyle={{ color: 'rgba(255,255,255,0.75)', paddingBottom: 4 }}
            onClick={handleLegendClick}
          />

          {/* 점: A 진하게/크게, B 옅게/작게, 애니 비활성화 */}
          {showA && (
            <Scatter
              name="A"
              data={aPts}
              fill="var(--tw-color-brand-a, #cb3cff)"
              fillOpacity={0.95}
              shape={DotA}
              legendType="circle"
              isAnimationActive={false}
            />
          )}
          {showB && (
            <Scatter
              name="B"
              data={bPts}
              fill="var(--tw-color-brand-b, #3d63ff)"
              fillOpacity={0.35}
              shape={DotB}
              legendType="circle"
              isAnimationActive={false}
            />
          )}
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
