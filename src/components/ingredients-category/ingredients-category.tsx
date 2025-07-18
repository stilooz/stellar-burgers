import { forwardRef, useMemo } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { addIngredient } from '../../services/slices/constructor/constructorSlice';
import { TIngredientsCategoryProps } from './type';
import { TIngredient } from '@utils-types';
import { IngredientsCategoryUI } from '../ui/ingredients-category';

export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(({ title, titleRef, ingredients }, ref) => {
  const dispatch = useDispatch();
  const { bun, ingredients: constructorIngredients } = useSelector(
    (state) => state.constructor
  );

  const burgerConstructor = {
    bun: bun || { _id: '' },
    ingredients: constructorIngredients || []
  };

  const ingredientsCounters = useMemo(() => {
    const counters: { [key: string]: number } = {};

    if (burgerConstructor.bun) {
      counters[burgerConstructor.bun._id] = 2;
    }

    burgerConstructor.ingredients.forEach((ingredient: TIngredient) => {
      if (ingredient._id) {
        counters[ingredient._id] = (counters[ingredient._id] || 0) + 1;
      }
    });

    return counters;
  }, [burgerConstructor]);

  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={ingredientsCounters}
      ref={ref}
    />
  );
});
