import { BurgerIngredients } from '../../components/burger-ingredients/burger-ingredients';
import { BurgerConstructor } from '../../components/burger-constructor/burger-constructor';
import { useSelector } from '../../services/store';

export const ConstructorPage = () => {
  const isIngredientsLoading = useSelector(
    (state) => state.ingredients?.loading || false
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden'
      }}
    >
      <h1
        style={{
          fontSize: 'clamp(24px, 4vw, 36px)',
          fontWeight: 'bold',
          margin: '20px',
          textAlign: 'center'
        }}
      >
        Соберите бургер
      </h1>
      {isIngredientsLoading ? (
        <div
          style={{
            padding: '20px',
            textAlign: 'center',
            fontSize: '18px'
          }}
        >
          Загрузка...
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            gap: '20px',
            padding: '0 20px 20px 20px',
            height: 'calc(100vh - 120px)',
            overflow: 'hidden'
          }}
        >
          <BurgerIngredients />
          <BurgerConstructor />
        </div>
      )}
    </div>
  );
};
