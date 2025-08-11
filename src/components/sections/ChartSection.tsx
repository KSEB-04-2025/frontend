// src/components/sections/ChartSection.tsx
'use client';

import React from 'react';
import { getAdminDashboardSummary, getUniformity, type UniformityItem } from '@/apis/dashboard';
import PieABDefect from '@/components/charts/PieABDefect';
import BlockUniformityHeatmap from '@/components/charts/BlockUniformityHeatmap';

export default function ChartSection() {
  const [now, setNow] = React.useState<Date | null>(null);
  React.useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const day = ['일', '월', '화', '수', '목', '금', '토'];
  const timeText =
    now?.toLocaleTimeString('ko-KR', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }) ?? '';
  const dateText = now
    ? `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')} ${day[now.getDay()]}`
    : '';

  const [total, setTotal] = React.useState<number | null>(null);
  const [aCnt, setACnt] = React.useState(0);
  const [bCnt, setBCnt] = React.useState(0);
  const [loadingSummary, setLoadingSummary] = React.useState(false);

  React.useEffect(() => {
    let alive = true;
    setLoadingSummary(true);
    getAdminDashboardSummary()
      .then(d => {
        if (!alive) return;
        setTotal(d.totalProducts);
        setACnt(d.aqualityProducts);
        setBCnt(d.bqualityProducts);
      })
      .catch(() => {
        if (!alive) return;
        setTotal(null);
        setACnt(0);
        setBCnt(0);
      })
      .finally(() => alive && setLoadingSummary(false));
    return () => {
      alive = false;
    };
  }, []);

  const defectCnt = Math.max(0, (total ?? 0) - aCnt - bCnt);
  const safeTotal = total ?? 0;
  const toPct = (n: number) => (safeTotal > 0 ? `${Math.round((n / safeTotal) * 100)}%` : '-');

  const [blocks, setBlocks] = React.useState<UniformityItem[]>([]);
  React.useEffect(() => {
    let alive = true;
    getUniformity()
      .then(list => alive && setBlocks(list))
      .catch(() => alive && setBlocks([]));
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="grid min-h-0 grid-cols-1 items-stretch gap-[28px] lg:h-full lg:grid-cols-2 lg:[grid-template-columns:520px_1fr] lg:[grid-template-rows:auto_1fr]">
      {/* 시간 + 날짜 */}
      <div className="col-span-1 flex items-center gap-10">
        <span
          className="inline-block w-[10ch] text-right text-3xl font-semibold tabular-nums tracking-wide text-heading"
          suppressHydrationWarning
        >
          {timeText}
        </span>
        <span className="text-3xl font-extrabold tracking-wide text-sub" suppressHydrationWarning>
          {dateText}
        </span>
      </div>

      {/* Cluster / Uniformity */}
      <section className="overflow-hidden rounded-lg border border-brand-border bg-box p-5 lg:row-span-2 lg:h-full">
        <div className="mb-4">
          <h2 className="text-[24px] font-extrabold leading-[1.1] text-heading md:text-[28px]">
            Cluster / Uniformity
          </h2>
          <p className="mt-2 text-sm text-sub">균일도와 군집도에 따른 밀도 블록 차트입니다.</p>
        </div>
        {/* 기본: 고정 높이, lg 이상: 헤더 제외한 전체 */}
        <div className="0 grid h-[300px] place-items-center rounded-lg p-4 lg:h-[calc(100%-56px)]">
          <BlockUniformityHeatmap
            points={blocks}
            binsX={10}
            binsY={8}
            xDomain={[0.6, 1.0]}
            yDomain={[0, 120]}
            aColor="var(--tw-color-brand-a, #cb3cff)"
            bColor="var(--tw-color-brand-b, #0038ff)"
          />
        </div>
      </section>

      {/* Total Product */}
      <section className="overflow-hidden rounded-lg border border-brand-border bg-box p-5 lg:h-full">
        <div className="mb-4 flex items-end gap-2">
          <h2 className="text-[28px] font-extrabold leading-[1.1] text-heading md:text-[34px]">
            Total Product
          </h2>
          <span className="text-sm text-sub">현재까지의 전체 생산량</span>
        </div>

        {/* 기본: 자동 높이, lg 이상: 헤더 제외한 전체 */}
        <div className="flex flex-col rounded-xl p-4 lg:h-[calc(100%-56px)]">
          <div className="grid h-full min-h-0 grid-cols-12 gap-5">
            {/* 파이 */}
            <div className="col-span-12 h-full lg:col-span-6">
              <div className="flex h-full items-center justify-center">
                <div className="aspect-square w-[200px] lg:w-[280px]">
                  {safeTotal > 0 ? (
                    <PieABDefect a={aCnt} b={bCnt} defect={defectCnt} />
                  ) : (
                    <div className="placeholder grid h-48 w-full place-items-center rounded-xl">
                      {loadingSummary ? '불러오는 중…' : '표시할 데이터가 없습니다.'}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 우측 수치 */}
            <div className="col-span-12 lg:col-span-6">
              <div className="mb-6">
                <div className="text-xs text-sub">총 생산량</div>
                <div className="mt-1 text-[40px] font-semibold leading-none text-heading">
                  {total ?? '-'}
                </div>
              </div>

              <ul className="space-y-4">
                <li className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
                  <span className="inline-block size-2 rounded-full bg-brand-a" />
                  <span className="text-2xl text-heading">A</span>
                  <span className="text-[36px] font-semibold leading-none text-heading">
                    {toPct(aCnt)}
                  </span>
                </li>
                <li className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
                  <span className="inline-block size-2 rounded-full bg-brand-b" />
                  <span className="text-2xl text-heading">B</span>
                  <span className="text-[36px] font-semibold leading-none text-heading">
                    {toPct(bCnt)}
                  </span>
                </li>
                <li className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
                  <span className="inline-block size-2 rounded-full bg-defect" />
                  <span className="text-2xl text-heading">defect</span>
                  <span className="text-[36px] font-semibold leading-none text-heading">
                    {toPct(defectCnt)}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
