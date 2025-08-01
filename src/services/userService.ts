import { axiosClient } from "@/config/axios"
import { API_ENDPOINT } from "@/constants/api"
import { AxiosResponse } from "axios";

// Define the user profile data structure
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

        try {
            const response = await axiosClient.post('/AdopterApplications', data);

            return response.data;
        } catch (error: unknown) {
            const err = error as {
                message?: string;
                response?: {
                    status?: number;
                    statusText?: string;
                    data?: unknown;
                }
            };

            console.error("userService: API error:", {
                status: err?.response?.status,
                statusText: err?.response?.statusText,
                data: err?.response?.data,
                message: err?.message
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
    updateUserProfile: async (userId: number, payload: UserProfileUpdatePayload): Promise<UserProfileUpdatePayload> => {
        try {

            const fullUrl = `${API_ENDPOINT.USER.SELF_INFO}/${userId}`;

            const response: AxiosResponse<UserProfileUpdatePayload> = await axiosClient.put(fullUrl, payload);

            return response.data;
        } catch (error: unknown) {
            console.error("Error updating user profile:", error);

            // Cast error to a type with response property
            const err = error as {
                message?: string;
                response?: {
                    status?: number;
                    statusText?: string;
                    data?: unknown;
                }
            };

            console.error("Error details:", {
                status: err?.response?.status,
                statusText: err?.response?.statusText,
                data: err?.response?.data,
                message: err?.message
            });
            throw error;
        }
    },
    updateAvatarProfile: async (userId: number, profileData: { userId?: number; isReadyToAdopt?: boolean, profilePicture?: string }): Promise<UserProfileUpdatePayload> => {
        try {


            const response: AxiosResponse<UserProfileUpdatePayload> = await axiosClient.put(`${API_ENDPOINT.USER.SELF_INFO}/${userId}`, profileData);
            return response.data;
        } catch (error) {
            console.error("Error updating avatar or adoption status:", error);
            throw error;
        }
    },
    updateAdopterStatus: async (userId: number, isReadyToAdopt: boolean): Promise<UserProfileUpdatePayload> => {
        try {
            if (!userId) {
                throw new Error("User ID not provided");
            }

            const payload = {
                userId: userId,  // Đảm bảo userId nằm trong payload
                isReadyToAdopt
            };

            const response: AxiosResponse<UserProfileUpdatePayload> = await axiosClient.put(`${API_ENDPOINT.USER.SELF_INFO}/${userId}`, payload);
            return response.data;
        } catch (error) {
            console.error("Error updating adopter status:", error);
            throw error;
        }
    },
    //Donation
    createPayment: async (payload: any) => {
        return axiosClient.post(`/Donations/create-payment`, payload);
    }
}