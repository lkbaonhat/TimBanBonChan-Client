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
    const userInfo: IRedux.UserInfo = useSelector(selectorAuth.userInfo)
    const isAuthenticated = useSelector(selectorAuth.isAuthenticated)

    if (!Object.keys(userInfo).length || !isAuthenticated) {
        return <LoadingPage />;
    }

    const userRoles = Array.isArray(userInfo.roles) ? userInfo.roles : [userInfo.roles];

    const hasPermission = userRoles.some(role => role && (allowedRoles.includes(role) || role === ROLE.ADMIN));

    if (!hasPermission) {
        return <Navigate to={ROUTES.PUBLIC.HOME} replace />;
    }

    return <Outlet />;
};

export default PrivateRoute;