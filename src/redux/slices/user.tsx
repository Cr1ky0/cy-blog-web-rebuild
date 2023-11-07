import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { client, Result } from '@/utils/request';
import { User, GetUserRes } from '@/apis/user';

interface userInitObj {
  user: User;
}

const initialState: userInitObj = {
  user: {} as User,
};

export const setMyUser = createAsyncThunk('user/setMyUser', async () => {
  const response = await client.get<Result<GetUserRes>>('/api/user/info');
  console.log(response);
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
      state.user = action.payload.data.user;
    });
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
