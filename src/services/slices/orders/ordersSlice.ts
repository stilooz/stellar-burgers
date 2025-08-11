import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '../../../utils/types';
import { createOrder, getOrderByNumber } from './ordersApi';

interface OrdersState {
  currentOrder: TOrder | null;
  orderDetails: TOrder | null;
  loading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  currentOrder: null,
  orderDetails: null,
  loading: false,
  error: null
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setCurrentOrder: (state, action: PayloadAction<TOrder | null>) => {
      state.currentOrder = action.payload;
    },
    setOrderDetails: (state, action: PayloadAction<TOrder | null>) => {
      state.orderDetails = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearOrder: (state) => {
      state.currentOrder = null;
      state.error = null;
    },
    clearOrderDetails: (state) => {
      state.orderDetails = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Ошибка создания заказа';
      })
      .addCase(getOrderByNumber.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.loading = false;
        state.orderDetails = action.payload;
        state.error = null;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Ошибка получения заказа';
      });
  }
});

export const {
  setCurrentOrder,
  setOrderDetails,
  setLoading,
  setError,
  clearOrder,
  clearOrderDetails
} = ordersSlice.actions;

export default ordersSlice.reducer;
