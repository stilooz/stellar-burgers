import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { ConstructorPage } from '../../pages/constructor-page/constructor-page';
import { Feed } from '../../pages/feed/feed';
import { Login } from '../../pages/login/login';
import { Register } from '../../pages/register/register';
import { ForgotPassword } from '../../pages/forgot-password/forgot-password';
import { ResetPassword } from '../../pages/reset-password/reset-password';
import { Profile } from '../../pages/profile/profile';
import { ProfileOrders } from '../../pages/profile-orders/profile-orders';
import { NotFound404 } from '../../pages/not-fount-404/not-fount-404';
import { ProtectedRoute } from '../ProtectedRoute/ProtectedRoute';
import { Modal } from '../modal/modal';
import { OrderInfo } from '../order-info/order-info';
import { IngredientDetails } from '../ingredient-details/ingredient-details';
import { useDispatch } from '../../services/store';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    try {
      dispatch(fetchIngredients());
    } catch (error) {
      console.error('Error fetching ingredients:', error);
    }
  }, [dispatch]);

  return (
    <BrowserRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <Routes>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path='/feed/:number'
          element={
            <div>
              <h2>Детали заказа</h2>
              <p>Информация о заказе</p>
            </div>
          }
        />
        <Route
          path='/ingredients/:id'
          element={
            <div>
              <h2>Детали ингредиента</h2>
              <p>Информация об ингредиенте</p>
            </div>
          }
        />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <div>
                <h2>Детали заказа</h2>
                <p>Информация о заказе из профиля</p>
              </div>
            </ProtectedRoute>
          }
        />
        <Route path='*' element={<NotFound404 />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
