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
  reducers: {
    connectFeedSocket: (state) => {
      state.wsStatus = 'connecting';
    },
    disconnectFeedSocket: (state) => {
      state.wsStatus = 'offline';
    },
    setFeedData: (state, action) => {
      state.orders = action.payload.orders;
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
      state.wsStatus = 'online';
    },
    setFeedError: (state) => {
      state.wsStatus = 'error';
    }
  },
});

export const { connectFeedSocket, disconnectFeedSocket, setFeedData, setFeedError } = wsFeedSlice.actions;
export const wsFeedReducer = wsFeedSlice.reducer; 