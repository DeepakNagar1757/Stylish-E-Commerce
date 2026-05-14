import { useMutation } from "@tanstack/react-query";
import { authApi } from "../services/authApi";
import { useAuthStore } from "@/src/Store/authStore";
import { useErrorHandlerWithToast } from "@/src/hooks/useErrorHandlerWithToast";
import { ApiError } from "@/src/Services/errorHandler";

type AuthResponse = {
  token: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
  };
};

type LoginPayload = {
  email: string;
  password: string;
};

export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const { showError, showSuccess } = useErrorHandlerWithToast();

  return useMutation<AuthResponse, ApiError, LoginPayload>({
    mutationFn: authApi.login,

    onSuccess: async (data) => {
      await setAuth(data);
      showSuccess("Welcome back!", "Login Successful");
    },

    onError: (error) => {
      showError(error, "Login Failed");
    },
  });
};
