// src/apis/auth.ts
import { axioscommon } from '@/apis/common';

export async function login(username: string, password: string) {
  const res = await axioscommon.post(
    '/login', // 실제 백엔드 경로가 /api/auth/login 이라면 여기만 바꿔주세요
    { username, password },
    {
      withCredentials: true,
      _skipAuth: true, // ← 로그인 요청은 401/403 인터셉터 처리 스킵
      validateStatus: s => (s ?? 0) < 500, // 4xx는 여기서 직접 문구 처리
    }
  );

  if (res.status >= 500)
    throw new Error('로그인 서버 오류(500)입니다. 잠시 후 다시 시도해 주세요.');
  if (res.status >= 400) throw new Error('아이디 또는 비밀번호가 올바르지 않습니다.');
}
