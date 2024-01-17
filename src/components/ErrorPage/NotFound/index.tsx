import React, { CSSProperties } from 'react';

// css
import style from './index.module.scss';

// img
import img from '@/assets/images/401.webp';

interface NotFoundProps {
  detail: string;
  styles?: CSSProperties;
}

const NotFound: React.FC<NotFoundProps> = ({ detail, styles }) => {
  return (
    <div className={style.deleted} style={styles}>
      <img src={img} alt="img" />
      <div className={style.deletedCode}>404</div>
      <div>{detail}</div>
    </div>
  );
};

export default NotFound;
