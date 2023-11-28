import React, { useEffect } from 'react';
import { Outlet } from 'react-router';

// comp
import SideMenu from '@/components/SideMenu';
import BlogToc from '@/components/BlogPage/BlogToc';
import MobileTopBtn from '@/components/Universal/MobileTopBtn';
import NotFound from '@/components/ErrorPage/NotFound';
import Footer from '@/components/Footer';

// css
import style from './index.module.scss';

// redux
import { setChosenList } from '@/redux/slices/chosenList';
import { useAppDispatch, useAppSelector } from '@/redux';
import { setFadeOut, setIsLoading } from '@/redux/slices/progressbar';
import { setJumpFlag, setMobileMenuOpen } from '@/redux/slices/universal';

// context
import { useViewport } from '@/components/ContextProvider/ViewportProvider';

// global
import { ANIME_HIDE_TIME, BACKGROUND_COLOR_DARK } from '@/global';

const BlogPage = () => {
  const { width } = useViewport();
  const dispatch = useAppDispatch();

  const selectedId = useAppSelector(state => state.blogMenu.selectedId);
  const curBlogContent = useAppSelector(state => state.blog.curBlogContent);
  const fadeOut = useAppSelector(state => state.progressbar.fadeOut);
  const themeMode = useAppSelector(state => state.universal.themeMode);
  const jumpFlag = useAppSelector(state => state.universal.jumpFlag);

  useEffect(() => {
    // 重置mobile open
    dispatch(setMobileMenuOpen(false));
    // 导航栏
    dispatch(setChosenList([false, true, false, false]));
    // 回滚
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    // 如果先前打开了滚动条要先关闭
    dispatch(setIsLoading(false));
    setTimeout(() => {
      dispatch(setIsLoading(true));
    }, 50);
  }, []);

  // 打开滚动条
  useEffect(() => {
    if (jumpFlag) {
      // 重置jumpFLag标志
      dispatch(setJumpFlag(false));
      dispatch(setFadeOut(true));
      setTimeout(() => {
        window.scrollTo({
          top: 0,
        });
      }, ANIME_HIDE_TIME);
    }
  }, [jumpFlag]);

  return (
    <div className={`${style.wrapper} clearfix ${themeMode === 'dark' ? 'dark' : 'light'}`}>
      <div className={`${style.sider} showAnime`}>
        <div>
          <SideMenu page="blog"></SideMenu>
        </div>
      </div>
      <div className={`${style.content} clearfix transBase ${fadeOut ? 'transHide' : ''}`}>
        {/*<div className={`${style.content} clearfix`}>*/}
        {/* 选中状态 */}
        {selectedId ? (
          <Outlet />
        ) : (
          <>
            <NotFound detail="当前没有博客，去别处转转吧~" />
            <Footer />
          </>
        )}
      </div>
      <div className={`${style.toc} showAnime`} style={width > 1100 ? undefined : { display: 'none' }}>
        {selectedId ? <BlogToc text={curBlogContent}></BlogToc> : undefined}
      </div>
      {/* Mobile Menu */}
      <MobileTopBtn
        styles={{
          height: 350,
          width: 250,
          padding: 10,
          backgroundColor: themeMode === 'dark' ? BACKGROUND_COLOR_DARK : '#FFF',
        }}
      >
        <SideMenu
          page="blog"
          closeMenu={() => {
            dispatch(setMobileMenuOpen(false));
          }}
        ></SideMenu>
      </MobileTopBtn>
    </div>
  );
};
export default BlogPage;
