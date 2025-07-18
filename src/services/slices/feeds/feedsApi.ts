import { createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi } from '../../../utils/burger-api';
import { TOrder } from '../../../utils/types';

interface FeedsResponse {
  orders: TOrder[];
  total: number;
  totalToday: number;
}

export const fetchFeeds = createAsyncThunk<
  FeedsResponse,
  void,
  { rejectValue: string }
>('feeds/fetchFeeds', async (_, { rejectWithValue }) => {
  try {
    const data = await getFeedsApi();
    return {
      orders: data.orders,
      total: data.total,
      totalToday: data.totalToday
    };
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'Ошибка загрузки ленты заказов'
    );
  }
});
