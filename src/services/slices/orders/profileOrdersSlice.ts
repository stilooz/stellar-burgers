import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getOrdersApi } from '../../../utils/burger-api';
import { TOrder } from '../../../utils/types';

interface ProfileOrdersState {
  orders: TOrder[];
  loading: boolean;
  error: string | null;
}

const initialState: ProfileOrdersState = {
  orders: [],
  loading: false,
  error: null
};

export const fetchProfileOrders = createAsyncThunk<
  TOrder[],
  void,
  { rejectValue: string }
>('profileOrders/fetchOrders', async (_, { rejectWithValue }) => {
  try {
    const orders = await getOrdersApi();
    return orders;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'Ошибка загрузки заказов'
    );
  }
});

const profileOrdersSlice = createSlice({
  name: 'profileOrders',
  initialState,
  reducers: {
    clearProfileOrders: (state) => {
      state.orders = [];
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfileOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
        state.error = null;
      })
      .addCase(fetchProfileOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Ошибка загрузки заказов';
      });
  }
});

export const { clearProfileOrders } = profileOrdersSlice.actions;

export default profileOrdersSlice.reducer;
