import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '../../../utils/types';
import { fetchFeeds } from './feedsApi';

interface FeedsState {
  orders: TOrder[];
  total: number;
  totalToday: number;
  loading: boolean;
  error: string | null;
}

const initialState: FeedsState = {
  orders: [],
  total: 0,
  totalToday: 0,
  loading: false,
  error: null
};

const feedsSlice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {
    setOrders: (state, action: PayloadAction<TOrder[]>) => {
      state.orders = action.payload;
    },
    setTotal: (state, action: PayloadAction<number>) => {
      state.total = action.payload;
    },
    setTotalToday: (state, action: PayloadAction<number>) => {
      state.totalToday = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearFeeds: (state) => {
      state.orders = [];
      state.total = 0;
      state.totalToday = 0;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
        state.error = null;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Ошибка загрузки ленты заказов';
      });
  }
});

export const {
  setOrders,
  setTotal,
  setTotalToday,
  setLoading,
  setError,
  clearFeeds
} = feedsSlice.actions;

export default feedsSlice.reducer;
