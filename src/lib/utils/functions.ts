import Cookies from "js-cookie";
export const clearToken = () => {
  localStorage.removeItem("refreshToken");
  Cookies.remove("accessToken");
};

export const capitalizeFirstLetter = (str: string) => {
  return (
    str.trim().charAt(0).toUpperCase() + str.trim().slice(1).toLowerCase()
  );
};