import { client, Result } from '@/utils/request';

// interface
// response
export interface BlogDoc {
  id: number;
  title: string;
  content: string;
  menuTitle: string;
}

export type SearchRes = {
  [key: string]: BlogDoc[];
};

interface SearchDocRes {
  result: SearchRes;
}

export const searchDoc = async (field: string) => {
  return client.get<Result<SearchDocRes>>(`/api/es/search?field=${field}`);
};
