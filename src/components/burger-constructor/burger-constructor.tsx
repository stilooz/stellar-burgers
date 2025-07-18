import { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import { createOrder } from '../../services/slices/orders/ordersApi';
import { clearConstructor } from '../../services/slices/constructor/constructorSlice';
import { clearOrder } from '../../services/slices/orders/ordersSlice';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    bun,
    ingredients = [],
    totalPrice = 0
  } = useSelector((state) => state.constructor);
  const { currentOrder, loading: orderRequest = false } = useSelector(
    (state) => state.orders
  );
  const { isAuthenticated = false } = useSelector((state) => state.auth);

  const constructorItems = {
    bun,
    ingredients: ingredients || []
  };

  if (!ingredients) {
    return <div>Загрузка конструктора...</div>;
  }

  const onOrderClick = () => {
    if (!bun || orderRequest) return;

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const ingredientIds = [
      bun._id,
      ...ingredients.map((item) => item._id),
      bun._id
    ];

    dispatch(createOrder(ingredientIds)).then(() => {
      dispatch(clearConstructor());
    });
  };

  const closeOrderModal = () => {
    dispatch(clearOrder());
  };

  const price = useMemo(() => totalPrice, [totalPrice]);

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={currentOrder}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
