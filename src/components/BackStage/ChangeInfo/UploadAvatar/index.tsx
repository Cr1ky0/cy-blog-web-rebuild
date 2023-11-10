import React, { useState } from 'react';
import { useNavigate } from 'react-router';

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
import { useAvatar } from '@/components/ContextProvider/AvatarPrivider';

//api
import { uploadAvatar } from '@/apis/user';

// redux
import { useAppDispatch, useAppSelector } from '@/redux';
import { setMyUser } from '@/redux/slices/user';

const UploadAvatar = () => {
  // context
  const message = useGlobalMessage();
  const { avatar } = useAvatar();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // state
  const user = useAppSelector(state => state.user.user);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(avatar);
  const [isLoading, setIsLoading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([
    {
      uid: '-1',
      name: `${user.avatar}`,
      status: 'done',
      url: avatar,
    },
  ]);

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
    if (fileList[0] && fileList[0].originFileObj) {
      try {
        setIsLoading(true);
        await uploadAvatar(fileList[0].originFileObj as RcFile);
        await message.success('上传成功');
        dispatch(setMyUser());
        navigate(0);
      } catch (data: any) {
        message.error(data.message);
      } finally {
        setIsLoading(false);
      }
    } else {
      message.error('请上传新图片！');
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
