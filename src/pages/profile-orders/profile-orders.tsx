import { useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  connectProfileSocket,
  disconnectProfileSocket
} from '../../services/slices/wsProfileSlice';
import { ProfileOrdersUI } from '@ui-pages';
import { FC } from 'react';
import { Preloader } from '../../components/ui';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const { orders, wsStatus } = useSelector((state) => state.wsProfile);

  useEffect(() => {
    dispatch(connectProfileSocket());
    return () => {
      dispatch(disconnectProfileSocket());
    };
  }, [dispatch]);

  if (wsStatus !== 'online') {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
