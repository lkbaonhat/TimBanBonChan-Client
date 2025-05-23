import { axiosClient } from "@/config/axios";
import { API_ENDPOINT } from "@/constants/api";

export const volunteerServices = {
    getAllVolunteerApplications: (pageNumber: number, pageSize: number) => {
        return axiosClient.get(`${API_ENDPOINT.VOLUNTEER.APPLICATIONS}?PageNumber=${pageNumber}&PageSize=${pageSize}`);
    },
    getVolunteerApplicationById: (id: string) => {
        return axiosClient.get(`/volunteer-applications/${id}`);
    },
    createVolunteerApplication: (applicationData: any) => {
        return axiosClient.post("/volunteer-applications", applicationData);
    },
    updateVolunteerApplication: (id: string, applicationData: any) => {
        return axiosClient.put(`/volunteer-applications/${id}`, applicationData);
    },
    updateVolunteerApplicationStatus: (id: string, status: string) => {
        return axiosClient.patch(`/volunteer-applications/${id}/status`, { status });
    },
    deleteVolunteerApplication: (id: string) => {
        return axiosClient.delete(`/volunteer-applications/${id}`);
    },
}