import { client, GetPageRequest, RequestPageOptions, Result } from '@/utils/request';

// interface
// request
interface AddImageForm {
  fileName: string;
  photoTile?: string;
}

// response
export interface Image {
  imageId: string;
  endpoint: string;
  fileName: string;
  bucket: string;
  uploadAt: string;
  photoTime: string;
  version?: number;
  deleted?: number;
  userId: string;
}

interface GetImageRes {
  image: Image;
}

export const addImage = async (data: AddImageForm) => {
  return client.post<Result<GetImageRes>>('/api/image', data);
};

export const getImagePageOfCriiky0 = async (data: RequestPageOptions) => {
  const { page, size } = data;
  return client.get<Result<GetPageRequest<Image>>>(`/api/image/criiky0?page=${page || ''}&size=${size || ''}`);
};

export const delSingleImage = async (imageId: string) => {
  return client.delete<Result<void>>(`/api/image?image_id=${imageId}`);
};

export const delManyImage = async (idList: string[]) => {
  return client.delete<Result<void>>('/api/image/many', {
    data: idList,
  });
};

export const getImagePageOfUser = async (data: RequestPageOptions) => {
  const { page, size } = data;
  return client.get<Result<GetPageRequest<Image>>>(`/api/image?page=${page || ''}&size=${size || ''}`);
};
