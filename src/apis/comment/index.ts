import { client, Result } from '@/utils/request';

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

export interface GetCommentPageRes {
  comments: Comment[];
  totalSize: number;
  totalPage: number;
  pageSize: number;
  pageNum: number;
}

export interface GetCommentCountRes {
  count: number;
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
