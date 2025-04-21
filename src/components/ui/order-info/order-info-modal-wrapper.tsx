// src/components/ui/order-info/order-info-modal-wrapper.tsx

import { FC, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from '../../../services/store';
import {
  fetchOrderDetails,
  selectOrderDetails
} from '../../../services/slices/feedSlice';
import { selectIngredients } from '../../../services/slices/ingredientSlice';
import { Preloader } from '../preloader';
import { ModalUI } from '../modal/modal';
import { OrderInfoUI } from './order-info';
import { TIngredient, TOrderInfoExtended } from '@utils-types';

type Props = {
  onClose: () => void;
};

export const OrderInfoModalWrapper: FC<Props> = ({ onClose }) => {
  const { number } = useParams<{ number: string }>();
  const dispatch = useDispatch();
  const order = useSelector(selectOrderDetails);
  const ingredientList = useSelector(selectIngredients);

  useEffect(() => {
    if (!order && number) {
      dispatch(fetchOrderDetails(Number(number)));
    }
  }, [dispatch, number, order]);

  if (!order || !ingredientList.length) return <Preloader />;

  const ingredientsInfo = order.ingredients.reduce<
    Record<string, TIngredient & { count: number }>
  >((acc, id) => {
    const ingredient = ingredientList.find((item) => item._id === id);
    if (!ingredient) return acc;

    if (acc[id]) {
      acc[id].count += 1;
    } else {
      acc[id] = { ...ingredient, count: 1 };
    }

    return acc;
  }, {});

  const total = Object.values(ingredientsInfo).reduce(
    (acc, item) => acc + item.price * item.count,
    0
  );

  const orderInfo: TOrderInfoExtended = {
    ...order,
    ingredientsInfo,
    total,
    date: new Date(order.createdAt)
  };

  return (
    <ModalUI title={`#${orderInfo.number}`} onClose={onClose}>
      <OrderInfoUI orderInfo={orderInfo} />
    </ModalUI>
  );
};
