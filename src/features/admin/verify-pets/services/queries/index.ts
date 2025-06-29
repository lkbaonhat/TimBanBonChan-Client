import { queryOptions } from "@tanstack/react-query";
import { VerifyPetsKeys } from "./key";

const getVerifyPetListQuery = () =>
    queryOptions({
        queryKey: [VerifyPetsKeys.GetVerifyPetList],
        queryFn: async () => {

        }
    })