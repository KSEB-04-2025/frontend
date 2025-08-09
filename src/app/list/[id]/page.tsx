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

interface RawDetailData {
  productId?: string;
  imageUrl?: string;
  label?: string;
  qualityGrade?: string;
  uploadDate?: string;
  uniformity?: number;
  maxCluster?: number;
  nclusters?: number;
  nspots?: number;
}

interface ApiError {
  message?: string;
}

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
        const res = await axioscommon.get<RawDetailData>(
          `/admin/product-quality/${encodeURIComponent(id)}`
        );
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
      } catch (e) {
        const error = e as ApiError;
        setErr(error?.message || '상세를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="rounded-xl border border-brand-border bg-box/60 p-6 text-sub">
          Loading...
        </div>
      </div>
    );
  }

  if (err || !data) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="rounded-xl border border-brand-border bg-box/60 p-6 text-defect">
          {err || '데이터 없음'}
        </div>
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
            className="h-[46px] rounded-lg bg-button px-4 font-dm-sans text-sm text-white hover:opacity-90"
          >
            뒤로가기
          </button>
        </div>

        {/* 본문 */}
        <div className="mt-8 flex gap-8">
          {/* 좌측 이미지 */}
          <div className="h-[476px] w-[486px] overflow-hidden rounded-lg bg-black/20">
            {data.imageUrl ? (
              <Image
                src={data.imageUrl}
                alt="product"
                width={486}
                height={476}
                className="h-full w-full object-cover"
                onError={() => console.log('이미지 실패: 만료/권한 가능성')}
              />
            ) : (
              <div className="grid h-full w-full place-items-center text-sub">No Image</div>
            )}
          </div>

          {/* 우측 메트릭 */}
          <div className="w-[248px] space-y-3 font-inter text-base text-sub">
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

function Section({
  label,
  value,
  strong,
}: {
  label: string;
  value?: React.ReactNode;
  strong?: boolean;
}) {
  return (
    <div className="rounded-xl p-2">
      <div className="truncate leading-5">{label}</div>
      <div
        className={`font-pretendard text-[15px] leading-[18px] ${strong ? 'font-semibold text-white' : 'text-white'}`}
      >
        {value ?? '-'}
      </div>
    </div>
  );
}
