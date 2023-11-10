import React, { useEffect, useState } from 'react';

// antd
import { Button, Form, Input } from 'antd';

// css
import style from './index.module.scss';

// redux
import { useAppDispatch } from '@/redux';
import { setSelectKey } from '@/redux/slices/backstage';

// api
import { AddOSSConfigForm, getOSSConfig, OSSConfig, OSSConfigInit, setOSSConfig } from '@/apis/oss';

// provider
import { useGlobalMessage } from '@/components/ContextProvider/MessageProvider';

const EditOSS = () => {
  const msg = useGlobalMessage();
  const dispatch = useAppDispatch();

  const [config, setConfig] = useState<OSSConfig>(OSSConfigInit);
  const [form] = Form.useForm();

  const refreshConfig = () => {
    form.setFieldsValue({
      accessKeyId: config.accessKeyId,
      accessKeySecret: config.accessKeySecret,
      bucket: config.bucket,
      endpoint: config.endpoint,
      dir: config.dir,
      callbackUrl: config.callbackUrl,
    });
  };

  const clearConfig = () => {
    form.setFieldsValue({
      accessKeyId: '',
      accessKeySecret: '',
      bucket: '',
      endpoint: '',
      dir: '',
      callbackUrl: '',
    });
  };

  // 刷新config
  useEffect(() => {
    refreshConfig();
  }, [config]);

  useEffect(() => {
    dispatch(setSelectKey('oss'));
    getOSSConfig().then(
      response => {
        setConfig(response.data.config);
      },
      error => {
        msg.error(error.message);
      }
    );
  }, []);

  const handleSubmit = async (values: AddOSSConfigForm) => {
    try {
      const res = await setOSSConfig(values);
      msg.success('保存成功！');
      refreshConfig();
      setConfig(res.data.config);
    } catch (data: any) {
      msg.error(data.message);
    }
  };

  return (
    <div className={style.wrapper}>
      <Form
        form={form}
        name="wrap"
        labelCol={{ flex: '120px' }}
        labelAlign="right"
        labelWrap
        colon={false}
        className={style.form}
        onFinish={handleSubmit}
      >
        <Form.Item label="AccessKeyId" name="accessKeyId" rules={[{ required: true }]}>
          <Input placeholder="设定 AccessKeyId" />
        </Form.Item>
        <Form.Item label="AccessKeySecret" name="accessKeySecret" rules={[{ required: true }]}>
          <Input placeholder="设定 AccessKeySecret" type="password" />
        </Form.Item>
        <Form.Item label="Bucket" name="bucket" rules={[{ required: true }]}>
          <Input placeholder="设定 Bucket" />
        </Form.Item>
        <Form.Item label="Endpoint" name="endpoint" rules={[{ required: true }]}>
          <Input placeholder="设定 endpoint" />
        </Form.Item>
        <Form.Item label="Dir" name="dir">
          <Input placeholder="设定 图片路径" />
        </Form.Item>
        <Form.Item label="CallbackUrl" name="callbackUrl">
          <Input placeholder="设定 上传回调地址" />
        </Form.Item>
        <Form.Item label=" ">
          <Button type="primary" htmlType="submit">
            保存
          </Button>
          <Button style={{ marginLeft: '20px' }} type="primary" danger onClick={clearConfig}>
            清除
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditOSS;
