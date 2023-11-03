import React, { useContext, createContext, useState, useEffect } from 'react';
import { avatarAjax } from '@/api/user';

// default.png
import img from '@/assets/images/default.webp';
import { useGlobalMessage } from '@/components/ContextProvider/MessageProvider';
import { getAvatar } from '@/apis/user';

interface avatarContextProps {
  children?: React.ReactNode;
}

const avatarContext = createContext(img);
const AvatarProvider: React.FC<avatarContextProps> = ({ children }) => {
  const [avatar, setAvatar] = useState<string>(img);

  useEffect(() => {
    const init = async () => {
      try {
        // 获取用户头像
        const res = await getAvatar();
        const type = res.headers['content-type'];
        const blob = new Blob([res.data], { type });
        // img src
        const imageUrl = URL.createObjectURL(blob);
        setAvatar(imageUrl);
      } catch (data: any) {
        // 没登录或没有设置头像则用默认头像
        setAvatar(img);
      }
    };
    init();
  }, []);

  return <avatarContext.Provider value={avatar}>{children}</avatarContext.Provider>;
};

export default AvatarProvider;

export const useAvatar = () => {
  return useContext(avatarContext);
};
