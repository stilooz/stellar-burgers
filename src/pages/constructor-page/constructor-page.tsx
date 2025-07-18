import { useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { fetchIngredients } from '../../services/slices/ingredients/ingredientsApi';
import { getUser } from '../../services/slices/auth/authApi';

import styles from './constructor-page.module.css';

import { BurgerIngredients } from '../../components';
import { BurgerConstructor } from '../../components';
import { Preloader } from '../../components/ui';
import { FC } from 'react';

export const ConstructorPage: FC = () => {
  const dispatch = useDispatch();

  const { loading: isIngredientsLoading = false, error: ingredientsError } =
    useSelector((state) => state.ingredients);

  const { authChecked = false } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchIngredients());

    if (!authChecked) {
      dispatch(getUser());
    }
  }, [dispatch, authChecked]);

  if (isIngredientsLoading) {
    return <Preloader />;
  }

  if (ingredientsError) {
    return (
      <div className={styles.error}>
        <h2>Ошибка загрузки ингредиентов</h2>
        <p>{ingredientsError}</p>
      </div>
    );
  }

  return (
    <main className={styles.containerMain}>
      <h1
        className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}
      >
        Соберите бургер
      </h1>
      <div className={`${styles.main} pl-5 pr-5`}>
        <BurgerIngredients />
        <BurgerConstructor />
      </div>
    </main>
  );
};
