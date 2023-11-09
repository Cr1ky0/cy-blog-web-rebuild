import React, { useEffect, useRef } from 'react';
import style from './index.module.scss';
import { useAppSelector } from '@/redux';

interface InitLoadingProps {
  open?: boolean;
  isNavLoad?: boolean;
}

const InitLoading: React.FC<InitLoadingProps> = ({ open, isNavLoad }) => {
  const ref = useRef<HTMLDivElement>(null);
  const themeMode = useAppSelector(state => state.universal.themeMode);

  useEffect(() => {
    if (open) {
      ref.current!.style.display = 'flex';
    } else {
      setTimeout(() => {
        ref.current!.style.display = 'none';
      }, 300);
    }
  }, [open]);

  return (
    <div
      className={`${style.wrapper} ${open ? '' : style.close} ${themeMode === 'dark' ? style.dark : ''} ${
        isNavLoad ? style.navLoad : ''
      }`}
      ref={ref}
    >
      <div className={style.anime}>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default InitLoading;
