// src/apis/lists.ts
import { axioscommon } from '@/apis/common';

export type ProductRow = { id: string; grade: 'A' | 'B' | 'defect'; date: string };

interface RawProductData {
  productId?: string;
  label?: string;
  uploadDate?: string;
}

interface ApiResponse {
  data?: RawProductData[];
}

const toYmd = (v: unknown): string => {
  if (!v) return '';
  const d = new Date(v as string);
  if (isNaN(d.getTime())) return '';
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
};

// 목록
export async function fetchAllProducts(): Promise<ProductRow[]> {
  const { data } = await axioscommon.get<RawProductData[] | ApiResponse>('/admin/all-products');
  const arr: RawProductData[] = Array.isArray(data) ? data : ((data as ApiResponse)?.data ?? []);
  return arr.map(it => {
    const rawLabel = String(it.label ?? '').toUpperCase();
    const grade: 'A' | 'B' | 'defect' =
      rawLabel === 'A' || rawLabel === 'B' ? (rawLabel as 'A' | 'B') : 'defect';
    return {
      id: String(it.productId ?? ''),
      grade,
      date: toYmd(it.uploadDate),
    };
  });
}

// 상세
export type ProductDetail = {
  productId: string;
  label: 'A' | 'B' | 'defect';
  uploadDate: string;
  imageUrl?: string;
  qualityGrade?: string;
  uniformity?: number;
  maxCluster?: number;
  nclusters?: number;
  nspots?: number;
};

interface RawProductDetailData {
  productId?: string;
  label?: string;
  uploadDate?: string;
  imageUrl?: string;
  qualityGrade?: string;
  uniformity?: number;
  maxCluster?: number;
  nclusters?: number;
  nspots?: number;
}

export async function fetchProductQuality(id: string): Promise<ProductDetail> {
  const { data } = await axioscommon.get<RawProductDetailData>(
    `/admin/product-quality/${encodeURIComponent(id)}`
  );
  const rawLabel = String(data.label ?? '').toUpperCase();
  const label: 'A' | 'B' | 'defect' =
    rawLabel === 'A' || rawLabel === 'B' ? (rawLabel as 'A' | 'B') : 'defect';
  return {
    productId: data.productId ?? id,
    label,
    uploadDate: data.uploadDate ?? '',
    imageUrl: data.imageUrl,
    qualityGrade: data.qualityGrade,
    uniformity: data.uniformity,
    maxCluster: data.maxCluster,
    nclusters: data.nclusters,
    nspots: data.nspots,
  };
}
