import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  registerUserApi,
  loginUserApi,
  logoutApi,
  getUserApi,
  updateUserApi,
  forgotPasswordApi,
  resetPasswordApi,
  TRegisterData,
  TLoginData
} from '../../../utils/burger-api';
import { TUser } from '../../../utils/types';
import { setCookie, deleteCookie } from '../../../utils/cookie';

export const registerUser = createAsyncThunk<
  { user: TUser; accessToken: string; refreshToken: string },
  TRegisterData,
  { rejectValue: string }
>('auth/registerUser', async (userData, { rejectWithValue }) => {
  try {
    const data = await registerUserApi(userData);
    setCookie('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'Ошибка регистрации'
    );
  }
});

export const loginUser = createAsyncThunk<
  { user: TUser; accessToken: string; refreshToken: string },
  TLoginData,
  { rejectValue: string }
>('auth/loginUser', async (userData, { rejectWithValue }) => {
  try {
    const data = await loginUserApi(userData);
    setCookie('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'Ошибка входа'
    );
  }
});

export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      deleteCookie('accessToken');
      localStorage.removeItem('refreshToken');
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка выхода'
      );
    }
  }
);

export const getUser = createAsyncThunk<TUser, void, { rejectValue: string }>(
  'auth/getUser',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getUserApi();
      return data.user;
    } catch (error) {
      deleteCookie('accessToken');
      localStorage.removeItem('refreshToken');
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка получения пользователя'
      );
    }
  }
);

export const updateUser = createAsyncThunk<
  TUser,
  Partial<TRegisterData>,
  { rejectValue: string }
>('auth/updateUser', async (userData, { rejectWithValue }) => {
  try {
    const data = await updateUserApi(userData);
    return data.user;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'Ошибка обновления пользователя'
    );
  }
});

export const forgotPassword = createAsyncThunk<
  void,
  { email: string },
  { rejectValue: string }
>('auth/forgotPassword', async ({ email }, { rejectWithValue }) => {
  try {
    await forgotPasswordApi({ email });
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'Ошибка восстановления пароля'
    );
  }
});

export const resetPassword = createAsyncThunk<
  void,
  { password: string; token: string },
  { rejectValue: string }
>('auth/resetPassword', async ({ password, token }, { rejectWithValue }) => {
  try {
    await resetPasswordApi({ password, token });
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'Ошибка сброса пароля'
    );
  }
});
