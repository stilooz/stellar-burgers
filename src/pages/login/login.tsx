import { FC, SyntheticEvent, useState, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { loginUser } from '../../services/slices/auth/authApi';
import { clearError } from '../../services/slices/auth/authSlice';
import { LoginUI } from '@ui-pages';

export const Login: FC = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (error) {
      dispatch(clearError());
    }
  }, [email, password, dispatch, error]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    if (!email || !password) {
      return;
    }

    dispatch(loginUser({ email, password }));
  };

  return (
    <LoginUI
      errorText={error || ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
