import Cookies from "js-cookie";
import { jwtDecode as jwt_decode } from "jwt-decode";
import moment from "moment";
import { api } from "./AuthAPI";

// Validate user Token
export function validateToken() {
  let accessToken = Cookies.get("accessToken");
  let refreshToken = localStorage.getItem("refreshToken");

  if (!refreshToken) {
    return false;
  }
  if (!accessToken) {
    return false;
  }

  let accessTokenExpireTime;

  try {
    //extracting the token's expiry time with jwt_decode
    accessTokenExpireTime = jwt_decode(accessToken).exp;
  } catch (error) {
    return false;
  }

  if (accessTokenExpireTime === undefined || moment.unix(accessTokenExpireTime).diff(moment()) < 10000) {
    // generate new accessToken
    let refreshTokenExpireTime;

    try {
      refreshTokenExpireTime = jwt_decode(refreshToken).exp;
    } catch (error) {
      return false;
    }

    if (refreshTokenExpireTime === undefined || moment.unix(refreshTokenExpireTime).diff(moment()) > 10000) {
        new Promise((resolve) => {
        api
          .post("auth/Account/Refresh-Token", {
            accessToken: accessToken,
            refreshToken: refreshToken,
          })
          .then((res) => {
            console.log("refreshed");
            const { newAccessToken } = res?.data;
            Cookies.set("accessToken", newAccessToken);
            resolve(newAccessToken);
          });
      });
    } else {
      // refreshToken expired
      Cookies.remove("accessToken");
      localStorage.removeItem("refreshToken");
      console.log("logged out");
      console.log("Token expired");

      return false;
    }
    return true;
  }
  return true;
}
