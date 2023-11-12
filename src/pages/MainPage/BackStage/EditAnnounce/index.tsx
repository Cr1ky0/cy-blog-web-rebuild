import React, { useEffect, useState } from 'react';

// css
import style from './index.module.scss';

// antd
import { Button, Input } from 'antd';

const { TextArea } = Input;

// redux
import { setSelectKey } from '@/redux/slices/backstage';
import { useAppDispatch } from '@/redux';
import { addAnnounce, getAnnounce } from '@/apis/announce';
import { useGlobalMessage } from '@/components/ContextProvider/MessageProvider';

const EditAnnounce = () => {
  const dispatch = useAppDispatch();
  const msg = useGlobalMessage();

  const [value, setValue] = useState('');

  useEffect(() => {
    dispatch(setSelectKey('announce'));
    // 获取announce
    getAnnounce().then(
      res => {
        const announce = res.data.announce;
        if (announce) {
          setValue(announce.content);
        }
      },
      err => {
        msg.error(err.message);
      }
    );
  }, []);

  const handleSubmit = async () => {
    try {
      const res = await addAnnounce({ content: value });
      msg.success('提交成功');
      setValue(res.data.announce.content);
    } catch (data: any) {
      msg.error(data.message);
    }
  };

  return (
    <div className={style.wrapper}>
      <TextArea
        className={style.textArea}
        rows={4}
        placeholder="最长50个字符"
        maxLength={50}
        autoSize={false}
        value={value}
        onChange={e => {
          setValue(e.target.value);
        }}
      />
      <div className={style.btns}>
        <Button type="primary" onClick={handleSubmit}>
          提交
        </Button>
        <Button
          danger
          onClick={() => {
            setValue('');
          }}
        >
          清除
        </Button>
      </div>
    </div>
  );
};

export default EditAnnounce;
