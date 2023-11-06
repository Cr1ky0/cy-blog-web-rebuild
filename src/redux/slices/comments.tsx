import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { client, GetCountRequest, GetPageRequest, RequestPageOptions, Result } from '@/utils/request';
import { Comment } from '@/apis/comment';

interface commentsState {
  commentList: Comment[];
  curPage: number;
  isLoading: boolean;
  length: number;
  sort: 'time' | 'hot';
  likeList: number[]; // 用来存放已经点过赞的评论id列表
}

const initialState: commentsState = {
  commentList: [] as Comment[],
  curPage: 1,
  isLoading: false,
  length: 0,
  sort: 'time',
  likeList: [],
};

export const setComments = createAsyncThunk('comments/setComments', async (options: RequestPageOptions) => {
  const { id, page, size, sort } = options;
  return client.get<Result<GetPageRequest<Comment>>>(
    `/api/comment/curblog?blog_id=${id}?page=${page}&size=${size}&sort=${sort}`
  );
});

export const setLength = createAsyncThunk('comments/setLength', async (blogId: number) => {
  return client.get<Result<GetCountRequest>>(`/api/comment/curblog/count?blog_id=${blogId}`);
});

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    // comments
    setCurPage: (state, action) => {
      state.curPage = action.payload;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setSort: (state, action) => {
      state.sort = action.payload;
    },
    addLikeId: (state, action) => {
      state.likeList = [action.payload, ...state.likeList];
    },
    delLikeId: (state, action) => {
      state.likeList = state.likeList.filter(id => action.payload !== id);
    },
  },
  extraReducers(builder) {
    builder
      .addCase(setComments.fulfilled, (state, action) => {
        state.commentList = action.payload.data.records;
      })
      .addCase(setComments.rejected, (state, action) => {
        console.log(action.error.message);
      })
      .addCase(setLength.fulfilled, (state, action) => {
        state.length = action.payload.data.count;
      })
      .addCase(setLength.rejected, (state, action) => {
        console.log(action.error.message);
      });
  },
});

export const { setCurPage, setIsLoading, setSort, addLikeId, delLikeId } = commentsSlice.actions;
export default commentsSlice.reducer;
