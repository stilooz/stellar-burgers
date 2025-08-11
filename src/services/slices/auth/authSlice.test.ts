import { configureStore } from '@reduxjs/toolkit';
import authReducer, { clearError, setAuthChecked, logout } from './authSlice';
import {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  updateUser,
  forgotPassword,
  resetPassword
} from './authApi';

jest.mock('./authApi', () => ({
  registerUser: {
    pending: { type: 'auth/registerUser/pending' },
    fulfilled: { type: 'auth/registerUser/fulfilled' },
    rejected: { type: 'auth/registerUser/rejected' }
  },
  loginUser: {
    pending: { type: 'auth/loginUser/pending' },
    fulfilled: { type: 'auth/loginUser/fulfilled' },
    rejected: { type: 'auth/loginUser/rejected' }
  },
  logoutUser: {
    pending: { type: 'auth/logoutUser/pending' },
    fulfilled: { type: 'auth/logoutUser/fulfilled' },
    rejected: { type: 'auth/logoutUser/rejected' }
  },
  getUser: {
    pending: { type: 'auth/getUser/pending' },
    fulfilled: { type: 'auth/getUser/fulfilled' },
    rejected: { type: 'auth/getUser/rejected' }
  },
  updateUser: {
    pending: { type: 'auth/updateUser/pending' },
    fulfilled: { type: 'auth/updateUser/fulfilled' },
    rejected: { type: 'auth/updateUser/rejected' }
  },
  forgotPassword: {
    pending: { type: 'auth/forgotPassword/pending' },
    fulfilled: { type: 'auth/forgotPassword/fulfilled' },
    rejected: { type: 'auth/forgotPassword/rejected' }
  },
  resetPassword: {
    pending: { type: 'auth/resetPassword/pending' },
    fulfilled: { type: 'auth/resetPassword/fulfilled' },
    rejected: { type: 'auth/resetPassword/rejected' }
  }
}));

describe('authSlice', () => {
  const initialState = {
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    authChecked: false,
    loading: false,
    error: null
  };

  const mockUser = {
    email: 'test@example.com',
    name: 'Test User'
  };

  const mockAuthData = {
    user: mockUser,
    accessToken: 'mock-access-token',
    refreshToken: 'mock-refresh-token'
  };

  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        auth: authReducer
      }
    });
  });

  describe('Начальное состояние', () => {
    it('должно возвращать правильное начальное состояние', () => {
      expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });
  });

  describe('Синхронные действия', () => {
    it('должно очищать ошибку при вызове clearError', () => {
      const stateWithError = {
        ...initialState,
        error: 'Тестовая ошибка'
      };

      const result = authReducer(stateWithError, clearError());

      expect(result.error).toBeNull();
    });

    it('должно устанавливать authChecked при вызове setAuthChecked', () => {
      const result = authReducer(initialState, setAuthChecked(true));

      expect(result.authChecked).toBe(true);
    });

    it('должно очищать данные пользователя при вызове logout', () => {
      const stateWithUser = {
        ...initialState,
        user: mockUser,
        accessToken: 'token',
        refreshToken: 'refresh',
        isAuthenticated: true
      };

      const result = authReducer(stateWithUser, logout());

      expect(result.user).toBeNull();
      expect(result.accessToken).toBeNull();
      expect(result.refreshToken).toBeNull();
      expect(result.isAuthenticated).toBe(false);
      expect(result.authChecked).toBe(true);
    });
  });

  describe('Регистрация пользователя', () => {
    it('должно устанавливать loading в true при pending', () => {
      const action = { type: registerUser.pending.type };
      const result = authReducer(initialState, action);

      expect(result.loading).toBe(true);
      expect(result.error).toBeNull();
    });

    it('должно сохранять данные пользователя при успешной регистрации', () => {
      const action = {
        type: registerUser.fulfilled.type,
        payload: mockAuthData
      };
      const result = authReducer(initialState, action);

      expect(result.loading).toBe(false);
      expect(result.user).toEqual(mockUser);
      expect(result.accessToken).toBe('mock-access-token');
      expect(result.refreshToken).toBe('mock-refresh-token');
      expect(result.isAuthenticated).toBe(true);
      expect(result.authChecked).toBe(true);
      expect(result.error).toBeNull();
    });

    it('должно сохранять ошибку при неудачной регистрации', () => {
      const action = {
        type: registerUser.rejected.type,
        payload: 'Ошибка регистрации'
      };
      const result = authReducer(initialState, action);

      expect(result.loading).toBe(false);
      expect(result.error).toBe('Ошибка регистрации');
    });

    it('должно использовать дефолтную ошибку если payload отсутствует', () => {
      const action = {
        type: registerUser.rejected.type,
        payload: undefined
      };
      const result = authReducer(initialState, action);

      expect(result.error).toBe('Ошибка регистрации');
    });
  });

  describe('Вход пользователя', () => {
    it('должно устанавливать loading в true при pending', () => {
      const action = { type: loginUser.pending.type };
      const result = authReducer(initialState, action);

      expect(result.loading).toBe(true);
      expect(result.error).toBeNull();
    });

    it('должно сохранять данные пользователя при успешном входе', () => {
      const action = {
        type: loginUser.fulfilled.type,
        payload: mockAuthData
      };
      const result = authReducer(initialState, action);

      expect(result.loading).toBe(false);
      expect(result.user).toEqual(mockUser);
      expect(result.accessToken).toBe('mock-access-token');
      expect(result.refreshToken).toBe('mock-refresh-token');
      expect(result.isAuthenticated).toBe(true);
      expect(result.authChecked).toBe(true);
    });

    it('должно сохранять ошибку при неудачном входе', () => {
      const action = {
        type: loginUser.rejected.type,
        payload: 'Неверные данные'
      };
      const result = authReducer(initialState, action);

      expect(result.loading).toBe(false);
      expect(result.error).toBe('Неверные данные');
    });
  });

  describe('Выход пользователя', () => {
    it('должно устанавливать loading в true при pending', () => {
      const action = { type: logoutUser.pending.type };
      const result = authReducer(initialState, action);

      expect(result.loading).toBe(true);
      expect(result.error).toBeNull();
    });

    it('должно очищать данные пользователя при успешном выходе', () => {
      const stateWithUser = {
        ...initialState,
        user: mockUser,
        accessToken: 'token',
        refreshToken: 'refresh',
        isAuthenticated: true
      };

      const action = { type: logoutUser.fulfilled.type };
      const result = authReducer(stateWithUser, action);

      expect(result.loading).toBe(false);
      expect(result.user).toBeNull();
      expect(result.accessToken).toBeNull();
      expect(result.refreshToken).toBeNull();
      expect(result.isAuthenticated).toBe(false);
      expect(result.authChecked).toBe(true);
    });

    it('должно сохранять ошибку при неудачном выходе', () => {
      const action = {
        type: logoutUser.rejected.type,
        payload: 'Ошибка выхода'
      };
      const result = authReducer(initialState, action);

      expect(result.loading).toBe(false);
      expect(result.error).toBe('Ошибка выхода');
    });
  });

  describe('Получение данных пользователя', () => {
    it('должно устанавливать loading в true при pending', () => {
      const action = { type: getUser.pending.type };
      const result = authReducer(initialState, action);

      expect(result.loading).toBe(true);
    });

    it('должно сохранять данные пользователя при успешном получении', () => {
      const action = {
        type: getUser.fulfilled.type,
        payload: mockUser
      };
      const result = authReducer(initialState, action);

      expect(result.loading).toBe(false);
      expect(result.user).toEqual(mockUser);
      expect(result.isAuthenticated).toBe(true);
      expect(result.authChecked).toBe(true);
    });

    it('должно очищать данные при неудачном получении', () => {
      const stateWithUser = {
        ...initialState,
        user: mockUser,
        accessToken: 'token',
        refreshToken: 'refresh',
        isAuthenticated: true
      };

      const action = { type: getUser.rejected.type };
      const result = authReducer(stateWithUser, action);

      expect(result.loading).toBe(false);
      expect(result.isAuthenticated).toBe(false);
      expect(result.authChecked).toBe(true);
      expect(result.user).toBeNull();
      expect(result.accessToken).toBeNull();
      expect(result.refreshToken).toBeNull();
    });
  });

  describe('Обновление пользователя', () => {
    it('должно устанавливать loading в true при pending', () => {
      const action = { type: updateUser.pending.type };
      const result = authReducer(initialState, action);

      expect(result.loading).toBe(true);
      expect(result.error).toBeNull();
    });

    it('должно обновлять данные пользователя при успешном обновлении', () => {
      const updatedUser = { ...mockUser, name: 'Updated Name' };
      const action = {
        type: updateUser.fulfilled.type,
        payload: updatedUser
      };
      const result = authReducer(initialState, action);

      expect(result.loading).toBe(false);
      expect(result.user).toEqual(updatedUser);
    });

    it('должно сохранять ошибку при неудачном обновлении', () => {
      const action = {
        type: updateUser.rejected.type,
        payload: 'Ошибка обновления'
      };
      const result = authReducer(initialState, action);

      expect(result.loading).toBe(false);
      expect(result.error).toBe('Ошибка обновления');
    });
  });

  describe('Восстановление пароля', () => {
    it('должно устанавливать loading в true при pending', () => {
      const action = { type: forgotPassword.pending.type };
      const result = authReducer(initialState, action);

      expect(result.loading).toBe(true);
      expect(result.error).toBeNull();
    });

    it('должно сбрасывать loading при успешном восстановлении', () => {
      const stateWithLoading = { ...initialState, loading: true };
      const action = { type: forgotPassword.fulfilled.type };
      const result = authReducer(stateWithLoading, action);

      expect(result.loading).toBe(false);
    });

    it('должно сохранять ошибку при неудачном восстановлении', () => {
      const action = {
        type: forgotPassword.rejected.type,
        payload: 'Email не найден'
      };
      const result = authReducer(initialState, action);

      expect(result.loading).toBe(false);
      expect(result.error).toBe('Email не найден');
    });
  });

  describe('Сброс пароля', () => {
    it('должно устанавливать loading в true при pending', () => {
      const action = { type: resetPassword.pending.type };
      const result = authReducer(initialState, action);

      expect(result.loading).toBe(true);
      expect(result.error).toBeNull();
    });

    it('должно сбрасывать loading при успешном сбросе', () => {
      const stateWithLoading = { ...initialState, loading: true };
      const action = { type: resetPassword.fulfilled.type };
      const result = authReducer(stateWithLoading, action);

      expect(result.loading).toBe(false);
    });

    it('должно сохранять ошибку при неудачном сбросе', () => {
      const action = {
        type: resetPassword.rejected.type,
        payload: 'Неверный код'
      };
      const result = authReducer(initialState, action);

      expect(result.loading).toBe(false);
      expect(result.error).toBe('Неверный код');
    });
  });
});
