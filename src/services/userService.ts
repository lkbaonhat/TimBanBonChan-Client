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
    getAllAdopterApplications: () => {
        return axiosClient.get(`/AdopterApplications`);
    },
    getAdopterApplicationById: (applicationId: number) => {
        return axiosClient.get(`/AdopterApplications/${applicationId}`)
    },
    getAllUser: () => {
        return axiosClient.get(`/users`)
    }
}    