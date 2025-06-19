import { axiosClient } from "@/config/axios"
import { API_ENDPOINT } from "@/constants/api"

export const userService = {
    getSelfInfo: (userId: string) => {
        return axiosClient.get(`${API_ENDPOINT.USER.SELF_INFO}/${userId}`)
    },
    createAdoptionApplication: (payload: any) => {
        return axiosClient.post('/adoptionApplication', payload);
    },
    createVolunteerApplication: (payload: any) => {
        return axiosClient.post('/volunteerApplication', payload);
    },
    createAdopterApplication: async (data: any) => {
        console.log("userService: Sending adopter application data to API:", data);
        try {
            const response = await axiosClient.post('/AdopterApplications', data);
            console.log("userService: API response:", response);
            return response.data;
        } catch (error: any) {
            console.error("userService: API error:", {
                status: error?.response?.status,
                statusText: error?.response?.statusText,
                data: error?.response?.data,
                message: error?.message
            });
            throw error;
        }
    }
}