import { axiosClient } from "@/config/axios"
import { API_ENDPOINT } from "@/constants/api"
import { AxiosResponse } from "axios";

interface UserProfileUpdatePayload {
    userId?: number;
    fullName?: string;
    birthDate?: string | null;
    email?: string;
    occupation?: string;
    gender?: string;
    phoneNumber?: string;
    address?: string;
    city?: string;
    district?: string;
    bio?: string;
    hobby?: string;
    description?: string;
    profilePicture?: string;
    isReadyToAdopt?: boolean;
}

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
    },
    getAllAdopterApplications: () => {
        return axiosClient.get(`/AdopterApplications`);
    },
    getAdopterApplicationById: (applicationId: number) => {
        return axiosClient.get(`/AdopterApplications/${applicationId}`);
    },
    getAllUser: () => {
        return axiosClient.get(`/users`);
    },
    updateUserProfile: async (userId: number, payload: UserProfileUpdatePayload): Promise<any> => {
        try {
            const response: AxiosResponse = await axiosClient.put(`${API_ENDPOINT.USER.SELF_INFO}/${userId}`, payload);
            return response.data;
        } catch (error) {
            console.error("Error updating user profile:", error);
            throw error;
        }
    },
    updateAvatarProfile: async (userId: number, payload: { userId?: number; isReadyToAdopt?: boolean, profilePicture?: string }): Promise<any> => {
        try {
            const response: AxiosResponse = await axiosClient.put(`${API_ENDPOINT.USER.SELF_INFO}/${userId}`, payload);
            return response.data;
        } catch (error) {
            console.error("Error updating avatar or adoption status:", error);
            throw error;
        }
    },
}