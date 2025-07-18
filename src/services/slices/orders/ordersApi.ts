import { createAsyncThunk } from '@reduxjs/toolkit';
import { orderBurgerApi, getOrderByNumberApi } from '../../../utils/burger-api';
import { TOrder } from '../../../utils/types';

export const createOrder = createAsyncThunk<
  TOrder,
  string[],
  { rejectValue: string }
>('orders/createOrder', async (ingredientIds, { rejectWithValue }) => {
  try {
    const response = await orderBurgerApi(ingredientIds);
    return response.order;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'Ошибка создания заказа'
    );
  }
});

export const getOrderByNumber = createAsyncThunk<
  TOrder,
  number,
  { rejectValue: string }
>('orders/getOrderByNumber', async (orderNumber, { rejectWithValue }) => {
  try {
    const response = await getOrderByNumberApi(orderNumber);
    return response.orders[0];
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'Ошибка получения заказа'
    );
  }
});
