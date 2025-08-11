import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

export const axioscommon = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
  headers: { Accept: 'application/json' },
});

const authClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
  headers: { Accept: 'application/json' },
});

let isRefreshing = false;
let queue: Array<() => void> = [];

async function devLogin() {
  const username = process.env.NEXT_PUBLIC_DEV_ID || '';
  const password = process.env.NEXT_PUBLIC_DEV_PW || '';
  if (!username || !password) throw new Error('DEV ID/PW가 .env.local에 없습니다.');
  await authClient.post('/login', { username, password }); // ★ baseURL에 /api 포함 기준
}

function shouldSkip(url?: string) {
  if (!url) return false;
  return url.endsWith('/login') || url.endsWith('/logout');
}

axioscommon.interceptors.response.use(
  res => res,
  async (err: AxiosError) => {
    const resp = err.response;
    const cfg = (err.config || {}) as RetriableConfig;

    if (!resp || !cfg) throw err;
    if (shouldSkip(cfg.url)) throw err;

    if ((resp.status === 401 || resp.status === 403) && !cfg._retry) {
      cfg._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          await devLogin();
          isRefreshing = false;
          queue.forEach(cb => cb());
          queue = [];
          return axioscommon(cfg);
        } catch (e) {
          isRefreshing = false;
          queue = [];
          throw e;
        }
      }

      return new Promise((resolve, reject) => {
        queue.push(() => {
          axioscommon(cfg).then(resolve).catch(reject);
        });
      });
    }

    throw err;
  }
);
