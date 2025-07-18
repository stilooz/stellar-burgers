import { useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { fetchProfileOrders } from '../../services/slices/orders/profileOrdersSlice';
import { ProfileOrdersUI } from '@ui-pages';
import { Preloader } from '@ui';
import { FC } from 'react';
import { getCookie } from '../../utils/cookie';

export const ProfileOrders: FC = () => {
  console.log('🔥 ProfileOrders component loaded!');

  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector(
    (state) => state.profileOrders
  );
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  console.log('🔥 ProfileOrders render - isAuthenticated:', isAuthenticated);
  console.log('🔥 ProfileOrders render - orders:', orders);
  console.log('🔥 ProfileOrders render - loading:', loading);
  console.log('🔥 ProfileOrders render - error:', error);

  useEffect(() => {
    console.log('ProfileOrders useEffect triggered');
    console.log('Is authenticated:', isAuthenticated);
    console.log('User:', user);
    console.log('Access token:', getCookie('accessToken'));

    if (isAuthenticated) {
      console.log('Fetching profile orders...');
      dispatch(fetchProfileOrders());
    } else {
      console.log('User not authenticated, cannot fetch orders');
    }
  }, [dispatch, isAuthenticated]);

  console.log('ProfileOrders render - orders:', orders);
  console.log('ProfileOrders render - loading:', loading);
  console.log('ProfileOrders render - error:', error);

  if (loading) {
    return <Preloader />;
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <h2>Ошибка загрузки заказов</h2>
        <p>{error}</p>
        <button onClick={() => dispatch(fetchProfileOrders())}>
          Попробовать еще раз
        </button>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <h2>Необходима авторизация</h2>
        <p>Для просмотра заказов войдите в систему</p>
      </div>
    );
  }

  return <ProfileOrdersUI orders={orders} />;
};
