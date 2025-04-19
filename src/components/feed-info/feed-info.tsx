import { FC, useMemo } from 'react';
import { FeedInfoUI } from '@ui';
import { useSelector } from '../../services/store';

import {
  selectTotalCount,
  selectTodayCount,
  selectPublicOrders
} from '../../services/slices/feedSlice';

export const FeedInfo: FC = () => {
  const total = useSelector(selectTotalCount) ?? 0;
  const totalToday = useSelector(selectTodayCount) ?? 0;
  const orders = useSelector(selectPublicOrders) ?? [];

  const { readyOrders, pendingOrders } = useMemo(() => {
    const ready: number[] = [];
    const pending: number[] = [];

    orders.forEach((order) => {
      if (order.status === 'done') ready.push(order.number);
      else if (order.status === 'pending') pending.push(order.number);
    });

    return {
      readyOrders: ready.slice(0, 10),
      pendingOrders: pending.slice(0, 10)
    };
  }, [orders]);

  return (
    <FeedInfoUI
      total={total}
      totalToday={totalToday}
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
    />
  );
};
