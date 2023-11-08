import { client, GetCountResponse, GetPageRequest, RequestPageOptions, Result } from '@/utils/request';

// interface
// init
export const blogInitState: Blog = {
  blogId: '',
  title: '',
  content: '',
  likes: 0,
  views: 0,
  collected: false,
  createAt: '',
  updateAt: '',
  sort: 0,
  userId: '',
  menuId: '',
};

// request
interface UpdateBlogForm {
  blogId: string;
  title?: string;
  content?: string;
  collected?: boolean;
  updateAt?: string;
  menuId?: string;
}

interface AddBlogForm {
  title: string;
  content: string;
  menuId: string;
}

interface UpdateBlogBrowseForm {
  blogId: string;
  like?: boolean;
  plus?: boolean;
}

// response
export interface Blog {
  blogId: string;
  title: string;
  content: string;
  likes: number;
  views: number;
  collected: boolean;
  createAt: string;
  updateAt: string;
  sort: number;
  version?: number;
  deleted?: number;
  userId: string;
  menuId: string;
}

export interface MenuBlog {
  menuId: string;
  blogId: string;
  title: string;
  sort: number;
  createAt: string;
}

export interface BlogTimeLineObj {
  blogId: string;
  title: string;
  createAt: string;
}

export interface BlogHasComment {
  commentCount: number;
  blogId: string;
  userId: string;
  menuId: string;
  title: string;
}

interface GetBlogRes {
  blog: Blog;
}

interface GetMenuBlogRes {
  blogs: MenuBlog[];
}

interface GetCollectedBlogsRes {
  collectedBlogs: MenuBlog[];
}

interface UpdateBlogRes {
  updatedBlog: Blog;
}

export interface BlogTimeLineRes {
  timeline: BlogTimeLineObj[];
}

export const getBlog = async (blogId: string) => {
  return client.get<Result<GetBlogRes>>(`/api/blog/single/${blogId}`);
};

export const delBlog = async (blogId: string) => {
  return client.delete<Result<void>>(`/api/blog?blog_id=${blogId}`);
};

export const updateBlog = async (data: UpdateBlogForm) => {
  return client.patch<Result<UpdateBlogRes>>('/api/blog', data);
};

export const getBlogsOfMenu = async (menuId: string) => {
  return client.get<Result<GetMenuBlogRes>>(`/api/blog/certain_menu?menu_id=${menuId}`);
};

export const sortBlog = async (idList: string[]) => {
  return client.patch<Result<void>>('/api/blog/sort', idList);
};

export const addBlog = async (data: AddBlogForm) => {
  return client.post<Result<GetBlogRes>>('/api/blog', data);
};

export const updateBlogBrowse = async (data: UpdateBlogBrowseForm) => {
  const { blogId, like, plus } = data;
  return client.patch<Result<UpdateBlogRes>>(
    `/api/blog/browse?blog_id=${blogId}&like=${like || ''}&plus=${plus || ''}`
  );
};

export const getCriiky0TimeLine = async () => {
  return client.get<Result<BlogTimeLineRes>>('/api/blog/criiky0/timeline');
};

export const getBlogPageOfCriiky0 = async (data: RequestPageOptions) => {
  const { page, size, sort, collected } = data;
  return client.get<Result<GetPageRequest<Blog>>>(
    `/api/blog/criiky0?page=${page || ''}&size=${size || ''}&sort=${sort || ''}&options=collected:${collected || ''}`
  );
};

export const getBlogCountOfCriiky0 = async (options: string) => {
  return client.get<Result<GetCountResponse>>(`/api/blog/criiky0/count?options=${options}`);
};

export const getBlogHasCommentOfUser = async (data: RequestPageOptions) => {
  const { page, size } = data;
  return client.get<Result<GetPageRequest<BlogHasComment>>>(
    `/api/blog/hascomment?page=${page || ''}&size=${size || ''}`
  );
};

export const getCollectedBlogOfCriiky0 = async () => {
  return client.get<Result<GetCollectedBlogsRes>>('/api/blog/criiky0/collected');
};
