import React, { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router';
// css
import style from './index.module.scss';

// redux
import { useAppSelector } from '@/redux';

// util & comp
import LinkBtn from '@/components/Universal/LinkBtn';
import IntroductionBox from '@/components/HomePage/IntroductionBox';
import _ from 'lodash';

interface MobileMenuProps {
  isOpen: boolean;
  close: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = props => {
  const { isOpen, close } = props;
  const navigate = useNavigate();
  const themeMode = useAppSelector(state => state.universal.themeMode);

  // 切换line样式
  useEffect(() => {
    const lines = document.getElementsByClassName(style.line);
    for (let i = 0; i < lines.length; i += 1) {
      const line = lines[i];
      if (themeMode === 'dark') {
        line.classList.add(style.lineDark);
        line.classList.remove(style.lineLight);
      } else {
        line.classList.add(style.lineLight);
        line.classList.remove(style.lineDark);
      }
    }
  }, [themeMode]);

  const handleJump = useCallback(
    _.throttle((link: string) => {
      close();
      navigate(link);
    }, 1000),
    [close]
  );
  return (
    <div
      id="mobile-menu-wrapper"
      className={`${style.menu} ${isOpen ? style.menuOnOpen : style.menuOnClose} ${
        themeMode === 'dark' ? style.menuDark : style.menuLight
      }`}
    >
      <div className={style.wrapper}>
        <div className={style.menuWrapper}>
          <LinkBtn
            icon="&#xe600;"
            seq={0}
            notAnimation={true}
            onClick={() => {
              handleJump('/');
            }}
          >
            主页
          </LinkBtn>
          <div className={style.line}></div>
          <LinkBtn
            icon="&#xe60e;"
            seq={1}
            notAnimation={true}
            onClick={() => {
              handleJump('/blog');
            }}
          >
            博客
          </LinkBtn>
          <div className={style.line}></div>
          <LinkBtn
            icon="&#xe7df;"
            seq={2}
            notAnimation={true}
            onClick={() => {
              handleJump('/stars');
            }}
          >
            精选
          </LinkBtn>
          <div className={style.line}></div>
          <LinkBtn
            icon="&#xe612;"
            seq={3}
            notAnimation={true}
            onClick={() => {
              handleJump('/photo');
            }}
          >
            相册
          </LinkBtn>
          <div className={style.line}></div>
        </div>
        <div className={style.introWrapper}>
          <IntroductionBox isMobile={true}></IntroductionBox>
        </div>
      </div>
    </div>
  );
};
export default MobileMenu;
