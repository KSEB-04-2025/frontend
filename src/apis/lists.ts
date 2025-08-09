// src/apis/lists.ts
import { axioscommon } from '@/apis/common';

export type ProductRow = { id: string; grade: 'A'|'B'|'C'; date: string };

const toYmd = (v: any) => {
  const d = new Date(v);
  if (isNaN(d.getTime())) return '';
  return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')}`;
};

// 목록
export async function fetchAllProducts(): Promise<ProductRow[]> {
  const { data } = await axioscommon.get('/admin/all-products');
  const arr: any[] = Array.isArray(data) ? data : data?.data ?? [];
  return arr.map((it) => ({
    id: String(it.productId ?? ''),
    grade: (String(it.label ?? '').toUpperCase() as 'A'|'B'|'C') ?? 'C',
    date: toYmd(it.uploadDate),
  }));
}

// 상세
export type ProductDetail = {
  productId: string;
  label: string;
  uploadDate: string;
  // 서버 응답 필드에 맞춰 자유롭게 확장
  // e.g. metrics?: { name: string; value: number }[]
};

export async function fetchProductQuality(id: string): Promise<ProductDetail> {
  const { data } = await axioscommon.get(`/admin/product-quality/${encodeURIComponent(id)}`);
  // 필요한 형태로 매핑
  return {
    productId: data.productId ?? id,
    label: data.label ?? '',
    uploadDate: data.uploadDate ?? '',
  };
}
