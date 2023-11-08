import React, { useCallback, useEffect, useState } from 'react';

// antd
import { Tag } from 'antd';

// css
import style from './index.module.scss';

// interface
import { Comment, updateCommentBrowse } from '@/apis/comment';

// context
import { useGlobalMessage } from '@/components/ContextProvider/MessageProvider';
import { useGlobalModal } from '@/components/ContextProvider/ModalProvider';
import { useAvatar } from '@/components/ContextProvider/AvatarPrivider';

// img
import img from '@/assets/images/default.webp';

// redux
import { useAppDispatch, useAppSelector } from '@/redux';
import { addLikeId, delLikeId, setComments, setLength } from '@/redux/slices/comments';

// util
import { isLike } from '@/utils';

//api
import { deleteCommentAjax } from '@/apis/comment';

// comp
import WriteComment from '@/components/Comment/WriteComment';

// api
import { getUserInfoById, User, userInitState } from '@/apis/user';

export interface SingleCommentProps {
  info: Comment;
  noLikes?: boolean;
  isReply?: boolean;
}

// TODO:根据isReply来改写为Reply样式
const SingleComment: React.FC<SingleCommentProps> = props => {
  const { info, noLikes, isReply } = props;
  const { content, username, brief, createAt, userId, likes: likeNum, commentId } = info;
  const modal = useGlobalModal();
  const message = useGlobalMessage();
  const dispatch = useAppDispatch();
  const { getAvatarById } = useAvatar();

  // 利用likeList判断当前评论的id是否在其中来记录点赞状态
  const likeList = useAppSelector(state => state.comments.likeList);
  const themeMode = useAppSelector(state => state.universal.themeMode);
  const curPage = useAppSelector(state => state.comments.curPage);
  const selectedId = useAppSelector(state => state.blogMenu.selectedId);
  const user = useAppSelector(state => state.user.user);

  const [avatar, setAvatar] = useState(img);
  const [commentUser, setCommentUser] = useState<User>(userInitState);
  const [replyOpen, setReplyOpen] = useState(false);
  const [likes, setLikes] = useState(likeNum);

  const isChosen = isLike(likeList, commentId);

  const handleDel = () => {
    modal.confirm({
      title: '提示',
      content: '是否删除该评论？',
      onOk: async () => {
        await deleteCommentAjax(commentId);
        dispatch(
          setComments({
            id: selectedId,
            page: curPage,
          })
        );
        dispatch(setLength(selectedId));
        message.success('删除成功');
      },
    });
  };

  // 获取当前评论用户的头像以及用户信息
  useEffect(() => {
    const getUserAvatarById = async () => {
      if (userId) {
        try {
          const res = await getAvatarById(userId);
          setAvatar(res);
          const userRes = await getUserInfoById(userId);
          setCommentUser(userRes.data.user);
        } catch (data: any) {
          message.error(data.message);
        }
      }
    };
    getUserAvatarById();
  }, []);

  const handleLike = async () => {
    try {
      if (!isChosen) {
        const res = await updateCommentBrowse({
          commentId,
          plus: true,
        });
        const comment = res.data.updatedComment;
        dispatch(addLikeId(commentId));
        setLikes(comment.likes);
      } else {
        const res = await updateCommentBrowse({
          commentId,
          plus: false,
        });
        const comment = res.data.updatedComment;
        dispatch(delLikeId(commentId));
        setLikes(comment.likes);
      }
    } catch (data: any) {
      message.error(data.message);
    }
  };

  const getTagPage = () => {
    if (commentUser.role === 'admin') {
      return <Tag color="red">管理员</Tag>;
    } else if (commentUser.role === 'user') {
      return <Tag color="blue">用户</Tag>;
    } else {
      return <Tag color="green">游客</Tag>;
    }
  };

  return (
    <div className={`${style.wrapper} clearfix ${themeMode === 'dark' ? 'dark' : 'light'}`}>
      <div
        className={`${style.infoWrapper} clearfix ${
          themeMode === 'dark' ? style.infoWrapperDark : style.infoWrapperLight
        }`}
      >
        <img className={style.avatar} src={avatar} alt="avatar"></img>
        <div className={style.info}>
          <div className={style.infoBox}>
            <div className={style.username}>{username || '匿名'}</div>
            <div className={style.tags}>{getTagPage()}</div>
            <div className={style.time}>{createAt}</div>
          </div>
          <div className={style.rightFuncBox}>
            {user && user.role === 'admin' ? (
              <div className={`${style.delComment} iconfont`} onClick={handleDel}>
                &#xe604;
              </div>
            ) : undefined}
            {noLikes ? undefined : (
              <div className={style.likesWrapper}>
                {isChosen ? (
                  <div className={`${style.likesOnChosen} iconfont`} onClick={handleLike}>
                    &#xeca2;
                  </div>
                ) : (
                  <div className={`${style.likes} iconfont`} onClick={handleLike}>
                    &#xeca1;
                  </div>
                )}
                <span className={`${style.likesNum}`}>{likes}</span>
              </div>
            )}
            {!isReply ? (
              <div
                className={`${style.replyComment} iconfont`}
                onClick={() => {
                  setReplyOpen(!replyOpen);
                }}
              >
                &#xe82e;
              </div>
            ) : undefined}
          </div>
        </div>
        <div className={style.signature}>{brief || '他很懒，没有个人简介！'}</div>
      </div>
      <div className={style.comment}>{content}</div>
      {/* reply */}
      {replyOpen ? (
        <div className={style.writeComment}>
          <WriteComment belongCommentId={commentId}></WriteComment>
        </div>
      ) : undefined}
    </div>
  );
};

export default SingleComment;
