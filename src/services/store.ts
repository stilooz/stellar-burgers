import { configureStore, combineReducers } from '@reduxjs/toolkit';
import ingredientsReducer from './slices/ingredients/ingredientsSlice';
import authReducer from './slices/auth/authSlice';
import constructorReducer from './slices/constructor/constructorSlice';
import ordersReducer from './slices/orders/ordersSlice';
import feedsReducer from './slices/feeds/feedsSlice';
import profileOrdersReducer from './slices/orders/profileOrdersSlice';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  auth: authReducer,
  constructor: constructorReducer,
  orders: ordersReducer,
  feeds: feedsReducer,
  profileOrders: profileOrdersReducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
