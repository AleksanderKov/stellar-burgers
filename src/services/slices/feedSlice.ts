import {
  getFeedsApi,
  getOrderByNumberApi,
  getOrdersApi,
  orderBurgerApi
} from '@api';

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { TOrder } from '@utils-types';
import { clearConstructor } from './constructorSlice';

const SLICE_NAME = 'orders';

interface IFeedState {
  orders: TOrder[];
  userOrders: TOrder[];
  orderRequestData: TOrder | null;
  orderInfo: TOrder | null;
  total: number | null;
  totalToday: number | null;
  isLoading: boolean;
  error: string | null;
  orderRequest: boolean;
}

const initialState: IFeedState = {
  orders: [],
  userOrders: [],
  total: null,
  totalToday: null,
  isLoading: false,
  error: null,
  orderRequest: false,
  orderRequestData: null,
  orderInfo: null
};

export const fetchPublicOrders = createAsyncThunk(
  `${SLICE_NAME}/fetchPublicOrders`,
  async () => await getFeedsApi()
);

export const fetchUserOrders = createAsyncThunk(
  `${SLICE_NAME}/fetchUserOrders`,
  async () => await getOrdersApi()
);

export const createOrder = createAsyncThunk(
  `${SLICE_NAME}/createOrder`,
  async (ingredients: string[], { dispatch }) => {
    const res = await orderBurgerApi(ingredients);

    dispatch(clearConstructor());

    return res;
  }
);

export const fetchOrderDetails = createAsyncThunk(
  `${SLICE_NAME}/fetchOrderDetails`,
  async (id: number) => {
    const res = await getOrderByNumberApi(id);
    return res;
  }
);

const ordersSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    resetOrderData: (state) => {
      state.orderRequestData = null;
      state.orderRequest = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPublicOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPublicOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchPublicOrders.rejected, (state) => {
        state.isLoading = false;
        state.error = 'Ошибка получения публичных заказов';
      })
      .addCase(fetchUserOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userOrders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state) => {
        state.isLoading = false;
        state.error = 'Ошибка получения заказов пользователя';
      })
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderRequestData = action.payload.order;
      })
      .addCase(createOrder.rejected, (state) => {
        state.orderRequest = false;
        state.error = 'Ошибка оформления заказа';
      })
      .addCase(fetchOrderDetails.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderInfo = action.payload.orders[0];
      })
      .addCase(fetchOrderDetails.rejected, (state) => {
        state.orderRequest = false;
        state.error = 'Ошибка получения информации о заказе';
      });
  }
});

export const selectPublicOrders = (state: RootState) => state.orders.orders;
export const selectUserOrders = (state: RootState) => state.orders.userOrders;
export const selectOrderDetails = (state: RootState) => state.orders.orderInfo;
export const selectOrderData = (state: RootState) =>
  state.orders.orderRequestData;
export const selectOrderLoading = (state: RootState) =>
  state.orders.orderRequest;
export const selectTotalCount = (state: RootState) => state.orders.total;
export const selectTodayCount = (state: RootState) => state.orders.totalToday;

export const orderReducer = ordersSlice.reducer;
export const { resetOrderData } = ordersSlice.actions;

export const fetchOrderBurgerApi = createOrder;
export const clearOrderData = resetOrderData;
