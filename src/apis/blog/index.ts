import { client, Result } from '@/utils/request';

// interface
// request
interface UpdateBlogForm {
  blogId: number;
  title?: string;
  content?: string;
  collected?: boolean;
  updateAt?: string;
  menuId?: number;
}

// response
export interface Blog {
  blogId: number;
  title: string;
  content: string;
  likes: number;
  views: number;
  collected: boolean;
  creatAt: string;
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

interface GetBlogRes {
  blog: Blog;
}

interface GetMenuBlogRes {
  blogs: MenuBlog[];
}

interface UpdateBlogRes {
  updatedBlog: Blog;
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