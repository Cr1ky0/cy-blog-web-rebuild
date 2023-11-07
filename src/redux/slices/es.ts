import { createSlice } from '@reduxjs/toolkit';
import { BlogDoc } from '@/apis/es';

interface SearchHistory {
  blog: BlogDoc;
  match: string;
}

interface ESInitialState {
  history: SearchHistory[];
}

const initialState = {
  history: [],
} as ESInitialState;

const esSlice = createSlice({
  name: 'es',
  initialState,
  reducers: {
    addHistory: (state, action) => {
      const has = state.history.find(history => history.blog.id === action.payload.blog.id);
      if (!has) state.history = [action.payload, ...state.history];
    },
    delHistory: (state, action) => {
      state.history = state.history.filter(history => {
        return history.blog.id !== action.payload;
      });
    },
  },
});

export const { addHistory, delHistory } = esSlice.actions;
export default esSlice.reducer;
