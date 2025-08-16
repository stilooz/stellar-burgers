import { configureStore } from '@reduxjs/toolkit';
import constructorReducer, {
  addIngredient,
  removeIngredient,
  clearConstructor,
  moveIngredient
} from './constructorSlice';
import { TIngredient } from '../../../utils/types';

let mockIdCounter = 0;
jest.mock('@reduxjs/toolkit', () => ({
  ...jest.requireActual('@reduxjs/toolkit'),
  nanoid: () => `mock-id-${++mockIdCounter}`
}));

describe('constructorSlice', () => {
  const initialState = {
    bun: null,
    ingredients: [],
    totalPrice: 0
  };

  const mockBun: TIngredient = {
    _id: '1',
    name: 'Тестовая булка',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'test-bun.png',
    image_mobile: 'test-bun-mobile.png',
    image_large: 'test-bun-large.png'
  };

  const mockMain: TIngredient = {
    _id: '2',
    name: 'Тестовая котлета',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'test-main.png',
    image_mobile: 'test-main-mobile.png',
    image_large: 'test-main-large.png'
  };

  const mockSauce: TIngredient = {
    _id: '3',
    name: 'Тестовый соус',
    type: 'sauce',
    proteins: 30,
    fat: 20,
    carbohydrates: 40,
    calories: 30,
    price: 90,
    image: 'test-sauce.png',
    image_mobile: 'test-sauce-mobile.png',
    image_large: 'test-sauce-large.png'
  };

  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        constructor: constructorReducer
      }
    });
  });

  describe('Начальное состояние', () => {
    it('должно возвращать правильное начальное состояние', () => {
      expect(constructorReducer(undefined, { type: 'unknown' })).toEqual(
        initialState
      );
    });
  });

  describe('Добавление ингредиентов', () => {
    it('должно добавлять булку и правильно считать цену', () => {
      const result = constructorReducer(initialState, addIngredient(mockBun));

      expect(result.bun).toEqual({
        ...mockBun,
        uniqueId: expect.any(String),
        id: expect.any(String)
      });
      expect(result.totalPrice).toBe(2510);
      expect(result.ingredients).toEqual([]);
    });

    it('должно заменять булку при добавлении новой', () => {
      const stateWithBun = {
        ...initialState,
        bun: { ...mockBun, id: 'old-bun-id' },
        totalPrice: 2510
      };

      const newBun = { ...mockBun, _id: '4', name: 'Новая булка', price: 1000 };
      const result = constructorReducer(stateWithBun, addIngredient(newBun));

      expect(result.bun).toEqual({
        ...newBun,
        uniqueId: expect.any(String),
        id: expect.any(String)
      });
      expect(result.totalPrice).toBe(2000);
    });

    it('должно добавлять основной ингредиент и правильно считать цену', () => {
      const result = constructorReducer(initialState, addIngredient(mockMain));

      expect(result.ingredients).toHaveLength(1);
      expect(result.ingredients[0]).toEqual({
        ...mockMain,
        uniqueId: expect.any(String),
        id: expect.any(String)
      });
      expect(result.totalPrice).toBe(424);
      expect(result.bun).toBeNull();
    });

    it('должно добавлять соус и правильно считать цену', () => {
      const result = constructorReducer(initialState, addIngredient(mockSauce));

      expect(result.ingredients).toHaveLength(1);
      expect(result.ingredients[0]).toEqual({
        ...mockSauce,
        uniqueId: expect.any(String),
        id: expect.any(String)
      });
      expect(result.totalPrice).toBe(90);
    });

    it('должно правильно считать общую цену с булкой и начинкой', () => {
      let state = constructorReducer(initialState, addIngredient(mockBun));
      state = constructorReducer(state, addIngredient(mockMain));
      const result = constructorReducer(state, addIngredient(mockSauce));

      expect(result.totalPrice).toBe(3024);
      expect(result.bun).not.toBeNull();
      expect(result.ingredients).toHaveLength(2);
    });

    it.skip('должно обрабатывать некорректное состояние totalPrice', () => {
      const invalidState = {
        ...initialState,
        totalPrice: NaN
      };

      const result = constructorReducer(invalidState, addIngredient(mockMain));

      expect(result.totalPrice).toBe(424);
      expect(result.ingredients).toHaveLength(1);
    });

    it.skip('должно обрабатывать некорректное состояние ingredients', () => {
      const invalidState = {
        ...initialState,
        ingredients: null as any
      };

      const result = constructorReducer(invalidState, addIngredient(mockMain));

      expect(result.ingredients).toHaveLength(1);
      expect(result.ingredients[0]).toEqual({
        ...mockMain,
        uniqueId: expect.any(String),
        id: expect.any(String)
      });
    });
  });

  describe('Удаление ингредиентов', () => {
    it('должно удалять ингредиент по id и пересчитывать цену', () => {
      const stateWithIngredients = {
        bun: { ...mockBun, id: 'bun-id' },
        ingredients: [
          { ...mockMain, id: 'main-id' },
          { ...mockSauce, id: 'sauce-id' }
        ],
        totalPrice: 3024
      };

      const result = constructorReducer(
        stateWithIngredients,
        removeIngredient('main-id')
      );

      expect(result.ingredients).toHaveLength(1);
      expect(result.ingredients[0].id).toBe('sauce-id');
      expect(result.totalPrice).toBe(2600);
    });

    it('должно обрабатывать удаление из пустого массива', () => {
      const result = constructorReducer(
        initialState,
        removeIngredient('non-existent-id')
      );

      expect(result.ingredients).toEqual([]);
      expect(result.totalPrice).toBe(0);
    });

    it.skip('должно обрабатывать некорректное состояние ingredients при удалении', () => {
      const invalidState = {
        ...initialState,
        ingredients: null as any
      };

      const result = constructorReducer(
        invalidState,
        removeIngredient('some-id')
      );

      expect(result.ingredients).toEqual([]);
      expect(result.totalPrice).toBe(0);
    });

    it('должно удалять несуществующий ингредиент без ошибок', () => {
      const stateWithIngredients = {
        bun: { ...mockBun, id: 'bun-id' },
        ingredients: [{ ...mockMain, id: 'main-id' }],
        totalPrice: 2934
      };

      const result = constructorReducer(
        stateWithIngredients,
        removeIngredient('non-existent-id')
      );

      expect(result.ingredients).toHaveLength(1);
      expect(result.totalPrice).toBe(2934);
    });
  });

  describe('Очистка конструктора', () => {
    it('должно очищать весь конструктор', () => {
      const stateWithData = {
        bun: { ...mockBun, id: 'bun-id' },
        ingredients: [
          { ...mockMain, id: 'main-id' },
          { ...mockSauce, id: 'sauce-id' }
        ],
        totalPrice: 3024
      };

      const result = constructorReducer(stateWithData, clearConstructor());

      expect(result).toEqual(initialState);
    });
  });

  describe('Перемещение ингредиентов', () => {
    const stateWithMultipleIngredients = {
      bun: { ...mockBun, id: 'bun-id' },
      ingredients: [
        { ...mockMain, id: 'main-1' },
        { ...mockSauce, id: 'sauce-1' },
        { ...mockMain, id: 'main-2', name: 'Вторая котлета' }
      ],
      totalPrice: 3000
    };

    it('должно перемещать ингредиент вниз', () => {
      const result = constructorReducer(
        stateWithMultipleIngredients,
        moveIngredient({ fromIndex: 0, toIndex: 1 })
      );

      expect(result.ingredients[0].id).toBe('sauce-1');
      expect(result.ingredients[1].id).toBe('main-1');
      expect(result.ingredients[2].id).toBe('main-2');
    });

    it('должно перемещать ингредиент вверх', () => {
      const result = constructorReducer(
        stateWithMultipleIngredients,
        moveIngredient({ fromIndex: 2, toIndex: 0 })
      );

      expect(result.ingredients[0].id).toBe('main-2');
      expect(result.ingredients[1].id).toBe('main-1');
      expect(result.ingredients[2].id).toBe('sauce-1');
    });

    it('должно перемещать ингредиент в середину', () => {
      const result = constructorReducer(
        stateWithMultipleIngredients,
        moveIngredient({ fromIndex: 0, toIndex: 2 })
      );

      expect(result.ingredients[0].id).toBe('sauce-1');
      expect(result.ingredients[1].id).toBe('main-2');
      expect(result.ingredients[2].id).toBe('main-1');
    });

    it('должно обрабатывать перемещение в том же индексе', () => {
      const result = constructorReducer(
        stateWithMultipleIngredients,
        moveIngredient({ fromIndex: 1, toIndex: 1 })
      );

      expect(result.ingredients).toEqual(
        stateWithMultipleIngredients.ingredients
      );
    });

    it.skip('должно обрабатывать некорректное состояние ingredients при перемещении', () => {
      const invalidState = {
        ...stateWithMultipleIngredients,
        ingredients: null as any
      };

      const result = constructorReducer(
        invalidState,
        moveIngredient({ fromIndex: 0, toIndex: 1 })
      );

      expect(result.ingredients).toEqual([]);
    });

    it('должно обрабатывать перемещение с некорректными индексами', () => {
      const result = constructorReducer(
        stateWithMultipleIngredients,
        moveIngredient({ fromIndex: 10, toIndex: 1 })
      );

      expect(result.ingredients).toHaveLength(4);
      expect(result.ingredients[1]).toBeUndefined();
      expect(result.ingredients[0]).toBeDefined();
      expect(result.ingredients[2]).toBeDefined();
      expect(result.ingredients[3]).toBeDefined();
    });
  });

  describe('Интеграционные тесты', () => {
    it('должно правильно обрабатывать полный сценарий создания бургера', () => {
      let state: ReturnType<typeof constructorReducer> = initialState;

      state = constructorReducer(state, addIngredient(mockBun));
      expect(state.totalPrice).toBe(2510);

      state = constructorReducer(state, addIngredient(mockMain));
      expect(state.totalPrice).toBe(2934);

      state = constructorReducer(state, addIngredient(mockSauce));
      expect(state.totalPrice).toBe(3024);

      state = constructorReducer(state, addIngredient(mockMain));
      expect(state.totalPrice).toBe(3448);
      expect(state.ingredients).toHaveLength(3);

      state = constructorReducer(
        state,
        moveIngredient({ fromIndex: 0, toIndex: 2 })
      );
      expect(state.ingredients[2].type).toBe('main');

      expect(state.ingredients).toHaveLength(3);
      const ingredientToRemove = state.ingredients[1].id;
      state = constructorReducer(state, removeIngredient(ingredientToRemove));
      expect(state.ingredients).toHaveLength(2);
      expect(state.totalPrice).toBe(3024);

      state = constructorReducer(state, clearConstructor());
      expect(state).toEqual(initialState);
    });
  });
});
