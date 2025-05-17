import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initialState } from "./state";

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setListPet: (state, action: PayloadAction<any[]>) => {
      state.listPet = action.payload;
    }
  },
});

export const { setListPet } = globalSlice.actions;

export { globalSlice };
export default globalSlice.reducer;
