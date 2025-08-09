// src/components/lists/ListSection.tsx
'use client';
import React from 'react';
import SearchBar from '@/components/lists/SearchBar';
import Toolbar from '@/components/lists/Toolbar';
import ListTable from '@/components/lists/ListTable';
import FooterPagination from '@/components/lists/FooterPagination';
import { fetchAllProducts, type ProductRow } from '@/apis/lists';

interface ApiError {
  message?: string;
}

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
  const [pickedDate, setPickedDate] = React.useState<string | null>(null);

  // ✅ 페이지네이션 상태
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(20); // 한 페이지 20개

  React.useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const data = await fetchAllProducts();
        setRows(data);
      } catch (e) {
        const error = e as ApiError;
        setErr(error?.message || '목록을 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // 검색/날짜/정렬 계산
  const filtered = React.useMemo(() => {
    let result = [...rows];

    const q = query.trim().toLowerCase();
    if (q) {
      result = result.filter(
        r =>
          r.id.toLowerCase().includes(q) ||
          r.grade.toLowerCase().includes(q) ||
          r.date.toLowerCase().includes(q)
      );
    }

    if (pickedDate) {
      const targetYmd = pickedDate.replace(/-/g, '.');
      result = result.filter(r => r.date === targetYmd);
    }

    result.sort((a, b) => {
      const da = ymdToMs(a.date);
      const db = ymdToMs(b.date);
      return sortOrder === 'asc' ? da - db : db - da;
    });

    return result;
  }, [rows, query, pickedDate, sortOrder]);

  // ✅ 검색/날짜 변경 시 페이지 리셋
  React.useEffect(() => {
    setPage(1);
  }, [query, pickedDate, sortOrder]);

  // ✅ 현재 페이지의 데이터 잘라내기
  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const pageRows = filtered.slice(start, start + pageSize);

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <Toolbar
          sortOrder={sortOrder}
          onToggleSort={() => setSortOrder(p => (p === 'asc' ? 'desc' : 'asc'))}
          onPickDate={d => setPickedDate(d)}
          currentDate={pickedDate}
        />
        <div className="flex-1">
          <SearchBar
            value={query}
            onChange={setQuery}
            onSearch={() => setPage(1)}
            placeholder="Search for..."
          />
        </div>
      </div>

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
          {/* ✅ 현재 페이지 데이터만 렌더 */}
          <ListTable rows={pageRows} />

          {/* ✅ 페이지네이션 컨트롤 */}
          <FooterPagination
            total={total}
            page={page}
            pageSize={pageSize}
            onChange={setPage} // ← FooterPagination에 이 prop이 있어야 함
            onPageSizeChange={setPageSize} // (선택) 페이지 크기 드롭다운이 있다면
          />
        </>
      )}
    </section>
  );
}
