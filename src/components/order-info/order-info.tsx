import { FC, useEffect, useMemo } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';

import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';

import { getUserData, getAuthStatus } from '../../services/slices/authSlice';
import {
  fetchOrderDetails,
  selectOrderDetails,
  selectPublicOrders,
  selectUserOrders
} from '../../services/slices/feedSlice';

import { selectIngredients } from '../../services/slices/ingredientSlice';

import { TOrder, TIngredient } from '@utils-types';

export const OrderInfo: FC = () => {
  const { number, id } = useParams<{ number?: string; id?: string }>();
  const orderIdentifier = number || id || '';

  const dispatch = useDispatch();
  const currentLocation = useLocation();
  const isPrivateScope = currentLocation.pathname.includes('/profile/orders');

  const isAuthDone = useSelector(getAuthStatus);
  const userData = useSelector(getUserData);
  const cachedPublicOrders = useSelector(selectPublicOrders) as TOrder[];
  const cachedPrivateOrders = useSelector(selectUserOrders) as TOrder[];
  const ingredientList = useSelector(selectIngredients) || [];
  const orderFromStore = useSelector(selectOrderDetails) as TOrder | null;

  const locateOrder = (source: TOrder[]): TOrder | null =>
    source.find((o) => o?.number === Number(orderIdentifier)) || null;

  const orderCached = isPrivateScope
    ? locateOrder(cachedPrivateOrders)
    : locateOrder(cachedPublicOrders);

  useEffect(() => {
    if (!orderCached && orderIdentifier) {
      dispatch(fetchOrderDetails(Number(orderIdentifier)));
    }
  }, [dispatch, orderCached, orderIdentifier]);

  const orderRaw = orderCached || orderFromStore;

  const orderInfo = useMemo(() => {
    if (
      !orderRaw?.createdAt ||
      !orderRaw.ingredients?.length ||
      !ingredientList.length
    ) {
      return null;
    }

    try {
      const date = new Date(orderRaw.createdAt);

      const countedIngredients = orderRaw.ingredients.reduce<
        Record<string, TIngredient & { count: number }>
      >((acc, id) => {
        if (!id) return acc;

        const existing = acc[id];
        const ingredient = ingredientList.find((ing) => ing._id === id);

        if (!ingredient) return acc;

        acc[id] = existing
          ? { ...existing, count: existing.count + 1 }
          : { ...ingredient, count: 1 };

        return acc;
      }, {});

      const totalCost = Object.values(countedIngredients).reduce(
        (sum, ing) => sum + (ing.price || 0) * (ing.count || 0),
        0
      );

      return {
        ...orderRaw,
        ingredientsInfo: countedIngredients,
        total: totalCost,
        date
      };
    } catch (error) {
      console.error('Ошибка обработки заказа:', error);
      return null;
    }
  }, [orderRaw, ingredientList]);

  if (isPrivateScope && (!isAuthDone || !userData)) {
    return <Preloader />;
  }

  if (!orderInfo) {
    return <Preloader />;
  }

  try {
    return <OrderInfoUI orderInfo={orderInfo} />;
  } catch (e) {
    console.error('Ошибка в отрисовке:', e);
    return <Preloader />;
  }
};
