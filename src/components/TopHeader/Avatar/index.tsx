import React from 'react';
import { useNavigate } from 'react-router';

// css
import style from './index.module.scss';

// antd
import { Dropdown } from 'antd';
import type { MenuProps } from 'antd';

// context
import { useAvatar } from '@/components/ContextProvider/AvatarPrivider';
import { useGlobalMessage } from '@/components/ContextProvider/MessageProvider';
import { useAppSelector } from '@/redux';

const Avatar = () => {
  const message = useGlobalMessage();
  const navigate = useNavigate();
  const { avatar } = useAvatar();

  const user = useAppSelector(state => state.user.user);

  const items: MenuProps['items'] = [
    {
      label: (
        <div
          style={{ padding: '5px 10px' }}
          onClick={() => {
            navigate('/backstage/info');
          }}
        >
          修改信息
        </div>
      ),
      key: '1',
    },
    {
      label: (
        <div
          style={{ padding: '5px 10px' }}
          onClick={() => {
            navigate('/backstage/comment');
          }}
        >
          评论管理
        </div>
      ),
      key: '2',
    },
    {
      label: (
        <div
          style={{ padding: '5px 10px' }}
          onClick={() => {
            navigate('/backstage/blog');
          }}
        >
          博客管理
        </div>
      ),
      key: '3',
    },
    {
      label: (
        <div
          style={{ padding: '5px 10px' }}
          onClick={() => {
            navigate('/backstage/editmenu');
          }}
        >
          菜单管理
        </div>
      ),
      key: '4',
    },
    {
      label: (
        <div
          style={{ padding: '5px 10px' }}
          onClick={() => {
            navigate('/backstage/photo');
          }}
        >
          添加照片
        </div>
      ),
      key: '5',
    },
    {
      label: (
        <div
          style={{ padding: '5px 10px' }}
          onClick={() => {
            navigate('/backstage/editPhoto', { state: 'now' });
          }}
        >
          编辑照片
        </div>
      ),
      key: '6',
    },
    {
      label: (
        <div
          style={{ padding: '5px 10px' }}
          onClick={() => {
            navigate('/backstage/announce');
          }}
        >
          发布公告
        </div>
      ),
      key: '7',
    },
    {
      label: (
        <div
          style={{ padding: '5px 10px' }}
          onClick={() => {
            navigate('/backstage/oss');
          }}
        >
          OSS管理
        </div>
      ),
      key: '8',
    },
  ];
  return (
    <>
      {user ? (
        <>
          <Dropdown menu={{ items }} trigger={['click']}>
            <img className={style.rightNavAvatar} src={avatar} alt="avatar"></img>
          </Dropdown>
        </>
      ) : (
        <img
          className={style.rightNavAvatar}
          src={avatar}
          onClick={() => {
            message.error('请先登录！');
          }}
          alt="avatar"
        ></img>
      )}
    </>
  );
};

export default Avatar;
