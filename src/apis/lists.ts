import { axioscommon } from '@/apis/common';

export type ProductRow = { id: string; grade: 'A'|'B'|'C'; date: string };

const toYmd = (v: any) => {
  const d = new Date(v);
  if (isNaN(d.getTime())) return '';
  return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')}`;
};

export async function fetchAllProducts(): Promise<ProductRow[]> {
  const res = await axioscommon.get('/admin/all-products'); // 보호된 API
  const arr: any[] = Array.isArray(res.data) ? res.data : res.data?.data ?? [];
  return arr.map((it) => ({
    id: String(it.productId ?? ''),
    grade: (String(it.label ?? '').toUpperCase() as 'A'|'B'|'C') ?? 'C',
    date: toYmd(it.uploadDate),
  }));
}
