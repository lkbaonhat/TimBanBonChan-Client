export interface Pet {
  petId: number;
  petName: string;
  petImageUrls: string | null;
  primaryImageUrl?: string | null; // Added to match API response
  gender: string;
  color: string;
  description: string;
  foodPreferences: string | null;
  toyPreferences: string | null;
  compatibleWith: string | null;
  notCompatibleWith: string | null;
  location: string | null;
  categoryId: number;
  categoryName: string;
  breedId: number;
  breed: string;
  age: number | string; // Can be either number or string from API
  size: string;
  weight: number;
  isVaccinated: boolean;
  isNeutered: boolean;
  isTrained: boolean;
  healthStatus: string;
  personality: string;
  adoptionStatus: string;
  slug: string;
  purpose?: string; // Added to match API response
  createdByUserId?: number; // Added to match API response
  createdDate: string;
}

// Simplified pet interface for card displays
export interface PetCardData {
  id: number;
  name: string;
  gender: string;
  location: string;
  status: string;
  imageUrl: string;
  categoryName?: string;
  slug: string;
}
