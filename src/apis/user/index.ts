import service, { client, Result } from '@/utils/request';
import { RcFile } from 'antd/es/upload';

// interface
// init
export const userInitState: User = {
  userId: '',
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

export interface UpdateUserForm {
  nickname?: string;
  brief?: string;
}

export interface UpdatePswForm {
  oldPsw: string;
  newPsw: string;
  pswConfirm: string;
}

export interface UpdateEmailForm {
  newEmail: string;
  code: number;
}

// response
interface CodeResult {
  img: string;
}

interface LoginResult {
  expireTime: number;
}

export interface User {
  userId: string;
  username: string;
  nickname: string;
  brief: string;
  email: string;
  avatar: string;
  role: string;
}

export interface GetUserRes {
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
  return client.post(
    '/api/user/avatar',
    { file },
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    }
  );
};

export const getVerificationCode = async () => {
  return client.get<Result<CodeResult>>('/api/user/verify');
};

export const getUserInfo = async () => {
  return client.get<Result<GetUserRes>>('/api/user/info');
};

export const getCriiky0Info = async () => {
  return client.get<Result<GetUserRes>>('/api/user/criiky0');
};

export const getCriiky0Avatar = async () => {
  return service.get('/api/user/criiky0/avatar', {
    responseType: 'arraybuffer',
  });
};

export const updateUser = async (data: UpdateUserForm) => {
  return client.patch<Result<UpdatedUser>>('/api/user/info', data);
};

export const getUserInfoById = async (userId: string) => {
  return client.get<Result<GetUserRes>>(`/api/user/${userId}`);
};

export const getAvatarByUserId = async (userId: string) => {
  return service.get(`/api/user/avatar/${userId}`, {
    responseType: 'arraybuffer',
  });
};

export const updatePsw = async (data: UpdatePswForm) => {
  return client.patch<Result<void>>('/api/user/password', data);
};

export const sendCode = async (email: string) => {
  return client.get<Result<void>>(`/api/user/code?email=${email}`);
};

export const updateEmail = async (data: UpdateEmailForm) => {
  return client.patch<Result<GetUserRes>>('/api/user/email', data);
};

export const logout = async () => {
  return client.delete('/api/user/logout');
};
