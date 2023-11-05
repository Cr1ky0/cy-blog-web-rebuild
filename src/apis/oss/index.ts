import { client, Result } from '@/utils/request';

// interface
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

export const getPolicy = async () => {
  return client.get<Result<OSSPolicy>>('/api/oss/policy');
};
