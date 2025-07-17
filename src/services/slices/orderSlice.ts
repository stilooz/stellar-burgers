import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentOrder: null,
  orderDetails: null,
  status: 'idle',
  error: null
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {}
});

export const orderReducer = orderSlice.reducer;
