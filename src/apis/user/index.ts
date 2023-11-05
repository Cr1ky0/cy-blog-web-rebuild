import service, { client, Result } from '@/utils/request';
import { RcFile } from 'antd/es/upload';

// interface
// init
export const userInitState: User = {
  userId: 0,
  username: '',
  nickname: '',
  brief: '',
  email: '',
  avatar: '',
  role: '',
};

// request
interface LoginForm {
  userinfo: string;
  verificationCode: string;
  password: string;
}

interface UpdateUserForm {
  nickname: string;
  brief: string;
}

// response
interface CodeResult {
  img: string;
}

interface LoginResult {
  expireTime: number;
}

export interface User {
  userId: number;
  username: string;
  nickname: string;
  brief: string;
  email: string;
  avatar: string;
  role: string;
}

export interface UserInfo {
  user: User;
}

export interface UpdatedUser {
  updatedUser: User;
}

export const login = async (data: LoginForm) => {
  return client.post<Result<LoginResult>>('/api/user/login', data);
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

export const getCriiky0Info = async () => {
  return client.get<Result<UserInfo>>('/api/user/criiky0');
};

export const getCriiky0Avatar = async () => {
  return service.get('/api/user/criiky0/avatar', {
    responseType: 'arraybuffer',
  });
};

export const updateUser = async (data: UpdateUserForm) => {
  return client.post<Result<UpdatedUser>>('/api/user/info', data);
};

export const getUserInfoById = async (userId: number) => {
  return client.get<Result<UserInfo>>(`/api/user/${userId}`);
};

export const getAvatarById = async (userId: number) => {
  return service.get(`/api/user/avatar/${userId}`, {
    responseType: 'arraybuffer',
  });
};
