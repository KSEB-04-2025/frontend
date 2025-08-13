'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { logout } from '@/apis/auth';
import { LogOut, RefreshCw } from 'lucide-react';

export default function LogoutButton({ className = '' }: { className?: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // ✅ 사용

  async function onClick() {
    if (loading) return;
    const ok = window.confirm('로그아웃 하시겠습니까?');
    if (!ok) return;

    setLoading(true);
    try {
      await logout();
      router.replace('/login?loggedout=1'); 
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className={[
        'inline-flex w-full items-center justify-center gap-2 rounded-lg border border-white/15 px-3 py-2.5 text-sm text-sub hover:bg-white/5 hover:text-heading disabled:opacity-60',
        className,
      ].join(' ')}
    >
      {loading ? (
        <>
          <RefreshCw className="size-4 animate-spin" />
          로그아웃 중…
        </>
      ) : (
        <>
          <LogOut className="size-4" />
          로그아웃
        </>
      )}
    </button>
  );
}
