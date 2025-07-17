import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  registerUserApi,
  loginUserApi,
  logoutApi,
  updateUserApi,
  forgotPasswordApi,
  getUserApi,
  TRegisterData,
  TLoginData
} from '../../utils/burger-api';
import { TUser } from '@utils-types';

interface AuthState {
  userData: TUser | null;
  isLoading: boolean;
  registerError: string | null;
  loginError: string | null;
  logoutError: string | null;
  updatedError: string | null;
  forgotError: string | null;
  checkAuthError: string | null;
  authChecked: boolean;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  userData: null,
  isLoading: false,
  registerError: null,
  loginError: null,
  logoutError: null,
  updatedError: null,
  forgotError: null,
  checkAuthError: null,
  authChecked: false,
  isAuthenticated: false
};

// thunks
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (data: TRegisterData, { rejectWithValue }) => {
    try {
      return await registerUserApi(data);
    } catch (err: any) {
      return rejectWithValue(err.message || 'Ошибка регистрации');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (data: TLoginData, { rejectWithValue }) => {
    try {
      return await loginUserApi(data);
    } catch (err: any) {
      return rejectWithValue(err.message || 'Ошибка входа');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      return await logoutApi();
    } catch (err: any) {
      return rejectWithValue(err.message || 'Ошибка выхода');
    }
  }
);

export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (user: Partial<TRegisterData>, { rejectWithValue }) => {
    try {
      return await updateUserApi(user);
    } catch (err: any) {
      return rejectWithValue(err.message || 'Ошибка обновления');
    }
  }
);

export const forgotUserPass = createAsyncThunk(
  'auth/forgotUserPass',
  async (email: string, { rejectWithValue }) => {
    try {
      return await forgotPasswordApi({ email });
    } catch (err: any) {
      return rejectWithValue(err.message || 'Ошибка восстановления пароля');
    }
  }
);

export const getUser = createAsyncThunk(
  'auth/getUser',
  async (_, { rejectWithValue }) => {
    try {
      return await getUserApi();
    } catch (err: any) {
      return rejectWithValue(err.message || 'Ошибка проверки сессии');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.registerError = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userData = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.registerError = action.payload as string;
      });

    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.loginError = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userData = action.payload.user;
        state.isAuthenticated = true;
        state.authChecked = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.loginError = action.payload as string;
        state.authChecked = true;
      });

    builder
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
        state.logoutError = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.userData = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.logoutError = action.payload as string;
      });

    builder
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.updatedError = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userData = action.payload.user;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.updatedError = action.payload as string;
      });

    builder
      .addCase(forgotUserPass.pending, (state) => {
        state.isLoading = true;
        state.forgotError = null;
      })
      .addCase(forgotUserPass.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(forgotUserPass.rejected, (state, action) => {
        state.isLoading = false;
        state.forgotError = action.payload as string;
      });

    builder
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
        state.checkAuthError = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userData = action.payload.user;
        state.isAuthenticated = true;
        state.authChecked = true;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isLoading = false;
        state.checkAuthError = action.payload as string;
        state.authChecked = true;
      });
  }
});

export const authReducer = authSlice.reducer;

export const selectAuth = (state: { auth: AuthState }) => state.auth;
