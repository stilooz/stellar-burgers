import { combineReducers } from '@reduxjs/toolkit';
import { ingredientsReducer } from './slices/ingredientsSlice';
import { authReducer } from './slices/authSlice';
import { orderReducer } from './slices/orderSlice';
import { wsFeedReducer } from './slices/wsFeedSlice';
import { wsProfileReducer } from './slices/wsProfileSlice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  auth: authReducer,
  order: orderReducer,
  wsFeed: wsFeedReducer,
  wsProfile: wsProfileReducer
}); 