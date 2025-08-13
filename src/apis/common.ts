// src/apis/common.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Axios 요청 설정에 커스텀 플래그 추가 (_skipAuth)
declare module 'axios' {
  interface AxiosRequestConfig {
    _skipAuth?: boolean;
  }
}

type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean; _skipAuth?: boolean };

export const axioscommon = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true, // 세션 쿠키 사용 시 필수
  headers: { Accept: 'application/json' },
});

let isRedirecting = false;
const isBrowser = () => typeof window !== 'undefined';

function goLogin(reason: 'expired' | 'forbidden' | 'net') {
  if (!isBrowser() || isRedirecting) return;
  isRedirecting = true;
  const from = encodeURIComponent(location.pathname + location.search);
  const q = reason === 'expired' ? 'expired=1' : reason === 'forbidden' ? 'forbidden=1' : 'net=1';
  location.assign(`/login?${q}&from=${from}`);
}

axioscommon.interceptors.response.use(
  res => res,
  async (err: AxiosError) => {
    const resp = err.response;
    const cfg = (err.config || {}) as RetriableConfig;

    if (cfg?._skipAuth) return Promise.reject(err);
    // 네트워크/CORS 차단 등으로 응답 자체가 없을 때
    if (!resp) {
      goLogin('net');
      return Promise.reject(err);
    }

    // 로그인/리프레시 같은 인증 API 자체는 건너뛴다

    // 비로그인/세션만료/권한없음 → 로그인 페이지 이동
    if (resp.status === 401) {
      goLogin('expired');
    } else if (resp.status === 403) {
      goLogin('forbidden');
    }

    return Promise.reject(err);
  }
);
