import { useState, useRef, useEffect, FC } from 'react';
import { useInView } from 'react-intersection-observer';

import { TTabMode } from '@utils-types';
import { BurgerIngredientsUI } from '../ui/burger-ingredients';
import { useSelector } from '../../services/store';

export const BurgerIngredients: FC = () => {
  const { items, loading } = useSelector((state) => state.ingredients);

  if (loading) return <div>Загрузка ингредиентов...</div>;

  if (!items || items.length === 0) return <div>Нет ингредиентов</div>;

  const buns = items.filter((item) => item.type === 'bun');
  const mains = items.filter((item) => item.type === 'main');
  const sauces = items.filter((item) => item.type === 'sauce');

  return (
    <div style={{ flex: 1, height: '100%', overflow: 'auto' }}>
      <nav style={{ display: 'flex', marginBottom: '20px' }}>
        <button
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            backgroundColor: '#4C4CFF',
            color: 'white',
            border: 'none',
            borderRadius: '6px'
          }}
        >
          Булки
        </button>
        <button
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            backgroundColor: '#8585AD',
            color: 'white',
            border: 'none',
            borderRadius: '6px'
          }}
        >
          Соусы
        </button>
        <button
          style={{
            padding: '10px 20px',
            backgroundColor: '#8585AD',
            color: 'white',
            border: 'none',
            borderRadius: '6px'
          }}
        >
          Начинки
        </button>
      </nav>

      <div>
        <h3 style={{ marginBottom: '15px' }}>Булки</h3>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '15px',
            marginBottom: '30px'
          }}
        >
          {buns.map((item) => (
            <div
              key={item._id}
              style={{
                width: 'calc(50% - 7.5px)',
                minWidth: '180px',
                padding: '15px',
                border: '1px solid #E0E0E0',
                borderRadius: '8px',
                textAlign: 'center'
              }}
            >
              <img
                src={item.image}
                alt={item.name}
                style={{
                  width: '100%',
                  height: '100px',
                  objectFit: 'cover',
                  marginBottom: '10px'
                }}
              />
              <div style={{ marginBottom: '5px' }}>
                <span style={{ fontWeight: 'bold' }}>{item.price}₽</span>
              </div>
              <div style={{ fontSize: '14px' }}>{item.name}</div>
            </div>
          ))}
        </div>

        <h3 style={{ marginBottom: '15px' }}>Соусы</h3>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '15px',
            marginBottom: '30px'
          }}
        >
          {sauces.map((item) => (
            <div
              key={item._id}
              style={{
                width: 'calc(50% - 7.5px)',
                minWidth: '180px',
                padding: '15px',
                border: '1px solid #E0E0E0',
                borderRadius: '8px',
                textAlign: 'center'
              }}
            >
              <img
                src={item.image}
                alt={item.name}
                style={{
                  width: '100%',
                  height: '100px',
                  objectFit: 'cover',
                  marginBottom: '10px'
                }}
              />
              <div style={{ marginBottom: '5px' }}>
                <span style={{ fontWeight: 'bold' }}>{item.price}₽</span>
              </div>
              <div style={{ fontSize: '14px' }}>{item.name}</div>
            </div>
          ))}
        </div>

        <h3 style={{ marginBottom: '15px' }}>Начинки</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
          {mains.map((item) => (
            <div
              key={item._id}
              style={{
                width: 'calc(50% - 7.5px)',
                minWidth: '180px',
                padding: '15px',
                border: '1px solid #E0E0E0',
                borderRadius: '8px',
                textAlign: 'center'
              }}
            >
              <img
                src={item.image}
                alt={item.name}
                style={{
                  width: '100%',
                  height: '100px',
                  objectFit: 'cover',
                  marginBottom: '10px'
                }}
              />
              <div style={{ marginBottom: '5px' }}>
                <span style={{ fontWeight: 'bold' }}>{item.price}₽</span>
              </div>
              <div style={{ fontSize: '14px' }}>{item.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
