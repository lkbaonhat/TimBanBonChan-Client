import { RootState } from "../../store";

const listPet = (state: RootState) => state.global.listPet;
const petCategories = (state: RootState) => state.global.petCategories;
const petsNeedingVerification = (state: RootState) => state.global.petsNeedingVerification;

export const selectorGlobal = { listPet, petCategories, petsNeedingVerification };