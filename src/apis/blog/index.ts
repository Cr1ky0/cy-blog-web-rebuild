import { client, GetCountResponse, GetPageRequest, RequestPageOptions, Result } from '@/utils/request';

// interface
// init
export const blogInitState: Blog = {
  blogId: 0,
  title: '',
  content: '',
  likes: 0,
  views: 0,
  collected: false,
  createAt: '',
  updateAt: '',
  sort: 0,
  userId: 0,
  menuId: 0,
};

// request
interface UpdateBlogForm {
  blogId: number;
  title?: string;
  content?: string;
  collected?: boolean;
  updateAt?: string;
  menuId?: number;
}

interface AddBlogForm {
  title: string;
  content: string;
  menuId: number;
}

interface UpdateBlogBrowseForm {
  blogId: number;
  like?: boolean;
  plus?: boolean;
}

// response
export interface Blog {
  blogId: number;
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
  userId: number;
  menuId: number;
}

export interface MenuBlog {
  blogId: number;
  title: string;
  sort: number;
  createAt: string;
}

export interface BlogTimeLineObj {
  blogId: number;
  title: string;
  createAt: string;
}

export interface BlogHasComment {
  commentCount: number;
  blogId: number;
  userId: number;
  menuId: number;
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

export const getBlog = async (blogId: number) => {
  return client.get<Result<GetBlogRes>>(`/api/blog/single/${blogId}`);
};

export const delBlog = async (blogId: number) => {
  return client.delete<Result<void>>(`/api/blog?blog_id=${blogId}`);
};

export const updateBlog = async (data: UpdateBlogForm) => {
  return client.patch<Result<UpdateBlogRes>>('/api/blog', data);
};

export const getBlogsOfMenu = async (menuId: number) => {
  return client.get<Result<GetMenuBlogRes>>(`/api/blog/certain_menu?menu_id=${menuId}`);
};

export const sortBlog = async (idList: number[]) => {
  return client.patch<Result<void>>('/api/blog/sort', idList);
};

export const addBlog = async (data: AddBlogForm) => {
  return client.post<Result<GetBlogRes>>('/api/blog', data);
};

export const updateBlogBrowse = async (data: UpdateBlogBrowseForm) => {
  return client.patch<Result<UpdateBlogRes>>('/api/blog/browse', data);
};

export const getCriiky0TimeLine = async () => {
  return client.get<Result<BlogTimeLineRes>>('/api/criiky0/timeline');
};

export const getBlogPageOfCriiky0 = async (data: RequestPageOptions) => {
  const { page, size, sort, collected } = data;
  return client.get<Result<GetPageRequest<Blog>>>(
    `/api/blog/criiky0?page=${page}&size=${size}&sort=${sort}&collected=${collected}`
  );
};

export const getBlogCountOfCriiky0 = async (options: string) => {
  return client.get<Result<GetCountResponse>>(`/api/blog/criiky0/count?options=${options}`);
};

export const getBlogHasCommentOfUser = async (data: RequestPageOptions) => {
  const { page, size } = data;
  return client.get<Result<GetPageRequest<BlogHasComment>>>(`/api/blog/hascomment?page=${page}&size=${size}`);
};

export const getCollectedBlogOfCriiky0 = async () => {
  return client.get<Result<GetCollectedBlogsRes>>('/api/blog/criiky0/collected');
};
