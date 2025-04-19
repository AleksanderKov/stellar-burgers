import { FC, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

import { useDispatch } from '../../services/store';
import { fetchLogoutUser } from '../../services/slices/authSlice';
import { ProfileMenuUI } from '@ui';

export const ProfileMenu: FC = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  const handleLogout = useCallback(() => {
    dispatch(fetchLogoutUser());
  }, [dispatch]);

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
