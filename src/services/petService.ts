import { axiosClient } from "@/config/axios";
import { API_ENDPOINT } from "@/constants/api";
import { Pet } from "@/types/Pet";

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
  
  // Legacy fields we'll keep for backward compatibility
  breed?: string;
  categoryName?: string;
  petImageUrls?: string;
  userId?: number; // Keep for compatibility with existing code
  purpose?: string; // Keep for compatibility with existing code
}

export const petService = {  getAllPets: (params?: PetFilterParams) => {    // If userId is provided but not createdByUserId, use userId as createdByUserId
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
    
    console.log("getAllPets called with params:", modifiedParams);
    console.log("Full API URL:", `${url}?${queryParams.toString()}`);
    
    return axiosClient.get("/pets/filter", { params: modifiedParams });
  },
  getPetBySlug: (slug: string) => {
    return axiosClient.get(`/pets/${slug}`);
  },
  getPetById: (id: number) => {
    return axiosClient.get(`/pets/${id}`);
  },  getUserPets: (userId: number, purpose?: string) => {
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
    
    console.log("getUserPets called with params:", JSON.stringify(params));
    console.log("Full API URL:", `${url}?${queryParams.toString()}`);
    
    return axiosClient.get("/pets/filter", { params });
  },createPet: async (petData: PetCreateDto) => {
    try {
      console.log("%c Creating new pet", "background: #4CAF50; color: white; padding: 4px; border-radius: 4px");
      
      // Check if the payload includes image data or a Cloudinary URL
      const hasImageData = petData.primaryImageUrl?.startsWith('data:');
      const hasCloudinaryUrl = petData.primaryImageUrl?.includes('cloudinary.com');
      
      if (hasImageData) {
        console.warn("Create includes base64 image data - this should be avoided");
      } else if (hasCloudinaryUrl) {
        console.log("%c Create with Cloudinary image URL:", "font-weight: bold; color: #2196F3");
        console.log("URL:", petData.primaryImageUrl);
      } else if (petData.primaryImageUrl) {
        console.log("Create with non-Cloudinary image URL:", petData.primaryImageUrl);
      } else {
        console.log("Create with no image");
      }
      
      // Add timeout configuration for large payloads with images
      const config = hasImageData ? { timeout: 60000 } : {};
      
      const response = await axiosClient.post("/pets", petData, config);
      console.log("Pet created successfully with ID:", response.data.petId);
      return response;
    } catch (error) {
      console.error("%c API Error in createPet:", "background: #F44336; color: white; padding: 4px; border-radius: 4px", error);
      // Re-throw to be handled by the component
      throw error;
    }
  },updatePet: async (id: number, petData: PetCreateDto) => {
    try {
      console.log(`%c Updating pet ${id}`, "background: #FF9800; color: white; padding: 4px; border-radius: 4px");
      
      // Check if the payload includes image data or a Cloudinary URL
      const hasImageData = petData.primaryImageUrl?.startsWith('data:');
      const hasCloudinaryUrl = petData.primaryImageUrl?.includes('cloudinary.com');
      
      if (hasImageData) {
        console.warn("Update includes base64 image data - this should be avoided");
      } else if (hasCloudinaryUrl) {
        console.log("%c Update with Cloudinary image URL:", "font-weight: bold; color: #2196F3");
        console.log("URL:", petData.primaryImageUrl);
      } else if (petData.primaryImageUrl) {
        console.log("Update with non-Cloudinary image URL:", petData.primaryImageUrl);
      } else {
        console.log("Update with no image");
      }
      
      // Add timeout configuration for large payloads with images
      const config = hasImageData ? { timeout: 60000 } : {};
      
      const response = await axiosClient.put(`/pets/${id}`, petData, config);
      console.log("Pet updated successfully");
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
    console.log("%c Cloudinary image deletion requested:", "background: #E91E63; color: white; padding: 4px; border-radius: 4px");
    console.log("Image URL to delete:", imageUrl);
    
    if (!imageUrl || !imageUrl.includes('cloudinary.com')) {
      console.error("Invalid Cloudinary URL - cannot delete:", imageUrl);
      return false;
    }
    
    try {
      const publicId = getPublicIdFromUrl(imageUrl);
      console.log("Extracted public ID:", publicId);
      
      if (!publicId) {
        console.error("Could not extract public ID from URL:", imageUrl);
        return false;
      }
      
      const timestamp = new Date().getTime();
      console.log("Delete timestamp:", timestamp);
      
      // We need to create a signature for the delete request
      // Note: In a real app, you should have this done on your backend
      // This is just for demonstration - DO NOT use API secret in frontend code
      // Use a backend endpoint to handle this securely
      
      console.log("%c Would delete Cloudinary image with public ID:", "font-weight: bold; color: #FF9800", publicId);
      
      // TODO: Replace with actual API call to your backend to handle Cloudinary deletion
      // Example:
      // const response = await axiosClient.delete(`/cloudinary/images/${encodeURIComponent(publicId)}`);
      // return response.status === 200;
      
      // For demo purposes only - should be handled by backend
      // Simulate successful deletion
      console.log("Simulating successful image deletion (in a real app, this would call a backend API)");
      return true;
    } catch (error) {
      console.error("%c Error deleting Cloudinary image:", "background: #F44336; color: white; padding: 4px; border-radius: 4px", error);
      return false;
    }
  }
};
