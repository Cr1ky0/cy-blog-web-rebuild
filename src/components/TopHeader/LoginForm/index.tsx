import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';

// img
import img from '@/assets/images/blog-icon.webp';
import defaultImg from '@/assets/images/timeline.webp';

// css
import style from './index.module.scss';

// ajax
import { getVerificationCode, login } from '@/apis/user';

// util
import _ from 'lodash';

// context
import { useGlobalMessage } from '@/components/ContextProvider/MessageProvider';

// redux
import { useAppDispatch } from '@/redux';
import { setLoginFormOpen } from '@/redux/slices/universal';
import { setMyUser } from '@/redux/slices/user';

// comp
import LoadingIcon from '@/components/Loading/LoadingIcon';

const LoginForm = () => {
  const message = useGlobalMessage();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [showPsw, setShowPsw] = useState(false);
  const [codeImg, setCodeImg] = useState<string>(defaultImg);
  const [checked, setChecked] = useState(false);

  // value
  const [userInfo, setUserInfo] = useState(localStorage.getItem('login_info') || '');
  const [psw, setPsw] = useState(localStorage.getItem('login_psw') || '');
  const [code, setCode] = useState('');

  // placeholder
  const ref1 = useRef<HTMLDivElement>(null);
  const ref2 = useRef<HTMLDivElement>(null);
  const ref3 = useRef<HTMLDivElement>(null);
  // scroll bar
  const ref4 = useRef<HTMLDivElement>(null);
  const ref5 = useRef<HTMLDivElement>(null);
  const ref6 = useRef<HTMLDivElement>(null);

  const onFocus = (ref1: React.RefObject<HTMLDivElement>, ref2: React.RefObject<HTMLDivElement>) => {
    const div = ref1.current as HTMLDivElement;
    const scroll = ref2.current as HTMLDivElement;
    if (!div.classList.contains(style.placeHolderOutInit)) {
      div.classList.add(style.placeHolderOut);
    }
    div.classList.remove(style.placeHolderIn);
    div.classList.remove(style.blurColor);
    scroll.classList.add(style.barScroll);
  };

  const onBlur = (ref1: React.RefObject<HTMLDivElement>) => {
    const div = ref1.current as HTMLDivElement;
    div.classList.add(style.placeHolderIn);
    div.classList.remove(style.placeHolderOut);
    div.classList.remove(style.placeHolderOutInit);
  };

  const onBlur2 = (ref1: React.RefObject<HTMLDivElement>, ref2: React.RefObject<HTMLDivElement>) => {
    const div = ref1.current as HTMLDivElement;
    const scroll = ref2.current as HTMLDivElement;
    scroll.classList.remove(style.barScroll);
    div.classList.add(style.blurColor);
  };

  // 验证码
  const getCode = useCallback(async () => {
    try {
      const res = await getVerificationCode();
      setCodeImg(res.data.img);
    } catch (data: any) {
      message.error(data.message);
    }
  }, []);

  const getCodeThrottle = _.throttle(getCode, 300);

  // 登录
  const handleLogin = async () => {
    if (!isLoading) {
      setIsLoading(true);
      try {
        await login({
          userinfo: userInfo,
          password: psw,
          verificationCode: code,
        });
        await message.loadingSuccessAsync('登录中...', '登录成功');
        // 获取用户信息存入redux
        await dispatch(setMyUser());
        // 如果checked则保存一下账号密码到localStorage
        if (checked) {
          localStorage.setItem('login_info', userInfo);
          localStorage.setItem('login_psw', psw);
        }
        navigate(0);
        // 开启定时器，在token到期后清除redux内user
        // const expireTime = res.data.expireTime;
        // const timeout = expireTime - Date.now();
        // // 确保不会丢失timer
        // const timer = setTimeout(() => {
        //   dispatch(setUser(null));
        //   message.error('用户登录信息过期，请重新登录！');
        //   navigate(0);
        // }, timeout);
      } catch (data: any) {
        message.error(data.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // 先请求一个code
  useEffect(() => {
    getCode();
  }, []);

  // 如果设置了记录密码，则把样式定为有值
  useEffect(() => {
    if (userInfo) {
      setChecked(true);
      const div1 = ref1.current as HTMLDivElement;
      const div2 = ref2.current as HTMLDivElement;
      div1.classList.add(style.placeHolderOutInit);
      div2.classList.add(style.placeHolderOutInit);
      div1.classList.add(style.blurColor);
      div2.classList.add(style.blurColor);
    }
  }, []);

  // 监听回车和ESC
  useEffect(() => {
    const listener = _.throttle(e => {
      if (e.key.toUpperCase() === 'ENTER' && !isLoading) {
        handleLogin();
      }
      if (e.key.toUpperCase() === 'ESCAPE') {
        dispatch(setLoginFormOpen(false));
      }
    }, 500);

    document.addEventListener('keydown', listener);
    return () => {
      document.removeEventListener('keydown', listener);
    };
  }, [handleLogin]);

  return (
    <div className={style.mask}>
      <div className={`${style.wrapper} animate__animated animate__zoomIn `}>
        <div
          className={`${style.closeBtn} iconfont`}
          onClick={() => {
            dispatch(setLoginFormOpen(false));
          }}
        >
          &#xe6dc;
        </div>
        <div className={style.header}>
          <div className={style.logo} style={{ backgroundImage: `url(${img})` }}></div>
          <div className={style.login}>
            <div>登录</div>
            <div></div>
          </div>
        </div>
        <form className={style.form}>
          <div className={style.input}>
            <input
              value={userInfo}
              type="text"
              onFocus={() => {
                onFocus(ref1, ref4);
              }}
              onBlur={e => {
                if (!e.target.value) onBlur(ref1);
                onBlur2(ref1, ref4);
              }}
              onChange={e => {
                setUserInfo(e.target.value);
              }}
            />
            <div className={style.placeHolder} ref={ref1}>
              用户名/邮箱
            </div>
            <div ref={ref4}></div>
          </div>
          <div className={style.input}>
            <input
              value={psw}
              type={showPsw ? 'text' : 'password'}
              onFocus={() => {
                onFocus(ref2, ref5);
              }}
              onBlur={e => {
                if (!e.target.value) onBlur(ref2);
                onBlur2(ref2, ref5);
              }}
              onChange={e => {
                setPsw(e.target.value);
              }}
            />
            <div className={style.placeHolder} ref={ref2}>
              登录密码
            </div>
            <div
              className={`${style.isShowPsw} iconfont`}
              onClick={() => {
                setShowPsw(!showPsw);
              }}
            >
              {showPsw ? <>&#xe605;</> : <>&#xe607;</>}
            </div>
            <div ref={ref5}></div>
          </div>
          <div className={style.input}>
            <input
              maxLength={6}
              type="text"
              onFocus={() => {
                onFocus(ref3, ref6);
              }}
              onBlur={e => {
                if (!e.target.value) onBlur(ref3);
                onBlur2(ref3, ref6);
              }}
              onChange={e => {
                setCode(e.target.value);
              }}
            />
            <div className={style.placeHolder} ref={ref3}>
              图形验证码
            </div>
            <div className={style.captcha} onClick={getCodeThrottle}>
              <img src={codeImg} alt="code" />
            </div>
            <div ref={ref6}></div>
          </div>
          <div className={style.func}>
            <label htmlFor="remember-psw">
              <input
                id="remember-psw"
                type="checkbox"
                checked={checked}
                onChange={() => {
                  setChecked(!checked);
                }}
              />
              <div>记住密码</div>
            </label>
          </div>
          <div className={style.submit} onClick={handleLogin}>
            <div className="iconfont">{isLoading ? <LoadingIcon></LoadingIcon> : <>&#xe73c;&nbsp;登录</>}</div>
          </div>
        </form>
      </div>
    </div>
  );
};
export default LoginForm;
