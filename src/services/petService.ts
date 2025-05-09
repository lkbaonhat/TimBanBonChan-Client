import { axiosClient } from "@/config/axios";

export const petService = {
  getAllPets: () => {
    return axiosClient.get("/Pets");
  },
  getPetById: (id: string) => {
    return axiosClient.get(`/pets/${id}`);
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
