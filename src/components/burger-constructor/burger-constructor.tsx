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
  const constructorState = useSelector(selectConstructor);
  const { bun, ingredients } = constructorState || {
    bun: null,
    ingredients: []
  };

  const totalPrice = useMemo(
    () =>
      (bun ? bun.price * 2 : 0) +
      ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [bun, ingredients]
  );

  return (
    <div
      style={{
        flex: 1,
        height: '100%',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      <div style={{ flexGrow: 1 }}>
        {/* Верхняя булка */}
        <div
          style={{
            marginBottom: '20px',
            padding: '20px',
            border: '2px dashed #E0E0E0',
            borderRadius: '8px',
            textAlign: 'center',
            backgroundColor: bun ? '#F8F8F8' : '#FAFAFA'
          }}
        >
          {bun ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <img
                src={bun.image}
                alt={bun.name}
                style={{
                  width: '80px',
                  height: '40px',
                  objectFit: 'cover'
                }}
              />
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div style={{ fontWeight: 'bold' }}>{bun.name} (верх)</div>
                <div style={{ color: '#666' }}>{bun.price}₽</div>
              </div>
            </div>
          ) : (
            <div style={{ color: '#999', fontSize: '14px' }}>
              Перетащите булку сюда
            </div>
          )}
        </div>

        {/* Начинки */}
        <div
          style={{
            minHeight: '200px',
            maxHeight: '300px',
            padding: '15px',
            border: '2px dashed #E0E0E0',
            borderRadius: '8px',
            backgroundColor: '#FAFAFA',
            overflowY: 'auto'
          }}
        >
          {ingredients.length > 0 ? (
            ingredients.map((item, index) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  padding: '10px',
                  marginBottom: '10px',
                  backgroundColor: 'white',
                  border: '1px solid #E0E0E0',
                  borderRadius: '6px'
                }}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    width: '60px',
                    height: '30px',
                    objectFit: 'cover'
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold' }}>{item.name}</div>
                  <div style={{ color: '#666' }}>{item.price}₽</div>
                </div>
                <div style={{ display: 'flex', gap: '5px' }}>
                  <button
                    style={{
                      padding: '5px 10px',
                      border: 'none',
                      backgroundColor: '#F0F0F0',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    ↑
                  </button>
                  <button
                    style={{
                      padding: '5px 10px',
                      border: 'none',
                      backgroundColor: '#F0F0F0',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    ↓
                  </button>
                  <button
                    style={{
                      padding: '5px 10px',
                      border: 'none',
                      backgroundColor: '#FFE0E0',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    ×
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div
              style={{
                textAlign: 'center',
                color: '#999',
                fontSize: '14px',
                paddingTop: '50px'
              }}
            >
              Перетащите ингредиенты сюда
            </div>
          )}
        </div>

        {/* Нижняя булка */}
        <div
          style={{
            marginTop: '20px',
            padding: '20px',
            border: '2px dashed #E0E0E0',
            borderRadius: '8px',
            textAlign: 'center',
            backgroundColor: bun ? '#F8F8F8' : '#FAFAFA'
          }}
        >
          {bun ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <img
                src={bun.image}
                alt={bun.name}
                style={{
                  width: '80px',
                  height: '40px',
                  objectFit: 'cover'
                }}
              />
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div style={{ fontWeight: 'bold' }}>{bun.name} (низ)</div>
                <div style={{ color: '#666' }}>{bun.price}₽</div>
              </div>
            </div>
          ) : (
            <div style={{ color: '#999', fontSize: '14px' }}>
              Перетащите булку сюда
            </div>
          )}
        </div>
      </div>

      {/* Итоговая информация */}
      <div
        style={{
          marginTop: '20px',
          padding: '20px',
          backgroundColor: '#F8F8F8',
          borderRadius: '8px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
          {totalPrice}₽
        </div>
        <button
          disabled={!bun || ingredients.length === 0}
          style={{
            padding: '15px 30px',
            backgroundColor: bun && ingredients.length > 0 ? '#4C4CFF' : '#CCC',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            cursor: bun && ingredients.length > 0 ? 'pointer' : 'not-allowed'
          }}
        >
          Оформить заказ
        </button>
      </div>
    </div>
  );
};
