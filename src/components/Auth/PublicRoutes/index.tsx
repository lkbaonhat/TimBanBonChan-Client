import ROUTES from "@/constants/routes"
import { selectorAuth } from "@/store/modules/auth/selector"
import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom"

const PublicRoute = () => {
    const isAuthenticated = useSelector(selectorAuth.isAuthenticated)
    if (isAuthenticated)
        return <Navigate to={ROUTES.PUBLIC.HOME} replace />;
    return <Outlet />
}

export default PublicRoute