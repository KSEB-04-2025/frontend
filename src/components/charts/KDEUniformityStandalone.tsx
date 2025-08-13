// src/components/charts/KDEUniformityStandalone.tsx
'use client';

import React from 'react';
import { contourDensity } from 'd3-contour';
import { scaleLinear } from 'd3-scale';
import { geoPath } from 'd3-geo';
import type { UniformityItem } from '@/apis/dashboard';

type Pt = { x: number; y: number };
type Palette = 'brand' | 'viridis' | 'turbo' | 'mono';

type Props = {
  points: UniformityItem[];
  labelFilter?: 'A' | 'B';
  xDomain?: [number, number];
  yDomain?: [number, number];
  height?: number;
  bandwidth?: number;
  thresholds?: number;
  palette?: Palette;
  blur?: number;
  maxOpacity?: number;
  strokeOutlines?: boolean;
  xCut?: number;
  yCut?: number;
  shadeARegion?: boolean;
  regionOpacity?: number;
  showLegend?: boolean;
  debugPoints?: boolean;
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const hex2rgb = (hex: string) => {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)!;
  return [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] as const;
};
const interpColor = (stops: string[], t: number) => {
  if (stops.length === 1) return stops[0];
  const i = Math.max(0, Math.min(stops.length - 2, Math.floor(t * (stops.length - 1))));
  const localT = t * (stops.length - 1) - i;
  const [r1, g1, b1] = hex2rgb(stops[i]);
  const [r2, g2, b2] = hex2rgb(stops[i + 1]);
  const r = Math.round(lerp(r1, r2, localT));
  const g = Math.round(lerp(g1, g2, localT));
  const b = Math.round(lerp(b1, b2, localT));
  return `rgb(${r},${g},${b})`;
};

const PALETTES: Record<Palette, string[]> = {
  brand: ['#1b3a8a', '#2a5bd7', '#3d63ff', '#9c4cff', '#cb3cff'],
  viridis: ['#2c7bb6', '#00a6ca', '#00ccbc', '#90eb9d', '#ffff8c'],
  turbo: ['#30123b', '#4145ab', '#2bb6ff', '#8cf700', '#fbd500', '#f94000'],
  mono: ['#0b5bd3', '#3d63ff', '#7f8cff', '#b2bfff'],
};

export default function KDEUniformityStandalone({
  points,
  labelFilter,
  xDomain = [0, 120],
  yDomain = [0.3, 1.0],
  height = 300,
  bandwidth = 16,
  thresholds = 14,
  palette = 'brand',
  blur = 1.2,
  maxOpacity = 0.55,
  strokeOutlines = true,
  xCut,
  yCut,
  shadeARegion = true,
  regionOpacity = 0.12,
  showLegend = true,
  debugPoints = false,
}: Props) {
  // 반응형 width
  const wrapRef = React.useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = React.useState(0);
  React.useEffect(() => {
    if (!wrapRef.current) return;
    const obs = new ResizeObserver(e => setWidth(e[0]?.contentRect.width ?? 0));
    obs.observe(wrapRef.current);
    return () => obs.disconnect();
  }, []);

  // 유니크 ID들 (clip/blur/gradient 충돌 방지)
  const uid = React.useId().replace(/:/g, '');
  const clipId = `kde-clip-${uid}`;
  const blurId = `kde-blur-${uid}`;
  const gradId = `kde-grad-${uid}`;

  // 레이아웃
  const margin = { top: 8, right: 16, bottom: 36, left: 48 };
  const W = Math.max(1, width);
  const H = height;
  const plotW = Math.max(1, W - margin.left - margin.right);
  const plotH = Math.max(1, H - margin.top - margin.bottom);

  // 데이터
  const data: Pt[] = React.useMemo(() => {
    const src = labelFilter ? points.filter(p => p.label === labelFilter) : points;
    return src.map(p => ({ x: p.nclusters, y: p.uniformity }));
  }, [points, labelFilter]);

  // 스케일
  const sx = React.useMemo(() => scaleLinear().domain(xDomain).range([0, plotW]), [xDomain, plotW]);
  const sy = React.useMemo(() => scaleLinear().domain(yDomain).range([plotH, 0]), [yDomain, plotH]);

  // 픽셀 좌표
  const pts = React.useMemo<[number, number][]>(
    () => data.map(d => [sx(d.x), sy(d.y)]),
    [data, sx, sy]
  );

  // KDE
  const contours = React.useMemo(() => {
    if (!pts.length) return [];
    return contourDensity<[number, number]>()
      .x(d => d[0])
      .y(d => d[1])
      .size([plotW, plotH])
      .bandwidth(bandwidth)
      .thresholds(thresholds)(pts);
  }, [pts, plotW, plotH, bandwidth, thresholds]);

  const path = React.useMemo(() => geoPath(), []);
  const pal = PALETTES[palette];

  // 정규화(등고선 값 → 0~1)
  const [vmin, vmax] = React.useMemo(() => {
    if (!contours.length) return [0, 1];
    let mi = Infinity,
      ma = -Infinity;
    for (const c of contours) {
      mi = Math.min(mi, c.value);
      ma = Math.max(ma, c.value);
    }
    return [mi, ma];
  }, [contours]);
  const norm = (v: number) => (v - vmin) / Math.max(1e-9, vmax - vmin);

  // 눈금
  const XTICKS = React.useMemo(() => {
    const [x0, x1] = xDomain;
    const step = (x1 - x0) / 4;
    return Array.from({ length: 5 }, (_, i) => Math.round(x0 + step * i));
  }, [xDomain]);
  const YTICKS = React.useMemo(() => {
    const [y0, y1] = yDomain;
    const step = (y1 - y0) / 4;
    return Array.from({ length: 5 }, (_, i) => Number((y0 + step * i).toFixed(2)));
  }, [yDomain]);

  // 임계치 픽셀(플롯 좌표; 선을 또렷하게 0.5px 스냅)
  const xCutPx = xCut != null ? Math.round(sx(xCut)) + 0.5 : undefined;
  const yCutPx = yCut != null ? Math.round(sy(yCut)) + 0.5 : undefined;

  return (
    <div ref={wrapRef} className="w-full min-w-0">
      <svg width={W} height={H}>
        <defs>
          {blur > 0 && (
            <filter id={blurId} x="-10%" y="-10%" width="120%" height="120%">
              <feGaussianBlur stdDeviation={blur} />
            </filter>
          )}
          <linearGradient id={gradId} x1="0" x2="1" y1="0" y2="0">
            {pal.map((c, i) => (
              <stop key={i} offset={`${(i / (pal.length - 1)) * 100}%`} stopColor={c} />
            ))}
          </linearGradient>
          <clipPath id={clipId}>
            {/* ⬇️ 플롯 좌표계(0,0) 기준의 클립 사각형 */}
            <rect x="0" y="0" width={plotW} height={plotH} rx="6" ry="6" />
          </clipPath>
        </defs>

        {/* ==== 플롯 영역(좌표계 통일) ==== */}
        <g transform={`translate(${margin.left},${margin.top})`}>
          {/* 격자 */}
          {XTICKS.map((tx, i) => {
            const px = Math.round(sx(tx)) + 0.5;
            return (
              <line key={i} x1={px} x2={px} y1={0} y2={plotH} stroke="rgba(255,255,255,0.08)" />
            );
          })}
          {YTICKS.map((ty, i) => {
            const py = Math.round(sy(ty)) + 0.5;
            return (
              <line key={i} x1={0} x2={plotW} y1={py} y2={py} stroke="rgba(255,255,255,0.08)" />
            );
          })}

          {/* 임계영역(왼쪽-위) */}
          {shadeARegion && xCutPx != null && yCutPx != null && (
            <rect
              x={0}
              y={0}
              width={Math.max(0, xCutPx)}
              height={Math.max(0, yCutPx)}
              fill="var(--tw-color-brand-a, #cb3cff)"
              opacity={regionOpacity}
              clipPath={`url(#${clipId})`}
            />
          )}

          {/* KDE */}
          <g clipPath={`url(#${clipId})`} filter={blur > 0 ? `url(#${blurId})` : undefined}>
            {contours.map((c, i) => {
              const t = norm(c.value);
              const fill = interpColor(pal, t);
              const alpha = 0.25 + t * (maxOpacity - 0.25);
              return (
                <path
                  key={i}
                  d={path(c) ?? undefined}
                  fill={fill}
                  fillOpacity={alpha}
                  stroke={strokeOutlines ? 'rgba(255,255,255,0.06)' : 'none'}
                  strokeWidth={strokeOutlines ? 0.6 : 0}
                />
              );
            })}
            {debugPoints &&
              pts.map(([px, py], i) => (
                <circle key={i} cx={px} cy={py} r={1.2} fill="#fff" opacity={0.5} />
              ))}
          </g>

          {/* 임계선 + 라벨 (플롯 좌표계) */}
          {xCutPx != null && (
            <>
              <line
                x1={xCutPx}
                x2={xCutPx}
                y1={0}
                y2={plotH}
                stroke="rgba(255,255,255,0.65)"
                strokeDasharray="6 6"
              />
              <text x={xCutPx + 6} y={14} fill="rgba(255,255,255,0.85)" fontSize={11}>
                x ≤ {xCut}
              </text>
            </>
          )}
          {yCutPx != null && (
            <>
              <line
                x1={0}
                x2={plotW}
                y1={yCutPx}
                y2={yCutPx}
                stroke="rgba(255,255,255,0.65)"
                strokeDasharray="6 6"
              />
              <text x={6} y={yCutPx - 6} fill="rgba(255,255,255,0.85)" fontSize={11}>
                y ≥ {yCut}
              </text>
            </>
          )}

          {/* 축 라벨/눈금 */}
          <text
            x={plotW / 8}
            y={plotH + 28}
            fill="rgba(255,255,255,0.85)"
            fontSize={17}
            textAnchor="middle"
          >
            Number of Clusters
          </text>
          {XTICKS.map((tx, i) => (
            <text
              key={i}
              x={sx(tx)}
              y={plotH + 16}
              fill="rgba(255,255,255,0.75)"
              fontSize={12}
              textAnchor="middle"
            >
              {tx}
            </text>
          ))}
          <g transform={`translate(-35, ${plotH / 2}) rotate(-90)`}>
            <text fill="rgba(255,255,255,0.85)" fontSize={17} textAnchor="middle">
              Uniformity
            </text>
          </g>
          {YTICKS.map((ty, i) => (
            <text
              key={i}
              x={-8}
              y={sy(ty) + 4}
              fill="rgba(255,255,255,0.75)"
              fontSize={12}
              textAnchor="end"
            >
              {ty.toFixed(2)}
            </text>
          ))}

          {/* 범례 */}
          {showLegend && (
            <>
              <rect x={plotW - 160} y={0} width={120} height={8} fill={`url(#${gradId})`} rx={4} />
              <text x={plotW - 160} y={20} fontSize={11} fill="rgba(255,255,255,0.75)">
                low
              </text>
              <text
                x={plotW - 44}
                y={20}
                fontSize={11}
                fill="rgba(255,255,255,0.75)"
                textAnchor="end"
              >
                high
              </text>
            </>
          )}
        </g>
      </svg>
    </div>
  );
}
