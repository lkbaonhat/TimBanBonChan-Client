import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initialState } from "./state";

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setListPet: (state, action: PayloadAction<any[]>) => {
      state.listPet = action.payload;
    },
    setPetsNeedingVerification: (state, action: PayloadAction<any[]>) => {
      state.petsNeedingVerification = action.payload;
    },
    verifyPet: (state, action: PayloadAction<{ id: number, isApproved: boolean }>) => {
      const { id, isApproved } = action.payload;
      // Cập nhật trong danh sách tất cả thú cưng
      const petIndex = state.listPet.findIndex(pet => pet.petId === id);
      if (petIndex !== -1) {
        state.listPet[petIndex].isVerified = isApproved;
        state.listPet[petIndex].verificationStatus = isApproved ? 'verified' : 'rejected';
      }

      // Cập nhật trong danh sách thú cưng cần xác minh
      const verifyIndex = state.petsNeedingVerification.findIndex(pet => pet.petId === id);
      if (verifyIndex !== -1) {
        state.petsNeedingVerification.splice(verifyIndex, 1);
      }
    },
    setPetCate: (state, action: PayloadAction<[]>) => {
      state.petCategories = action.payload
    }
  },
});

export const { setListPet, setPetsNeedingVerification, verifyPet, setPetCate } = globalSlice.actions;

export { globalSlice };
export default globalSlice.reducer;
