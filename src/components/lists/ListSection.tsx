// src/components/lists/ListSection.tsx
'use client';
import React from 'react';
import SearchBar from '@/components/lists/SearchBar';
import Toolbar from '@/components/lists/Toolbar';
import ListTable from '@/components/lists/ListTable';
import FooterPagination from '@/components/lists/FooterPagination';
import { fetchAllProducts, type ProductRow } from '@/apis/lists';

function ymdToMs(ymd: string) {
  const iso = ymd.replace(/\./g, '-');
  const t = new Date(iso).getTime();
  return Number.isNaN(t) ? 0 : t;
}

export default function ListSection() {
  const [rows, setRows] = React.useState<ProductRow[]>([]);
  const [query, setQuery] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [err, setErr] = React.useState<string | null>(null);


  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('asc');
  const [pickedDate, setPickedDate] = React.useState<string | null>(null); // 'YYYY-MM-DD'

  React.useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const data = await fetchAllProducts();
        setRows(data);
      } catch (e: any) {
        setErr(e?.message || '목록을 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = React.useMemo(() => {
    let result = [...rows];

    // 검색
    const q = query.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (r) =>
          r.id.toLowerCase().includes(q) ||
          r.grade.toLowerCase().includes(q) ||
          r.date.toLowerCase().includes(q)
      );
    }

    // 날짜 필터: 동일 날짜만 보기
    if (pickedDate) {
      const targetYmd = pickedDate.replace(/-/g, '.'); // 'YYYY-MM-DD' → 'YYYY.MM.DD'
      result = result.filter((r) => r.date === targetYmd);
    }

    // 날짜 정렬
    result.sort((a, b) => {
      const da = ymdToMs(a.date);
      const db = ymdToMs(b.date);
      return sortOrder === 'asc' ? da - db : db - da;
    });

    return result;
  }, [rows, query, pickedDate, sortOrder]);

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <Toolbar
          sortOrder={sortOrder}
          onToggleSort={() => setSortOrder((p) => (p === 'asc' ? 'desc' : 'asc'))}
          onPickDate={(d) => setPickedDate(d)}       // 'YYYY-MM-DD' 또는 null
          currentDate={pickedDate}
        />
        <div className="flex-1">
          <SearchBar value={query} onChange={setQuery} placeholder="Search for..." />
        </div>
      </div>

      {/* 현재 선택된 날짜 표시/초기화 */}
      {pickedDate && (
        <div className="text-m text-sub">
          날짜: <b className="text-heading">{pickedDate}</b>
          <button className="ml-2 underline hover:opacity-80" onClick={() => setPickedDate(null)}>
            해제
          </button>
        </div>
      )}

      {loading && (
        <div className="rounded-xl border border-brand-border bg-box/60 px-6 py-8 text-sub">
          Loading...
        </div>
      )}
      {!loading && err && (
        <div className="rounded-xl border border-brand-border bg-box/60 px-6 py-8 text-defect">
          {err}
        </div>
      )}
      {!loading && !err && (
        <>
          <ListTable rows={filtered} />
          <FooterPagination total={filtered.length} page={1} pageSize={40} />
        </>
      )}
    </section>
  );
}
