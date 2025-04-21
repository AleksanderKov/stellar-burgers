import { getIngredientsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

const INGREDIENTS_SLICE_NAME = 'ingredients';

interface IIngredientsState {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: string | null;
}

const initialState: IIngredientsState = {
  ingredients: [],
  isLoading: true,
  error: null
};

export const fetchIngredient = createAsyncThunk(
  `${INGREDIENTS_SLICE_NAME}/fetchIngredients`,
  async () => await getIngredientsApi()
);

const ingredientsSlice = createSlice({
  name: INGREDIENTS_SLICE_NAME,
  initialState,
  reducers: {},
  selectors: {
    selectIngredients: (state) => state.ingredients,
    selectIsIngredientsLoading: (state) => state.isLoading
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredient.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIngredient.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ingredients = action.payload;
      })
      .addCase(fetchIngredient.rejected, (state) => {
        state.isLoading = false;
        state.error = 'Не удалось получить ингредиенты';
      });
  }
});

export const ingredientsReducer = ingredientsSlice.reducer;

export const { selectIngredients, selectIsIngredientsLoading } =
  ingredientsSlice.selectors;
