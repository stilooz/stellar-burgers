import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi } from '../../utils/burger-api';
import { TOrder, TOrdersData } from '@utils-types';

interface FeedsState {
  listItems: TOrder[];
  listItemInfo: {
    total: number;
    totalToday: number;
  };
  isLoading: boolean;
  error: string | null;
}

const initialState: FeedsState = {
  listItems: [],
  listItemInfo: {
    total: 0,
    totalToday: 0
  },
  isLoading: false,
  error: null
};

export const fetchFeeds = createAsyncThunk(
  'feeds/fetchFeeds',
  async (_, { rejectWithValue }) => {
    try {
      return await getFeedsApi();
    } catch (err: any) {
      return rejectWithValue(err.message || 'Не удалось загрузить ленту');
    }
  }
);

const feedsSlice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        const payload = action.payload as TOrdersData;
        state.listItems = payload.orders;
        state.listItemInfo.total = payload.total;
        state.listItemInfo.totalToday = payload.totalToday;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export const feedsReducer = feedsSlice.reducer;
export const selectFeeds = (state: { feeds: FeedsState }) => state.feeds;
