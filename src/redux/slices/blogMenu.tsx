import { client, Result } from '@/utils/request';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// interface
import { Menu, MenuResponse } from '@/apis/menu';

interface blogMenuInitObj {
  menuList: Menu[];
  selectedId: string; // 选的博客id
  deleteKey: string;
  delKind: 'menu' | 'blog';
  opt: boolean;
}

// 合并了菜单的slice因为无法解决设置了selectedId后设置curBlog延迟的问题
const initialState: blogMenuInitObj = {
  menuList: [] as Menu[],
  selectedId: '', // 选的博客id
  deleteKey: '', // EditMenu中删除的id，可以是blog也可以是menu
  delKind: 'menu', // EditMenu中删除的种类
  opt: true, // 可以点击menu标志（用来控制操作频率）
};

export const setMenuList = createAsyncThunk('blogMenu/setMenuList', async () => {
  const response = await client.get<Result<MenuResponse>>(`/api/menu/criiky0`);
  return response.data.menus;
});

const blogMenuSlice = createSlice({
  name: 'blogMenu',
  initialState,
  reducers: {
    setOpt: (state, action) => {
      state.opt = action.payload;
    },
    // deleteKey
    setDeleteKey: (state, action) => {
      state.deleteKey = action.payload;
    },
    // delKind
    setDelKind: (state, action) => {
      state.delKind = action.payload;
    },
    // selectedId
    setSelectedId: (state, action) => {
      state.selectedId = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(setMenuList.fulfilled, (state, action) => {
        state.menuList = action.payload;
      })
      .addCase(setMenuList.rejected, (state, action) => {
        console.log(action.error.message);
      });
  },
});

export const { setOpt, setDeleteKey, setDelKind, setSelectedId } = blogMenuSlice.actions;
export default blogMenuSlice.reducer;
