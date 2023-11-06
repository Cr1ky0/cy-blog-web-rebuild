import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';

// comp
import BlogInfo from '@/components/Universal/BlogInfo';
import ReactMarkdownRender from '@/components/ReactMarkdownRender';
import Comment from '@/components/Comment';
import Footer from '@/components/Footer';
import NextPage from '@/components/BlogPage/NextPage';

// antd
import { Breadcrumb } from 'antd';

// css
import style from './index.module.scss';

//redux
import { useAppDispatch, useAppSelector } from '@/redux';
import { setOpt, setMenuList } from '@/redux/slices/blogMenu';
import { setAllContent, setCurBlogContent, setCurEditId, setIsEdit } from '@/redux/slices/blog';
import { setFadeOut } from '@/redux/slices/progressbar';

// utils
import { filterLT, filterTitle, getBreadcrumbList } from '@/utils';

// context
import { useIcons } from '@/components/ContextProvider/IconStore';
import { useGlobalModal } from '@/components/ContextProvider/ModalProvider';
import { useGlobalMessage } from '@/components/ContextProvider/MessageProvider';

// interface
import { getMenu } from '@/apis/menu';
// global
import { ANIME_SHOW_TIME } from '@/global';
import { Blog, blogInitState, delBlog, getBlog, updateBlogBrowse } from '@/apis/blog';
import { getUserInfoById, User, userInitState } from '@/apis/user';
import { BreadCrumbObj } from '@/interface';

const BlogContent = () => {
  const icons = useIcons();
  const message = useGlobalMessage();
  const modal = useGlobalModal();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [deleted, setDeleted] = useState(false);
  const [blogUser, setBlogUser] = useState<User>(userInitState);
  const menus = useAppSelector(state => state.blogMenu.menuList);
  const selectedId = useAppSelector(state => state.blogMenu.selectedId);
  const user = useAppSelector(state => state.user.user);
  // 获取面包屑列表
  const breadcrumbList = useMemo(() => {
    const breadcrumbs: BreadCrumbObj[] = selectedId ? getBreadcrumbList(menus, selectedId, icons) : [];
    return breadcrumbs && breadcrumbs.length
      ? breadcrumbs.map(item => {
          return {
            title: (
              <div>
                <span className={style.crumbIcon}>{item.icon}</span>{' '}
                <span className={style.crumbTitle}>{item.title}</span>
              </div>
            ),
          };
        })
      : [];
  }, [selectedId]);

  // curBlog
  const [curBlog, setCurBlog] = useState<Blog>(blogInitState);

  useEffect(() => {
    const getCurBlog = async () => {
      try {
        const res = await getBlog(selectedId);
        const blog = res.data.blog;
        const userRes = await getUserInfoById(blog.userId);
        setBlogUser(userRes.data.user);
        // 热度加一
        await updateBlogBrowse({
          blogId: blog.blogId,
          like: false,
          plus: true,
        });
        // 处理Title
        const contents = filterTitle(blog.content);
        const newBlog = Object.assign({}, blog, { contents });
        setCurBlog(newBlog);
        // 更新完毕后关闭FadeOut并打开Opt标志
        dispatch(setCurBlogContent(contents));
        dispatch(setFadeOut(false));
        // 关闭mobileMenu
        setTimeout(() => {
          dispatch(setOpt(true));
        }, ANIME_SHOW_TIME + 150);
      } catch (data: any) {
        setDeleted(true);
        // message.error(data.message);
      }
    };
    getCurBlog();
  }, [selectedId]);

  const handleEdit = async () => {
    try {
      const res = await getBlog(selectedId);
      const blog = res.data.blog;
      const menuRes = await getMenu(blog.menuId);
      const menu = menuRes.data.menu;
      dispatch(
        setAllContent({
          title: blog.title,
          menuId: menu.menuId,
          menuTitle: menu.title,
          content: filterLT(blog.content),
        })
      );
      dispatch(setCurEditId(selectedId));
      dispatch(setIsEdit(true));
      navigate('/backstage/blog');
    } catch (data: any) {
      message.error(data.message);
    }
  };
  const handleDelete = async () => {
    try {
      await delBlog(selectedId);
      await message.loadingAsync('删除中...', '删除成功');
      dispatch(setMenuList());
      setDeleted(deleted);
    } catch (data: any) {
      message.error(data.message);
    }
  };

  const getPageContent = useCallback(() => {
    if (deleted) {
      return <div>当前博客不存在或已被删除，请选择其他文章阅读！</div>;
    }

    const getEditPage = () => {
      if (user && user.userId === blogUser.userId) {
        return (
          <div>
            <div
              onClick={() => {
                modal.confirm({
                  title: '提示',
                  content: '编辑此页会覆盖正在编辑的博客，确定要这么做吗？',
                  onOk: () => {
                    handleEdit();
                  },
                });
              }}
            >
              <span className={`${style.editPageBtn} iconfont`}>&#xe624;</span>
              &nbsp;
              <span>编辑此页</span>
            </div>
            <div
              onClick={() => {
                modal.confirm({
                  title: '提示',
                  content: '是否删除当前博客？',
                  onOk: () => {
                    handleDelete();
                  },
                });
              }}
            >
              <span className={`${style.delPageBtn} iconfont`}>&#xe604;</span>
              &nbsp;
              <span>删除博客</span>
            </div>
          </div>
        );
      }
      return undefined;
    };

    return (
      <div className={style.blog}>
        <div className={style.breadCrumb}>
          <Breadcrumb items={breadcrumbList} />
        </div>
        <div className={style.info}>
          <div className={style.title}>
            <span className="iconfont">&#xe627;</span>
            {curBlog.title}
          </div>
          <div className={style.blogInfo}>
            <BlogInfo
              statistics={{
                blogId: curBlog.blogId,
                blogUser,
                time: curBlog.createAt,
                views: curBlog.views,
                likes: curBlog.likes,
                belongingMenu: curBlog.menuId,
                isCollected: curBlog.collected,
              }}
            ></BlogInfo>
          </div>
        </div>
        <div className={style.blogContent}>
          <div className={style.text}>
            <ReactMarkdownRender>{curBlog.content}</ReactMarkdownRender>
          </div>
          {/* 博客编辑选项 */}
          <div className={style.blogEdit}>
            {getEditPage()}
            <div>
              <div>
                上次编辑于：<span>{curBlog.updateAt}</span>
              </div>
              <div>
                贡献者：<span>{blogUser.nickname}</span>
              </div>
            </div>
          </div>
        </div>
        <div className={style.partLine}>
          <div></div>
        </div>
        {selectedId ? <NextPage></NextPage> : undefined}
        <div className={style.comment}>
          <Comment></Comment>
        </div>
      </div>
    );
  }, [selectedId, deleted]);

  return (
    <>
      <div className={`${style.main} showAnime`}>
        <div className="clearfix">{getPageContent()}</div>
        <Footer></Footer>
      </div>
    </>
  );
};
export default BlogContent;
