import React from 'react';

// css
import style from './index.module.scss';

// interface
import { Comment } from '@/apis/comment';

// redux
import { useAppSelector } from '@/redux';

// comp
import SingleComment from '@/components/Comment/CommentList/SingleComment';

interface ReplyListProps {
  comment: Comment;
  noLikes?: boolean;
}

const ReplyList: React.FC<ReplyListProps> = ({ comment, noLikes }) => {
  const themeMode = useAppSelector(state => state.universal.themeMode);
  return (
    <div
      className={`${style.wrapper} ${themeMode === 'dark' ? 'dark' : 'light'}`}
      style={comment.subComments && comment.subComments.length ? { paddingTop: 30 } : undefined}
    >
      {comment.subComments
        ? comment.subComments.map(reply => {
            return <SingleComment key={reply.commentId} info={reply} noLikes={noLikes} isReply></SingleComment>;
          })
        : undefined}
    </div>
  );
};

export default ReplyList;
