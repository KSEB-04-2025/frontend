'use client';

import React from 'react';
import ToggleGroup from '@/components/ui/ToggleGroup';
import { useDashboard } from '@/store/dashboard';
import { getABStats, getDefectStats, type DailyAB, type DefectItem } from '@/apis/dashboard';
type CSSVars = React.CSSProperties & { ['--cols']?: number | string };

/** 공통: 날짜 오름차순 정렬 후 최근 n개만 */
function takeRecentByDate<T extends { date: string }>(arr: T[], n: number) {
  return [...arr].sort((a, b) => (a.date < b.date ? -1 : 1)).slice(-n);
}

/** 주/월 라벨 */
const labelWeek = (iso: string) => `${iso.slice(2, 4)}.${iso.slice(5, 7)}.${iso.slice(8, 10)}`;
const labelMonth = (iso: string) => `${Number(iso.slice(5, 7))}월`;

export default function MetricsGrid() {
  const period = useDashboard(s => s.period);

  // 오늘 카드용 요약
  const [todayA, setTodayA] = React.useState<number | null>(null);
  const [todayB, setTodayB] = React.useState<number | null>(null);
  const [todayDef, setTodayDef] = React.useState<number | null>(null);

  // 공통 차트 데이터
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
          // 오늘: 합산 1칸 (AB 막대 + 카드 3개)
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
          // 최근 4주
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
          // 최근 3개월
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
      } catch {
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

  // 스케일 (패널별 독립)
  const maxAB = Math.max(1, ...abRows.flatMap(r => [r.a, r.b]));
  const maxDef = Math.max(1, ...defRows.map(r => r.defect));

  /** ─────────────────────────────────
   *  오늘 뷰: 왼쪽(막대 3개 A/B/defect), 오른쪽(카드 3개)
   *  주/월 뷰: 왼쪽 Quality(AB), 오른쪽 defect
   *  ───────────────────────────────── */
  const renderToday = () => {
    // 좌측 막대: A/B/defect 3개
    const a = todayA ?? 0;
    const b = todayB ?? 0;
    const d = todayDef ?? 0;
    const max = Math.max(1, a, b, d);

    return (
      <div className="grid h-full min-h-0 grid-cols-12 gap-5">
        {/* Left: Count (A/B/defect) */}
        <section className="col-span-12 overflow-hidden rounded-xl border border-brand-border bg-box p-5 lg:col-span-7">
          <div className="mb-1 flex items-center gap-2">
            <h3 className="text-[30px] font-extrabold text-heading">Count</h3>
            <span className="text-sub">등급별 백분율</span>
          </div>

          {loading ? (
            <div className="placeholder grid h-[320px] place-items-center rounded-xl">
              불러오는 중…
            </div>
          ) : (
            <div className="mt-3 grid h-[320px] grid-cols-3 content-end items-end gap-8">
              {[
                { key: 'A', val: a, color: 'bg-brand-a' },
                { key: 'B', val: b, color: 'bg-brand-b' },
                { key: 'defect', val: d, color: 'bg-defect' },
              ].map(item => (
                <div key={item.key} className="flex flex-col items-center">
                  <div className="mb-2 text-xl font-bold text-heading">{item.val ?? '-'}</div>
                  <div className="flex w-14 items-end justify-center" style={{ height: 220 }}>
                    <div
                      className={`w-full rounded-t-md ${item.color}`}
                      style={{ height: `${((item.val ?? 0) / max) * 180}px` }}
                      aria-label={`${item.key} ${item.val ?? '-'}`}
                    />
                  </div>
                  <div className="mt-2 text-sm text-sub">{item.key}</div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Right: Cards (A / defect / B) */}
        <section className="col-span-12 grid gap-5 sm:grid-cols-2 lg:col-span-5">
          {/* A */}
          <div className="rounded-xl border border-brand-border bg-box p-5">
            <div className="flex h-24 items-center justify-between px-2">
              <span className="text-lg text-heading">A</span>
              <div className="text-right">
                <div className="text-4xl font-semibold text-heading">{todayA ?? '-'}</div>
                <div className="text-xs text-sub">개</div>
              </div>
            </div>
          </div>
          {/* defect */}
          <div className="rounded-xl border border-brand-border bg-box p-5">
            <div className="flex h-24 items-center justify-between px-2">
              <span className="text-lg text-heading">결함</span>
              <div className="text-right">
                <div className="text-4xl font-semibold text-heading">{todayDef ?? '-'}</div>
                <div className="text-xs text-sub">개</div>
              </div>
            </div>
          </div>
          {/* B  */}
          <div className="rounded-xl border border-brand-border bg-box p-5 sm:col-span-1">
            <div className="flex h-24 items-center justify-between px-2">
              <span className="text-lg text-heading">B</span>
              <div className="text-right">
                <div className="text-4xl font-semibold text-heading">{todayB ?? '-'}</div>
                <div className="text-xs text-sub">개</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  };

  const renderWeekMonth = () => (
    <div className="grid h-full min-h-0 grid-cols-12 gap-5">
      {/* Left: Quality (A/B) */}
      <section className="col-span-12 overflow-hidden rounded-lg border border-brand-border bg-box p-5 lg:col-span-7">
        <div className="mb-1 flex items-center gap-3">
          <h3 className="text-4xl font-extrabold text-heading">Quality</h3>
          <div className="flex items-center gap-3 text-xl">
            <span className="inline-flex items-center gap-2 text-sub">
              <i className="inline-block size-3 rounded-full bg-brand-a" /> A
            </span>
            <span className="inline-flex items-center gap-2 text-sub">
              <i className="inline-block size-3 rounded-full bg-brand-b" /> B
            </span>
          </div>
        </div>

        {loading ? (
          <div className="placeholder grid h-[320px] place-items-center rounded-lg">
            불러오는 중…
          </div>
        ) : abRows.length === 0 ? (
          <div className="placeholder grid h-32 place-items-center rounded-lg">-</div>
        ) : (
          <div
            className="mt-3 grid grid-cols-[repeat(var(--cols),1fr)] gap-8"
            style={{ '--cols': abRows.length } as CSSVars}
          >
            {abRows.map((r, idx) => (
              <div key={idx} className="flex flex-col items-center justify-end">
                <div className="relative flex items-end gap-4" style={{ height: 220 }}>
                  {/* A */}
                  <div className="relative w-10 sm:w-12">
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-2xl font-bold text-heading">
                      {r.a}
                    </div>
                    <div
                      className="mx-auto w-full bg-brand-a"
                      style={{ height: `${(r.a / maxAB) * 180}px` }}
                    />
                  </div>
                  {/* B */}
                  <div className="relative w-10 sm:w-12">
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-2xl font-bold text-heading">
                      {r.b}
                    </div>
                    <div
                      className="mx-auto w-full bg-brand-b"
                      style={{ height: `${(r.b / maxAB) * 180}px` }}
                    />
                  </div>
                </div>

                <div className="mt-3 whitespace-nowrap text-lg tabular-nums text-sub">
                  {r.label}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Right: defect */}
      <section className="col-span-12 overflow-hidden rounded-lg border border-brand-border bg-box p-5 lg:col-span-5">
        <div className="mb-4 flex items-center gap-2">
          <h3 className="text-4xl font-extrabold text-heading">defect</h3>
          <span className="flex items-end text-sub">
            {period === 'week' ? '주차별 결함 통계' : '월별 결함 통계'}
          </span>
        </div>

        {loading ? (
          <div className="placeholder grid h-[320px] place-items-center rounded-lg">
            불러오는 중…
          </div>
        ) : defRows.length === 0 ? (
          <div className="placeholder grid h-32 place-items-center rounded-lg">-</div>
        ) : (
          <div
            className="mt-3 grid grid-cols-[repeat(var(--cols),1fr)] gap-8"
            style={{ '--cols': defRows.length } as CSSVars}
          >
            {defRows.map((r, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="mb-3 text-3xl font-bold text-heading">{r.defect}</div>
                <div className="flex w-16 items-end justify-center" style={{ height: 175 }}>
                  <div
                    className="via-brand-defect/40 w-full rounded-t-full bg-gradient-to-b from-defect/90 to-brand-border shadow-[inset_0_-20px_30px_rgba(0,0,0,0.35)] transition-[height] duration-500"
                    style={{ height: `${(r.defect / maxDef) * 115 + 40}px` }}
                  />
                </div>
                <div className="mt-2 text-lg text-sub">{r.label}</div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <div className="flex shrink-0 items-center gap-3">
        <ToggleGroup />
        <span className="text-md text-sub">
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
