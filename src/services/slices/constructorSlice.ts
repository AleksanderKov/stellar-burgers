import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { RootState } from '../store';

const SLICE_NAME = 'burgerConstructor';

type TConstructorState = {
  ingredients: TConstructorIngredient[];
  bun: TConstructorIngredient | null;
};

const initialState: TConstructorState = {
  ingredients: [],
  bun: null
};

const constructorSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        const item = action.payload;
        if (item.type === 'bun') {
          state.bun = item;
        } else {
          state.ingredients.push(item);
        }
      },
      prepare: (ingredient: TIngredient) => {
        const id = nanoid();
        return { payload: { ...ingredient, id } };
      }
    },

    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    },

    moveIngredient: (
      state,
      action: PayloadAction<{ fromIndex: number; shift: number }>
    ) => {
      const { fromIndex, shift } = action.payload;
      const toIndex = fromIndex - shift;
      [state.ingredients[fromIndex], state.ingredients[toIndex]] = [
        state.ingredients[toIndex],
        state.ingredients[fromIndex]
      ];
    },

    deleteIngredient: (
      state,
      action: PayloadAction<TConstructorIngredient>
    ) => {
      const { id } = action.payload;
      state.ingredients = state.ingredients.filter((item) => item.id !== id);
    }
  }
});

const selectConstructorState = (state: RootState): TConstructorState =>
  state.burgerConstructor;

export const constructorReducer = constructorSlice.reducer;

export const {
  addIngredient,
  clearConstructor,
  deleteIngredient,
  moveIngredient
} = constructorSlice.actions;

export { selectConstructorState };
