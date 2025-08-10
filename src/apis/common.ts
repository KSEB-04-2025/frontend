// apis/common.ts
import axios, { AxiosError } from 'axios';

export const axioscommon = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
  headers: { Accept: 'application/json' },
});

axioscommon.interceptors.response.use(
  (res) => res,
  (err: AxiosError) => {
    const status = err.response?.status;
    if ((status === 401 || status === 403) && typeof window !== 'undefined') {
      const from = window.location.pathname + window.location.search;
      window.location.href = `/signin?from=${encodeURIComponent(from)}`;
      return; // 이후 요청 중단
    }
    return Promise.reject(err);
  }
);
