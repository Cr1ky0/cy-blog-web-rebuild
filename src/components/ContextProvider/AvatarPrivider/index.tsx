import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

// default.png
import img from '@/assets/images/default.webp';
import { getAvatar } from '@/apis/user';
import { useAppSelector } from '@/redux';

interface avatarContextProps {
  children?: React.ReactNode;
}

interface AvatarContext {
  avatar: string;
  getAvatarById: (userId: string) => Promise<any>;
}

const avatarContext = createContext<AvatarContext>({
  avatar: img,
  getAvatarById: async userId => {
    //pass
  },
});
const AvatarProvider: React.FC<avatarContextProps> = ({ children }) => {
  const user = useAppSelector(state => state.user.user);
  const [avatar, setAvatar] = useState<string>(img);

  const getAvatarById: AvatarContext['getAvatarById'] = useCallback(async (userId: string) => {
    try {
      const res = await getAvatarById(userId);
      const type = res.headers['content-type'];
      const blob = new Blob([res.data], { type });
      // img src
      return URL.createObjectURL(blob);
    } catch (data: any) {
      return img;
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        // 获取用户头像
        const res = await getAvatar();
        console.log(1);
        const type = res.headers['content-type'];
        const blob = new Blob([res.data], { type });
        // img src
        const imageUrl = URL.createObjectURL(blob);
        setAvatar(imageUrl);
      } catch (data: any) {
        console.log(data);
        // 没登录或没有设置头像则用默认头像
        setAvatar(img);
      }
    };
    init();
  }, [user]);

  return <avatarContext.Provider value={{ avatar, getAvatarById }}>{children}</avatarContext.Provider>;
};

export default AvatarProvider;

export const useAvatar = () => {
  const { avatar, getAvatarById } = useContext(avatarContext);
  return { avatar, getAvatarById };
};
