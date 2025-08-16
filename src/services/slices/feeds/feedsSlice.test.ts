import { configureStore } from '@reduxjs/toolkit';
import feedsReducer, {
  setOrders,
  setTotal,
  setTotalToday,
  setLoading,
  setError,
  clearFeeds
} from './feedsSlice';
import { fetchFeeds } from './feedsApi';
import { TOrder } from '../../../utils/types';

jest.mock('./feedsApi', () => ({
  fetchFeeds: {
    pending: { type: 'feeds/fetchFeeds/pending' },
    fulfilled: { type: 'feeds/fetchFeeds/fulfilled' },
    rejected: { type: 'feeds/fetchFeeds/rejected' }
  }
}));

describe('feedsSlice', () => {
  const initialState = {
    orders: [],
    total: 0,
    totalToday: 0,
    loading: false,
    error: null
  };

  const mockOrder: TOrder = {
    _id: '1',
    ingredients: ['ingredient1', 'ingredient2'],
    status: 'done',
    name: 'Тестовый бургер',
    createdAt: '2024-01-01T12:00:00.000Z',
    updatedAt: '2024-01-01T12:00:00.000Z',
    number: 12345
  };

  const mockOrders: TOrder[] = [
    mockOrder,
    {
      ...mockOrder,
      _id: '2',
      name: 'Второй бургер',
      number: 12346,
      status: 'pending'
    }
  ];

  const mockFeedsData = {
    orders: mockOrders,
    total: 1000,
    totalToday: 50
  };

  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        feeds: feedsReducer
      }
    });
  });

  describe('Начальное состояние', () => {
    it('должно возвращать правильное начальное состояние', () => {
      expect(feedsReducer(undefined, { type: 'unknown' })).toEqual(
        initialState
      );
    });
  });

  describe('Синхронные действия', () => {
    it('должно устанавливать заказы при вызове setOrders', () => {
      const result = feedsReducer(initialState, setOrders(mockOrders));

      expect(result.orders).toEqual(mockOrders);
      expect(result.orders).toHaveLength(2);
    });

    it('должно устанавливать общее количество при вызове setTotal', () => {
      const result = feedsReducer(initialState, setTotal(1000));

      expect(result.total).toBe(1000);
    });

    it('должно устанавливать количество за сегодня при вызове setTotalToday', () => {
      const result = feedsReducer(initialState, setTotalToday(50));

      expect(result.totalToday).toBe(50);
    });

    it('должно устанавливать состояние загрузки при вызове setLoading', () => {
      const result = feedsReducer(initialState, setLoading(true));

      expect(result.loading).toBe(true);
    });

    it('должно устанавливать ошибку при вызове setError', () => {
      const errorMessage = 'Тестовая ошибка';
      const result = feedsReducer(initialState, setError(errorMessage));

      expect(result.error).toBe(errorMessage);
    });

    it('должно очищать ошибку при вызове setError с null', () => {
      const stateWithError = {
        ...initialState,
        error: 'Предыдущая ошибка'
      };

      const result = feedsReducer(stateWithError, setError(null));

      expect(result.error).toBeNull();
    });

    it('должно очищать все данные при вызове clearFeeds', () => {
      const stateWithData = {
        orders: mockOrders,
        total: 1000,
        totalToday: 50,
        loading: false,
        error: 'Какая-то ошибка'
      };

      const result = feedsReducer(stateWithData, clearFeeds());

      expect(result.orders).toEqual([]);
      expect(result.total).toBe(0);
      expect(result.totalToday).toBe(0);
      expect(result.error).toBeNull();
      expect(result.loading).toBe(false);
    });
  });

  describe('Загрузка ленты заказов', () => {
    it('должно устанавливать loading в true при pending', () => {
      const action = { type: fetchFeeds.pending.type };
      const result = feedsReducer(initialState, action);

      expect(result.loading).toBe(true);
      expect(result.error).toBeNull();
    });

    it('должно сохранять данные ленты при успешной загрузке', () => {
      const action = {
        type: fetchFeeds.fulfilled.type,
        payload: mockFeedsData
      };
      const result = feedsReducer(initialState, action);

      expect(result.loading).toBe(false);
      expect(result.orders).toEqual(mockOrders);
      expect(result.total).toBe(1000);
      expect(result.totalToday).toBe(50);
      expect(result.error).toBeNull();
    });

    it('должно сохранять ошибку при неудачной загрузке', () => {
      const action = {
        type: fetchFeeds.rejected.type,
        payload: 'Ошибка сети'
      };
      const result = feedsReducer(initialState, action);

      expect(result.loading).toBe(false);
      expect(result.error).toBe('Ошибка сети');
      expect(result.orders).toEqual([]);
      expect(result.total).toBe(0);
      expect(result.totalToday).toBe(0);
    });

    it('должно использовать дефолтную ошибку если payload отсутствует', () => {
      const action = {
        type: fetchFeeds.rejected.type,
        payload: undefined
      };
      const result = feedsReducer(initialState, action);

      expect(result.error).toBe('Ошибка загрузки ленты заказов');
    });

    it('должно обновлять существующие данные при повторной загрузке', () => {
      const stateWithData = {
        orders: [mockOrder],
        total: 500,
        totalToday: 25,
        loading: false,
        error: null
      };

      const newMockData = {
        orders: mockOrders,
        total: 1500,
        totalToday: 75
      };

      const action = {
        type: fetchFeeds.fulfilled.type,
        payload: newMockData
      };

      const result = feedsReducer(stateWithData, action);

      expect(result.orders).toEqual(mockOrders);
      expect(result.orders).toHaveLength(2);
      expect(result.total).toBe(1500);
      expect(result.totalToday).toBe(75);
    });
  });

  describe('Интеграционные тесты', () => {
    it('должно правильно обрабатывать полный сценарий работы с лентой', () => {
      let state: ReturnType<typeof feedsReducer> = initialState;

      state = feedsReducer(state, { type: fetchFeeds.pending.type });
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();

      state = feedsReducer(state, {
        type: fetchFeeds.fulfilled.type,
        payload: mockFeedsData
      });
      expect(state.loading).toBe(false);
      expect(state.orders).toEqual(mockOrders);
      expect(state.total).toBe(1000);
      expect(state.totalToday).toBe(50);

      const newOrders = [
        ...mockOrders,
        { ...mockOrder, _id: '3', number: 12347 }
      ];
      state = feedsReducer(state, setOrders(newOrders));
      expect(state.orders).toHaveLength(3);

      state = feedsReducer(state, setTotal(1100));
      state = feedsReducer(state, setTotalToday(55));
      expect(state.total).toBe(1100);
      expect(state.totalToday).toBe(55);

      state = feedsReducer(state, setError('Ошибка обновления'));
      expect(state.error).toBe('Ошибка обновления');

      state = feedsReducer(state, clearFeeds());
      expect(state.orders).toEqual([]);
      expect(state.total).toBe(0);
      expect(state.totalToday).toBe(0);
      expect(state.error).toBeNull();
    });

    it('должно правильно обрабатывать ошибку после успешной загрузки', () => {
      let state: ReturnType<typeof feedsReducer> = initialState;

      state = feedsReducer(state, {
        type: fetchFeeds.fulfilled.type,
        payload: mockFeedsData
      });
      expect(state.orders).toHaveLength(2);
      expect(state.error).toBeNull();

      state = feedsReducer(state, {
        type: fetchFeeds.rejected.type,
        payload: 'Ошибка сети'
      });
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Ошибка сети');
      expect(state.orders).toEqual(mockOrders);
      expect(state.total).toBe(1000);
      expect(state.totalToday).toBe(50);
    });

    it('должно правильно обрабатывать пустую ленту', () => {
      const emptyFeedsData = {
        orders: [],
        total: 0,
        totalToday: 0
      };

      const action = {
        type: fetchFeeds.fulfilled.type,
        payload: emptyFeedsData
      };

      const result = feedsReducer(initialState, action);

      expect(result.orders).toEqual([]);
      expect(result.total).toBe(0);
      expect(result.totalToday).toBe(0);
      expect(result.loading).toBe(false);
      expect(result.error).toBeNull();
    });
  });

  describe('Управление состоянием загрузки', () => {
    it('должно правильно переключать состояние загрузки', () => {
      let state: ReturnType<typeof feedsReducer> = initialState;

      state = feedsReducer(state, setLoading(true));
      expect(state.loading).toBe(true);

      state = feedsReducer(state, setLoading(false));
      expect(state.loading).toBe(false);

      state = feedsReducer(state, { type: fetchFeeds.pending.type });
      expect(state.loading).toBe(true);

      state = feedsReducer(state, {
        type: fetchFeeds.fulfilled.type,
        payload: mockFeedsData
      });
      expect(state.loading).toBe(false);
    });
  });
});
