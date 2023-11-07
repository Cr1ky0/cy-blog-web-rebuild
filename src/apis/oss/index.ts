import { client, Result } from '@/utils/request';

// interface
// init
export const OSSConfigInit: OSSConfig = {
  id: '',
  endpoint: '',
  bucket: '',
  accessKeyId: '',
  accessKeySecret: '',
  dir: '',
  callbackUrl: '',
};

// request
export interface AddOSSConfigForm {
  endpoint: string;
  bucket: string;
  accessKeyId: string;
  accessKeySecret: string;
  dir?: string;
  callbackUrl?: string;
}

// response
export interface OSSPolicy {
  accessid: string;
  policy: string;
  signature: string;
  dir: string;
  host: string;
  expire: string;
  callback: string;
}

export interface OSSConfig {
  id: string;
  endpoint: string;
  bucket: string;
  accessKeyId: string;
  accessKeySecret: string;
  dir: string;
  callbackUrl: string;
  version?: number;
  deleted?: number;
}

interface GetOSSConfigRes {
  config: OSSConfig;
}

export const getOSSPolicy = async () => {
  return client.get<Result<OSSPolicy>>('/api/oss/policy');
};

export const setOSSConfig = async (data: AddOSSConfigForm) => {
  return client.post<Result<GetOSSConfigRes>>('/api/oss', data);
};

export const getOSSConfig = async () => {
  return client.get<Result<GetOSSConfigRes>>('/api/oss');
};
