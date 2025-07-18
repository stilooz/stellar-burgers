import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit';
import { TIngredient, TConstructorIngredient } from '../../../utils/types';

interface ConstructorState {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
  totalPrice: number;
}

const initialState: ConstructorState = {
  bun: null,
  ingredients: [],
  totalPrice: 0
};

const calculateTotalPrice = (
  bun: TConstructorIngredient | null,
  ingredients: TConstructorIngredient[] | undefined
): number => {
  const bunPrice = bun ? bun.price * 2 : 0;
  const ingredientsPrice = Array.isArray(ingredients)
    ? ingredients.reduce((sum, item) => sum + (item?.price || 0), 0)
    : 0;
  return bunPrice + ingredientsPrice;
};

const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    addIngredient: (state, action: PayloadAction<TIngredient>) => {
      const ingredient = action.payload;

      if (typeof state.totalPrice !== 'number' || isNaN(state.totalPrice)) {
        state.totalPrice = 0;
      }

      if (!Array.isArray(state.ingredients)) {
        state.ingredients = [];
      }

      const constructorIngredient: TConstructorIngredient = {
        ...ingredient,
        id: nanoid()
      };

      if (ingredient.type === 'bun') {
        return {
          ...state,
          bun: constructorIngredient,
          totalPrice: calculateTotalPrice(
            constructorIngredient,
            state.ingredients
          )
        };
      } else {
        const newIngredients = [...state.ingredients, constructorIngredient];
        return {
          ...state,
          ingredients: newIngredients,
          totalPrice: calculateTotalPrice(state.bun, newIngredients)
        };
      }
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      if (!Array.isArray(state.ingredients)) {
        state.ingredients = [];
      }

      const newIngredients = state.ingredients.filter(
        (item) => item.id !== action.payload
      );
      return {
        ...state,
        ingredients: newIngredients,
        totalPrice: calculateTotalPrice(state.bun, newIngredients)
      };
    },
    clearConstructor: (state) => ({
      ...state,
      bun: null,
      ingredients: [],
      totalPrice: 0
    }),
    moveIngredient: (
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) => {
      if (!Array.isArray(state.ingredients)) {
        state.ingredients = [];
        return state;
      }

      const { fromIndex, toIndex } = action.payload;
      const ingredients = [...state.ingredients];
      const [movedIngredient] = ingredients.splice(fromIndex, 1);
      ingredients.splice(toIndex, 0, movedIngredient);
      return {
        ...state,
        ingredients
      };
    }
  }
});

export const {
  addIngredient,
  removeIngredient,
  clearConstructor,
  moveIngredient
} = constructorSlice.actions;

export default constructorSlice.reducer;
