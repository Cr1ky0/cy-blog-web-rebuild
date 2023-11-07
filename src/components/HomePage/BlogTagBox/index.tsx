import React, { useState } from 'react';
import { useNavigate } from 'react-router';

// css
import style from './index.module.scss';

// comp
import BlogInfo from '@/components/Universal/BlogInfo';

// util
import { filterMarkdown, getLimitString } from '@/utils';

// redux
import { useAppDispatch, useAppSelector } from '@/redux';
import { setSelectedId } from '@/redux/slices/blogMenu';

// context
import { useViewport } from '@/components/ContextProvider/ViewportProvider';

// global
import { BREAK_POINT } from '@/global';

// api
import { User } from '@/apis/user';

export interface BlogTagBoxStatistic {
  blogUser: User;
  time: string;
  views: number;
  belongingMenu: string;
  isCollected: boolean;
  blogId: string;
  likes: number;
}

export interface BlogTagBoxProps {
  children: string;
  title: string;
  statistic: BlogTagBoxStatistic;
}

// 主页的BlogBox组件
const BlogTagBox: React.FC<BlogTagBoxProps> = props => {
  const { children, title, statistic } = props;
  const { blogUser, time, views, belongingMenu, blogId, isCollected, likes } = statistic;

  const { width } = useViewport();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const limit = width > BREAK_POINT ? 200 : 100;

  const themeMode = useAppSelector(state => state.universal.themeMode);
  const [str] = useState(getLimitString(limit, filterMarkdown(children)));

  return (
    <div className={`${style.wrapper} clearfix ${themeMode === 'dark' ? style.tagDark : style.tagLight}`}>
      <div className={style.titleWrapper}>
        <div
          className={style.title}
          onClick={() => {
            dispatch(setSelectedId(blogId));
            navigate('/blog');
          }}
        >
          {title}
          <div className={style.bar}></div>
        </div>
        <div className={`${style.pin} iconfont`}>&#xe637;</div>
      </div>
      <div className={style.text}>{str}</div>
      <div className={style.line}></div>
      <div className={`${style.statistics} clearfix`}>
        <BlogInfo statistics={{ blogUser, time, views, belongingMenu, blogId, isCollected, likes }}></BlogInfo>
      </div>
    </div>
  );
};

export default BlogTagBox;
