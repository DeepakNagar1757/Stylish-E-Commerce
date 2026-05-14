import { useMutation } from "@tanstack/react-query";
import { authApi } from "../services/authApi";
import { useAuthStore } from "@/src/Store/authStore";
import { useErrorHandlerWithToast } from "@/src/hooks/useErrorHandlerWithToast";

export const useSendOtp = () => {
  return useMutation({
    mutationFn: authApi.sendOtp,
  });
};

export const useVerifyOtp = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const { showError, showSuccess } = useErrorHandlerWithToast();

  return useMutation({
    mutationFn: authApi.verifyOtp,
    onSuccess: async (data) => {
      await setAuth(data);
      showSuccess("Account created successfully!", "Welcome");
    },
    onError: (error) => {
      showError(error as any, "Verification Failed");
    },
  });
};
