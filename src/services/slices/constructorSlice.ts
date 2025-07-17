import {
  createSlice,
  createAsyncThunk,
  nanoid,
  PayloadAction
} from '@reduxjs/toolkit';
import { TIngredient, TConstructorIngredient, TOrder } from '@utils-types';
import { orderBurgerApi } from '../../utils/burger-api';

interface ConstructorState {
  ingredients: TConstructorIngredient[];
  bun: TConstructorIngredient | null;
  lastOrderName: string;
  isLoading: boolean;
  error: string | null;
  orderAccept: boolean;
  orderRequest: boolean;
  orderModalData: TOrder | null;
}

const initialState: ConstructorState = {
  ingredients: [],
  bun: null,
  lastOrderName: '',
  isLoading: false,
  error: null,
  orderAccept: false,
  orderRequest: false,
  orderModalData: null
};

export const orderConstructorBurgerApi = createAsyncThunk(
  'constructor/orderConstructorBurgerApi',
  async (ingredientsIds: string[]) => {
    const response = await orderBurgerApi(ingredientsIds);
    return response;
  }
);

const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    addItem: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        const type = action.payload.type;
        if (type !== 'bun') {
          state.ingredients.push(action.payload);
        } else {
          state.bun = action.payload;
        }
      },
      prepare: (ingredient: TIngredient) => {
        const id = nanoid();
        return { payload: { ...ingredient, id } as TConstructorIngredient };
      }
    },
    clearItems: (state) => {
      state.bun = null;
      state.ingredients = [];
    },
    deleteItem: (state, action: PayloadAction<{ id: string }>) => {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload.id
      );
    },
    upItem: (state, action: PayloadAction<{ id: string }>) => {
      const index = state.ingredients.findIndex(
        (item) => item.id === action.payload.id
      );
      if (index > 0) {
        [state.ingredients[index - 1], state.ingredients[index]] = [
          state.ingredients[index],
          state.ingredients[index - 1]
        ];
      }
    },
    downItem: (state, action: PayloadAction<{ id: string }>) => {
      const index = state.ingredients.findIndex(
        (item) => item.id === action.payload.id
      );
      if (index < state.ingredients.length - 1) {
        [state.ingredients[index], state.ingredients[index + 1]] = [
          state.ingredients[index + 1],
          state.ingredients[index]
        ];
      }
    },
    handleCloseOrderModal: (state) => {
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(orderConstructorBurgerApi.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.orderRequest = true;
        state.orderAccept = false;
      })
      .addCase(orderConstructorBurgerApi.fulfilled, (state, action) => {
        state.lastOrderName = action.payload.name;
        state.error = null;
        state.orderAccept = true;
        state.isLoading = false;
        state.orderRequest = false;
        state.orderModalData = action.payload.order;
      })
      .addCase(orderConstructorBurgerApi.rejected, (state, action) => {
        state.error = action.error.message || 'Не удалось сделать заказ';
        state.isLoading = false;
        state.orderRequest = false;
        state.orderModalData = null;
      });
  }
});

export const constructorReducer = constructorSlice.reducer;
export const {
  addItem,
  clearItems,
  deleteItem,
  upItem,
  downItem,
  handleCloseOrderModal
} = constructorSlice.actions;

// селекторы
export const selectConstructor = (state: { constructor: ConstructorState }) =>
  state.constructor;
