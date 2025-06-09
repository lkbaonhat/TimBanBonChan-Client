import { jwtDecode } from "jwt-decode";

const getInitialUserInfo = () => {
  const token = localStorage.getItem("accessToken");
  if (!token) return null;

  try {
    return jwtDecode(token);
  } catch (error) {
    console.error("Invalid token:", error);
    localStorage.removeItem("accessToken");
    return null;
  }
};

export const initialState = {
  isAuthenticated: localStorage.getItem("accessToken") !== null,
  userInfo: getInitialUserInfo(),
};
