export const initialState = {
  isAuthenticated: localStorage.getItem("accessToken") !== null,
  userInfo: {},
};
