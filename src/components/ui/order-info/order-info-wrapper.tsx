import { FC } from 'react';
import { useSelector } from '../../../services/store';
import { Preloader } from '../preloader';
import { OrderInfoUI } from './order-info';
import { selectIngredients } from '../../../services/slices/ingredientSlice';
import { selectOrderDetails } from '../../../services/slices/feedSlice';
import { TIngredient, TOrderInfoExtended } from '@utils-types';

import styles from './order-info-wrapper.module.css';

export const OrderInfoWrapper: FC = () => {
  const order = useSelector(selectOrderDetails);
  const ingredientList = useSelector(selectIngredients);

  if (!order || !ingredientList.length) return <Preloader />;

  const ingredientsInfo = order.ingredients.reduce<
    Record<string, TIngredient & { count: number }>
  >((acc, id) => {
    const ingredient = ingredientList.find((i) => i._id === id);
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
    <div className={styles.wrapper}>
      <span className={`${styles.number} text text_type_digits-default pb-10`}>
        #{String(orderInfo.number).padStart(6, '0')}
      </span>
      <OrderInfoUI orderInfo={orderInfo} />
    </div>
  );
};
