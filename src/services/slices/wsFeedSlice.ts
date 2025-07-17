import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  orders: [],
  total: 0,
  totalToday: 0,
  wsStatus: 'offline'
};

const wsFeedSlice = createSlice({
  name: 'wsFeed',
  initialState,
  reducers: {},
});

export const wsFeedReducer = wsFeedSlice.reducer; 