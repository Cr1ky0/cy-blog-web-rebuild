import axios, { AxiosRequestConfig } from 'axios';
import { BASE_URL } from '@/global';

const service = axios.create({
  timeout: 5000,
  baseURL: BASE_URL,
});

// Result接口
export interface Result<T = unknown> {
  message: string;
  code: number;
  data: T;
}

export interface RequestPageOptions {
  id?: number;
  page?: number;
  size?: number;
  sort?: string;
  collected?: boolean;
}

export interface GetPageRequest<T> {
  records: T[];
  totalSize: number;
  totalPage: number;
  pageSize: number;
  pageNum: number;
}

export interface GetCountResponse {
  count: number;
}

// 都用json发数据
service.defaults.headers.post['Content-Type'] = 'application/json';
service.defaults.withCredentials = true;
//请求拦截器
service.interceptors.request.use(config => {
  // token放入cookie自动携带了
  return config;
});

//响应拦截器
service.interceptors.response.use(
  response => {
    const data = response.data;
    if (response.status !== 200) return Promise.reject();
    if (data.code !== 200) return Promise.reject(data as Result); // catch的就是data
    return Promise.resolve(response);
  },
  async error => {
    return Promise.reject(error.response);
  }
);

// 定义接口
export const client = {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return service.get<T, Result<T>>(url, config).then(res => res.data);
  },
  post<T = any>(url: string, data?: object, config?: AxiosRequestConfig): Promise<T> {
    return service.post<T, Result<T>>(url, data, config).then(res => res.data);
  },
  put<T = any>(url: string, data?: object, config?: AxiosRequestConfig): Promise<T> {
    return service.put<T, Result<T>>(url, data, config).then(res => res.data);
  },
  patch<T = any>(url: string, data?: object, config?: AxiosRequestConfig): Promise<T> {
    return service.patch<T, Result<T>>(url, data, config).then(res => res.data);
  },
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return service.delete<T, Result<T>>(url, config).then(res => res.data);
  },
};

export default service;
