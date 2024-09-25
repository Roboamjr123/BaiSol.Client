import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { setUser } from "../../state/authSlice";
import { useDispatch } from "react-redux";

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

// Login
export const useLoginMutation = () => {
  return useMutation({
    mutationFn: async (formData: { email: string; password: string }) => {
      const response = await api.post("auth/Auth/Login", formData, {
        headers: {
          "Content-Type": "application/json", // Ensure it matches the server requirements
        },
      });
      return response.data;
    },
  });
};

export const use2FAMutation = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: async (data: { email: string; code: string }) => {
      return await api.post("auth/Auth/Login-2FA", data);
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
