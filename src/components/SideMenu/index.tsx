import React, { CSSProperties, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';

// antd
import { Menu, Modal } from 'antd';

// css
import style from './index.module.scss';

// ui
import LinkBtn2 from '@/components/Universal/LinkBtn2';

// redux
import { useAppSelector, useAppDispatch } from '@/redux';
import { setSelectedId, setOpt } from '@/redux/slices/blogMenu';
import { setJumpFlag } from '@/redux/slices/universal';

// context
import { useIcons } from '../ContextProvider/IconStore';

// utils
import { getAntdMenus, getSideMenuItem, getParentListOfBlog } from '@/utils';

// global
import { ANIME_HIDE_TIME } from '@/global';
import { useGlobalMessage } from '@/components/ContextProvider/MessageProvider';

// interface
import { MenuBlog } from '@/apis/blog';

interface SideMenuProps {
  styles?: CSSProperties;
  noEdit?: boolean;
  page: 'manage' | 'blog';
  closeMenu?: () => void;
}

const SideMenu: React.FC<SideMenuProps> = ({ styles, noEdit, page, closeMenu }) => {
  const icons = useIcons();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const menus = useAppSelector(state => state.blogMenu.menuList);
  const selectedId = useAppSelector(state => state.blogMenu.selectedId);
  const opt = useAppSelector(state => state.blogMenu.opt);
  const antdMenus = getAntdMenus(menus, icons);
  const parentKey = useMemo(() => {
    const list = getParentListOfBlog(menus, icons, selectedId);
    return list.map(id => {
      return id.toString();
    });
  }, [menus, icons, selectedId]);

  const handleSelect = async (e: any) => {
    const key = parseInt(e.key);
    if (opt) {
      if (!noEdit) {
        dispatch(setSelectedId(key));
      } else {
        // 触发事件
        const item = getSideMenuItem(menus, key);
        if (item && !('blogId' in item) && key !== selectedId) {
          // 操作标志置为false，不可继续操作
          dispatch(setOpt(false));
          dispatch(setJumpFlag(true));
          setTimeout(async () => {
            dispatch(setSelectedId(e.key));
            if (page === 'blog') {
              navigate(`/blog`);
            }
          }, ANIME_HIDE_TIME);
        }
        if (closeMenu) closeMenu();
      }
    }
  };

  return (
    <div className={style.wrapper} style={styles}>
      {/* 有tag则显示菜单，否则显示提示 */}
      {menus.length ? (
        <Menu
          className={style.menu}
          inlineIndent={12}
          style={{ borderRadius: '0 0 5px 5px', border: 'none' }}
          defaultOpenKeys={parentKey}
          openKeys={parentKey}
          mode="inline"
          items={antdMenus}
          selectedKeys={[selectedId.toString()]}
          onClick={handleSelect}
        />
      ) : (
        <div className={style.noneMenu}>当前还没有分类，快去添加吧！</div>
      )}
    </div>
  );
};

export default SideMenu;
