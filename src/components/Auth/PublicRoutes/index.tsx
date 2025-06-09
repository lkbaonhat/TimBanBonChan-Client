import ROUTES from "@/constants/routes"
import { selectorAuth } from "@/store/modules/auth/selector"
import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"

interface PublicRouteProps {
    children: React.ReactNode
}

const PublicRoute = ({ children }: PublicRouteProps) => {
    const isAuthenticated = useSelector(selectorAuth.isAuthenticated)
    if (isAuthenticated)
        return <Navigate to={ROUTES.PUBLIC.HOME} replace />;
    return <>{children}</>
}

export default PublicRoute