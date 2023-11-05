import React, { MouseEventHandler, useCallback, useRef, useState } from 'react';

// antd
import { Button, Popover, Input, InputRef } from 'antd';

// css
import style from './index.module.scss';

// comp
import Emoji from './Emoji';

// context
import { useGlobalMessage } from '@/components/ContextProvider/MessageProvider';
import { useViewport } from '@/components/ContextProvider/ViewportProvider';

// redux
import { useAppDispatch, useAppSelector } from '@/redux';
import { setComments, setIsLoading, setLength } from '@/redux/slices/comments';

// api
import { addComment } from '@/apis/comment';

// global
import { BREAK_POINT } from '@/global';

interface WriteCommentProps {
  belongCommentId?: number;
}

const WriteComment: React.FC<WriteCommentProps> = ({ belongCommentId }) => {
  const message = useGlobalMessage();
  const dispatch = useAppDispatch();
  const { width } = useViewport();
  const commentRef = useRef<HTMLTextAreaElement>(null);
  const userNameRef = useRef<InputRef>(null);
  const userBriefRef = useRef<InputRef>(null);

  // state
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading1] = useState(false);
  const selectedId = useAppSelector(state => state.blogMenu.selectedId);
  const curPage = useAppSelector(state => state.comments.curPage);
  const sort = useAppSelector(state => state.comments.sort);
  const themeMode = useAppSelector(state => state.universal.themeMode);
  const user = useAppSelector(state => state.user.user);

  // 向文本框内部添加表情
  const addEmoji: MouseEventHandler<HTMLLIElement> = useCallback(event => {
    const commentNode = commentRef.current as HTMLTextAreaElement;
    commentNode.value = commentNode.value + event.currentTarget.innerHTML;
    setIsOpen(false);
  }, []);

  const handleSubmit = async () => {
    setIsLoading1(true);
    const comment = commentRef.current as HTMLTextAreaElement;
    const username = (userNameRef.current as InputRef).input as HTMLInputElement;
    const brief = (userBriefRef.current as InputRef).input as HTMLInputElement;
    if (!comment.value) {
      message.error('请输入评论！');
      setIsLoading1(false);
      return;
    }
    try {
      if (belongCommentId) {
        await addComment({
          blogId: selectedId,
          belongCommentId,
          content: comment.value,
          userId: user ? user.userId : undefined,
          brief: user ? user.brief : brief.value ? brief.value : undefined,
          username: user ? user.username : username.value ? username.value : undefined,
        });
        await message.loadingAsync('提交中...', '提交成功');
        comment.value = '';
        dispatch(setLength(selectedId));
        dispatch(setIsLoading(true));
        setTimeout(() => {
          dispatch(setIsLoading(false));
        }, 500);
        dispatch(
          setComments({
            id: selectedId,
            page: curPage,
          })
        );
      } else {
        await addComment({
          blogId: selectedId,
          content: comment.value,
          userId: user ? user.userId : undefined,
          brief: user ? user.brief : brief.value ? brief.value : undefined,
          username: user ? user.username : username.value ? username.value : undefined,
        });
        await message.loadingAsync('提交中...', '提交成功');
        comment.value = '';
        dispatch(setLength(selectedId));
        dispatch(setIsLoading(true));
        setTimeout(() => {
          dispatch(setIsLoading(false));
        }, 500);
        dispatch(
          setComments({
            id: selectedId,
            page: curPage,
            sort: sort === 'time' ? 'create_at' : 'likes',
          })
        );
      }
    } catch (data: any) {
      message.error(data.message);
    } finally {
      setIsLoading1(false);
    }
  };

  return (
    <div className={`${style.wrapper} clearfix ${themeMode === 'dark' ? style.commentDark : style.commentLight}`}>
      <div className={style.infoInput}>
        <div>
          <Input className={style.input} placeholder="昵称" ref={userNameRef} />
        </div>
        <div>
          <Input className={style.input} placeholder="个人签名" ref={userBriefRef} />
        </div>
      </div>
      <textarea
        className={`${style.content} ${themeMode === 'dark' ? 'dark' : 'light'}`}
        ref={commentRef}
        name="comment"
        placeholder="请输入评论"
      />
      <div className={`${style.funcBar} clearfix`}>
        <Popover
          placement="bottomLeft"
          content={<Emoji handleClick={addEmoji} />}
          open={isOpen}
          style={{ boxShadow: '0 0 1px rgba(0,0,0,.5)' }}
        >
          <div
            className={style.emoji}
            onClick={() => {
              setIsOpen(!isOpen);
            }}
          >
            <span className="iconfont">&#xe618;</span>
          </div>
        </Popover>

        <div className={style.submit}>
          <Button
            style={{ border: 'none' }}
            type="primary"
            size={width > BREAK_POINT ? 'middle' : 'small'}
            loading={isLoading}
            onClick={handleSubmit}
          >
            {belongCommentId ? '回复' : '评论'}
          </Button>
        </div>
      </div>
    </div>
  );
};
export default WriteComment;
