import { RootState } from "../../store";

const listPet = (state: RootState) => state.global.listPet;
const petCategories = (state: RootState) => state.global.petCategories;

export const selectorGlobal = { listPet, petCategories };