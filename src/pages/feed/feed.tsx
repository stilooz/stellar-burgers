import { useEffect, FC } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  connectFeedSocket,
  disconnectFeedSocket
} from '../../services/slices/wsFeedSlice';
import { fetchFeeds } from '../../services/slices/feedsSlice';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';

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

  const handleGetFeeds = () => {
    dispatch(fetchFeeds());
  };

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
