import { useSelector } from '../../services/store';

import { ConstructorPageUI } from '@ui-pages';

export const ConstructorPage = () => {
  const isIngredientsLoading = useSelector(
    (state) => state.ingredients.loading
  );

  return (
    <>
      {isIngredientsLoading ? (
        <p>Загрузка...</p>
      ) : (
        <ConstructorPageUI isIngredientsLoading={isIngredientsLoading} />
      )}
    </>
  );
};
