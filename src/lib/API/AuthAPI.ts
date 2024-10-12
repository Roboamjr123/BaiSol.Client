import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { setUser } from "../../state/authSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useUserEmail } from "../../state/Hooks/userHook";

const baseURL = import.meta.env.VITE_APP_SERVER_API_URL;

export const api = axios.create({
  baseURL,
});

api.interceptors.request.use((config) => {
  const token = Cookies.get("accessToken"); // Or however you store the token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
// Define the expected structure of the API response
interface ILoginResponse {
  message: string;
  flag: boolean;
  isDefaultAdmin: boolean;
  accessToken: string | null;
  refreshToken: string | null;
}
// Login
export const useLoginMutation = () => {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: async (formData: { email: string; password: string }) => {
      const response = await api.post<ILoginResponse>(
        "auth/Auth/Login",
        formData,
        {
          headers: {
            "Content-Type": "application/json", // Ensure it matches the server requirements
          },
        }
      );

      return response.data;
    },
    onSuccess: (res) => {
      if (res.isDefaultAdmin && res.flag) {
        // Extract and store tokens
        const { accessToken, refreshToken } = res;
        if (accessToken && refreshToken) {
          Cookies.set("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);

          // Decode the access token to extract user information
          const decodedToken: any = jwtDecode(accessToken);
          const user = {
            userId:
              decodedToken[
                "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
              ],
            email:
              decodedToken[
                "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
              ],
            userName:
              decodedToken[
                "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
              ],
            userRole:
              decodedToken[
                "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
              ],
          };

          // Dispatch the user information to the Redux store
          dispatch(setUser(user));
        }
      }

      // Show success message
      toast.success(res.message);
    },
    onError: (err: any) => {
      toast.error(err.response.data);
    },
  });
};

export const use2FAMutation = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: async (data: { email: string; code: string }) => {
      const response = await api.post("auth/Auth/Login-2FA", data);
      return response.data;
    },
    onSuccess: (res) => {
      const accessToken = res.data.accessToken;
      const refreshToken = res.data.refreshToken;
      Cookies.set("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      const decoded: any = jwtDecode(accessToken);
      const user = {
        userId:
          decoded[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
          ],
        email:
          decoded[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
          ],
        userName:
          decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
        userRole:
          decoded[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
          ],
      };

      dispatch(setUser(user));
    },
    onError: (err: any) => {
      toast.error(err.response.data.message);
    },
  });
};

export const useLogOut = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      const response = await api.post(`auth/Auth/LogOut?email=${email}`, {
        headers: {
          "Content-Type": "application/json", // Ensure it matches the server requirements
        },
      });
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data);
    },
    onError: (err: any) => {
      toast.error(err);
    },
  });
};

export const useResend2FA = () => {
  return useMutation({
    mutationFn: async (data: string) => {
      const response = await api.post("auth/Account/ResendOTP", data, {
        headers: {
          "Content-Type": "application/json", // Ensure it matches the server requirements
        },
      });
      return response.data;
    },
  });
};

// Email Confirmaton
export const useConfirmEmail = () => {
  return useMutation<
    { message: string },
    unknown,
    { token: string; email: string }
  >({
    mutationFn: async ({ token, email }) => {
      const response = await api.get<{ message: string }>(
        "auth/Auth/ConfirmEmail",
        {
          params: { token, email },
        }
      );
      console.log(response);
      return response.data;
    },
  });
};

// Forgot Password
export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationFn: async (data: string) => {
      const response = await api.post("auth/Auth/ForgotPassword", data, {
        headers: {
          "Content-Type": "application/json", // Ensure it matches the server requirements
        },
      });
      return response.data;
    },
  });
};

// fetch Reset Password Token
export const fetchResetPasswordToken = () => {
  return useMutation<
    { message: string },
    unknown,
    { token: string; email: string }
  >({
    mutationFn: async ({ token, email }) => {
      const response = await api.get<{ message: string }>(
        "auth/Auth/Reset-Password",
        {
          params: { token, email },
        }
      );
      return response.data;
    },
  });
};

// New Password
export const useNewPasswordMutation = () => {
  return useMutation({
    mutationFn: async (formData: {
      email: string;
      password: string;
      token: string;
    }) => {
      const response = await api.post("auth/Auth/New-Password", formData, {
        headers: {
          "Content-Type": "application/json", // Ensure it matches the server requirements
        },
      });
      return response.data;
    },
  });
};
