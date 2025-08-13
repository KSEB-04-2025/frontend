
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';


declare module 'axios' {
  interface AxiosRequestConfig {
    _skipAuth?: boolean;
  }
}

type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean; _skipAuth?: boolean };

export const axioscommon = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ,
  withCredentials: true, 
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
   
    if (!resp) {
      goLogin('net');
      return Promise.reject(err);
    }

   

    
    if (resp.status === 401) {
      goLogin('expired');
    } else if (resp.status === 403) {
      goLogin('forbidden');
    }

    return Promise.reject(err);
  }
);
