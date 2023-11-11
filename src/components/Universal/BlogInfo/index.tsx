import React, { useCallback, useMemo, useState } from 'react';

// css
import style from './index.module.scss';

// antd
import { Tag, Tooltip } from 'antd';

// interface
import { BreadCrumbObj } from '@/interface';

// redux
import { useAppDispatch, useAppSelector } from '@/redux';
import { addLikeList, removeLikeList } from '@/redux/slices/blog';

// util
import { getBreadcrumbList, hasUser } from '@/utils';

// provider
import { useGlobalMessage } from '@/components/ContextProvider/MessageProvider';
import { useIcons } from '@/components/ContextProvider/IconStore';
import { useViewport } from '@/components/ContextProvider/ViewportProvider';
import { BREAK_POINT } from '@/global';
import { updateBlog, updateBlogBrowse } from '@/apis/blog';
import { BlogTagBoxStatistic } from '@/components/HomePage/BlogTagBox';

interface BlogInfoProps {
  statistics: BlogTagBoxStatistic;
}

const isLiked = (likeList: string[], id: string) => {
  return likeList.some(likeId => likeId === id);
};
const BlogInfo: React.FC<BlogInfoProps> = ({ statistics }) => {
  const { blogUser, time, views, blogId: id, isCollected, likes } = statistics;

  const { width } = useViewport();
  const message = useGlobalMessage();
  const dispatch = useAppDispatch();
  const icons = useIcons();
  // state
  const menus = useAppSelector(state => state.blogMenu.menuList);
  const themeMode = useAppSelector(state => state.universal.themeMode);
  const user = useAppSelector(state => state.user.user);
  // 点赞状态（游客也可以点赞，用redux管理（与评论类似））
  const likeList = useAppSelector(state => state.blog.likeList);
  // 收藏状态
  const [collected, setCollected] = useState(isCollected);
  const [likesNum, setLikesNum] = useState(likes);
  const grandMenu: BreadCrumbObj[] = useMemo(() => {
    const breadcrums = getBreadcrumbList(menus, id, icons) || [];
    if (breadcrums.length) breadcrums.shift();
    return breadcrums;
  }, [menus, id]);

  // 收藏
  const handleCollect = async () => {
    try {
      const res = await updateBlog({
        blogId: id,
        collected: !collected,
      });
      const blog = res.data.updatedBlog;
      setCollected(blog.collected);
    } catch (data: any) {
      message.error(data.message);
    }
  };

  const handleLike = async (state: 'add' | 'decrease') => {
    try {
      const isAdd = state === 'add';
      const res = await updateBlogBrowse({
        blogId: id,
        like: true,
        plus: isAdd,
      });
      const blog = res.data.updatedBlog;
      if (isAdd) dispatch(addLikeList(id));
      else dispatch(removeLikeList(id));
      setLikesNum(blog.likes);
    } catch (data: any) {
      message.error(data.message);
    }
  };

  const getTagPage = () => {
    if (width > BREAK_POINT) {
      return grandMenu.map((menu, index) => {
        return (
          <Tag key={index} className={style.tag} color={menu.color}>
            {menu.title}
          </Tag>
        );
      });
    }
    return (
      <Tag className={style.tag} color={grandMenu.length ? grandMenu[grandMenu.length - 1].color : undefined}>
        {grandMenu.length ? grandMenu[grandMenu.length - 1].title : undefined}
      </Tag>
    );
  };

  const getLikePage = () => {
    const flag = isLiked(likeList, id);
    if (flag) {
      return (
        <div
          className={style.like}
          onClick={() => {
            handleLike('decrease');
          }}
        >
          <span className="iconfont" style={{ color: '#FF0000' }}>
            &#xeca2;
          </span>
          <span>{likesNum}</span>
        </div>
      );
    }

    return (
      <div
        className={style.like}
        onClick={() => {
          handleLike('add');
        }}
      >
        <span className="iconfont">&#xeca1;</span>
        <span>{likesNum}</span>
      </div>
    );
  };

  const getUserCollectPage = () => {
    if (hasUser(user) && user.userId === blogUser.userId && width > BREAK_POINT) {
      const getCollectPage = () => {
        if (collected) {
          return (
            <>
              <span className="iconfont" style={{ color: 'gold' }}>
                &#xe86a;
              </span>
              <span>已收藏</span>
            </>
          );
        }
        return (
          <>
            <span className="iconfont">&#xe7df;</span>
            <span>收藏</span>
          </>
        );
      };

      return (
        <Tooltip title="收藏" trigger="hover" placement="bottom">
          <div className={style.collection} onClick={handleCollect}>
            {/* 收藏标志 */}
            {getCollectPage()}
          </div>
        </Tooltip>
      );
    }
  };

  return (
    <div className={`${style.wrapper} ${themeMode === 'dark' ? style.dark : style.light}`}>
      <div className={style.leftWrapper}>
        <Tooltip title="作者信息" trigger="hover" placement="bottom">
          <div>
            <span className="iconfont">&#xe72e;</span>
            {blogUser.nickname}
          </div>
        </Tooltip>
        <Tooltip title="发布时间" trigger="hover" placement="bottom">
          <div className={style.time}>
            <span className="iconfont">&#xe632;</span>
            {time}
          </div>
        </Tooltip>
        <Tooltip title="浏览量" trigger="hover" placement="bottom">
          <div className={style.views}>
            <span className="iconfont">&#xe66c;</span>
            {views}
          </div>
        </Tooltip>
        <Tooltip title="分类标签" trigger="hover" placement="bottom">
          <div className={style.classification}>
            <span className="iconfont">&#xe623;</span>
            {getTagPage()}
          </div>
        </Tooltip>
      </div>
      <div className={style.rightWrapper}>
        {/* 收藏标志 */}
        {getLikePage()}
        {/* User在才能收藏 */}
        {getUserCollectPage()}
      </div>
    </div>
  );
};

export default BlogInfo;
