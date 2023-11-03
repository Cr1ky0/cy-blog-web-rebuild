import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { client, Result } from '@/utils/request';
import { UserInfo } from '@/apis/user';

interface userInitObj {
  user: UserInfo;
}

const initialState: userInitObj = {
  user: {} as UserInfo,
};

export const setMyUser = createAsyncThunk('user/setMyUser', async () => {
  const response = await client.get<Result<UserInfo>>('/api/users/info');
  return Promise.resolve(response);
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(setMyUser.fulfilled, (state, action) => {
      console.log(action.payload.data);
      state.user = action.payload.data;
    });
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
