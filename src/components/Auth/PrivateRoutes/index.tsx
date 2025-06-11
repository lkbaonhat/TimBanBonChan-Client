import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LoadingPage from '@/pages/Loading';
import ROUTES from '@/constants/routes';
import { ROLE } from '@/constants/global';
import { selectorAuth } from '@/store/modules/auth/selector';

interface PrivateRouteProps {
    allowedRoles: string[];
}

const PrivateRoute = ({ allowedRoles }: PrivateRouteProps) => {
    const userInfo = useSelector(selectorAuth.userInfo)
    const isAuthenticated = useSelector(selectorAuth.isAuthenticated)

    if (!Object.keys(userInfo).length || !isAuthenticated) {
        return <LoadingPage />;
    }

    if (!allowedRoles.includes(userInfo.role) && userInfo.role !== ROLE.ADMIN) {
        return <Navigate to={ROUTES.PUBLIC.HOME} replace />;
    }

    return <Outlet />;
};

export default PrivateRoute;