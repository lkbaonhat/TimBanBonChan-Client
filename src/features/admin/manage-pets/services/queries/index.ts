import { queryOptions } from "@tanstack/react-query";
import { ManagePet } from "./keys";

const getPetListQuery = () => 
    queryOptions({
        queryKey: [ManagePet.GetPetList],
        queryFn: async () => {
            
        }
    })