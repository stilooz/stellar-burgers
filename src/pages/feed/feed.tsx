import { useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { fetchFeeds } from '../../services/slices/feeds/feedsApi';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC } from 'react';

export const Feed: FC = () => {
  const dispatch = useDispatch();

  const { orders, loading, error } = useSelector((state) => state.feeds);

  useEffect(() => {
    console.log('Feed useEffect triggered');
    console.log('Current orders:', orders);
    dispatch(fetchFeeds());
  }, [dispatch]);

  console.log('Feed render - orders:', orders);
  console.log('Feed render - loading:', loading);
  console.log('Feed render - error:', error);

  const handleGetFeeds = () => {
    console.log('Manual feed refresh triggered');
    dispatch(fetchFeeds());
  };

  if (loading) {
    return <Preloader />;
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <h2>Ошибка загрузки ленты заказов</h2>
        <p>{error}</p>
        <button onClick={handleGetFeeds}>Попробовать еще раз</button>
      </div>
    );
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
