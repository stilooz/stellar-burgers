import { useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  connectFeedSocket,
  disconnectFeedSocket
} from '../../services/slices/wsFeedSlice';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC } from 'react';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const { orders, total, totalToday, wsStatus } = useSelector(
    (state) => state.wsFeed
  );

  useEffect(() => {
    dispatch(connectFeedSocket());
    return () => {
      dispatch(disconnectFeedSocket());
    };
  }, [dispatch]);

  if (wsStatus !== 'online') {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={() => {}} />;
};
