import { client, Result } from '@/utils/request';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// interface
import { Menu, MenuResponse } from '@/apis/menu';
import { getOneBlogFromMenu } from '@/utils';

interface blogMenuInitObj {
  menuList: Menu[];
  selectedId: string; // 选的博客id
  opt: boolean;
}

// 合并了菜单的slice因为无法解决设置了selectedId后设置curBlog延迟的问题
const initialState: blogMenuInitObj = {
  menuList: [] as Menu[],
  selectedId: '', // 选的博客id
  opt: true, // 可以点击menu标志（用来控制操作频率）
};

export const setMenuList = createAsyncThunk('blogMenu/setMenuList', async () => {
  return client.get<Result<MenuResponse>>(`/api/menu/criiky0`);
});

const blogMenuSlice = createSlice({
  name: 'blogMenu',
  initialState,
  reducers: {
    setOpt: (state, action) => {
      state.opt = action.payload;
    },
    // selectedId
    setSelectedId: (state, action) => {
      state.selectedId = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(setMenuList.fulfilled, (state, action) => {
        const menus = action.payload.data.menus;
        if (!state.selectedId) {
          // 选择一个selectedId
          const list: string[] = [];
          menus.map(menu => {
            getOneBlogFromMenu(menu, list);
          });
          if (list.length) {
            state.selectedId = list[0];
          }
        }
        state.menuList = menus;
      })
      .addCase(setMenuList.rejected, (state, action) => {
        console.log(action.error.message);
      });
  },
});

export const { setOpt, setSelectedId } = blogMenuSlice.actions;
export default blogMenuSlice.reducer;
