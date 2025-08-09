// src/apis/lists.ts
import { axioscommon } from '@/apis/common';

export type ProductRow = { id: string; grade: 'A' | 'B' | 'defect'; date: string };

const toYmd = (v: any) => {
  const d = new Date(v);
  if (isNaN(d.getTime())) return '';
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
};

// 목록
export async function fetchAllProducts(): Promise<ProductRow[]> {
  const { data } = await axioscommon.get('/admin/all-products');
  const arr: any[] = Array.isArray(data) ? data : data?.data ?? [];
  return arr.map((it) => {
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
  // 서버 응답 필드에 맞춰 자유롭게 확장 가능
};

export async function fetchProductQuality(id: string): Promise<ProductDetail> {
  const { data } = await axioscommon.get(`/admin/product-quality/${encodeURIComponent(id)}`);
  const rawLabel = String(data.label ?? '').toUpperCase();
  const label: 'A' | 'B' | 'defect' =
    rawLabel === 'A' || rawLabel === 'B' ? (rawLabel as 'A' | 'B') : 'defect';
  return {
    productId: data.productId ?? id,
    label,
    uploadDate: data.uploadDate ?? '',
  };
}
