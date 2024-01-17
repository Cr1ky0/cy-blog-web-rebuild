import React, { useEffect, useState } from 'react';
import style from './index.module.scss';
import img from '@/assets/images/annouce.webp';
import { useAppDispatch, useAppSelector } from '@/redux';
import { setShowAnnouncement } from '@/redux/slices/universal';
import { getAnnounce } from '@/apis/announce';
import { useGlobalMessage } from '@/components/ContextProvider/MessageProvider';

interface AnnouncementProps {
  open: boolean;
  setOpen: (flag: boolean) => void;
}

const Announcement: React.FC<AnnouncementProps> = ({ open, setOpen }) => {
  const dispatch = useAppDispatch();
  const message = useGlobalMessage();

  const [content, setContent] = useState('暂无公告');
  const show = useAppSelector(state => state.universal.showAnnouncement);
  const handleClick = () => {
    setOpen(false);
    dispatch(setShowAnnouncement(false));
  };

  useEffect(() => {
    const handlePress = (e: any) => {
      if (e.key.toUpperCase() === 'ESCAPE') {
        handleClick();
      }
    };
    window.addEventListener('keydown', handlePress);
    return () => {
      window.removeEventListener('keydown', handlePress);
    };
  }, []);

  useEffect(() => {
    getAnnounce().then(
      res => {
        const announce = res.data.announce;
        if (announce && announce.content) {
          setContent(announce.content);
        }
      },
      err => {
        message.error(err.message);
      }
    );
  }, []);

  return (
    <div className={`${open ? style.wrapper : style.close}`} onClick={handleClick}>
      {/*<div className={`${open ? style.wrapper : style.close}  ${show ? '' : style.close}`} onClick={handleClick}>*/}
      <div className={`${style.announcement} animate__animated animate__zoomIn`}>
        <div className={style.tag} style={{ backgroundImage: `url(${img})` }}>
          <div className="iconfont">&#xe61f;</div>
          <div>欢迎参观~</div>
        </div>
        <div className={style.content}>{content}</div>
      </div>
    </div>
  );
};

export default Announcement;
