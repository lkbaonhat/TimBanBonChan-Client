import { axiosClient } from "@/config/axios";
import { API_ENDPOINT } from "@/constants/api";

interface PetFilterParams {
  userId?: number;
  createdByUserId?: number;
  purpose?: string;
  adoptionStatus?: string;
}

interface PetCreateDto {
  petId?: number; // Used for updates
  petName: string;
  categoryId: number;
  breedId: number;
  age: string;
  ageUnit: string;
  gender: string;
  size: string;
  color: string;
  weight: number;
  isVaccinated: boolean;
  isNeutered: boolean;
  isTrained: boolean;
  healthStatus: string;
  personality: string;
  description: string;
  adoptionStatus: string;
  foodPreferences: string;
  toyPreferences: string;
  compatibleWith: string;
  notCompatibleWith: string;
  location: string;
  createdByUserId: number; // Changed from userId to match the API
  createAdoptionPost?: boolean;
  postTitle?: string;
  postContent?: string;
  adoptionFee?: number;
  isUrgent?: boolean;
  primaryImageUrl?: string; // Changed from petImageUrls to match the API
  additionalImageUrls?: string[];
  purpose?: string; // Keep for compatibility with existing code

  // Legacy fields we'll keep for backward compatibility
  breed?: string;
  categoryName?: string;
  petImageUrls?: string;
  userId?: number; // Keep for compatibility with existing code
}

export const petService = {
  getAllPets: (params?: PetFilterParams) => {    // If userId is provided but not createdByUserId, use userId as createdByUserId
    const modifiedParams: Record<string, string | number | boolean> = {};

    // Convert to proper parameter names with capital first letters for the API
    if (params) {
      if (params.userId && !params.createdByUserId) {
        modifiedParams.CreatedByUserId = params.userId;
      } else if (params.createdByUserId) {
        modifiedParams.CreatedByUserId = params.createdByUserId;
      }

      if (params.purpose) {
        modifiedParams.Purpose = params.purpose;
      }

      if (params.adoptionStatus) {
        modifiedParams.AdoptionStatus = params.adoptionStatus;
      }
    }
    // Create URL to show exactly what's being requested
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const url = `${baseUrl}/pets/filter`;
    const queryParams = new URLSearchParams();

    // Add params to the URL for logging
    Object.entries(modifiedParams).forEach(([key, value]) => {
      queryParams.append(key, String(value));
    });

    return axiosClient.get("/pets/filter", { params: modifiedParams });
  },
  getPetBySlug: (slug: string) => {
    return axiosClient.get(`/pets/${slug}`);
  },
  getPetById: (id: number) => {
    return axiosClient.get(`/pets/${id}`);
  },
  getUserPets: (userId: number, purpose?: string) => {
    // Use capital first letter for parameter names to match API expectations
    const params: Record<string, string | number> = {
      CreatedByUserId: userId
    };

    // Only add Purpose if it's provided, with capital first letter
    if (purpose) {
      params.Purpose = purpose;
    }
    // Create URL to show exactly what's being requested
    const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";
    const url = `${baseUrl}/pets/filter`;
    const queryParams = new URLSearchParams();

    // Add params to the URL for logging
    Object.entries(params).forEach(([key, value]) => {
      queryParams.append(key, String(value));
    });

    return axiosClient.get("/pets/filter", { params });
  },
  createPet: async (petData: PetCreateDto) => {
    try {
      console.log("Creating pet with data:", JSON.stringify(petData, null, 2));

      // Check if the payload includes image data
      const hasImageData = petData.primaryImageUrl?.startsWith('data:');

      if (hasImageData) {
        console.warn("Create includes base64 image data - this should be avoided");
      }

      // Remove any undefined or empty string values that might cause issues
      const cleanedData = Object.fromEntries(
        Object.entries(petData).filter(([, value]) => {
          // Keep false values for booleans
          if (typeof value === 'boolean') return true;
          // Keep 0 values for numbers
          if (typeof value === 'number') return true;
          // Remove undefined, null, empty strings
          return value !== undefined && value !== null && value !== '';
        })
      );

      console.log("Cleaned data being sent:", JSON.stringify(cleanedData, null, 2));

      // Add timeout configuration for large payloads with images
      const config = hasImageData ? { timeout: 60000 } : {};

      const response = await axiosClient.post("/pets", cleanedData, config);
      console.log("Pet created successfully:", response.data);
      return response;
    } catch (error) {
      console.error("%c API Error in createPet:", "background: #F44336; color: white; padding: 4px; border-radius: 4px", error);
      
      // Log detailed error information
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response: { data: unknown, status: number } };
        console.error("Response status:", axiosError.response?.status);
        console.error("Response data:", axiosError.response?.data);
      }
      
      // Re-throw to be handled by the component
      throw error;
    }
  },
  updatePet: async (petData: PetCreateDto) => {
    try {
      // Check if the payload includes image data
      const hasImageData = typeof petData.primaryImageUrl === 'string' && petData.primaryImageUrl?.startsWith('data:');

      if (hasImageData) {
        console.warn("Update includes base64 image data - this should be avoided");
      }

      // Add timeout configuration for large payloads with images
      const config = hasImageData ? { timeout: 60000 } : {};

      const response = await axiosClient.put(`/pets`, petData, config);
      return response;
    } catch (error) {
      console.error("%c API Update Error:", "background: #F44336; color: white; padding: 4px; border-radius: 4px", error);
      // Re-throw to be handled by the component
      throw error;
    }
  },
  deletePet: (id: number) => {
    return axiosClient.delete(`/pets/${id}`);
  },
  getAllAdoptionApplications: (applicationStatus?: string) => {
    if (applicationStatus) {
      return axiosClient.get(`${API_ENDPOINT.PET.ADOPTION_APPLICATIONS}?ApplicationStatus=${applicationStatus}`)
    }
    return axiosClient.get(`${API_ENDPOINT.PET.ADOPTION_APPLICATIONS}`);
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
  },
  getPetCategories: () => {
    return axiosClient.get(`/petcategories`)
  }
};

// Helper function to extract public ID from Cloudinary URL
const getPublicIdFromUrl = (url: string): string | null => {
  try {
    if (!url || !url.includes('cloudinary.com')) return null;

    // Extract the public ID from the URL path
    // Example: https://res.cloudinary.com/cloudname/image/upload/v1234567890/folder/public_id.jpg
    const urlParts = url.split('/');
    const filenamePart = urlParts[urlParts.length - 1]; // Get the filename

    // Remove the extension to get the public ID
    const publicId = filenamePart.split('.')[0];

    // If the URL has a folder structure, include it in the public ID
    if (urlParts[urlParts.length - 2] !== 'upload') {
      const folderPart = urlParts.slice(urlParts.indexOf('upload') + 1, urlParts.length - 1).join('/');
      return `${folderPart}/${publicId}`;
    }

    return publicId;
  } catch (error) {
    console.error("Error extracting public ID from URL:", error);
    return null;
  }
};

export const cloudinaryService = {
  deleteImage: async (imageUrl: string): Promise<boolean> => {
    if (!imageUrl || !imageUrl.includes('cloudinary.com')) {
      console.error("Invalid Cloudinary URL - cannot delete:", imageUrl);
      return false;
    }

    try {
      const publicId = getPublicIdFromUrl(imageUrl);

      if (!publicId) {
        console.error("Could not extract public ID from URL:", imageUrl);
        return false;
      }

      // TODO: Replace with actual API call to your backend to handle Cloudinary deletion
      // Example:
      // const response = await axiosClient.delete(`/cloudinary/images/${encodeURIComponent(publicId)}`);
      // return response.status === 200;

      // For demo purposes only - should be handled by backend
      // Simulate successful deletion
      return true;
    } catch (error) {
      console.error("%c Error deleting Cloudinary image:", "background: #F44336; color: white; padding: 4px; border-radius: 4px", error);
      return false;
    }
  }
};
