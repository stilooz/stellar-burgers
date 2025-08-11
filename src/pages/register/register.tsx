import { FC, SyntheticEvent, useState, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { registerUser } from '../../services/slices/auth/authApi';
import { clearError } from '../../services/slices/auth/authSlice';
import { RegisterUI } from '@ui-pages';

export const Register: FC = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (error) {
      dispatch(clearError());
    }
  }, [userName, email, password, dispatch, error]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    if (!userName || !email || !password) {
      return;
    }

    dispatch(
      registerUser({
        name: userName,
        email,
        password
      })
    );
  };

  return (
    <RegisterUI
      errorText={error || ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      userName={userName}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
