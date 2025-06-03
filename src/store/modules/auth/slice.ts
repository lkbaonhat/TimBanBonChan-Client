import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initialState } from "./state";

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setIsAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
  },
});

export const { setIsAuthenticated } = authSlice.actions;

export { authSlice };
export default authSlice.reducer;
