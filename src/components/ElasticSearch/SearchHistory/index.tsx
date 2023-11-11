import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router';

// css
import style from '@/components/ElasticSearch/SearchList/index.module.scss';

// redux
import { useAppDispatch, useAppSelector } from '@/redux';
import { setJumpFlag } from '@/redux/slices/universal';
import { setSelectedId } from '@/redux/slices/blogMenu';
import { delHistory } from '@/redux/slices/es';
import { ANIME_HIDE_TIME } from '@/global';

interface SearchHistoryProps {
  closeBox: () => void;
}

const SearchHistory: React.FC<SearchHistoryProps> = ({ closeBox }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const themeMode = useAppSelector(state => state.universal.themeMode);
  const searchHistory = useAppSelector(state => state.es.history);
  const selectedId = useAppSelector(state => state.blogMenu.selectedId);

  const [isDragging, setIsDragging] = useState(false);

  const handleClick = useCallback((id: string) => {
    if (!isDragging) {
      closeBox();
      if (id !== selectedId) {
        if (location.pathname === '/blog') {
          dispatch(setJumpFlag(true));
          setTimeout(() => {
            dispatch(setSelectedId(id));
          }, ANIME_HIDE_TIME);
        } else {
          dispatch(setSelectedId(id));
        }
        navigate('/blog');
      }
    }
  }, []);

  const getPage = useCallback(() => {
    return searchHistory.map(history => {
      const { blog } = history;
      return (
        <div
          key={blog.id}
          className={`${style.singleWrapper} ${style.searchHistoryListWrapper} ${
            themeMode === 'dark' ? style.searchHistoryListWrapperDark : style.searchHistoryListWrapperLight
          }`}
          onClick={() => {
            handleClick(blog.id);
          }}
        >
          <div className="iconfont">&#xe7bb;</div>
          <div className={style.info}>
            <div className={style.title}>{blog.title}</div>
            <div className={style.text}>{blog.content}...</div>
          </div>
          <div className={`iconfont ${style.delHistory}`}>
            <div
              onClick={e => {
                e.stopPropagation();
                dispatch(delHistory(blog.id));
              }}
              onMouseDown={() => {
                setIsDragging(true);
              }}
              onMouseUp={() => {
                setIsDragging(false);
              }}
            >
              &#xe6dc;
            </div>
          </div>
        </div>
      );
    });
  }, [searchHistory]);

  return (
    <div className={style.wrapper}>
      <div className={style.header}>搜索历史</div>
      <div className={style.content}>{getPage()}</div>
    </div>
  );
};
export default SearchHistory;
