import { queryOptions } from "@tanstack/react-query";
import { AdopterApplication } from "./keys";
import { userService } from "@/services/userService";

const getAdopterApplications = () =>
    queryOptions({
        queryKey: [AdopterApplication.GetAdopterApplications],
        queryFn: async () => {
            const response = await userService.getAllAdopterApplications();

            if (response.status !== 200) {
                throw Error("Failed to fetch adopter application list");
            }

            return response.data.data.items
        }
    })

export const adopterApplicationsQuery = { getAdopterApplications }