import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  selectConstructor,
  orderConstructorBurgerApi,
  handleCloseOrderModal
} from '../../services/slices/constructorSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const constructorState = useSelector(selectConstructor);
  const { bun, ingredients, orderRequest, orderModalData } = constructorState;

  const onOrderClick = () => {
    if (!bun || orderRequest) return;
    const ingredientIds = [
      bun._id,
      ...ingredients.map((i) => i._id),
      bun._id
    ];
    dispatch(orderConstructorBurgerApi(ingredientIds));
  };
  const closeOrderModal = () => {
    dispatch(handleCloseOrderModal());
  };

  const price = useMemo(
    () =>
      (bun ? bun.price * 2 : 0) +
      ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [bun, ingredients]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={{ bun, ingredients }}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
