export interface AdopterApplicationRequest {
  userId: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  district: string;
  idCardNumber: string;
  occupation: string;
  income: string;
  livingConditions: string;
  housingType: string;
  hasExperience: boolean;
  previousExperience?: string;
  otherPets?: string;
  familySupport: string;
  workSchedule: string;
  reasonForAdoption: string;
  preferredPetTypes: string;
  createdDate: string;
  idCardFrontImageUrl: string;
  idCardBackImageUrl: string;
}

export interface AdopterApplication extends AdopterApplicationRequest {
  applicationId: number;
  applicationStatus: string;
}
