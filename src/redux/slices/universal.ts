import { createSlice } from '@reduxjs/toolkit';

interface UniInitState {
  themeMode: 'dark' | 'light';
  jumpFlag: boolean;
  loginFormOpen: boolean;
  starBlogPage: number;
  moblieMenuOpen: boolean;
  timerOn: boolean;
  showAnnouncement: boolean;
}

const initialState = {
  themeMode: 'light',
  jumpFlag: false, // 跳转标志，用来表示页面是否处于跳转（作为useEffect依赖使用）
  loginFormOpen: false, // 登录页面打开标志
  starBlogPage: 1, // starBlog页面分页的当前页
  moblieMenuOpen: false, // mobileMenu
  timerOn: false, // 计时器开始标志
  showAnnouncement: true, // 公共展示与否
} as UniInitState;

const uniSlice = createSlice({
  name: 'universal',
  initialState,
  reducers: {
    setMobileMenuOpen: (state, action) => {
      state.moblieMenuOpen = action.payload;
    },
    setThemeMode: (state, action) => {
      state.themeMode = action.payload;
    },
    setJumpFlag: (state, action) => {
      state.jumpFlag = action.payload;
    },
    setLoginFormOpen: (state, action) => {
      state.loginFormOpen = action.payload;
    },
    setStarBlogPage: (state, action) => {
      state.starBlogPage = action.payload;
    },
    setTimerOn: (state, action) => {
      state.timerOn = action.payload;
    },
    setShowAnnouncement: (state, action) => {
      state.showAnnouncement = action.payload;
    },
  },
});
export const {
  setMobileMenuOpen,
  setThemeMode,
  setJumpFlag,
  setLoginFormOpen,
  setStarBlogPage,
  setTimerOn,
  setShowAnnouncement,
} = uniSlice.actions;
export default uniSlice.reducer;
