'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { login } from '@/apis/auth';
import { Eye, EyeOff } from 'lucide-react';

function LoginInner() {
  const router = useRouter();
  const search = useSearchParams();
  const from = search.get('from');
  const redirectTo = from && from.startsWith('/') && !from.startsWith('//') ? from : '/dashboard';

  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const msg =
      search.get('expired') === '1'
        ? '세션이 만료되었습니다. 다시 로그인해 주세요.'
        : search.get('net') === '1'
          ? '네트워크 또는 CORS 문제로 인증이 필요합니다. 다시 로그인해 주세요.'
          : null;
    if (msg) setErr(msg);
  }, [search]);

  function axMsg(e: unknown): string {
    if (axios.isAxiosError(e)) {
      const data = e.response?.data as { message?: string } | undefined;
      return data?.message ?? '로그인에 실패했습니다. 잠시 후 다시 시도해 주세요.';
    }
    if (e instanceof Error && e.message) return e.message;
    return '로그인에 실패했습니다. 잠시 후 다시 시도해 주세요.';
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      await login(id, pw);
      router.replace(redirectTo);
    } catch (e) {
      setErr(axMsg(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#0c1222] text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-[560px] items-center justify-center px-6">
        <div className="w-full rounded-xl border border-white/10 bg-[#121a2e] p-8 shadow-xl">
          <h1 className="mb-8 text-center text-2xl font-semibold">관리자 로그인</h1>

          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label htmlFor="login-id" className="mb-2 block text-sm text-gray-300">
                아이디
              </label>
              <input
                id="login-id"
                type="text"
                name="username"
                value={id}
                onChange={e => setId(e.target.value)}
                placeholder="아이디"
                autoComplete="username"
                className="h-[58px] w-full rounded-lg border border-white/20 bg-transparent px-4 text-[15px] text-gray-200 outline-none focus:border-white/40"
              />
            </div>

            <div>
              <label htmlFor="login-pw" className="mb-2 block text-sm text-gray-300">
                비밀번호
              </label>
              <div className="relative">
                <input
                  id="login-pw"
                  type={showPw ? 'text' : 'password'}
                  name="password"
                  value={pw}
                  onChange={e => setPw(e.target.value)}
                  placeholder="비밀번호"
                  autoComplete="current-password"
                  className="h-[58px] w-full rounded-lg border border-white/20 bg-transparent px-4 pr-12 text-[15px] text-gray-200 outline-none focus:border-white/40"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(s => !s)}
                  aria-label={showPw ? '비밀번호 숨기기' : '비밀번호 보기'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-2 text-gray-300 hover:bg-white/5"
                >
                  {showPw ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                </button>
              </div>
            </div>

            {err && <p className="text-sm text-red-400">{err}</p>}

            <button
              type="submit"
              disabled={loading || !id || !pw}
              className="h-[62px] w-full rounded-lg bg-[#b44cff] px-4 text-center text-xl font-bold text-white hover:opacity-90 disabled:opacity-60"
            >
              {loading ? '로그인 중…' : '로그인'}
            </button>
          </form>
        </div>
      </div>

      <footer className="pb-10 text-center text-xs text-gray-400">
        <div className="mb-2 font-semibold tracking-wide">ZEZE ONE</div>
        <div>© 2025 K-Software Empowerment BootCamp. Project by zezeone</div>
      </footer>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen w-full bg-[#0c1222]" />}>
      <LoginInner />
    </Suspense>
  );
}
