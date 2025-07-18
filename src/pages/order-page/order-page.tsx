import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { Preloader } from '@ui';
import { OrderInfo } from '@components';
import styles from './order-page.module.css';

export const OrderPage: FC = () => {
  const { number } = useParams<{ number: string }>();
  const { orderDetails, loading } = useSelector((state) => state.orders);

  if (loading) {
    return <Preloader />;
  }

  if (!orderDetails && !loading) {
    return (
      <div className={styles.container}>
        <h2 className='text text_type_main-large'>Заказ не найден</h2>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className='text text_type_main-large mb-5'>Информация о заказе</h2>
      <OrderInfo />
    </div>
  );
};
