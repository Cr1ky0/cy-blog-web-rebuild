import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// global
import { client, Result } from '@/utils/request';

interface GetEmojiRes {
  emojis: object;
}

export interface Emoji {
  key: string;
  value: string;
}

const initialState = {
  emojiList: [] as Emoji[],
};

// async
// 这里只发送请求不处理数据，数据在extraReducer内处理
export const setEmoji = createAsyncThunk('emoji/setEmoji', async () => {
  return client.get<Result<GetEmojiRes>>('/api/comment/emoji');
});

const emojiSlice = createSlice({
  name: 'emoji',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(setEmoji.fulfilled, (state, action) => {
        const emojis = action.payload.data.emojis;
        // 将json转化为对象
        const list: Emoji[] = [];
        Object.entries(emojis).map(([key, value]) => {
          list.push({ key, value } as Emoji);
        });
        state.emojiList = [...list];
      })
      .addCase(setEmoji.rejected, (state, action) => {
        console.log(action.error.message);
      });
  },
});

export default emojiSlice.reducer;
