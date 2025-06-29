import { axiosClient } from "@/config/axios"
import { useMutation } from "@tanstack/react-query"

const useUpdateStatusVerifyPet = () => {
    return useMutation({
        mutationFn: async () => {
            const response = await axiosClient
        }
    })
}