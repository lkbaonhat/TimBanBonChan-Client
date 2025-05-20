import { axiosClient } from "@/config/axios";

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
};
