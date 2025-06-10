import { isTokenValid } from "@/lib/utils"
import { selectorAuth } from "@/store/modules/auth/selector"
import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"

export const useAuth = () => {
    const dispatch = useDispatch()
    const isAuthenticated = useSelector(selectorAuth.isAuthenticated)

    useEffect(() => {
        const token = localStorage.getItem("accessToken");

        if (token) {
            try {
                if (isTokenValid(token)) {
                    dispatch({
                        type: "FETCH_USER_LOGIN",
                        payload: token
                    })
                } else {
                    dispatch({
                        type: "LOGOUT",
                        callback: () => { }
                    })
                }
            } catch (error) {
                console.error("Invalid token:", error);
                dispatch({
                    type: "LOGOUT",
                    callback: () => { }
                });
            }
        }
    }, [isAuthenticated])
}