import React from 'react';
import { useNavigate } from 'react-router';

// antd
import {
  EditOutlined,
  CommentOutlined,
  BookOutlined,
  CloudDownloadOutlined,
  PlusSquareOutlined,
  PictureOutlined,
  MenuOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';

// redux
import { useAppSelector } from '@/redux';

function getItem(label: React.ReactNode, key: React.Key, icon?: React.ReactNode, children?: MenuItem[]): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
  getItem('个人信息', 'info', <EditOutlined />),
  getItem('评论管理', 'comment', <CommentOutlined />),
  getItem('博客管理', 'blog', <BookOutlined />),
  getItem('菜单管理', 'editmenu', <MenuOutlined />),
  getItem('添加照片', 'photo', <PlusSquareOutlined />),
  getItem('编辑照片', 'editPhoto', <PictureOutlined />),
  getItem('OSS设置', 'oss', <CloudDownloadOutlined />),
];

const ManageMenu = () => {
  const navigate = useNavigate();
  const selectKey = useAppSelector(state => state.backstage.selectKey);
  return (
    <Menu
      style={{ border: 'none' }}
      theme="light"
      selectedKeys={[selectKey]}
      mode="inline"
      items={items}
      onClick={e => {
        if (['now', 'bigEvent', 'memory', 'others'].includes(e.key)) navigate(`/backstage/editPhoto`, { state: e.key });
        else navigate(`/backstage/${e.key}`);
      }}
    />
  );
};

export default ManageMenu;
