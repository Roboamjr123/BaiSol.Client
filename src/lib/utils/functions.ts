import Cookies from "js-cookie";
export const clearToken = () => {
  localStorage.removeItem("refreshToken");
  Cookies.remove("accessToken");
};
