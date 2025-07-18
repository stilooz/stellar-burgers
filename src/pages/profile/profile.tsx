import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { updateUser } from '../../services/slices/auth/authApi';
import { clearError } from '../../services/slices/auth/authSlice';
import { ProfileUI } from '@ui-pages';

export const Profile: FC = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);

  const [formValue, setFormValue] = useState({
    name: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    if (user) {
      setFormValue({
        name: user.name,
        email: user.email,
        password: ''
      });
    }
  }, [user]);

  useEffect(() => {
    if (error) {
      dispatch(clearError());
    }
  }, [formValue, dispatch, error]);

  const isFormChanged = user
    ? formValue.name !== user.name ||
      formValue.email !== user.email ||
      formValue.password !== ''
    : false;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    if (!formValue.name || !formValue.email) {
      return;
    }

    const updateData: any = {
      name: formValue.name,
      email: formValue.email
    };

    if (formValue.password) {
      updateData.password = formValue.password;
    }

    dispatch(updateUser(updateData));
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();

    if (user) {
      setFormValue({
        name: user.name,
        email: user.email,
        password: ''
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
