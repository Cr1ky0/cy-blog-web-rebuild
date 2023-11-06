import { client, GetCountRequest, GetPageRequest, RequestPageOptions, Result } from '@/utils/request';

// interface
// request
interface AddCommentForm {
  content: string;
  blogId: number;
  username?: string;
  brief?: string;
  belongCommentId?: number;
  userId?: number;
}

interface UpdateCommentBrowseForm {
  commentId: number;
  plus?: boolean;
}

// response
export interface Comment {
  commentId: number;
  content: string;
  likes: number;
  username?: string;
  brief?: string;
  createAt: string;
  belongCommentId: number;
  userId?: number;
  blogId: number;
  subComments: Comment[];
}

interface GetCommentRes {
  comment: Comment;
}

interface UpdateCommentRes {
  updatedComment: Comment;
}

export const addComment = async (data: AddCommentForm) => {
  return client.post<Result<GetCommentRes>>('/api/comment/post', data);
};

export const updateCommentBrowse = async (data: UpdateCommentBrowseForm) => {
  const { commentId, plus } = data;
  return client.patch<Result<UpdateCommentRes>>(`/api/comment?comment_id=${commentId}&plus=${plus}`);
};

export const deleteCommentAjax = async (commentId: number) => {
  return client.delete<Result<void>>(`/api/comment?comment_id=${commentId}`);
};

export const getCommentCountOfBlog = async (blogId: number) => {
  return client.get<Result<GetCountRequest>>(`/api/comment/curblog/count?blog_id=${blogId}`);
};

export const getCommentPageOfBlog = async (data: RequestPageOptions) => {
  const { id, page, size } = data;
  return client.get<Result<GetPageRequest<Comment>>>(`/api/comment/curblog?blog_id=${id}&page=${page}&size=${size}`);
};
