import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useLocation
} from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from '../../services/store';
import { getUser } from '../../services/slices/auth/authApi';
import { setAuthChecked } from '../../services/slices/auth/authSlice';
import { fetchIngredients } from '../../services/slices/ingredients/ingredientsApi';
import { getCookie } from '../../utils/cookie';
import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404,
  IngredientPage,
  OrderPage
} from '@pages';
import '../../index.css';
import styles from './app.module.css';

import { AppHeader, Modal, IngredientDetails, OrderInfo } from '@components';
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';

const AppRoutes = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const background = location.state?.background;

  useEffect(() => {
    dispatch(fetchIngredients());

    const accessToken = getCookie('accessToken');
    if (accessToken) {
      dispatch(getUser());
    } else {
      dispatch(setAuthChecked(true));
    }
  }, [dispatch]);

  const handleCloseModal = () => {
    navigate(-1);
  };

  return (
    <>
      <AppHeader />
      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route
          path='/login'
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
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
        <Route path='/ingredients/:id' element={<IngredientPage />} />
        <Route path='/feed/:number' element={<OrderPage />} />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <OrderPage />
            </ProtectedRoute>
          }
        />
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {background && (
        <Routes>
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={handleCloseModal}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/feed/:number'
            element={
              <Modal title='Информация о заказе' onClose={handleCloseModal}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <Modal title='Информация о заказе' onClose={handleCloseModal}>
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </>
  );
};

const App = () => (
  <div className={styles.app}>
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <AppRoutes />
    </BrowserRouter>
  </div>
);

export default App;
