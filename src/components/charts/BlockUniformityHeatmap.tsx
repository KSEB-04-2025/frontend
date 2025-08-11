// src/components/charts/BlockUniformityHeatmap.tsx
'use client';

import React from 'react';
import type { UniformityItem } from '@/apis/dashboard';

type Props = {
  points: UniformityItem[];
  binsX?: number;
  binsY?: number;
  xDomain?: [number, number];
  yDomain?: [number, number];
  aColor?: string;
  bColor?: string;
};

const BlockUniformityHeatmap: React.FC<Props> = ({
  points,
  binsX = 10,
  binsY = 8,
  xDomain = [0.6, 1.0],
  yDomain = [0, 120],
  aColor = 'var(--tw-color-brand-a, #cb3cff)',
  bColor = 'var(--tw-color-brand-b, #0038ff)',
}) => {
  const pad = 8;
  const cols = binsX;
  const rows = binsY;

  const xStep = (xDomain[1] - xDomain[0]) / cols;
  const yStep = (yDomain[1] - yDomain[0]) / rows;

  const bins = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({ total: 0, a: 0, b: 0 }))
  );

  let maxCount = 0;
  for (const p of points) {
    const { uniformity: x, nclusters: y, label } = p;
    if (x < xDomain[0] || x > xDomain[1]) continue;
    if (y < yDomain[0] || y > yDomain[1]) continue;

    let cx = Math.floor((x - xDomain[0]) / xStep);
    let ry = Math.floor((y - yDomain[0]) / yStep);
    if (cx >= cols) cx = cols - 1;
    if (ry >= rows) ry = rows - 1;

    const cell = bins[rows - 1 - ry][cx];
    cell.total += 1;
    if (label === 'A') cell.a += 1;
    else cell.b += 1;
    if (cell.total > maxCount) maxCount = cell.total;
  }

  return (
    <div className="h-[290px] w-full">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
        {bins.map((row, r) =>
          row.map((cell, c) => {
            const x = pad + (c * (100 - pad * 2)) / cols;
            const y = pad + (r * (100 - pad * 2)) / rows;
            const w = (100 - pad * 2) / cols;
            const h = (100 - pad * 2) / rows;
            const opacity = cell.total === 0 ? 0 : Math.max(0.15, cell.total / (maxCount || 1));
            const fill = cell.total === 0 ? 'transparent' : cell.a > 0 ? aColor : bColor;

            return (
              <rect
                key={`${r}-${c}`}
                x={x}
                y={y}
                width={w}
                height={h}
                rx={1.5}
                fill={fill}
                opacity={opacity}
              />
            );
          })
        )}
        <text x="50" y="98" fontSize="4" className="text-heading">
          Number of Clusters
        </text>
        <g transform="translate(3 50) rotate(-90)">
          <text x="0" y="0" fontSize="4" className="text-heading">
            Uniformity
          </text>
        </g>
      </svg>
    </div>
  );
};

export default BlockUniformityHeatmap;
