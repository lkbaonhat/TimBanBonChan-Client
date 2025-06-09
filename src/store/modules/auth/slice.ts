import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initialState } from "./state";

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setIsAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    setUserInfo: (state, action: PayloadAction<any>) => {
      state.userInfo = action.payload;
    },
    logout: (state) => {
      localStorage.removeItem('userToken')
      state.userInfo = null
      state.isAuthenticated = false
    }
  },
});

export const { setIsAuthenticated, setUserInfo } = authSlice.actions;

export { authSlice };
export default authSlice.reducer;
