// src/apis/auth.ts
import { axioscommon } from '@/apis/common';

type ApiMessage = { message?: string }; // ✅ 응답 타입 최소 정의

export async function login(username: string, password: string) {
  const res = await axioscommon.post<ApiMessage>(
    '/login',
    { username, password },
    {
      withCredentials: true,
      _skipAuth: true,
      validateStatus: s => (s ?? 0) < 500,
    }
  );

  if (res.status >= 500)
    throw new Error('로그인 서버 오류(500)입니다. 잠시 후 다시 시도해 주세요.');
  if (res.status >= 400)
    throw new Error(res.data?.message ?? '아이디 또는 비밀번호가 올바르지 않습니다.');

  return res.data;
}

export async function logout() {
  const res = await axioscommon.post<ApiMessage>('/logout', undefined, {
    withCredentials: true,
    _skipAuth: true,
    validateStatus: s => (s ?? 0) < 500,
  });

  if (res.status >= 500)
    throw new Error('로그아웃 서버 오류(500)입니다. 잠시 후 다시 시도해 주세요.');
  if (res.status >= 400) throw new Error(res.data?.message ?? '로그아웃에 실패했습니다.');

  return res.data;
}
