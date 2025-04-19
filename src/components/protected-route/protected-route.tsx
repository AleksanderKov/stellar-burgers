import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { getUserData, getAuthStatus } from '../../services/slices/authSlice';
import { Preloader } from '@ui';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

const ProtectedRoute = ({
  onlyUnAuth = false,
  children
}: ProtectedRouteProps) => {
  const isAuthChecked = useSelector(getAuthStatus);
  const user = useSelector(getUserData);
  const location = useLocation();

  if (!isAuthChecked) return <Preloader />;

  const redirectPath = location.state?.from?.pathname || '/';

  if (onlyUnAuth && user) {
    return <Navigate to={redirectPath} replace />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
