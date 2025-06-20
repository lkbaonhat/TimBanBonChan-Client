declare namespace IRedux {
    export interface UserInfo {
        userId?: number;
        username?: string;
        gender?: string | null;
        email?: string;
        fullName?: string;
        phoneNumber?: string;
        address?: string;
        city?: string;
        district?: string;
        profilePicture?: string;
        bio?: string;
        birthDate?: string | null;
        occupation?: string;
        description?: string;
        hobby?: string;
        isVerifiedAdopter?: boolean | null;
        adopterSince?: string | null;
        isReadyToAdopt?: boolean | null;
        roles?: string[];
    }
}