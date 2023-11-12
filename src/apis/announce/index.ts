import { client, Result } from '@/utils/request';

// interface
// request
interface AddAnnounceForm {
  content: string;
}

// response
interface Announce {
  id: string;
  content: string;
  createAt: string;
  version?: number;
  deleted?: number;
}

interface GetAnnouncRes {
  announce: Announce;
}

export const addAnnounce = async (data: AddAnnounceForm) => {
  return client.post<Result<GetAnnouncRes>>('/api/announce', data);
};

export const getAnnounce = async () => {
  return client.get<Result<GetAnnouncRes>>('/api/announce/single');
};
