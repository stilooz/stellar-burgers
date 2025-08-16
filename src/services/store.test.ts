import { configureStore, combineReducers } from '@reduxjs/toolkit';
import store from './store';
import { setTotal } from './slices/feeds/feedsSlice';
import { clearConstructor } from './slices/constructor/constructorSlice';
import ingredientsReducer from './slices/ingredients/ingredientsSlice';
import authReducer from './slices/auth/authSlice';
import constructorReducer from './slices/constructor/constructorSlice';
import ordersReducer from './slices/orders/ordersSlice';
import feedsReducer from './slices/feeds/feedsSlice';
import profileOrdersReducer from './slices/orders/profileOrdersSlice';

const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  auth: authReducer,
  burgerConstructor: constructorReducer,
  orders: ordersReducer,
  feeds: feedsReducer,
  profileOrders: profileOrdersReducer
});

describe('rootReducer', () => {
  it('должен возвращать правильное начальное состояние при неизвестном экшене', () => {
    const unknownAction = { type: 'UNKNOWN_ACTION' };

    const result = rootReducer(undefined, unknownAction);

    expect(result).toHaveProperty('ingredients');
    expect(result).toHaveProperty('auth');
    expect(result).toHaveProperty('burgerConstructor');
    expect(result).toHaveProperty('orders');
    expect(result).toHaveProperty('feeds');
    expect(result).toHaveProperty('profileOrders');

    expect(result.ingredients).toEqual({
      ingredients: [],
      loading: false,
      error: null
    });

    expect(result.auth).toEqual({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      authChecked: false,
      loading: false,
      error: null
    });

    expect(result.burgerConstructor).toEqual({
      bun: null,
      ingredients: [],
      totalPrice: 0
    });

    expect(result.orders).toEqual({
      currentOrder: null,
      orderDetails: null,
      loading: false,
      error: null
    });

    expect(result.feeds).toEqual({
      orders: [],
      total: 0,
      totalToday: 0,
      loading: false,
      error: null
    });

    expect(result.profileOrders).toEqual({
      orders: [],
      loading: false,
      error: null
    });
  });

  it('должен правильно инициализировать основной store', () => {
    const state = store.getState();

    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('auth');
    expect(state).toHaveProperty('constructor');
    expect(state).toHaveProperty('orders');
    expect(state).toHaveProperty('feeds');
    expect(state).toHaveProperty('profileOrders');

    expect(Array.isArray(state.ingredients.ingredients)).toBe(true);
    expect(typeof state.auth.isAuthenticated).toBe('boolean');
    expect(Array.isArray(state.feeds.orders)).toBe(true);
    expect(Array.isArray(state.profileOrders.orders)).toBe(true);
  });

  it('должен корректно обрабатывать экшены всех слайсов', () => {
    const testStore = configureStore({
      reducer: rootReducer,
      devTools: false,
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: false
        })
    });

    testStore.dispatch(clearConstructor());
    expect(testStore.getState().burgerConstructor.bun).toBeNull();
    expect(testStore.getState().burgerConstructor.ingredients).toEqual([]);

    testStore.dispatch(setTotal(100));
    expect(testStore.getState().feeds.total).toBe(100);
  });

  it('должен сохранять изоляцию между слайсами', () => {
    const testStore = configureStore({
      reducer: rootReducer,
      devTools: false,
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: false
        })
    });

    testStore.dispatch(setTotal(500));

    const state = testStore.getState();

    expect(state.feeds.total).toBe(500);
    expect(state.auth.loading).toBe(false);
    expect(state.orders.loading).toBe(false);
    expect(state.profileOrders.loading).toBe(false);
    expect(state.burgerConstructor.totalPrice).toBe(0);
  });
});
