import Cookies from "js-cookie";
import { jwtDecode as jwt_decode } from "jwt-decode";
import moment from "moment";
import { api } from "./AuthAPI";

// Validate user Token
export async function validateToken() {
  // Get the access token from cookies and refresh token from localStorage
  const accessToken = Cookies.get("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  // If either token is missing, return false indicating invalid tokens
  if (!refreshToken) {
    return false;
  }
  if (!accessToken) {
    return false;
  }

  let accessTokenExpireTime;

  try {
    // Extracting the token's expiry time using jwt_decode
    accessTokenExpireTime = jwt_decode(accessToken).exp;
  } catch (error) {
    // If there's an error decoding the token, return false
    console.error("Error decoding access token:", error);
    return false;
  }

  // Check if the access token is about to expire or has expired
  if (
    accessTokenExpireTime === undefined ||
    moment.unix(accessTokenExpireTime).diff(moment(), 'minute') < 1
  ) {
    // If the access token is expired or about to expire, refresh it
    let refreshTokenExpireTime;

    try {
      // Extracting the refresh token's expiry time using jwt_decode
      refreshTokenExpireTime = jwt_decode(refreshToken).exp;
    } catch (error) {
      // If there's an error decoding the refresh token, return false
      console.error("Error decoding refresh token:", error);
      return false;
    }

    // Check if the refresh token is still valid
    if (
      refreshTokenExpireTime === undefined ||
      moment.unix(refreshTokenExpireTime).diff(moment(),'minute') > 1
    ) {
      try {
        // Make an API call to refresh the access token
        const response = await api.post("auth/Account/Refresh-Token", {
          accessToken: accessToken,
          refreshToken: refreshToken,
        });

        // Extract the new access token from the response
        const newAccessToken = response.data.accessToken;

        // Set the new access token in cookies
        Cookies.set("accessToken", newAccessToken);
        return true;
      } catch (error) {
        // If there's an error during the token refresh, handle it and return false
        console.error("Error refreshing token", error);
        Cookies.remove("accessToken");
        localStorage.removeItem("refreshToken");
        return false;
      }
    } else {
      // If the refresh token is expired, remove tokens and log out
      Cookies.remove("accessToken");
      localStorage.removeItem("refreshToken");
      console.log("logged out");
      console.log("Token expired");
      return false;
    }
  } // If the access token is still valid, return true

  return true;
}
