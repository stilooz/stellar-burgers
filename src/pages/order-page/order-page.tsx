import { FC } from 'react';
import { OrderInfo } from '@components';
import styles from './order-page.module.css';

export const OrderPage: FC = () => (
  <div className={styles.container}>
    <OrderInfo />
  </div>
);
