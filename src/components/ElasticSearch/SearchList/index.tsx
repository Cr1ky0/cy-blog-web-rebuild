import React, { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router';

// css
import style from './index.module.scss';

// redux
import { useAppDispatch, useAppSelector } from '@/redux';
import { setSelectedId } from '@/redux/slices/blogMenu';
import { setJumpFlag } from '@/redux/slices/universal';
import { addHistory } from '@/redux/slices/es';

// util
import { getRenderNode } from '@/components/ElasticSearch/utils';
import { ANIME_HIDE_TIME } from '@/global';

// api
import { BlogDoc } from '@/apis/es';

interface SearchListProps {
  docs: BlogDoc[];
  match: string;
  closeBox: () => void;
}

const SearchList: React.FC<SearchListProps> = ({ docs, match, closeBox }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const themeMode = useAppSelector(state => state.universal.themeMode);
  const selectedId = useAppSelector(state => state.blogMenu.selectedId);
  const menuTitle = docs.length ? docs[0].menuTitle : '';

  const handleClick = useCallback((id: string, blog: BlogDoc) => {
    closeBox();
    if (blog.id !== selectedId) {
      if (location.pathname === '/blog') {
        dispatch(setJumpFlag(true));
        setTimeout(() => {
          dispatch(setSelectedId(blog.id));
        }, ANIME_HIDE_TIME);
      } else {
        dispatch(setSelectedId(blog.id));
      }
      dispatch(addHistory({ blog, match }));
      navigate('/blog');
    }
  }, []);

  const getPage = useCallback(() => {
    return docs.map(blog => {
      return (
        <div
          key={blog.id}
          className={style.singleWrapper}
          onClick={() => {
            handleClick(blog.id, blog);
          }}
        >
          <div className="iconfont">&#xe774;</div>
          <div className={style.info}>
            <div className={style.title}>{getRenderNode(blog.title, match)}</div>
            <div className={style.text}>{getRenderNode(blog.content, match)}</div>
          </div>
          <div className="iconfont">&#xe852;</div>
        </div>
      );
    });
  }, [docs]);

  return (
    <div className={style.wrapper}>
      <div className={style.header}>{menuTitle}</div>
      <div className={`${style.content} ${themeMode === 'dark' ? style.listDark : style.listLight}`}>{getPage()}</div>
    </div>
  );
};
export default SearchList;
