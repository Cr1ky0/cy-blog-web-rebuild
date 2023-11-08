import { client, GetCountResponse, GetPageRequest, RequestPageOptions, Result } from '@/utils/request';

// interface
// request
interface AddCommentForm {
  content: string;
  blogId: string;
  username?: string;
  brief?: string;
  belongCommentId?: string;
  userId?: string;
}

interface UpdateCommentBrowseForm {
  commentId: string;
  plus?: boolean;
}

// response
export interface Comment {
  commentId: string;
  content: string;
  likes: number;
  username?: string;
  brief?: string;
  createAt: string;
  belongCommentId: string;
  userId?: string;
  blogId: string;
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
  return client.patch<Result<UpdateCommentRes>>(`/api/comment/browse?comment_id=${commentId}&plus=${plus || ''}`);
};

export const deleteCommentAjax = async (commentId: string) => {
  return client.delete<Result<void>>(`/api/comment?comment_id=${commentId}`);
};

export const getCommentCountOfBlog = async (blogId: string) => {
  return client.get<Result<GetCountResponse>>(`/api/comment/curblog/count?blog_id=${blogId}`);
};

export const getCommentPageOfBlog = async (data: RequestPageOptions) => {
  const { id, page, size } = data;
  return client.get<Result<GetPageRequest<Comment>>>(
    `/api/comment/curblog?blog_id=${id}&page=${page || ''}&size=${size || ''}`
  );
};
