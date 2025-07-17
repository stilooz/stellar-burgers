import { FC, useMemo, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { getOrderByNumberApi } from '../../utils/burger-api';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const location = useLocation();
  const dispatch = useDispatch();

  const isProfile = location.pathname.startsWith('/profile');
  const orders = useSelector((state) =>
    isProfile ? state.wsProfile.orders : state.wsFeed.orders
  );
  const ingredients = useSelector((state) => state.ingredients.items);

  const orderData = orders.find(
    (order: any) => String(order.number) === number
  ) as any | undefined;

  useEffect(() => {
    if (!orderData && number) {
      getOrderByNumberApi(Number(number));
      // TODO: если появится thunk типа fetchOrderByNumber — диспатчить его
    }
  }, [orderData, number]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = (
      orderData.ingredients as string[]
    ).reduce<TIngredientsWithCount>((acc, item) => {
      if (!acc[item]) {
        const ingredient = ingredients.find((ing) => ing._id === item);
        if (ingredient) {
          acc[item] = {
            ...ingredient,
            count: 1
          };
        }
      } else {
        acc[item].count++;
      }
      return acc;
    }, {});

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
