import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';

// antd
import { Badge, Tag } from 'antd';

// css
import style from './index.module.scss';

// redux
import { useAppDispatch, useAppSelector } from '@/redux';

import { setSelectedId } from '@/redux/slices/blogMenu';
//util
import { getClassificationInfo, getOneBlogFromMenu } from '@/utils';

// context
import { useGlobalMessage } from '@/components/ContextProvider/MessageProvider';
import { setMobileMenuOpen } from '@/redux/slices/universal';
import { getMenu } from '@/apis/menu';
import { ClassificationInfoObj } from '@/interface';

const Classification = () => {
  const navigate = useNavigate();
  const message = useGlobalMessage();
  const menus = useAppSelector(state => state.blogMenu.menuList);
  const themeMode = useAppSelector(state => state.universal.themeMode);
  const dispatch = useAppDispatch();
  const classInfoList = getClassificationInfo(menus);

  useEffect(() => {
    // 切换hover模式
    classInfoList && classInfoList.length
      ? classInfoList.forEach((_, index) => {
          const div = document.getElementById(`classification-tag-${index}`) as HTMLElement;
          if (themeMode === 'dark') {
            div.classList.add('hoverDark');
            div.classList.remove('hoverLight');
          } else {
            div.classList.add('hoverLight');
            div.classList.remove('hoverDark');
          }
        })
      : [];
  }, [themeMode]);

  const handleClick = async (info: ClassificationInfoObj) => {
    try {
      const res = await getMenu(info.id);
      const menu = res.data.menu;
      const blogId = getOneBlogFromMenu(menu);
      if (blogId) {
        dispatch(setSelectedId(blogId));
        dispatch(setMobileMenuOpen(false));
        navigate('/blog');
      } else {
        message.success('当前分类下暂时没有博客哦~');
      }
    } catch (data: any) {
      message.error(data.message);
    }
  };

  return (
    <div className="clearfix">
      {classInfoList
        ? classInfoList.map((info, index) => {
            return (
              <Tag
                id={`classification-tag-${index}`}
                key={index}
                color={info.color}
                className={style.tag}
                style={{
                  marginRight: '15px',
                }}
                onClick={() => {
                  handleClick(info);
                }}
              >
                <span>{info.title}</span>
                <Badge count={info.blogNum} showZero color={info.color} className={style.badge} />
              </Tag>
            );
          })
        : undefined}
    </div>
  );
};
export default Classification;
