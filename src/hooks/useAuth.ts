import { selectorAuth } from "@/store/modules/auth/selector"
import { useSelector } from "react-redux"

export const useAuth = () => {
    const isAuthenticated = useSelector(selectorAuth.isAuthenticated)
    const userInfo = useSelector(selectorAuth.userInfo)

    const hasRole = (roles: ('guest' | 'staff' | 'admin')[]) => {
        if (!userInfo) return false;
        return roles.includes(userInfo.role)
    };

    return { isAuthenticated, userInfo, hasRole }
}