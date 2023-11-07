import React, { useCallback, useEffect, useState } from 'react';

// css
import style from './index.module.scss';

// redux
import { useAppDispatch, useAppSelector } from '@/redux';
import { setSelectedId } from '@/redux/slices/blogMenu';
import { setJumpFlag } from '@/redux/slices/universal';

// global
import { ANIME_HIDE_TIME } from '@/global';
import { getMenu } from '@/apis/menu';
import { getBlog, MenuBlog } from '@/apis/blog';
import { useGlobalMessage } from '@/components/ContextProvider/MessageProvider';

interface ContextObj {
  title: string;
  blogId: string;
}

interface ContextRelation {
  last: ContextObj;
  next: ContextObj;
}

// 判断当前blog是否有前后文
const initRelation = {
  last: {
    title: '',
    blogId: '',
  },
  next: {
    title: '',
    blogId: '',
  },
};
const NextPage = () => {
  const dispatch = useAppDispatch();
  const message = useGlobalMessage();
  const selectedId = useAppSelector(state => state.blogMenu.selectedId);
  const themeMode = useAppSelector(state => state.universal.themeMode);
  const [relation, setRelation] = useState<ContextRelation>(initRelation);
  // const relation = useMemo(() => getState(selectedId), [selectedId]);

  // 获取前后文环境
  const getState = useCallback(async (): Promise<void> => {
    try {
      const blogRes = await getBlog(selectedId);
      const blog = blogRes.data.blog;
      const menuRes = await getMenu(blog.menuId);
      const menu = menuRes.data.menu;
      const blogs = menu.blogs ? (menu.blogs as MenuBlog[]) : [];
      const last = {} as ContextObj;
      const next = {} as ContextObj;
      blogs.forEach((blog, index) => {
        if (blog.blogId === selectedId)
          if (index === blogs.length - 1 && index !== 0) {
            // 无后文
            last.title = blogs[index - 1].title;
            last.blogId = blogs[index - 1].blogId;
          } else if (index === 0 && blogs.length > 1) {
            // 无前文
            next.title = blogs[index + 1].title;
            next.blogId = blogs[index + 1].blogId;
          } else if (blogs.length === 1) {
            // 无前后文
          } else {
            // 有前后文
            const lastBlog = blogs[index - 1];
            const nextBlog = blogs[index + 1];
            last.title = lastBlog.title;
            last.blogId = lastBlog.blogId;
            next.title = nextBlog.title;
            next.blogId = nextBlog.blogId;
          }
      });
      setRelation({ last, next });
    } catch (data: any) {
      message.error(data.message);
    }
  }, [selectedId]);

  useEffect(() => {
    getState();
  }, [selectedId]);

  const handleClick = (id: string) => {
    dispatch(setJumpFlag(true));
    setTimeout(async () => {
      await dispatch(setSelectedId(id));
    }, ANIME_HIDE_TIME);
  };

  return (
    <div className={`${style.wrapper} ${themeMode === 'dark' ? style.dark : style.light}`}>
      {Object.keys(relation.last).length !== 0 ? (
        <div
          className={style.last}
          style={{ width: Object.keys(relation.next).length !== 0 ? undefined : '95%' }}
          onClick={() => {
            handleClick(relation.last.blogId);
          }}
        >
          <div>{'<上一页'}</div>
          <div className="iconfont">&#xe627;&nbsp;{relation.last.title}</div>
        </div>
      ) : undefined}
      {Object.keys(relation.next).length !== 0 ? (
        <div
          className={style.next}
          style={{ width: Object.keys(relation.last).length !== 0 ? undefined : '95%' }}
          onClick={() => {
            handleClick(relation.next.blogId);
          }}
        >
          <div>{'下一页>'}</div>
          <div>
            <span>{relation.next.title}</span>
            &nbsp;
            <div className="iconfont">&#xe627;</div>
          </div>
        </div>
      ) : undefined}
    </div>
  );
};

export default NextPage;
