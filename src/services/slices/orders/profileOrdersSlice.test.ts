import { configureStore } from '@reduxjs/toolkit';
import profileOrdersReducer, {
  fetchProfileOrders,
  clearProfileOrders
} from './profileOrdersSlice';
import { TOrder } from '../../../utils/types';

jest.mock('../../../utils/burger-api', () => ({
  getOrdersApi: jest.fn()
}));

describe('profileOrdersSlice', () => {
  const initialState = {
    orders: [],
    loading: false,
    error: null
  };

  const mockOrder: TOrder = {
    _id: '1',
    ingredients: ['ingredient1', 'ingredient2'],
    status: 'done',
    name: 'Профильный бургер',
    createdAt: '2024-01-01T12:00:00.000Z',
    updatedAt: '2024-01-01T12:00:00.000Z',
    number: 12345
  };

  const mockOrders: TOrder[] = [
    mockOrder,
    {
      ...mockOrder,
      _id: '2',
      name: 'Второй профильный бургер',
      number: 12346,
      status: 'pending'
    },
    {
      ...mockOrder,
      _id: '3',
      name: 'Третий профильный бургер',
      number: 12347,
      status: 'created'
    }
  ];

  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        profileOrders: profileOrdersReducer
      }
    });
  });

  describe('Начальное состояние', () => {
    it('должно возвращать правильное начальное состояние', () => {
      expect(profileOrdersReducer(undefined, { type: 'unknown' })).toEqual(
        initialState
      );
    });
  });

  describe('Синхронные действия', () => {
    it('должно очищать заказы профиля при вызове clearProfileOrders', () => {
      const stateWithOrders = {
        orders: mockOrders,
        loading: false,
        error: 'Какая-то ошибка'
      };

      const result = profileOrdersReducer(
        stateWithOrders,
        clearProfileOrders()
      );

      expect(result.orders).toEqual([]);
      expect(result.error).toBeNull();
      expect(result.loading).toBe(false);
    });

    it('должно очищать заказы из пустого состояния', () => {
      const result = profileOrdersReducer(initialState, clearProfileOrders());

      expect(result).toEqual(initialState);
    });
  });

  describe('Загрузка заказов профиля', () => {
    it('должно устанавливать loading в true при pending', () => {
      const action = { type: fetchProfileOrders.pending.type };
      const result = profileOrdersReducer(initialState, action);

      expect(result.loading).toBe(true);
      expect(result.error).toBeNull();
    });

    it('должно сохранять заказы при успешной загрузке', () => {
      const action = {
        type: fetchProfileOrders.fulfilled.type,
        payload: mockOrders
      };
      const result = profileOrdersReducer(initialState, action);

      expect(result.loading).toBe(false);
      expect(result.orders).toEqual(mockOrders);
      expect(result.orders).toHaveLength(3);
      expect(result.error).toBeNull();
    });

    it('должно сохранять ошибку при неудачной загрузке', () => {
      const action = {
        type: fetchProfileOrders.rejected.type,
        payload: 'Ошибка авторизации'
      };
      const result = profileOrdersReducer(initialState, action);

      expect(result.loading).toBe(false);
      expect(result.error).toBe('Ошибка авторизации');
      expect(result.orders).toEqual([]);
    });

    it('должно использовать дефолтную ошибку если payload отсутствует', () => {
      const action = {
        type: fetchProfileOrders.rejected.type,
        payload: undefined
      };
      const result = profileOrdersReducer(initialState, action);

      expect(result.error).toBe('Ошибка загрузки заказов');
    });

    it('должно обновлять существующие заказы при повторной загрузке', () => {
      const stateWithOrders = {
        orders: [mockOrder],
        loading: false,
        error: null
      };

      const newOrders = [
        { ...mockOrder, _id: '4', number: 12348 },
        { ...mockOrder, _id: '5', number: 12349 }
      ];

      const action = {
        type: fetchProfileOrders.fulfilled.type,
        payload: newOrders
      };

      const result = profileOrdersReducer(stateWithOrders, action);

      expect(result.orders).toEqual(newOrders);
      expect(result.orders).toHaveLength(2);
      expect(result.loading).toBe(false);
      expect(result.error).toBeNull();
    });

    it('должно очищать предыдущую ошибку при новой загрузке', () => {
      const stateWithError = {
        orders: [],
        loading: false,
        error: 'Предыдущая ошибка'
      };

      const action = { type: fetchProfileOrders.pending.type };
      const result = profileOrdersReducer(stateWithError, action);

      expect(result.loading).toBe(true);
      expect(result.error).toBeNull();
    });
  });

  describe('Обработка разных статусов заказов', () => {
    it('должно правильно обрабатывать заказы с разными статусами', () => {
      const ordersWithDifferentStatuses: TOrder[] = [
        { ...mockOrder, _id: '1', status: 'pending', name: 'Ожидающий заказ' },
        { ...mockOrder, _id: '2', status: 'done', name: 'Готовый заказ' },
        { ...mockOrder, _id: '3', status: 'created', name: 'Созданный заказ' }
      ];

      const action = {
        type: fetchProfileOrders.fulfilled.type,
        payload: ordersWithDifferentStatuses
      };

      const result = profileOrdersReducer(initialState, action);

      expect(result.orders).toHaveLength(3);
      expect(result.orders[0].status).toBe('pending');
      expect(result.orders[1].status).toBe('done');
      expect(result.orders[2].status).toBe('created');
    });

    it('должно сохранять порядок заказов', () => {
      const orderedOrders = [
        { ...mockOrder, _id: '1', number: 100, name: 'Первый' },
        { ...mockOrder, _id: '2', number: 200, name: 'Второй' },
        { ...mockOrder, _id: '3', number: 300, name: 'Третий' }
      ];

      const action = {
        type: fetchProfileOrders.fulfilled.type,
        payload: orderedOrders
      };

      const result = profileOrdersReducer(initialState, action);

      expect(result.orders[0].name).toBe('Первый');
      expect(result.orders[1].name).toBe('Второй');
      expect(result.orders[2].name).toBe('Третий');
    });
  });

  describe('Обработка пустых данных', () => {
    it('должно правильно обрабатывать пустой массив заказов', () => {
      const action = {
        type: fetchProfileOrders.fulfilled.type,
        payload: []
      };

      const result = profileOrdersReducer(initialState, action);

      expect(result.loading).toBe(false);
      expect(result.orders).toEqual([]);
      expect(result.error).toBeNull();
    });

    it('должно заменять существующие заказы пустым массивом', () => {
      const stateWithOrders = {
        orders: mockOrders,
        loading: false,
        error: null
      };

      const action = {
        type: fetchProfileOrders.fulfilled.type,
        payload: []
      };

      const result = profileOrdersReducer(stateWithOrders, action);

      expect(result.orders).toEqual([]);
      expect(result.loading).toBe(false);
      expect(result.error).toBeNull();
    });
  });

  describe('Интеграционные тесты', () => {
    it('должно правильно обрабатывать полный сценарий работы с заказами профиля', () => {
      let state: ReturnType<typeof profileOrdersReducer> = initialState;

      state = profileOrdersReducer(state, {
        type: fetchProfileOrders.pending.type
      });
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
      expect(state.orders).toEqual([]);

      state = profileOrdersReducer(state, {
        type: fetchProfileOrders.fulfilled.type,
        payload: mockOrders
      });
      expect(state.loading).toBe(false);
      expect(state.orders).toEqual(mockOrders);
      expect(state.error).toBeNull();

      state = profileOrdersReducer(state, clearProfileOrders());
      expect(state.orders).toEqual([]);
      expect(state.error).toBeNull();
      expect(state.loading).toBe(false);

      state = profileOrdersReducer(state, {
        type: fetchProfileOrders.pending.type
      });
      expect(state.loading).toBe(true);

      state = profileOrdersReducer(state, {
        type: fetchProfileOrders.rejected.type,
        payload: 'Токен истек'
      });
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Токен истек');
      expect(state.orders).toEqual([]);
    });

    it('должно правильно обрабатывать обновление заказов', () => {
      let state: ReturnType<typeof profileOrdersReducer> = initialState;

      state = profileOrdersReducer(state, {
        type: fetchProfileOrders.fulfilled.type,
        payload: [mockOrders[0]]
      });
      expect(state.orders).toHaveLength(1);

      const updatedOrders = [
        mockOrders[0],
        { ...mockOrders[0], _id: '4', status: 'done' }
      ];
      state = profileOrdersReducer(state, {
        type: fetchProfileOrders.fulfilled.type,
        payload: updatedOrders
      });
      expect(state.orders).toHaveLength(2);
      expect(state.orders[1].status).toBe('done');

      const finalOrders = [
        { ...mockOrders[0], status: 'done' },
        { ...mockOrders[0], _id: '4', status: 'done' }
      ];
      state = profileOrdersReducer(state, {
        type: fetchProfileOrders.fulfilled.type,
        payload: finalOrders
      });
      expect(state.orders).toHaveLength(2);
      expect(state.orders[0].status).toBe('done');
      expect(state.orders[1].status).toBe('done');
    });

    it('должно правильно обрабатывать ошибки после успешной загрузки', () => {
      let state: ReturnType<typeof profileOrdersReducer> = initialState;

      state = profileOrdersReducer(state, {
        type: fetchProfileOrders.fulfilled.type,
        payload: mockOrders
      });
      expect(state.orders).toHaveLength(3);
      expect(state.error).toBeNull();

      state = profileOrdersReducer(state, {
        type: fetchProfileOrders.rejected.type,
        payload: 'Сервер недоступен'
      });
      expect(state.error).toBe('Сервер недоступен');
      expect(state.loading).toBe(false);
      expect(state.orders).toEqual(mockOrders);

      state = profileOrdersReducer(state, clearProfileOrders());
      expect(state.orders).toEqual([]);
      expect(state.error).toBeNull();
    });
  });

  describe('Проверка структуры заказов профиля', () => {
    it('должно сохранять все поля заказа профиля', () => {
      const action = {
        type: fetchProfileOrders.fulfilled.type,
        payload: [mockOrder]
      };

      const result = profileOrdersReducer(initialState, action);
      const savedOrder = result.orders[0];

      expect(savedOrder._id).toBe(mockOrder._id);
      expect(savedOrder.ingredients).toEqual(mockOrder.ingredients);
      expect(savedOrder.status).toBe(mockOrder.status);
      expect(savedOrder.name).toBe(mockOrder.name);
      expect(savedOrder.createdAt).toBe(mockOrder.createdAt);
      expect(savedOrder.updatedAt).toBe(mockOrder.updatedAt);
      expect(savedOrder.number).toBe(mockOrder.number);
    });

    it('должно правильно обрабатывать заказы с различными ингредиентами', () => {
      const ordersWithDifferentIngredients = [
        {
          ...mockOrder,
          _id: '1',
          ingredients: ['bun1', 'main1', 'sauce1'],
          name: 'Классический бургер'
        },
        {
          ...mockOrder,
          _id: '2',
          ingredients: ['bun2', 'main1', 'main2', 'sauce1', 'sauce2'],
          name: 'Двойной бургер'
        },
        {
          ...mockOrder,
          _id: '3',
          ingredients: ['bun1'],
          name: 'Простая булка'
        }
      ];

      const action = {
        type: fetchProfileOrders.fulfilled.type,
        payload: ordersWithDifferentIngredients
      };

      const result = profileOrdersReducer(initialState, action);

      expect(result.orders[0].ingredients).toHaveLength(3);
      expect(result.orders[1].ingredients).toHaveLength(5);
      expect(result.orders[2].ingredients).toHaveLength(1);
    });
  });

  describe('Управление состоянием загрузки', () => {
    it('должно правильно переключать состояние загрузки', () => {
      let state: ReturnType<typeof profileOrdersReducer> = initialState;

      state = profileOrdersReducer(state, {
        type: fetchProfileOrders.pending.type
      });
      expect(state.loading).toBe(true);

      state = profileOrdersReducer(state, {
        type: fetchProfileOrders.fulfilled.type,
        payload: mockOrders
      });
      expect(state.loading).toBe(false);

      state = profileOrdersReducer(state, clearProfileOrders());
      expect(state.loading).toBe(false);
    });
  });
});
