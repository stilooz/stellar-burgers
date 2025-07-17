import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  orders: [],
  total: 0,
  totalToday: 0,
  wsStatus: 'offline'
};

const wsProfileSlice = createSlice({
  name: 'wsProfile',
  initialState,
  reducers: {},
});

export const wsProfileReducer = wsProfileSlice.reducer; 