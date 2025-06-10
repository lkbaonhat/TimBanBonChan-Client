import { axiosClient } from "@/config/axios"
import { API_ENDPOINT } from "@/constants/api"

export const userService = {
    getSelfInfo: (userId: string) => {
        return axiosClient.get(`${API_ENDPOINT.USER.SELF_INFO}/${userId}`)
    }
}