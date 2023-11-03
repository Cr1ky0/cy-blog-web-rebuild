import service, { client, Result } from '@/utils/request';
import { RcFile } from 'antd/es/upload';

// interface
interface LoginForm {
  userinfo: string;
  verificationCode: string;
  password: string;
}

interface CodeResult {
  img: string;
}

export interface UserInfo {
  userId: number;
  username: string;
  nickname: string;
  brief: string;
  email: string;
  avatar: string;
  role: string;
}

export const login = async (data: LoginForm) => {
  return client.post<void>('/api/user/login', data);
};

export const getAvatar = async () => {
  return service.get('/api/user/avatar', {
    responseType: 'arraybuffer',
  });
};

export const uploadAvatar = async (file: RcFile) => {
  return client.post('/api/user/avatar', { file });
};

export const getVerificationCode = async () => {
  return client.get<Result<CodeResult>>('/api/user/verify');
};

export const getUserInfo = async () => {
  return client.get<Result<UserInfo>>('/api/user/info');
};
