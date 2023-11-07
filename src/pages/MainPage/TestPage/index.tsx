import React, { useState } from 'react';
import { useAvatar } from '@/components/ContextProvider/AvatarPrivider';

const TestPage = () => {
  const { avatar } = useAvatar();
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100vw', height: '100vh' }}>
      <img src={avatar} alt="123" />
    </div>
  );
};

export default TestPage;
