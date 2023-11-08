import React, { useEffect, useState } from 'react';

// antd
import { Input, TreeSelect, Button, Drawer, Dropdown, Space } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';

// css
import style from './index.module.scss';

// comp
import SideMenu from '@/components/SideMenu';
import MarkdownEditor from '@/components/MarkdownEditor';
import ReactMarkdownRender from '@/components/ReactMarkdownRender';

// utils
import { filterLT, getTreeSelectList, hasBlog } from '@/utils';

// redux
import { useAppDispatch, useAppSelector } from '@/redux';
import { setMenuList, setSelectedId } from '@/redux/slices/blogMenu';
import { setSelectKey } from '@/redux/slices/backstage';
import {
  setMenuId,
  setTitle,
  setMenuTitle,
  initWriteContent,
  setIsEdit,
  setAllContent,
  setCurEditId,
} from '@/redux/slices/blog';

// context
import { useIcons } from '@/components/ContextProvider/IconStore';
import { useGlobalMessage } from '@/components/ContextProvider/MessageProvider';
import { useGlobalModal } from '@/components/ContextProvider/ModalProvider';
import { useViewport } from '@/components/ContextProvider/ViewportProvider';

// api
import { addBlog, getBlog, updateBlog } from '@/apis/blog';
import { getMenu } from '@/apis/menu';
import moment from 'moment';

const BlogManage = () => {
  const modal = useGlobalModal();
  const message = useGlobalMessage();
  const dispatch = useAppDispatch();
  const { width } = useViewport();
  const icons = useIcons();
  // text info
  const { title, menuId, content, menuTitle } = useAppSelector(state => state.blog.writeContent);
  const menus = useAppSelector(state => state.blogMenu.menuList);
  const isEdit = useAppSelector(state => state.blog.isEdit);
  const curEditId = useAppSelector(state => state.blog.curEditId);
  const selectedId = useAppSelector(state => state.blogMenu.selectedId);
  const antdMenus = getTreeSelectList(menus, icons, true);
  // 提交按钮loading状态
  const [isLoading, setIsLoading] = useState(false);
  // 当前正在编辑的id，如果不用的话，编辑中选择其他博客selectedId会改变，修改的博客就变成了其他博客了
  // 预览打开state
  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(setSelectKey('blog'));
  }, []);

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
    } catch (data: any) {
      message.error(data.message);
    }
  };

  // 编辑状态菜单
  const items: MenuProps['items'] = [
    {
      key: '1',
      label: <div style={{ fontSize: '1vw' }}>Update</div>,
      onClick: () => {
        if (!hasBlog(menus) && !selectedId) {
          message.error('当前没有博客可供编辑！');
          return;
        }
        modal.confirm({
          title: '提示',
          content: '编辑当前博客会覆盖正在编辑的内容，确定要这么做吗？',
          onOk: handleEdit,
        });
      },
    },
    {
      key: '2',
      label: <div style={{ fontSize: '1vw' }}>Add</div>,
      onClick: () => {
        modal.confirm({
          title: '提示',
          content: '添加博客会情况当前编辑状态，确定要这么做吗？',
          onOk: () => {
            dispatch(initWriteContent());
            dispatch(setIsEdit(false));
          },
        });
      },
    },
  ];

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const res = await addBlog({
        title,
        menuId,
        content,
      });
      await message.loadingSuccessAsync('提交中...', '提交成功！');
      const blog = res.data.blog;
      if (!hasBlog(menus)) {
        dispatch(setSelectedId(blog.blogId));
      }
      // 更新主页博客信息
      dispatch(initWriteContent());
      dispatch(setMenuList());
    } catch (data: any) {
      message.error(data.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      await updateBlog({
        blogId: curEditId,
        title,
        content,
        updateAt: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
        menuId,
      });
      await message.loadingSuccessAsync('更新中...', '更新成功！');
      dispatch(initWriteContent());
      dispatch(setMenuList());
      dispatch(setIsEdit(false));
    } catch (data: any) {
      message.error(data.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`${style.wrapper} clearfix`}>
      <div id="blog-manage-sider-wrapper" className={style.sider}>
        <SideMenu page="manage" isEdit></SideMenu>
      </div>
      <div id="blog-manage-content-wrapper" className={style.content}>
        <div className={style.editState}>
          当前状态：
          <Dropdown menu={{ items, selectable: true, selectedKeys: [isEdit ? '1' : '2'] }}>
            <a
              onClick={e => {
                e.preventDefault();
              }}
            >
              <Space>
                {isEdit ? 'Update' : 'Add'}
                <DownOutlined />
              </Space>
            </a>
          </Dropdown>
        </div>
        <div className={style.inputBox}>
          <Input
            showCount
            placeholder="Title"
            maxLength={50}
            style={{ fontSize: '2vw' }}
            value={title}
            onChange={e => {
              dispatch(setTitle(e.target.value));
            }}
          />
          <TreeSelect
            treeIcon
            placeholder="请选择分类"
            treeLine={true}
            treeData={antdMenus}
            value={menuTitle || undefined}
            onChange={(key, title) => {
              dispatch(setMenuId(key));
              dispatch(setMenuTitle(title[0]));
            }}
          />
        </div>
        <div className={style.editor}>
          <MarkdownEditor></MarkdownEditor>
        </div>
        <div className={style.submitBtn}>
          {/* 是否处于编辑状态 */}
          {isEdit ? (
            <Button size="large" loading={isLoading} onClick={handleUpdate}>
              更新
            </Button>
          ) : (
            <Button size="large" loading={isLoading} onClick={handleSubmit}>
              提交
            </Button>
          )}
          <Button
            size="large"
            onClick={() => {
              setOpen(true);
            }}
          >
            预览
          </Button>
        </div>
      </div>
      <Drawer
        destroyOnClose
        title="总览"
        placement="right"
        width={width > 768 ? '50vw' : '75vw'}
        onClose={() => {
          setOpen(false);
        }}
        open={open}
      >
        <ReactMarkdownRender>{content}</ReactMarkdownRender>
      </Drawer>
    </div>
  );
};

export default BlogManage;
