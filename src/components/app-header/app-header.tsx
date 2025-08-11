import { FC } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { AppHeaderUI } from '@ui';

export const AppHeader: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const userName = user?.name || '';

  const handleConstructorClick = () => {
    navigate('/');
  };

  const handleFeedClick = () => {
    navigate('/feed');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <AppHeaderUI
      userName={userName}
      onConstructorClick={handleConstructorClick}
      onFeedClick={handleFeedClick}
      onProfileClick={handleProfileClick}
      onLogoClick={handleLogoClick}
      isConstructorActive={location.pathname === '/'}
      isFeedActive={location.pathname === '/feed'}
      isProfileActive={location.pathname.startsWith('/profile')}
    />
  );
};
