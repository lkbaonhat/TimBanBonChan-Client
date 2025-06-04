import { axiosClient } from "@/config/axios";
import { API_ENDPOINT } from "@/constants/api";

export const volunteerServices = {
    getAllVolunteerApplications: (pageNumber: number, pageSize: number) => {
        return axiosClient.get(`${API_ENDPOINT.VOLUNTEER.APPLICATIONS}?PageNumber=${pageNumber}&PageSize=${pageSize}`);
    },
    getVolunteerApplicationById: (id: string) => {
        return axiosClient.get(`/volunteerApplication/${id}`);
    },
    createVolunteerApplication: (applicationData: any) => {
        return axiosClient.post("/volunteer-applications", applicationData);
    },
    updateVolunteerApplication: (id: string, applicationData: any) => {
        return axiosClient.put(`/volunteer-applications/${id}`, applicationData);
    },
    updateVolunteerApplicationStatus: (id: string, payload: any) => {
        return axiosClient.put(`${API_ENDPOINT.VOLUNTEER.APPLICATIONS}/${id}/review`, payload);
    },
    deleteVolunteerApplication: (id: string) => {
        return axiosClient.delete(`/volunteer-applications/${id}`);
    },
}