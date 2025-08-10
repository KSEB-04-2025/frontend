// /middleware.ts  (루트)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  console.log('[MW HIT]', req.nextUrl.pathname); // 터미널에 무조건 찍혀야 함

  // 정적/내부 리소스는 통과
  const p = req.nextUrl.pathname;
  if (
    p.startsWith('/_next/') ||
    p === '/favicon.ico' ||
    p === '/manifest.json' ||
    p === '/robots.txt' ||
    p === '/sitemap.xml'
  ) return NextResponse.next();

  // ✅ /signin이 아니면 전부 /signin으로 보냄 (무조건 리다이렉트 테스트)
  if (!p.startsWith('/signin')) {
    const url = req.nextUrl.clone();
    url.pathname = '/signin';
    url.search = '';
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

// ⚠ 테스트 단계에서는 export const config 지우세요
