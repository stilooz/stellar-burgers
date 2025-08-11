import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { Preloader } from '@ui';
import { IngredientDetails } from '@components';
import styles from './ingredient-page.module.css';

export const IngredientPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const { ingredients, loading } = useSelector((state) => state.ingredients);

  const ingredient = ingredients.find((item) => item._id === id);

  if (loading) {
    return <Preloader />;
  }

  if (!ingredient) {
    return (
      <div className={styles.container}>
        <h2 className='text text_type_main-large'>Ингредиент не найден</h2>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className='text text_type_main-large mb-5'>Детали ингредиента</h2>
      <IngredientDetails />
    </div>
  );
};
