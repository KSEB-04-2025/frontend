'use client';

import React from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getAdminDashboardSummary, getUniformity } from '@/apis/dashboard';
import PieABDefect from '@/components/charts/PieABDefect';
import KDEUniformityStandalone from '@/components/charts/KDEUniformityStandalone';

export default function ChartSection() {
  // 시계(SSR 가변값 주의)
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

  // ✅ 요약 폴링(3초)
  const { data: summary, isFetching: fetchingSummary } = useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: getAdminDashboardSummary,
    refetchInterval: 3000,
  });

  const total = summary?.totalProducts ?? null;
  const aCnt = summary?.aqualityProducts ?? 0;
  const bCnt = summary?.bqualityProducts ?? 0;
  const defectCnt = Math.max(0, (total ?? 0) - aCnt - bCnt);
  const safeTotal = total ?? 0;
  const toPct = (n: number) => (safeTotal > 0 ? `${Math.round((n / safeTotal) * 100)}%` : '-');

  const { data: points = [] } = useQuery({
    queryKey: ['uniformity'],
    queryFn: getUniformity,
    refetchInterval: 10000,
    placeholderData: keepPreviousData,
  });

  return (
    <div className="grid min-h-0 grid-cols-1 items-stretch gap-7 lg:h-full lg:grid-cols-2 lg:[grid-template-columns:520px_1fr] lg:[grid-template-rows:auto_1fr]">
      {/* 시간 + 날짜 */}
      <div className="col-span-1 flex items-center justify-between gap-8">
        <span
          className="inline-block w-[8ch] text-right text-5xl font-semibold tabular-nums tracking-wide text-heading"
          suppressHydrationWarning
        >
          {timeText}
        </span>
        <span className="text-4xl font-bold tracking-wide text-sub" suppressHydrationWarning>
          {dateText}
        </span>
      </div>

      {/* 우측: KDE */}
      <section className="overflow-hidden rounded-lg border border-brand-border bg-box p-5 lg:row-span-2 lg:h-full">
        <div className="mb-4">
          <h2 className="text-[28px] font-extrabold leading-tight text-heading lg:text-[34px]">
            Cluster / Uniformity
          </h2>
          <p className="text-md mt-2 text-sub">
            X축은 군집도(cluster) / Y축은 균일도 (uniformity) 입니다.
          </p>
        </div>

        <div className="place-items-right grid h-[300px] rounded-lg lg:h-[calc(100%-80px)]">
          <KDEUniformityStandalone
            points={points}
            xDomain={[0, 120]}
            yDomain={[0.3, 1.0]}
            height={300}
            xCut={24}
            yCut={0.9}
            shadeARegion
            debugPoints={false}
          />
        </div>
      </section>

      {/* 좌측: Total Product */}
      <section className="overflow-hidden rounded-lg border border-brand-border bg-box p-5 lg:h-full">
        <div className="mb-4 flex items-center gap-2">
          <h2 className="text-[28px] font-extrabold leading-tight text-heading lg:text-[34px]">
            Total Product
          </h2>
          <span className="text-lg text-sub">현재까지의 전체 생산량</span>
        </div>

        <div className="flex flex-col rounded-xl lg:h-[calc(100%-64px)]">
          <div className="grid h-full min-h-0 grid-cols-12 gap-6">
            {/* 파이 */}
            <div className="col-span-12 lg:col-span-6">
              <div className="flex h-full items-center justify-center">
                <div className="aspect-square w-[200px] lg:w-[280px]">
                  {safeTotal > 0 ? (
                    <PieABDefect a={aCnt} b={bCnt} defect={defectCnt} />
                  ) : (
                    <div className="placeholder grid h-48 w-full place-items-center rounded-xl">
                      {fetchingSummary ? '불러오는 중…' : '표시할 데이터가 없습니다.'}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 우측 수치 */}
            <div className="col-span-12 lg:col-span-6">
              <div className="mb-6">
                <div className="text-md text-sub">총 생산량</div>
                <div className="mt-1 text-[50px] font-semibold leading-none text-heading">
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
