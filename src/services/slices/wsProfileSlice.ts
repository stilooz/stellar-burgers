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
  reducers: {
    connectProfileSocket: (state) => {
      state.wsStatus = 'connecting';
    },
    disconnectProfileSocket: (state) => {
      state.wsStatus = 'offline';
    },
    setProfileData: (state, action) => {
      state.orders = action.payload.orders;
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
      state.wsStatus = 'online';
    },
    setProfileError: (state) => {
      state.wsStatus = 'error';
    }
  }
});

export const {
  connectProfileSocket,
  disconnectProfileSocket,
  setProfileData,
  setProfileError
} = wsProfileSlice.actions;
export const wsProfileReducer = wsProfileSlice.reducer;
