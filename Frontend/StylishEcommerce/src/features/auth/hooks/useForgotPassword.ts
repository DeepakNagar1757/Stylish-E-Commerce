import { useMutation } from "@tanstack/react-query";
import { authApi } from "../services/authApi";
import { useErrorHandlerWithToast } from "@/src/hooks/useErrorHandlerWithToast";

export const useForgotPassword = () => {
  const { showError, showSuccess } = useErrorHandlerWithToast();

  return useMutation({
    mutationFn: authApi.forgotPassword,
    onSuccess: () => {
      showSuccess("OTP sent to your email", "Success");
    },
    onError: (error) => {
      showError(error as any, "Failed to send OTP");
    },
  });
};

export const useResetPassword = () => {
  const { showError, showSuccess } = useErrorHandlerWithToast();

  return useMutation({
    mutationFn: authApi.resetPassword,
    onSuccess: () => {
      showSuccess("Password reset successfully", "Success");
    },
    onError: (error) => {
      showError(error as any, "Password Reset Failed");
    },
  });
};
