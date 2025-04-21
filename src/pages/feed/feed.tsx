import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';

import {
  fetchPublicOrders,
  selectPublicOrders
} from '../../services/slices/feedSlice';

import { useDispatch, useSelector } from '../../services/store';

export const Feed: FC = () => {
  const dispatch = useDispatch();

  const orders: TOrder[] = useSelector(selectPublicOrders) || [];

  useEffect(() => {
    dispatch(fetchPublicOrders());
  }, [dispatch]);

  if (!orders.length) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => dispatch(fetchPublicOrders())}
    />
  );
};
