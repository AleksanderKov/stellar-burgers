import { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from '../../services/store';
import { TConstructorIngredient, TOrder } from '@utils-types';
import { BurgerConstructorUI } from '@ui';

import { selectConstructorState } from '../../services/slices/constructorSlice';

import {
  clearOrderData,
  fetchOrderBurgerApi,
  selectOrderLoading,
  selectOrderData
} from '../../services/slices/feedSlice';

import { getUser } from '../../services/slices/authSlice';

export const BurgerConstructor: FC = () => {
  const burgerState = useSelector(selectConstructorState);
  const user = useSelector(getUser);
  const orderRequest = useSelector(selectOrderLoading) as boolean;
  const orderModalData = useSelector(selectOrderData) as TOrder | null;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onOrderClick = () => {
    if (!burgerState.bun || orderRequest) return;

    if (!user) {
      navigate('/login');
      return;
    }

    const ingredientIds: string[] = [
      burgerState.bun._id,
      ...burgerState.ingredients.map((item) => item._id),
      burgerState.bun._id
    ];

    dispatch(fetchOrderBurgerApi(ingredientIds));
  };

  const closeOrderModal = () => {
    dispatch(clearOrderData());
  };

  const totalPrice = useMemo(() => {
    const bunPrice = burgerState.bun ? burgerState.bun.price * 2 : 0;
    const fillingsPrice = burgerState.ingredients.reduce(
      (sum: number, item: TConstructorIngredient) => sum + item.price,
      0
    );
    return bunPrice + fillingsPrice;
  }, [burgerState]);

  return (
    <BurgerConstructorUI
      price={totalPrice}
      orderRequest={orderRequest}
      constructorItems={burgerState}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
