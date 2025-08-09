'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { axioscommon } from '@/apis/common';

type Detail = {
  productId: string;
  imageUrl?: string;
  label: 'A' | 'B' | 'defect';    
  qualityGrade?: string;      
  uploadDate?: string;        
  uniformity?: number;
  maxCluster?: number;
  nclusters?: number;
  nspots?: number;
};

function toGrade(v: unknown): 'A' | 'B' | 'defect' {
  const s = String(v ?? '').toUpperCase();
  return s === 'A' || s === 'B' || s === 'defect' ? (s as 'A' | 'B' | 'defect') : 'defect';
}

const toYmd = (iso?: string) => {
  if (!iso) return '-';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '-';
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}.${m}.${day}`;
};

const nf = (v: number | undefined) => (typeof v === 'number' ? v.toLocaleString() : '-');

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [data, setData] = React.useState<Detail | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [err, setErr] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        setLoading(true);
        setErr(null);

        // baseURL에 이미 /api 포함되어 있다고 했으므로 /admin부터 시작
        const res = await axioscommon.get(`/admin/product-quality/${encodeURIComponent(id)}`);
        const raw = res.data ?? {};

        setData({
          productId: String(raw.productId ?? id),
          imageUrl: raw.imageUrl,
          label: toGrade(raw.label),
          qualityGrade: raw.qualityGrade,
          uploadDate: raw.uploadDate,
          uniformity: raw.uniformity,
          maxCluster: raw.maxCluster,
          nclusters: raw.nclusters,
          nspots: raw.nspots,
        });
      } catch (e: any) {
        setErr(e?.message || '상세를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="rounded-xl border border-brand-border bg-box/60 p-6 text-sub">Loading...</div>
      </div>
    );
  }

  if (err || !data) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="rounded-xl border border-brand-border bg-box/60 p-6 text-defect">{err || '데이터 없음'}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="rounded-lg border border-brand-border bg-box p-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <b className="text-2xl tracking-tight">[Grade] {data.label}</b>
          <button
            onClick={() => router.back()}
            className="h-[46px] px-4 rounded-lg bg-button text-sm font-dm-sans text-white hover:opacity-90"
          >
            뒤로가기
          </button>
        </div>

        {/* 본문 */}
        <div className="mt-8 flex gap-8">
          {/* 좌측 이미지 */}
          <div className="rounded-lg overflow-hidden w-[486px] h-[476px] bg-black/20">
            {data.imageUrl ? (
            <img
                src={data.imageUrl}
                alt="product"
                width={486}
                height={476}
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
                onError={() => console.log('이미지 실패: 만료/권한 가능성')}
                />
            ) : (
              <div className="h-full w-full grid place-items-center text-sub">No Image</div>
            )}
          </div>

          {/* 우측 메트릭 */}
          <div className="w-[248px] text-base font-inter text-sub space-y-3">
            <Section label="[ID]" value={data.productId} strong />
            <Section label="품질 등급(문자)" value={data.label} />
            <Section label="품질 등급(설명)" value={data.qualityGrade || '-'} />
            <Section label="업로드 일자" value={toYmd(data.uploadDate)} />
            <Section
              label="균일도(정규화, 최대 1)"
              value={typeof data.uniformity === 'number' ? data.uniformity.toFixed(6) : '-'}
            />
            <Section label="전체 점 개수" value={nf(data.nspots)} />
            <Section label="최대 군집 크기" value={nf(data.maxCluster)} />
            <Section label="전체 군집 수" value={nf(data.nclusters)} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ label, value, strong }: { label: string; value?: React.ReactNode; strong?: boolean }) {
  return (
    <div className="rounded-xl p-2">
      <div className="leading-5 truncate">{label}</div>
      <div className={`text-[15px] leading-[18px] font-pretendard ${strong ? 'text-white font-semibold' : 'text-white'}`}>
        {value ?? '-'}
      </div>
    </div>
  );
}
