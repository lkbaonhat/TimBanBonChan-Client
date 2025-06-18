import { axiosClient } from "@/config/axios";
import { API_ENDPOINT } from "@/constants/api";

export const petService = {
  getAllPets: () => {
    return axiosClient.get("/pets/filter");
  },
  getPetBySlug: (slug: string) => {
    return axiosClient.get(`/pets/${slug}`);
  },
  createPet: (petData: any) => {
    return axiosClient.post("/pets", petData);
  },
  updatePet: (id: string, petData: any) => {
    return axiosClient.put(`/pets/${id}`, petData);
  },
  deletePet: (id: string) => {
    return axiosClient.delete(`/pets/${id}`);
  },
  getAllAdoptionApplications: () => {
    return axiosClient.get(API_ENDPOINT.PET.ADOPTION_APPLICATIONS);
  },
  getAdoptionApplicationById: (id: string) => {
    return axiosClient.get(`${API_ENDPOINT.PET.ADOPTION_APPLICATIONS}/${id}`);
  },
  updateAdoptionApplicationStatus: (id: string, status: string) => {
    return axiosClient.patch(`${API_ENDPOINT.PET.ADOPTION_APPLICATIONS}/${id}/status`, { status });
  },
  getPetsNeedingVerification: () => {
    // Giả định API để lấy danh sách thú cưng cần xác minh
    return axiosClient.get("/pets/pending-verification");
  },
  verifyPet: (id: number, isApproved: boolean) => {
    // Giả định API để xác minh thú cưng
    return axiosClient.patch(`/pets/${id}/verify`, { isApproved });
  },
  getAdoptionPostDetail: (postId: string) => {
    return axiosClient.get(`/adoptionPost/${postId}`)
  },
  getAllAdoptionPost: () => {
    return axiosClient.get(API_ENDPOINT.PET.ADOPTION_POST)
  }
};
