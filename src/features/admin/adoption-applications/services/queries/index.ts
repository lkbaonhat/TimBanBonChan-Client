import { petService } from "@/services/petService"
import { queryOptions } from "@tanstack/react-query"
import { AdoptionApplication } from "./keys";

const getAdoptionApplications = () =>
    queryOptions({
        queryKey: [AdoptionApplication.GetAdoptionApplications],
        queryFn: async () => {
            const response = await petService.getAllAdoptionApplications();

            if (response.status !== 200) {
                throw Error("Failed to fetch adoption application list");
            }

            return response.data.data.items
        }
    })

export const adoptionApplicationsQuery = { getAdoptionApplications }