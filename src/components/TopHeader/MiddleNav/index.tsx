import React, { useCallback } from 'react';
import { useNavigate } from 'react-router';

// css
import style from './index.module.scss';

// ui-c
import LinkBtn from '@/components/Universal/LinkBtn';

// util
import _ from 'lodash';

const MiddleNav = () => {
  const navigate = useNavigate();

  const handleJump = useCallback(
    _.throttle((link: string) => {
      navigate(link);
    }, 1000),
    []
  );
  return (
    <div className={style.middleNav}>
      <LinkBtn
        icon="&#xe600;"
        seq={0}
        onClick={() => {
          handleJump('/');
        }}
      >
        主页
      </LinkBtn>
      <LinkBtn
        icon="&#xe60e;"
        seq={1}
        onClick={() => {
          handleJump('/blog');
        }}
      >
        博客
      </LinkBtn>
      <LinkBtn
        icon="&#xe7df;"
        seq={2}
        onClick={() => {
          handleJump('/stars');
        }}
      >
        精选
      </LinkBtn>
      <LinkBtn
        icon="&#xe612;"
        seq={3}
        onClick={() => {
          handleJump('/photo');
        }}
      >
        相册
      </LinkBtn>
    </div>
  );
};

export default MiddleNav;
