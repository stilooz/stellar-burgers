import { configureStore } from '@reduxjs/toolkit';
import ingredientsReducer from './ingredientsSlice';
import { fetchIngredients } from './ingredientsApi';
import { TIngredient } from '../../../utils/types';

jest.mock('./ingredientsApi', () => ({
  fetchIngredients: {
    pending: { type: 'ingredients/fetchIngredients/pending' },
    fulfilled: { type: 'ingredients/fetchIngredients/fulfilled' },
    rejected: { type: 'ingredients/fetchIngredients/rejected' }
  }
}));

describe('ingredientsSlice', () => {
  const initialState = {
    ingredients: [],
    loading: false,
    error: null
  };

  const mockBun: TIngredient = {
    _id: '1',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
  };

  const mockMain: TIngredient = {
    _id: '2',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
  };

  const mockSauce: TIngredient = {
    _id: '3',
    name: 'Соус Spicy-X',
    type: 'sauce',
    proteins: 30,
    fat: 20,
    carbohydrates: 40,
    calories: 30,
    price: 90,
    image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png'
  };

  const mockIngredients: TIngredient[] = [mockBun, mockMain, mockSauce];

  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        ingredients: ingredientsReducer
      }
    });
  });

  describe('Начальное состояние', () => {
    it('должно возвращать правильное начальное состояние', () => {
      expect(ingredientsReducer(undefined, { type: 'unknown' })).toEqual(
        initialState
      );
    });
  });

  describe('Загрузка ингредиентов', () => {
    it('должно устанавливать loading в true при pending', () => {
      const action = { type: fetchIngredients.pending.type };
      const result = ingredientsReducer(initialState, action);

      expect(result.loading).toBe(true);
      expect(result.error).toBeNull();
    });

    it('должно сохранять ингредиенты при успешной загрузке', () => {
      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredients
      };
      const result = ingredientsReducer(initialState, action);

      expect(result.loading).toBe(false);
      expect(result.ingredients).toEqual(mockIngredients);
      expect(result.ingredients).toHaveLength(3);
      expect(result.error).toBeNull();
    });

    it('должно сохранять ошибку при неудачной загрузке', () => {
      const action = {
        type: fetchIngredients.rejected.type,
        payload: 'Ошибка сети'
      };
      const result = ingredientsReducer(initialState, action);

      expect(result.loading).toBe(false);
      expect(result.error).toBe('Ошибка сети');
      expect(result.ingredients).toEqual([]);
    });

    it('должно использовать дефолтную ошибку если payload отсутствует', () => {
      const action = {
        type: fetchIngredients.rejected.type,
        payload: undefined
      };
      const result = ingredientsReducer(initialState, action);

      expect(result.error).toBe('Ошибка загрузки ингредиентов');
    });

    it('должно обновлять существующие ингредиенты при повторной загрузке', () => {
      const stateWithIngredients = {
        ingredients: [mockBun],
        loading: false,
        error: null
      };

      const newIngredients = [mockMain, mockSauce];
      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: newIngredients
      };

      const result = ingredientsReducer(stateWithIngredients, action);

      expect(result.ingredients).toEqual(newIngredients);
      expect(result.ingredients).toHaveLength(2);
      expect(result.loading).toBe(false);
      expect(result.error).toBeNull();
    });

    it('должно очищать предыдущую ошибку при новой загрузке', () => {
      const stateWithError = {
        ingredients: [],
        loading: false,
        error: 'Предыдущая ошибка'
      };

      const action = { type: fetchIngredients.pending.type };
      const result = ingredientsReducer(stateWithError, action);

      expect(result.loading).toBe(true);
      expect(result.error).toBeNull();
    });
  });

  describe('Типы ингредиентов', () => {
    it('должно правильно загружать булки', () => {
      const buns = [mockBun, { ...mockBun, _id: '4', name: 'Другая булка' }];
      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: buns
      };

      const result = ingredientsReducer(initialState, action);

      expect(result.ingredients).toHaveLength(2);
      expect(
        result.ingredients.every((ingredient) => ingredient.type === 'bun')
      ).toBe(true);
    });

    it('должно правильно загружать основные ингредиенты', () => {
      const mains = [
        mockMain,
        { ...mockMain, _id: '5', name: 'Другая котлета' }
      ];
      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: mains
      };

      const result = ingredientsReducer(initialState, action);

      expect(result.ingredients).toHaveLength(2);
      expect(
        result.ingredients.every((ingredient) => ingredient.type === 'main')
      ).toBe(true);
    });

    it('должно правильно загружать соусы', () => {
      const sauces = [
        mockSauce,
        { ...mockSauce, _id: '6', name: 'Другой соус' }
      ];
      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: sauces
      };

      const result = ingredientsReducer(initialState, action);

      expect(result.ingredients).toHaveLength(2);
      expect(
        result.ingredients.every((ingredient) => ingredient.type === 'sauce')
      ).toBe(true);
    });

    it('должно правильно загружать смешанные типы ингредиентов', () => {
      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredients
      };

      const result = ingredientsReducer(initialState, action);

      expect(result.ingredients).toHaveLength(3);

      const buns = result.ingredients.filter(
        (ingredient) => ingredient.type === 'bun'
      );
      const mains = result.ingredients.filter(
        (ingredient) => ingredient.type === 'main'
      );
      const sauces = result.ingredients.filter(
        (ingredient) => ingredient.type === 'sauce'
      );

      expect(buns).toHaveLength(1);
      expect(mains).toHaveLength(1);
      expect(sauces).toHaveLength(1);
    });
  });

  describe('Обработка пустых данных', () => {
    it('должно правильно обрабатывать пустой массив ингредиентов', () => {
      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: []
      };

      const result = ingredientsReducer(initialState, action);

      expect(result.loading).toBe(false);
      expect(result.ingredients).toEqual([]);
      expect(result.error).toBeNull();
    });

    it('должно сохранять состояние при загрузке пустого массива', () => {
      const stateWithIngredients = {
        ingredients: mockIngredients,
        loading: false,
        error: null
      };

      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: []
      };

      const result = ingredientsReducer(stateWithIngredients, action);

      expect(result.ingredients).toEqual([]);
      expect(result.loading).toBe(false);
      expect(result.error).toBeNull();
    });
  });

  describe('Интеграционные тесты', () => {
    it('должно правильно обрабатывать полный сценарий загрузки', () => {
      let state: ReturnType<typeof ingredientsReducer> = initialState;

      state = ingredientsReducer(state, {
        type: fetchIngredients.pending.type
      });
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
      expect(state.ingredients).toEqual([]);

      state = ingredientsReducer(state, {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredients
      });
      expect(state.loading).toBe(false);
      expect(state.ingredients).toEqual(mockIngredients);
      expect(state.error).toBeNull();

      state = ingredientsReducer(state, {
        type: fetchIngredients.pending.type
      });
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();

      state = ingredientsReducer(state, {
        type: fetchIngredients.rejected.type,
        payload: 'Ошибка сервера'
      });
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Ошибка сервера');
      expect(state.ingredients).toEqual(mockIngredients);
    });

    it('должно правильно обрабатывать множественные загрузки', () => {
      let state: ReturnType<typeof ingredientsReducer> = initialState;

      state = ingredientsReducer(state, {
        type: fetchIngredients.fulfilled.type,
        payload: [mockBun]
      });
      expect(state.ingredients).toHaveLength(1);

      state = ingredientsReducer(state, {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredients
      });
      expect(state.ingredients).toHaveLength(3);

      const newIngredients = [mockMain, mockSauce];
      state = ingredientsReducer(state, {
        type: fetchIngredients.fulfilled.type,
        payload: newIngredients
      });
      expect(state.ingredients).toEqual(newIngredients);
      expect(state.ingredients).toHaveLength(2);
    });
  });

  describe('Состояние ошибок', () => {
    it('должно сохранять ингредиенты при ошибке после успешной загрузки', () => {
      let state: ReturnType<typeof ingredientsReducer> = initialState;

      state = ingredientsReducer(state, {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredients
      });

      state = ingredientsReducer(state, {
        type: fetchIngredients.rejected.type,
        payload: 'Ошибка сети'
      });

      expect(state.error).toBe('Ошибка сети');
      expect(state.loading).toBe(false);
      expect(state.ingredients).toEqual(mockIngredients);
    });

    it('должно правильно обрабатывать разные типы ошибок', () => {
      const errorMessages = [
        'Ошибка сети',
        'Сервер недоступен',
        'Превышено время ожидания',
        null,
        undefined
      ];

      errorMessages.forEach((errorMessage) => {
        const action = {
          type: fetchIngredients.rejected.type,
          payload: errorMessage
        };

        const result = ingredientsReducer(initialState, action);

        if (errorMessage) {
          expect(result.error).toBe(errorMessage);
        } else {
          expect(result.error).toBe('Ошибка загрузки ингредиентов');
        }
        expect(result.loading).toBe(false);
      });
    });
  });

  describe('Проверка структуры ингредиентов', () => {
    it('должно сохранять все поля ингредиента', () => {
      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: [mockBun]
      };

      const result = ingredientsReducer(initialState, action);
      const savedIngredient = result.ingredients[0];

      expect(savedIngredient._id).toBe(mockBun._id);
      expect(savedIngredient.name).toBe(mockBun.name);
      expect(savedIngredient.type).toBe(mockBun.type);
      expect(savedIngredient.proteins).toBe(mockBun.proteins);
      expect(savedIngredient.fat).toBe(mockBun.fat);
      expect(savedIngredient.carbohydrates).toBe(mockBun.carbohydrates);
      expect(savedIngredient.calories).toBe(mockBun.calories);
      expect(savedIngredient.price).toBe(mockBun.price);
      expect(savedIngredient.image).toBe(mockBun.image);
      expect(savedIngredient.image_mobile).toBe(mockBun.image_mobile);
      expect(savedIngredient.image_large).toBe(mockBun.image_large);
    });
  });
});
