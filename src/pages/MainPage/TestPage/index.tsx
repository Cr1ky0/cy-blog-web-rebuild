import React, { useEffect, useState } from 'react';
import { getAvatar, login } from '@/apis/user';
import UploadAvatar from '@/components/TopHeader/ChangeInfo/UploadAvatar';
import LoginForm from '@/components/TopHeader/LoginForm';
import IntroductionBox from '@/components/HomePage/IntroductionBox';

const TestPage = () => {
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [image, setImage] = useState<string>();
  // useEffect(() => {
  //   const init = async () => {
  //     // await login({
  //     //   userinfo: 'criiky0',
  //     //   password: '123456',
  //     // });
  //     const res = await getAvatar();
  //     const type = res.headers['content-type'];
  //     const blob = new Blob([res.data], { type });
  //
  //     // img src
  //     const imageUrl = URL.createObjectURL(blob);
  //     setImage(imageUrl);
  //
  //     // base64
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setAvatarUrl(reader.result as string);
  //     };
  //     reader.readAsDataURL(blob);
  //   };
  //
  //   init();
  // }, []);
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100vw', height: '100vh' }}>
      {/*<div*/}
      {/*  style={{*/}
      {/*    width: 500,*/}
      {/*    height: 500,*/}
      {/*    backgroundImage: `url(${avatarUrl}})`,*/}
      {/*  }}*/}
      {/*></div>*/}
      {/*<img*/}
      {/*  src={image}*/}
      {/*  alt="123"*/}
      {/*  style={{*/}
      {/*    width: 500,*/}
      {/*    height: 500,*/}
      {/*  }}*/}
      {/*/>*/}
      <IntroductionBox />
    </div>
  );
};

export default TestPage;
