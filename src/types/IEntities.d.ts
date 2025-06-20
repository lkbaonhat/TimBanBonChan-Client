declare namespace IEntities {
    export interface Pet {
        petId: number;
        petName: string;
        age: string;
        ageUnit: string;
        gender: string;
        size: string;
        color: string | null;
        weight: number | null;
        isVaccinated: boolean;
        isNeutered: boolean;
        isTrained: boolean;
        healthStatus: string;
        personality: string;
        description: string;
        adoptionStatus: string;
        foodPreferences: string;
        toyPreferences: string | null;
        compatibleWith: string;
        notCompatibleWith: string | null;
        location: string;
        purpose: string;
        slug: string;
        categoryName: string;
        breedName: string;
        imageUrls: string[];
    }
    export interface PetCardData {
        id: number;
        name: string;
        gender: string;
        location: string;
        status: string;
        imageUrl: string;
        categoryName: string;
        slug: string;
        postId: number;
        adoptionFee?: number;
        isUrgent?: boolean;
        age?: string;
        ageUnit?: string;
        breedName?: string;
    }
    export interface AdoptionPost {
        postId: number;
        title: string;
        content: string;
        adoptionFee: number;
        location: string;
        city: string | null;
        district: string | null;
        postStatus: string;
        isUrgent: boolean;
        viewCount: number;
        createdByUserId: number;
        createdDate: string;
        pet: Pet;
    }
}