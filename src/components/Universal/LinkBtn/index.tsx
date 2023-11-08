import React from 'react';

// css
import style from './index.module.scss';

// global
import { THEME_COLOR } from '@/global';

// redux
import { useAppSelector } from '@/redux';

interface LinkBtnProps {
  seq: number;
  icon: string;
  children: string;
  notAnimation?: boolean;
  onClick?: () => void;
}

// 该UI组件用于实现链接按钮效果
const LinkBtn: React.FC<LinkBtnProps> = props => {
  const { seq, icon, children, notAnimation, onClick } = props;

  // redux
  const { chosenList } = useAppSelector(state => state.chosenList);
  const themeMode = useAppSelector(state => state.universal.themeMode);

  const contentStyle = { color: THEME_COLOR };

  return (
    <div className={`${style.wrapper}`} onClick={onClick}>
      <div
        className={`${style.content} iconfont ${themeMode === 'dark' ? 'dark-font' : 'light-font'}`}
        style={chosenList[seq] ? contentStyle : { color: '#666666' }}
      >
        <div>
          {icon}&nbsp;
          {children}
        </div>
        {notAnimation ? undefined : <div className={chosenList[seq] ? style.chosenBar : style.bar}></div>}
      </div>
    </div>
  );
};

export default LinkBtn;
