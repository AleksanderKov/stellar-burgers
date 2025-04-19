import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';
import { getUserData } from '../../services/slices/authSlice';

export const AppHeader = () => {
  const user = useSelector(getUserData);
  const displayName: string = user?.name ?? '';

  return <AppHeaderUI userName={displayName} />;
};

export default AppHeader;
