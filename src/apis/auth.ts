import { axioscommon } from '@/apis/common';

export const login  = (username: string, password: string) =>
  axioscommon.post('/login', { username, password });

export const logout = () => axioscommon.post('/logout');
