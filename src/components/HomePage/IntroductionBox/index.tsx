import React, { CSSProperties, useEffect, useState } from 'react';

// css
import style from './index.module.scss';

// util
import { getClassificationInfo, getLimitString } from '@/utils';

// comp
import LinkIcon from './LinkIcon';

// context
import { useGlobalMessage } from '@/components/ContextProvider/MessageProvider';
import { useAvatar } from '@/components/ContextProvider/AvatarPrivider';

// redux
import { useAppDispatch, useAppSelector } from '@/redux';
import { setTimeLine } from '@/redux/slices/blog';
import { useNavigate } from 'react-router';
import { getCriiky0Avatar, getCriiky0Info, GetUserRes } from '@/apis/user';

// interface
export interface IntroductionBoxProps {
  isMobile?: boolean;
  styles?: CSSProperties;
}

const IntroductionBox: React.FC<IntroductionBoxProps> = props => {
  const { isMobile, styles } = props;
  const message = useGlobalMessage();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // state
  const blogsNum = useAppSelector(state => state.blog.blogsNum);
  const menus = useAppSelector(state => state.blogMenu.menuList);
  const themeMode = useAppSelector(state => state.universal.themeMode);
  const loginUser = useAppSelector(state => state.user.user);

  const [user, setUser] = useState({} as GetUserRes['user']);
  const [avatar, setAvatar] = useState<string>(useAvatar().avatar);

  const limit = 40;

  useEffect(() => {
    dispatch(setTimeLine());
  }, []);

  useEffect(() => {
    if (!loginUser) {
      // 没有登录用户就请求我的个人信息
      const getInfo = async () => {
        try {
          // 获取用户信息
          const res = await getCriiky0Info();
          const user = res.data.user;
          setUser(user);
          if (user.avatar) {
            // 获取头像
            const res1 = await getCriiky0Avatar();
            const type = res1.headers['content-type'];
            const blob = new Blob([res1.data], { type });
            // img src
            const imageUrl = URL.createObjectURL(blob);
            setAvatar(imageUrl);
          }
        } catch (data: any) {
          message.error(data.message);
        }
      };
      getInfo().catch(err => {
        message.error(err.message);
      });
    } else {
      setUser(user);
    }
  }, []);

  return (
    <div
      className={`${style.wrapper} ${themeMode === 'dark' ? 'dark-2' : 'light'}`}
      style={isMobile ? Object.assign({ boxShadow: 'none' }, styles) : styles}
    >
      <div className={`${style.intro} clearfix`}>
        <img className={style.avatar} src={avatar} alt="avatar"></img>
        <div className={style.username}>{user.nickname}</div>
        <div className={style.signature}>
          {user.brief ? getLimitString(limit, user.brief) : '这个人很懒，没有个性签名！'}
        </div>
      </div>
      <div className={style.blogInfo}>
        <div
          onClick={() => {
            navigate('/blog');
          }}
        >
          <div>{getClassificationInfo(menus).length}</div>
          <div>分类</div>
        </div>
        <div
          onClick={() => {
            navigate('/blog');
          }}
        >
          <div>{blogsNum}</div>
          <div>文章</div>
        </div>
      </div>
      <div className={`${style.linkBox} clearfix`}>
        <LinkIcon
          icon="&#xe63b;"
          styles={{ color: '#2c3e50' }}
          content="Github"
          href="https://github.com/Creekyu"
        ></LinkIcon>
        <LinkIcon
          icon="&#xe66a;"
          styles={{ color: '#5eaade' }}
          content="QQ"
          href="tencent://Message/?Uin=503094716&Menu=yes"
        ></LinkIcon>
        <LinkIcon
          icon="&#xe731;"
          styles={{ color: '#3397db' }}
          content="Telegram"
          href="https://t.me/Criiky0"
        ></LinkIcon>
      </div>
    </div>
  );
};

export default IntroductionBox;
