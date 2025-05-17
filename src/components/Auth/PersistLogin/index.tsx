import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import LoadingPage from '@/pages/Loading';
import { selectorAuth } from '@/store/modules/auth/selector';
import ROUTES from '@/constants/routes';

const PersistToken = () => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const isAuthenticated = useSelector(selectorAuth.isAuthenticated);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAccessToken = () => {
      if (!isAuthenticated) {
        navigate(ROUTES.PUBLIC.SIGNIN);
      } else {
        setIsLoading(false);
      }
    };

    checkAccessToken();
  }, [isAuthenticated, navigate, dispatch]);

  if (isLoading) {
    return <LoadingPage />;
  }

  return <Outlet />;
};

export default PersistToken;