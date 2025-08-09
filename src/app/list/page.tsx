// src/app/list/page.tsx
import ListSection from '@/components/lists/ListSection';

export const metadata = { title: 'List — ZEZE ONE' };

export default function ListPage() {
  return (
    <div className="container mx-auto px-6 py-8">
      <ListSection />
    </div>
  );
}
