import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Outlet, useNavigate } from 'react-router';

// antd
import { Pagination } from 'antd';

// css
import style from './index.module.scss';

// comp
import Footer from '@/components/Footer';

// redux
import { useAppDispatch, useAppSelector } from '@/redux';
import { setChosenList } from '@/redux/slices/chosenList';
import { setChosen } from '@/redux/slices/blog';

// api
import { setStarBlogPage } from '@/redux/slices/universal';
import { ANIME_HIDE_TIME } from '@/global';
import { getBlogCountOfCriiky0 } from '@/apis/blog';

const choseList = ['收藏', '最多点赞', '最多浏览'];
const StarBlog = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const chosen = useAppSelector(state => state.blog.chosen);
  const blogsNum = useAppSelector(state => state.blog.blogsNum);
  const themeMode = useAppSelector(state => state.universal.themeMode);
  const curPage = useAppSelector(state => state.universal.starBlogPage);

  const [collectNum, setCollectNum] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  // 可操作标志
  const [isOpt, setIsOpt] = useState<boolean>();

  // timer
  const [timer, setTimer] = useState<any>();
  const wrapper = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    setIsOpt(true);
    // 设置初始选中状态
    dispatch(setChosenList([false, false, true, false]));
    const now = document.getElementById(`blog-stars-btn-${chosen}`) as HTMLElement;
    now.classList.add(style.optionsOnChosen);
    // 如果为收藏页，获取收藏总数
    if (chosen === 0) {
      getBlogCountOfCriiky0('collected:1').then(res => {
        setCollectNum(res.data.count);
      });
    }
  }, []);

  const handleJump = (e: any, index: number) => {
    // 动画
    if (isOpt) {
      setIsOpt(false);
      if (chosen !== index) {
        setIsLoading(true);
        setTimeout(() => {
          setIsOpt(true);
        }, 1200);
        // 导航样式变化
        const now = e.currentTarget;
        now.classList.add(style.optionsOnChosen);
        const last = document.getElementById(`blog-stars-btn-${chosen}`) as HTMLElement;
        last.classList.remove(style.optionsOnChosen);
        // 跳转
        setTimeout(async () => {
          await setIsLoading(false);
          await dispatch(setChosen(index));
          await dispatch(setStarBlogPage(1));
          navigate(`/stars?filter=${index}`);
        }, ANIME_HIDE_TIME);
      }
    }
  };

  const handleChange = (page: number) => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    if (timer) clearTimeout(timer);
    setIsLoading(true);
    setTimer(
      setTimeout(async () => {
        await setIsLoading(false);
        await dispatch(setStarBlogPage(page));
        // 点击跳转
        navigate(`?filter=${chosen}`);
      }, ANIME_HIDE_TIME)
    );
  };

  const getOptionPage = () => {
    return choseList.map((choice, index) => {
      return (
        <div
          id={`blog-stars-btn-${index}`}
          key={index}
          onClick={e => {
            handleJump(e, index);
          }}
        >
          <div>{choice}</div>
          <div className={style.bar}></div>
        </div>
      );
    });
  };

  return (
    <div className={`${style.wrapper} clearfix ${themeMode === 'dark' ? 'dark' : style.wrapperLight}`} ref={wrapper}>
      <div className="showAnime">
        <div className={style.options}>{getOptionPage()}</div>
        <div className={`${style.blogs} transBase ${isLoading ? 'transHide' : ''}`}>
          <Outlet />
        </div>
      </div>
      <div className={`${style.paginate} showAnime`}>
        <Pagination
          showSizeChanger={false}
          showQuickJumper
          pageSize={10}
          current={curPage}
          total={chosen === 0 ? collectNum : blogsNum}
          onChange={handleChange}
        />
      </div>
      <Footer></Footer>
    </div>
  );
};

export default StarBlog;
