import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

// default.png
import img from '@/assets/images/default.webp';
import { getAvatar, getAvatarById } from '@/apis/user';

interface avatarContextProps {
  children?: React.ReactNode;
}

interface AvatarContext {
  avatar: string;
  getAvatarById: (userId: number) => Promise<any>;
}

const avatarContext = createContext<AvatarContext>({
  avatar: img,
  getAvatarById: async (userId: number) => {
    try {
      const res = await getAvatarById(userId);
      const type = res.headers['content-type'];
      const blob = new Blob([res.data], { type });
      // img src
      return URL.createObjectURL(blob);
    } catch (data: any) {
      return img;
    }
  },
});
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

  return <avatarContext.Provider value={{ avatar, getAvatarById }}>{children}</avatarContext.Provider>;
};

export default AvatarProvider;

export const useAvatar = () => {
  const { avatar, getAvatarById } = useContext(avatarContext);
  return { avatar, getAvatarById };
};
