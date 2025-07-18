import { useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { fetchProfileOrders } from '../../services/slices/orders/profileOrdersSlice';
import { ProfileOrdersUI } from '@ui-pages';
import { Preloader } from '@ui';
import { FC } from 'react';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector(
    (state) => state.profileOrders
  );

  useEffect(() => {
    dispatch(fetchProfileOrders());
  }, [dispatch]);

  if (loading) {
    return <Preloader />;
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <h2>Ошибка загрузки заказов</h2>
        <p>{error}</p>
      </div>
    );
  }

  return <ProfileOrdersUI orders={orders} />;
};
