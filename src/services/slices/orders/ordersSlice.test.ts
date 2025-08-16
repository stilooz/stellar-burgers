import { configureStore } from '@reduxjs/toolkit';
import ordersReducer, {
  setCurrentOrder,
  setOrderDetails,
  setLoading,
  setError,
  clearOrder,
  clearOrderDetails
} from './ordersSlice';
import { createOrder, getOrderByNumber } from './ordersApi';
import { TOrder } from '../../../utils/types';

jest.mock('./ordersApi', () => ({
  createOrder: {
    pending: { type: 'orders/createOrder/pending' },
    fulfilled: { type: 'orders/createOrder/fulfilled' },
    rejected: { type: 'orders/createOrder/rejected' }
  },
  getOrderByNumber: {
    pending: { type: 'orders/getOrderByNumber/pending' },
    fulfilled: { type: 'orders/getOrderByNumber/fulfilled' },
    rejected: { type: 'orders/getOrderByNumber/rejected' }
  }
}));

describe('ordersSlice', () => {
  const initialState = {
    currentOrder: null,
    orderDetails: null,
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

  const mockOrderDetails: TOrder = {
    _id: '2',
    ingredients: ['ingredient3', 'ingredient4'],
    status: 'pending',
    name: 'Детальный заказ',
    createdAt: '2024-01-02T12:00:00.000Z',
    updatedAt: '2024-01-02T12:00:00.000Z',
    number: 12346
  };

  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        orders: ordersReducer
      }
    });
  });

  describe('Начальное состояние', () => {
    it('должно возвращать правильное начальное состояние', () => {
      expect(ordersReducer(undefined, { type: 'unknown' })).toEqual(
        initialState
      );
    });
  });

  describe('Синхронные действия', () => {
    it('должно устанавливать текущий заказ при вызове setCurrentOrder', () => {
      const result = ordersReducer(initialState, setCurrentOrder(mockOrder));

      expect(result.currentOrder).toEqual(mockOrder);
    });

    it('должно очищать текущий заказ при вызове setCurrentOrder с null', () => {
      const stateWithOrder = {
        ...initialState,
        currentOrder: mockOrder
      };

      const result = ordersReducer(stateWithOrder, setCurrentOrder(null));

      expect(result.currentOrder).toBeNull();
    });

    it('должно устанавливать детали заказа при вызове setOrderDetails', () => {
      const result = ordersReducer(
        initialState,
        setOrderDetails(mockOrderDetails)
      );

      expect(result.orderDetails).toEqual(mockOrderDetails);
    });

    it('должно очищать детали заказа при вызове setOrderDetails с null', () => {
      const stateWithOrderDetails = {
        ...initialState,
        orderDetails: mockOrderDetails
      };

      const result = ordersReducer(
        stateWithOrderDetails,
        setOrderDetails(null)
      );

      expect(result.orderDetails).toBeNull();
    });

    it('должно устанавливать состояние загрузки при вызове setLoading', () => {
      const result = ordersReducer(initialState, setLoading(true));

      expect(result.loading).toBe(true);
    });

    it('должно устанавливать ошибку при вызове setError', () => {
      const errorMessage = 'Тестовая ошибка';
      const result = ordersReducer(initialState, setError(errorMessage));

      expect(result.error).toBe(errorMessage);
    });

    it('должно очищать ошибку при вызове setError с null', () => {
      const stateWithError = {
        ...initialState,
        error: 'Предыдущая ошибка'
      };

      const result = ordersReducer(stateWithError, setError(null));

      expect(result.error).toBeNull();
    });

    it('должно очищать заказ и ошибку при вызове clearOrder', () => {
      const stateWithData = {
        currentOrder: mockOrder,
        orderDetails: mockOrderDetails,
        loading: false,
        error: 'Какая-то ошибка'
      };

      const result = ordersReducer(stateWithData, clearOrder());

      expect(result.currentOrder).toBeNull();
      expect(result.error).toBeNull();
      expect(result.orderDetails).toEqual(mockOrderDetails);
      expect(result.loading).toBe(false);
    });

    it('должно очищать только детали заказа при вызове clearOrderDetails', () => {
      const stateWithData = {
        currentOrder: mockOrder,
        orderDetails: mockOrderDetails,
        loading: false,
        error: 'Какая-то ошибка'
      };

      const result = ordersReducer(stateWithData, clearOrderDetails());

      expect(result.orderDetails).toBeNull();
      expect(result.currentOrder).toEqual(mockOrder);
      expect(result.error).toBe('Какая-то ошибка');
      expect(result.loading).toBe(false);
    });
  });

  describe('Создание заказа', () => {
    it('должно устанавливать loading в true при pending', () => {
      const action = { type: createOrder.pending.type };
      const result = ordersReducer(initialState, action);

      expect(result.loading).toBe(true);
      expect(result.error).toBeNull();
    });

    it('должно сохранять заказ при успешном создании', () => {
      const action = {
        type: createOrder.fulfilled.type,
        payload: mockOrder
      };
      const result = ordersReducer(initialState, action);

      expect(result.loading).toBe(false);
      expect(result.currentOrder).toEqual(mockOrder);
      expect(result.error).toBeNull();
    });

    it('должно сохранять ошибку при неудачном создании заказа', () => {
      const action = {
        type: createOrder.rejected.type,
        payload: 'Ошибка создания заказа'
      };
      const result = ordersReducer(initialState, action);

      expect(result.loading).toBe(false);
      expect(result.error).toBe('Ошибка создания заказа');
      expect(result.currentOrder).toBeNull();
    });

    it('должно использовать дефолтную ошибку если payload отсутствует при создании', () => {
      const action = {
        type: createOrder.rejected.type,
        payload: undefined
      };
      const result = ordersReducer(initialState, action);

      expect(result.error).toBe('Ошибка создания заказа');
    });

    it('должно обновлять существующий заказ при повторном создании', () => {
      const stateWithOrder = {
        ...initialState,
        currentOrder: mockOrder
      };

      const newOrder = { ...mockOrder, _id: '3', number: 12347 };
      const action = {
        type: createOrder.fulfilled.type,
        payload: newOrder
      };

      const result = ordersReducer(stateWithOrder, action);

      expect(result.currentOrder).toEqual(newOrder);
      expect(result.loading).toBe(false);
      expect(result.error).toBeNull();
    });
  });

  describe('Получение заказа по номеру', () => {
    it('должно устанавливать loading в true при pending', () => {
      const action = { type: getOrderByNumber.pending.type };
      const result = ordersReducer(initialState, action);

      expect(result.loading).toBe(true);
      expect(result.error).toBeNull();
    });

    it('должно сохранять детали заказа при успешном получении', () => {
      const action = {
        type: getOrderByNumber.fulfilled.type,
        payload: mockOrderDetails
      };
      const result = ordersReducer(initialState, action);

      expect(result.loading).toBe(false);
      expect(result.orderDetails).toEqual(mockOrderDetails);
      expect(result.error).toBeNull();
    });

    it('должно сохранять ошибку при неудачном получении заказа', () => {
      const action = {
        type: getOrderByNumber.rejected.type,
        payload: 'Заказ не найден'
      };
      const result = ordersReducer(initialState, action);

      expect(result.loading).toBe(false);
      expect(result.error).toBe('Заказ не найден');
      expect(result.orderDetails).toBeNull();
    });

    it('должно использовать дефолтную ошибку если payload отсутствует при получении', () => {
      const action = {
        type: getOrderByNumber.rejected.type,
        payload: undefined
      };
      const result = ordersReducer(initialState, action);

      expect(result.error).toBe('Ошибка получения заказа');
    });

    it('должно обновлять существующие детали заказа при повторном получении', () => {
      const stateWithOrderDetails = {
        ...initialState,
        orderDetails: mockOrderDetails
      };

      const newOrderDetails = { ...mockOrderDetails, _id: '4', status: 'done' };
      const action = {
        type: getOrderByNumber.fulfilled.type,
        payload: newOrderDetails
      };

      const result = ordersReducer(stateWithOrderDetails, action);

      expect(result.orderDetails).toEqual(newOrderDetails);
      expect(result.loading).toBe(false);
      expect(result.error).toBeNull();
    });
  });

  describe('Интеграционные тесты', () => {
    it('должно правильно обрабатывать полный сценарий создания заказа', () => {
      let state: ReturnType<typeof ordersReducer> = initialState;

      state = ordersReducer(state, { type: createOrder.pending.type });
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();

      state = ordersReducer(state, {
        type: createOrder.fulfilled.type,
        payload: mockOrder
      });
      expect(state.loading).toBe(false);
      expect(state.currentOrder).toEqual(mockOrder);
      expect(state.error).toBeNull();

      state = ordersReducer(state, { type: getOrderByNumber.pending.type });
      expect(state.loading).toBe(true);

      state = ordersReducer(state, {
        type: getOrderByNumber.fulfilled.type,
        payload: mockOrderDetails
      });
      expect(state.loading).toBe(false);
      expect(state.orderDetails).toEqual(mockOrderDetails);

      state = ordersReducer(state, clearOrder());
      expect(state.currentOrder).toBeNull();
      expect(state.error).toBeNull();
      expect(state.orderDetails).toEqual(mockOrderDetails);

      state = ordersReducer(state, clearOrderDetails());
      expect(state.orderDetails).toBeNull();
    });

    it('должно правильно обрабатывать ошибки в процессе работы', () => {
      let state: ReturnType<typeof ordersReducer> = initialState;

      state = ordersReducer(state, {
        type: createOrder.rejected.type,
        payload: 'Недостаточно средств'
      });
      expect(state.error).toBe('Недостаточно средств');
      expect(state.loading).toBe(false);

      state = ordersReducer(state, setError(null));
      expect(state.error).toBeNull();

      state = ordersReducer(state, {
        type: createOrder.fulfilled.type,
        payload: mockOrder
      });
      expect(state.currentOrder).toEqual(mockOrder);

      state = ordersReducer(state, {
        type: getOrderByNumber.rejected.type,
        payload: 'Сервер недоступен'
      });
      expect(state.error).toBe('Сервер недоступен');
      expect(state.currentOrder).toEqual(mockOrder);
    });

    it('должно правильно обрабатывать одновременную работу с заказом и деталями', () => {
      let state: ReturnType<typeof ordersReducer> = initialState;

      state = ordersReducer(state, setCurrentOrder(mockOrder));
      expect(state.currentOrder).toEqual(mockOrder);

      state = ordersReducer(state, setOrderDetails(mockOrderDetails));
      expect(state.orderDetails).toEqual(mockOrderDetails);
      expect(state.currentOrder).toEqual(mockOrder);

      state = ordersReducer(state, clearOrder());
      expect(state.currentOrder).toBeNull();
      expect(state.orderDetails).toEqual(mockOrderDetails);
      const newOrder = { ...mockOrder, _id: '5', number: 12348 };
      state = ordersReducer(state, setCurrentOrder(newOrder));
      expect(state.currentOrder).toEqual(newOrder);
      expect(state.orderDetails).toEqual(mockOrderDetails);

      state = ordersReducer(state, clearOrderDetails());
      expect(state.orderDetails).toBeNull();
      expect(state.currentOrder).toEqual(newOrder);
    });
  });

  describe('Управление состоянием загрузки', () => {
    it('должно правильно переключать состояние загрузки', () => {
      let state: ReturnType<typeof ordersReducer> = initialState;

      state = ordersReducer(state, setLoading(true));
      expect(state.loading).toBe(true);

      state = ordersReducer(state, setLoading(false));
      expect(state.loading).toBe(false);

      state = ordersReducer(state, { type: createOrder.pending.type });
      expect(state.loading).toBe(true);

      state = ordersReducer(state, {
        type: createOrder.fulfilled.type,
        payload: mockOrder
      });
      expect(state.loading).toBe(false);
    });

    it('должно правильно обрабатывать параллельные операции', () => {
      let state: ReturnType<typeof ordersReducer> = initialState;

      state = ordersReducer(state, { type: createOrder.pending.type });
      expect(state.loading).toBe(true);

      state = ordersReducer(state, { type: getOrderByNumber.pending.type });
      expect(state.loading).toBe(true);

      state = ordersReducer(state, {
        type: createOrder.fulfilled.type,
        payload: mockOrder
      });
      expect(state.loading).toBe(false);
      expect(state.currentOrder).toEqual(mockOrder);

      state = ordersReducer(state, {
        type: getOrderByNumber.fulfilled.type,
        payload: mockOrderDetails
      });
      expect(state.loading).toBe(false);
      expect(state.orderDetails).toEqual(mockOrderDetails);
    });
  });

  describe('Проверка структуры заказов', () => {
    it('должно сохранять все поля заказа', () => {
      const result = ordersReducer(initialState, setCurrentOrder(mockOrder));
      const savedOrder = result.currentOrder;

      expect(savedOrder?._id).toBe(mockOrder._id);
      expect(savedOrder?.ingredients).toEqual(mockOrder.ingredients);
      expect(savedOrder?.status).toBe(mockOrder.status);
      expect(savedOrder?.name).toBe(mockOrder.name);
      expect(savedOrder?.createdAt).toBe(mockOrder.createdAt);
      expect(savedOrder?.updatedAt).toBe(mockOrder.updatedAt);
      expect(savedOrder?.number).toBe(mockOrder.number);
    });

    it('должно правильно обрабатывать заказы с разными статусами', () => {
      const statuses = ['pending', 'done', 'created'];

      statuses.forEach((status) => {
        const orderWithStatus = { ...mockOrder, status };
        const result = ordersReducer(
          initialState,
          setCurrentOrder(orderWithStatus)
        );

        expect(result.currentOrder?.status).toBe(status);
      });
    });
  });
});
