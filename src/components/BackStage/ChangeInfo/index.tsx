import React, { RefObject, useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';

// antd
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

// css
import style from './index.module.scss';

// comp
import ChangeFormBox from './ChangeFormBox';
import UploadAvatar from './UploadAvatar';

// ui
import { useGlobalMessage } from '@/components/ContextProvider/MessageProvider';

// api
import isEmail from 'validator/lib/isEmail';
import {
  sendCode,
  updateEmail,
  UpdateEmailForm,
  updatePsw,
  UpdatePswForm,
  updateUser,
  UpdateUserForm,
} from '@/apis/user';

// redux
import { useAppDispatch, useAppSelector } from '@/redux';
import { setMyUser } from '@/redux/slices/user';
import { setTimerOn } from '@/redux/slices/universal';

// util
import { hasUser } from '@/utils';
import _ from 'lodash';

const ChangeInfo = () => {
  const message = useGlobalMessage();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState([false, false, false, false]);
  const [isLoading, setIsLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [count, setCount] = useState(60);

  const timerOn = useAppSelector(state => state.universal.timerOn);
  const user = useAppSelector(state => state.user.user);

  // ref
  // psw Ref
  const oldPswRef = useRef<HTMLInputElement>(null);
  const pswRef = useRef<HTMLInputElement>(null);
  const pswCfmRef2 = useRef<HTMLInputElement>(null);
  // email Ref
  const newEmailRef = useRef<HTMLInputElement>(null);
  const codeRef = useRef<HTMLInputElement>(null);
  // info Ref
  const usernameRef = useRef<HTMLInputElement>(null);
  const briefRef = useRef<HTMLInputElement>(null);

  // 实现展开Form动画
  const openForm = useCallback((state: boolean, chosenList: boolean[], key: number) => {
    const newList = [];
    for (let i = 0; i < chosenList.length; i += 1) {
      const div = document.getElementById('change-form-box-anime-' + i) as HTMLElement;
      if (i === key) {
        newList.push(state);
        // 如果打开就设置为scrollHeight
        if (state) div.style.height = div.scrollHeight + 'px';
        else div.style.height = '0';
      } else {
        newList.push(false);
        // 其他关闭
        div.style.height = '0';
      }
    }
    setIsOpen(newList);
  }, []);

  // 如果计时器存在，则开启定时
  useEffect(() => {
    if (timerOn) {
      const timer = setInterval(() => {
        setCount(count => count - 1);
      }, 1000);
      setTimeout(() => {
        dispatch(setTimerOn(false));
        setCount(60);
        clearTimeout(timer);
      }, count * 1000);
    }
  }, []);

  // 获取表单内数据
  function getFormValues<T>(
    ref1: RefObject<HTMLInputElement>,
    ref2?: RefObject<HTMLInputElement>,
    ref3?: RefObject<HTMLInputElement>
  ): T {
    const cur1 = ref1.current as HTMLInputElement;
    let cur2;
    let cur3;
    if (ref2) cur2 = ref2.current as HTMLInputElement;
    if (ref3) cur3 = ref3.current as HTMLInputElement;
    return Object.assign(
      { [cur1.name]: cur1.value },
      cur2 ? { [cur2.name]: cur2.value } : undefined,
      cur3 ? { [cur3.name]: cur3.value } : undefined
    ) as T;
  }

  // 密码表单
  const handlePasswordForm = async () => {
    setIsLoading(true);
    try {
      const data = getFormValues<UpdatePswForm>(oldPswRef, pswRef, pswCfmRef2);
      await updatePsw(data);
      await message.loadingSuccessAsync('修改中...', '修改成功!');
      navigate(0);
    } catch (data: any) {
      message.error(data.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 邮箱表单
  const handleSendCode = _.debounce(async () => {
    setUpdateLoading(true);
    const ref = newEmailRef.current as HTMLInputElement;
    if (!isEmail(ref.value)) {
      setUpdateLoading(false);
      message.error('请输入正确的邮箱！');
      return;
    }
    try {
      // 向新邮箱发送验证码
      await sendCode(ref.value);
      message.success('验证码已发送到新邮箱，请前往邮箱查看！');
      // 设定计时器
      dispatch(setTimerOn(true));
      const timer = setInterval(() => {
        setCount(count => count - 1);
      }, 1000);
      setTimeout(() => {
        dispatch(setTimerOn(false));
        setCount(60);
        clearTimeout(timer);
      }, count * 1000);
    } catch (data: any) {
      message.error(data.message);
    } finally {
      setUpdateLoading(false);
    }
  }, 500);

  const handleEmailForm = async () => {
    setIsLoading(true);
    const data = getFormValues<UpdateEmailForm>(newEmailRef, codeRef);
    try {
      await updateEmail(data);
      await message.loadingAsync('更新中...', '更新成功');
      await dispatch(setMyUser());
      navigate(0);
    } catch (data: any) {
      message.error(data.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 昵称
  const handleUpdateUserForm = async (ref: RefObject<HTMLInputElement>) => {
    setIsLoading(true);
    try {
      const data = getFormValues<UpdateUserForm>(ref);
      await updateUser(data);
      await message.loadingSuccessAsync('更新中', '更新成功!');
      await dispatch(setMyUser());
      navigate(0);
    } catch (data: any) {
      message.error(data.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {hasUser(user) ? (
        <div className={style.wrapper}>
          <div className={style.accountSecurity}>
            <div className={style.title}>
              <div></div>
              <div>账户与安全</div>
            </div>
            <ChangeFormBox
              name="oldPsw"
              title="密码"
              placeHolder="********"
              isOpen={isOpen}
              handleClose={openForm}
              handleSubmit={handlePasswordForm}
              isLoading={isLoading}
              type="password"
              seq={0}
              ref={oldPswRef}
            >
              <div>
                <input type="password" placeholder="新密码" name="newPsw" ref={pswRef} />
              </div>
              <div>
                <input type="password" placeholder="确认密码" name="pswConfirm" ref={pswCfmRef2} />
              </div>
            </ChangeFormBox>
            <ChangeFormBox
              title="邮箱"
              placeHolder={user.email}
              isOpen={isOpen}
              handleClose={openForm}
              isLoading={isLoading}
              handleSubmit={handleEmailForm}
              ref={newEmailRef}
              type="text"
              seq={1}
              name="newEmail"
            >
              <div>
                <input type="text" placeholder="验证码" name="code" ref={codeRef} />
                <div
                  className={style.sendCodeBtn}
                  onClick={() => {
                    if (!timerOn) handleSendCode();
                    else {
                      message.error(`请于${count}s后再试`);
                    }
                  }}
                >
                  {updateLoading ? (
                    <Spin indicator={<LoadingOutlined style={{ fontSize: 14, marginRight: 5 }} spin />} />
                  ) : undefined}
                  {timerOn ? `（${count}）` : '获取验证码'}
                </div>
              </div>
            </ChangeFormBox>
          </div>
          <div className={style.selfInfo}>
            <div className={style.title}>
              <div></div>
              <div>个人信息</div>
            </div>
            <ChangeFormBox
              title="昵称"
              placeHolder={user.nickname}
              isOpen={isOpen}
              handleClose={openForm}
              ref={usernameRef}
              isLoading={isLoading}
              handleSubmit={() => {
                handleUpdateUserForm(usernameRef);
              }}
              type="text"
              name="nickname"
              seq={2}
            ></ChangeFormBox>
            <ChangeFormBox
              title="个人简介"
              placeHolder={user.brief}
              isOpen={isOpen}
              isLoading={isLoading}
              handleClose={openForm}
              handleSubmit={() => {
                handleUpdateUserForm(briefRef);
              }}
              ref={briefRef}
              type="text"
              name="brief"
              seq={3}
            ></ChangeFormBox>
          </div>
          <div className={style.uploadAvatar}>
            <div className={style.title}>
              <div></div>
              <div>头像</div>
            </div>
            <UploadAvatar></UploadAvatar>
          </div>
        </div>
      ) : undefined}
    </>
  );
};
export default ChangeInfo;
