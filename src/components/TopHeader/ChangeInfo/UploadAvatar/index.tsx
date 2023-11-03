import React, { useState } from 'react';

// css
import style from './index.module.scss';

// antd
import { PlusOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
import { Modal, Upload, Button } from 'antd';
import type { RcFile, UploadProps } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';

// context
import { useGlobalMessage } from '@/components/ContextProvider/MessageProvider';

//api
import { uploadAvatar } from '@/apis/user';

const UploadAvatar = () => {
  // state
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  // context
  const message = useGlobalMessage();

  // handler
  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise(resolve => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as RcFile);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    if (!file.url && !file.preview) {
      file.preview = src;
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  // 阻止默认上传行为
  const beforeUpload: UploadProps['beforeUpload'] = () => {
    return false;
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    return false;
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  // 提交
  const handleSubmit = async () => {
    setIsLoading(true);
    if (fileList[0]) {
      try {
        await uploadAvatar(fileList[0].originFileObj as RcFile);
        message.success('上传成功');
      } catch (data: any) {
        message.error(data.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className={style.wrapper}>
      <div className={style.uploadBox}>
        <ImgCrop rotationSlider>
          <Upload
            beforeUpload={beforeUpload}
            listType="picture-card"
            fileList={fileList}
            onPreview={handlePreview}
            onChange={handleChange}
          >
            {fileList.length >= 1 ? null : uploadButton}
          </Upload>
        </ImgCrop>
        <Modal open={previewOpen} title="PhotoPreview" footer={null} onCancel={handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
      <div className={style.btn}>
        <Button onClick={handleSubmit} loading={isLoading}>
          提交
        </Button>
      </div>
    </div>
  );
};

export default UploadAvatar;
