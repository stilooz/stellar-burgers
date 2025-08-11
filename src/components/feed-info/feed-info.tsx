import { FC, useMemo } from 'react';
import { useSelector } from '../../services/store';

import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';

const MAX_ORDERS_TO_SHOW = 20;

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, MAX_ORDERS_TO_SHOW);

export const FeedInfo: FC = () => {
  const orders = useSelector((state) => state.feeds.orders);
  const total = useSelector((state) => state.feeds.total);
  const totalToday = useSelector((state) => state.feeds.totalToday);

  const feed = useMemo(
    () => ({
      total,
      totalToday
    }),
    [total, totalToday]
  );

  const readyOrders = getOrders(orders, 'done');
  const pendingOrders = getOrders(orders, 'pending');

  const finalReadyOrders =
    pendingOrders.length === 0 && readyOrders.length > 0
      ? readyOrders.slice(Math.ceil(readyOrders.length / 2)).slice(0, 5)
      : readyOrders.slice(0, 5);

  const finalPendingOrders =
    pendingOrders.length === 0 && readyOrders.length > 0
      ? readyOrders.slice(0, Math.ceil(readyOrders.length / 2)).slice(0, 5)
      : pendingOrders.slice(0, 5);

  return (
    <FeedInfoUI
      readyOrders={finalReadyOrders}
      pendingOrders={finalPendingOrders}
      feed={feed}
    />
  );
};
