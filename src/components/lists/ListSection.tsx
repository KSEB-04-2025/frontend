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
  const [sortKey, setSortKey] = React.useState<'id' | 'grade' | 'date'>('date');
  const [pickedDate, setPickedDate] = React.useState<string | null>(null);
  const [pickedGrade, setPickedGrade] = React.useState<'A' | 'B' | 'defect' | null>(null);

  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(20);

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

    if (pickedGrade) {
      result = result.filter(r => r.grade === pickedGrade);
    }

    const gradeOrder = { A: 0, B: 1, defect: 2 } as const;

    result.sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'id') {
        cmp = a.id.localeCompare(b.id);
      } else if (sortKey === 'grade') {
        cmp = gradeOrder[a.grade] - gradeOrder[b.grade];
      } else {
        cmp = ymdToMs(a.date) - ymdToMs(b.date);
      }
      return sortOrder === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [rows, query, pickedDate, pickedGrade, sortKey, sortOrder]);

  React.useEffect(() => {
    setPage(1);
  }, [query, pickedDate, pickedGrade, sortKey, sortOrder]);

  const total = filtered.length;

  const handleSort = (key: 'id' | 'grade' | 'date') => {
    if (sortKey === key) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <Toolbar
          sortOrder={sortOrder}
          onToggleSort={() => setSortOrder(p => (p === 'asc' ? 'desc' : 'asc'))}
          onPickDate={d => setPickedDate(d)}
          currentDate={pickedDate}
          currentGrade={pickedGrade}
          onPickGrade={setPickedGrade}
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

      
      <div className="text-m text-sub flex items-center gap-3">
        
        <span className="inline-flex items-center min-w-[140px]">
          {pickedGrade ? (
            <>
              등급: <b className="ml-1 text-heading">{pickedGrade}</b>
              <button
                className="ml-2 underline hover:opacity-80"
                onClick={() => setPickedGrade(null)}
              >
                해제
              </button>
            </>
          ) : (
            <span className="invisible">등급: defect 해제</span>
          )}
        </span>

        {/* 날짜 영역: 동일 방식(원하면 폭 조절) */}
        <span className="inline-flex items-center min-w-[180px]">
          {pickedDate ? (
            <>
              날짜: <b className="ml-1 text-heading">{pickedDate}</b>
              <button
                className="ml-2 underline hover:opacity-80"
                onClick={() => setPickedDate(null)}
              >
                해제
              </button>
            </>
          ) : (
            <span className="invisible">날짜: 2025.08.12 해제</span>
          )}
        </span>
      </div>

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
          <ListTable
            rows={filtered}
            page={page}
            pageSize={pageSize}
            sortKey={sortKey}
            sortOrder={sortOrder}
            onSort={handleSort}
          />

          <FooterPagination
            total={total}
            page={page}
            pageSize={pageSize}
            onChange={setPage}
            onPageSizeChange={setPageSize}
          />
        </>
      )}
    </section>
  );
}
