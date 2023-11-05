import React, { useEffect, useState } from 'react';
import { nanoid } from 'nanoid';

// antd
import { Form, Upload, DatePicker, Badge } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { RcFile } from 'antd/lib/upload';
import type { UploadFile } from 'antd/es/upload/interface';
import type { UploadProps } from 'antd';
import 'dayjs/locale/zh-cn';

const { Dragger } = Upload;

// css
import style from './index.module.scss';

// context
import { useGlobalMessage } from '@/components/ContextProvider/MessageProvider';

// redux
import { useAppDispatch } from '@/redux';

// provider
import { useViewport } from '@/components/ContextProvider/ViewportProvider';

// global
import { BREAK_POINT } from '@/global';
import { setSelectKey } from '@/redux/slices/backstage';
import { getPolicy, OSSPolicy } from '@/apis/oss';
import { addImage } from '@/apis/image';

interface AliyunOSSUploadProps {
  value?: UploadFile[];
  onChange?: (fileList: UploadFile[]) => void;
  time: Date;
}

const AliyunOSSUpload = ({ value }: AliyunOSSUploadProps) => {
  const message = useGlobalMessage();
  const { width } = useViewport();
  const [OSSData, setOSSData] = useState<OSSPolicy>();
  const [uploadList, setUploadList] = useState<string[]>([]);

  const init = async () => {
    try {
      const res = await getPolicy();
      setOSSData(res.data);
    } catch (data: any) {
      message.error(data.message);
    }
  };

  useEffect(() => {
    init();
  }, []);

  const handleChange: UploadProps['onChange'] = async ({ file }) => {
    const status = file.status;
    if (status === 'uploading') {
      message.destroy();
      message.loading('上传中');
    }
    if (status === 'done') {
      // 应用服务器上传
      try {
        await addImage({
          fileName: file.url as string,
        });
        setUploadList([...uploadList, file.url as string]);
        message.destroy();
        message.success('success');
      } catch (data: any) {
        message.error(data.message);
      }
    }
    if (status === 'error') {
      message.destroy();
      message.error('上传失败');
    }
  };

  const onRemove = () => {
    return true;
  };
  const getExtraData: UploadProps['data'] = file => ({
    key: file.url,
    OSSAccessKeyId: OSSData?.accessid,
    policy: OSSData?.policy,
    Signature: OSSData?.signature,
    success_action_status: 200,
    // callback:'' // 上线时使用
  });

  const beforeUpload: UploadProps['beforeUpload'] = async file => {
    if (!OSSData) return false;
    await init();

    // 判断文件大小是否超过5MB
    const inSize = file.size < 5 * 1024 * 1024;

    // 判断是否是图像
    const isImg = !!file.type.match('image');
    if (!isImg) message.error('请上传图片类文件！');
    const suffix = file.name.slice(file.name.lastIndexOf('.'));
    const filename = nanoid() + suffix;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    file.url = OSSData.dir + filename;
    return (inSize && isImg) || Upload.LIST_IGNORE;
  };

  // 预览
  const onPreview = async (file: UploadFile) => {
    const src = await new Promise(resolve => {
      const reader = new FileReader();
      reader.readAsDataURL(file.originFileObj as RcFile);
      reader.onload = () => resolve(reader.result as string);
    });
    const image = new Image();
    image.src = src as string;
    // 居中
    image.style.position = 'absolute';
    image.style.left = '0';
    image.style.right = '0';
    image.style.bottom = '0';
    image.style.top = '0';
    image.style.margin = 'auto';
    const imgWindow = window.open(src as string);
    imgWindow?.document.write(image.outerHTML);
  };

  const uploadProps: UploadProps = {
    name: 'file',
    fileList: value,
    action: OSSData?.host,
    multiple: true,
    onChange: handleChange,
    onRemove,
    onPreview,
    data: getExtraData,
    beforeUpload,
  };

  return (
    <Dragger {...uploadProps} listType="picture" height={width > BREAK_POINT ? 300 : 200}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">点击或者拖拽文件到此区域上传</p>
      <p className="ant-upload-hint">支持单个或批量上传。支持所有的图片格式格式，请勿上传其他文件！</p>
    </Dragger>
  );
};

const AddPhoto: React.FC = () => {
  const dispatch = useAppDispatch();
  const [time, setTime] = useState<Date>(new Date(Date.now()));
  const dateFormat = 'YYYY/MM/DD';

  const handleTime = (value: any) => {
    setTime(value.$d);
  };

  useEffect(() => {
    dispatch(setSelectKey('photo'));
  }, []);
  return (
    <div className={style.wrapper}>
      <div className={style.photoTime}>
        <span>请选择上传照片日期：</span>
        <DatePicker placeholder="请选择照片日期" format={dateFormat} onChange={handleTime} />
        <span>
          <Badge color="magenta" status="processing" style={{ paddingRight: 5 }}></Badge>
          用于时间轴展示（不填默认为当前时间）
        </span>
      </div>
      <div className={style.upload}>
        <Form labelCol={{ span: 4 }}>
          <Form.Item name="photos">
            <AliyunOSSUpload time={time} />
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};
export default AddPhoto;
