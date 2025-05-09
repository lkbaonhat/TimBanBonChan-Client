import { axiosClient } from "@/config/axios";
import { API_ENDPOINT } from "@constants/api";
import { AxiosResponse } from "axios";

// Define interfaces for request and response types
interface SignUpRequest {
  fullName: string;
  username: string;
  email: string;
  password: string;
}

interface SignInRequest {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    fullName: string;
    username: string;
    email: string;
    // Add other user properties as needed
  };
}

export const authService = {
  signUp: (userData: SignUpRequest): Promise<AxiosResponse<AuthResponse>> => {
    return axiosClient.post<AuthResponse>(API_ENDPOINT.AUTH.SIGN_UP, userData);
  },
  signIn: (userData: SignInRequest): Promise<AxiosResponse<AuthResponse>> => {
    return axiosClient.post<AuthResponse>(API_ENDPOINT.AUTH.SIGN_IN, userData);
  },
  confirmEmail: (token: string): Promise<void> => {
    return axiosClient.get(`/confirm-email?token=${token}`);
  },
};
