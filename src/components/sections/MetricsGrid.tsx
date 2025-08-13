'use client';

import React from 'react';
import ToggleGroup from '@/components/ui/ToggleGroup';
import { useDashboard } from '@/store/dashboard';
import { getABStats, getDefectStats, type DailyAB, type DefectItem } from '@/apis/dashboard';
type CSSVars = React.CSSProperties & { ['--cols']?: number | string };

//사이즈 상수
const SZ = {
  chartH: 260,
  barAreaH: 160,
  barMaxH: 150,
  cardHClass: 'h-32',
  numA: 'text-[56px] sm:text-[70px] lg:text-[90px]',
  numBig: 'text-[56px] sm:text-[70px] lg:text-[90px]',
  defAreaH: 170,
  defMaxH: 100,
  defBase: 40,
  gapLg: 'gap-8',
  padCard: 'p-5',
};

function takeRecentByDate<T extends { date: string }>(arr: T[], n: number) {
  return [...arr].sort((a, b) => a.date.localeCompare(b.date)).slice(-n);
}
const labelWeek = (iso: string) => `${iso.slice(2, 4)}.${iso.slice(5, 7)}.${iso.slice(8, 10)}`;
const labelMonth = (iso: string) => `${Number(iso.slice(5, 7))}월`;

export default function MetricsGrid() {
  const period = useDashboard(s => s.period);

  const [todayA, setTodayA] = React.useState<number | null>(null);
  const [todayB, setTodayB] = React.useState<number | null>(null);
  const [todayDef, setTodayDef] = React.useState<number | null>(null);

  const [abRows, setAbRows] = React.useState<{ label: string; a: number; b: number }[]>([]);
  const [defRows, setDefRows] = React.useState<{ label: string; defect: number }[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    let alive = true;
    setLoading(true);
    (async () => {
      try {
        const [abList, defectList] = await Promise.all([
          getABStats(period),
          getDefectStats(period),
        ]);
        if (period === 'today') {
          const a = abList.reduce((s, d) => s + (d.acount ?? 0), 0);
          const b = abList.reduce((s, d) => s + (d.bcount ?? 0), 0);
          const x = defectList.reduce((s, d) => s + (d.xcount ?? 0), 0);
          if (!alive) return;
          setTodayA(a);
          setTodayB(b);
          setTodayDef(x);
          setAbRows([{ label: 'Today', a, b }]);
          setDefRows([{ label: 'Today', defect: x }]);
        } else if (period === 'week') {
          const abPicked = takeRecentByDate<DailyAB>(abList, 4);
          const dfPicked = takeRecentByDate<DefectItem>(defectList, 4);
          if (!alive) return;
          setAbRows(
            abPicked.map(d => ({ label: labelWeek(d.date), a: d.acount ?? 0, b: d.bcount ?? 0 }))
          );
          setDefRows(dfPicked.map(d => ({ label: labelWeek(d.date), defect: d.xcount ?? 0 })));
          setTodayA(null);
          setTodayB(null);
          setTodayDef(null);
        } else {
          const abPicked = takeRecentByDate<DailyAB>(abList, 3);
          const dfPicked = takeRecentByDate<DefectItem>(defectList, 3);
          if (!alive) return;
          setAbRows(
            abPicked.map(d => ({ label: labelMonth(d.date), a: d.acount ?? 0, b: d.bcount ?? 0 }))
          );
          setDefRows(dfPicked.map(d => ({ label: labelMonth(d.date), defect: d.xcount ?? 0 })));
          setTodayA(null);
          setTodayB(null);
          setTodayDef(null);
        }
      } catch (e) {
        console.error('Failed to fetch metrics data:', e);
        if (!alive) return;
        setAbRows([]);
        setDefRows([]);
        setTodayA(null);
        setTodayB(null);
        setTodayDef(null);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [period]);

  const maxAB = Math.max(1, ...abRows.flatMap(r => [r.a, r.b]));
  const maxDef = Math.max(1, ...defRows.map(r => r.defect));

  const renderToday = () => {
    const a = todayA ?? 0,
      b = todayB ?? 0,
      d = todayDef ?? 0;
    const max = Math.max(1, a, b, d);

    return (
      <div className={`grid h-full min-h-0 grid-cols-12 gap-5`}>
        {/* Left */}
        <section
          className={`col-span-12 overflow-hidden rounded-lg border border-brand-border bg-box ${SZ.padCard} lg:col-span-7`}
        >
          <div className="mb-1 flex items-center gap-2">
            <h3 className="text-4xl font-extrabold text-heading">Count</h3>
            <span className="text-base text-sub">등급별 백분율</span>
          </div>

          {loading ? (
            <div
              className="placeholder grid place-items-center rounded-lg"
              style={{ height: SZ.chartH }}
            >
              불러오는 중…
            </div>
          ) : (
            <div
              className={`mt-3 grid content-end items-end ${SZ.gapLg} grid-cols-3`}
              style={{ height: SZ.chartH }}
            >
              {[
                { key: 'A', val: a, color: 'bg-brand-a' },
                { key: 'B', val: b, color: 'bg-brand-b' },
                { key: 'defect', val: d, color: 'bg-defect' },
              ].map(item => (
                <div key={item.key} className="flex flex-col items-center">
                  <div className="mb-1 text-3xl font-bold text-heading">{item.val ?? '-'}</div>
                  <div
                    className="flex w-16 items-end justify-center"
                    style={{ height: SZ.barAreaH }}
                  >
                    <div
                      className={`w-full rounded-t-md ${item.color}`}
                      style={{ height: `${((item.val ?? 0) / max) * SZ.barMaxH}px` }}
                      aria-label={`${item.key} ${item.val ?? '-'}`}
                    />
                  </div>
                  <div className="mt-1 text-base text-sub">{item.key}</div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Right cards */}
        <section className="col-span-12 grid gap-4 sm:grid-cols-2 lg:col-span-5">
          {/* A */}
          <div className={`relative rounded-lg border border-brand-border bg-box ${SZ.padCard}`}>
            <span className="absolute left-4 top-3 text-2xl text-heading/80">A</span>
            <div className={`flex ${SZ.cardHClass} items-center justify-center`}>
              <span className={`${SZ.numA} font-semibold leading-none tracking-tight text-heading`}>
                {todayA ?? '-'}
              </span>
            </div>
            <span className="text-md absolute bottom-3 right-4 text-sub/90">개</span>
          </div>

          {/* defect */}
          <div className={`relative rounded-lg border border-brand-border bg-box ${SZ.padCard}`}>
            <span className="absolute left-4 top-3 text-2xl text-heading/80">결함</span>
            <div className={`flex ${SZ.cardHClass} items-center justify-center`}>
              <span
                className={`${SZ.numBig} font-semibold leading-none tracking-tight text-heading`}
              >
                {todayDef ?? '-'}
              </span>
            </div>
            <span className="text-md absolute bottom-3 right-4 text-sub/90">개</span>
          </div>

          {/* B */}
          <div className={`relative rounded-lg border border-brand-border bg-box ${SZ.padCard}`}>
            <span className="absolute left-4 top-3 text-2xl text-heading/80">B</span>
            <div className={`flex ${SZ.cardHClass} items-center justify-center`}>
              <span
                className={`${SZ.numBig} font-semibold leading-none tracking-tight text-heading`}
              >
                {todayB ?? '-'}
              </span>
            </div>
            <span className="text-md absolute bottom-3 right-4 text-sub/90">개</span>
          </div>
        </section>
      </div>
    );
  };

  const renderWeekMonth = () => (
    <div className="grid h-full min-h-0 grid-cols-12 gap-5">
      {/* Left: Quality */}
      <section
        className={`col-span-12 overflow-hidden rounded-lg border border-brand-border bg-box ${SZ.padCard} lg:col-span-7`}
      >
        <div className="mb-1 flex items-center gap-4">
          <h3 className="text-4xl font-extrabold text-heading">Quality</h3>
          <div className="flex items-center gap-3 text-xl">
            <span className="inline-flex items-center gap-2 text-sub">
              <i className="inline-block size-4 rounded-full bg-brand-a" /> A
            </span>
            <span className="inline-flex items-center gap-2 text-sub">
              <i className="inline-block size-4 rounded-full bg-brand-b" /> B
            </span>
          </div>
        </div>

        {loading ? (
          <div
            className="placeholder grid place-items-center rounded-lg"
            style={{ height: SZ.chartH }}
          >
            불러오는 중…
          </div>
        ) : abRows.length === 0 ? (
          <div className="placeholder grid h-24 place-items-center rounded-lg">-</div>
        ) : (
          <div
            className={`mt-14 grid ${SZ.gapLg} grid-cols-[repeat(var(--cols),1fr)]`}
            style={{ '--cols': abRows.length } as CSSVars}
          >
            {abRows.map((r, idx) => (
              <div key={idx} className="flex flex-col items-center justify-end">
                <div className="relative flex items-end gap-3" style={{ height: SZ.barAreaH }}>
                  {/* A */}
                  <div className="relative w-8 sm:w-10">
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-3xl font-bold text-heading">
                      {r.a}
                    </div>
                    <div
                      className="mx-auto w-full bg-brand-a"
                      style={{ height: `${(r.a / maxAB) * SZ.barMaxH}px` }}
                    />
                  </div>
                  {/* B */}
                  <div className="relative w-8 sm:w-10">
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-3xl font-bold text-heading">
                      {r.b}
                    </div>
                    <div
                      className="mx-auto w-full bg-brand-b"
                      style={{ height: `${(r.b / maxAB) * SZ.barMaxH}px` }}
                    />
                  </div>
                </div>
                <div className="mt-2 whitespace-nowrap text-sm tabular-nums text-sub">
                  {r.label}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Right: defect */}
      <section
        className={`col-span-12 overflow-hidden rounded-lg border border-brand-border bg-box ${SZ.padCard} lg:col-span-5`}
      >
        <div className="mb-2 flex items-center gap-2">
          <h3 className="text-4xl font-extrabold text-heading">defect</h3>
          <span className="flex items-end text-lg text-sub">
            {period === 'week' ? '주차별 결함 통계' : '월별 결함 통계'}
          </span>
        </div>

        {loading ? (
          <div
            className="placeholder grid place-items-center rounded-lg"
            style={{ height: SZ.chartH }}
          >
            불러오는 중…
          </div>
        ) : defRows.length === 0 ? (
          <div className="placeholder grid h-24 place-items-center rounded-lg">-</div>
        ) : (
          <div
            className={`mt-3 grid ${SZ.gapLg} grid-cols-[repeat(var(--cols),1fr)]`}
            style={{ '--cols': defRows.length } as CSSVars}
          >
            {defRows.map((r, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="mb-2 text-3xl font-bold text-heading">{r.defect}</div>
                <div className="flex w-12 items-end justify-center" style={{ height: SZ.defAreaH }}>
                  <div
                    className="via-brand-defect/40 w-full rounded-t-full bg-gradient-to-b from-defect/90 to-brand-border shadow-[inset_0_-16px_24px_rgba(0,0,0,0.35)] transition-[height] duration-500"
                    style={{ height: `${(r.defect / maxDef) * SZ.defMaxH + SZ.defBase}px` }}
                  />
                </div>
                <div className="mt-1 text-sm text-sub">{r.label}</div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <div className="flex shrink-0 items-center gap-3">
        <ToggleGroup />
        <span className="text-lg text-sub">
          {period === 'today'
            ? '오늘 기준 데이터입니다.'
            : period === 'week'
              ? '현재 날짜 기준 최근 4주 데이터입니다.'
              : '현재 기준 최근 3개월 데이터입니다.'}
        </span>
      </div>

      <div className="min-h-0 grow">{period === 'today' ? renderToday() : renderWeekMonth()}</div>
    </div>
  );
}
