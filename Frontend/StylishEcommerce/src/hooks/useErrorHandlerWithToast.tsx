import { useCallback } from "react";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
import { ApiError } from "../Services/errorHandler";

export const useErrorHandlerWithToast = () => {
  const showError = useCallback(
    (error: ApiError | Error | unknown, title?: string) => {
      let errorMessage = "An unexpected error occurred";

      // Handle ApiError format
      if (typeof error === "object" && error !== null && "message" in error) {
        errorMessage = (error as ApiError).message;
      }
      // Handle standard Error
      else if (error instanceof Error) {
        errorMessage = error.message;
      }
      // Handle string errors
      else if (typeof error === "string") {
        errorMessage = error;
      }

      Toast.show({
        type: "error",
        text1: title || "Error",
        text2: errorMessage,
        visibilityTime: 4000,
        position: "top",
        topOffset: 50,
      });
    },
    [],
  );

  const showSuccess = useCallback((message: string, title?: string) => {
    Toast.show({
      type: "success",
      text1: title || "Success",
      text2: message,
      visibilityTime: 3000,
      position: "top",
      topOffset: 50,
    });
  }, []);

  const showInfo = useCallback((message: string, title?: string) => {
    Toast.show({
      type: "info",
      text1: title || "Info",
      text2: message,
      visibilityTime: 3000,
      position: "top",
      topOffset: 50,
    });
  }, []);

  const showWarning = useCallback((message: string, title?: string) => {
    Toast.show({
      type: "warning",
      text1: title || "Warning",
      text2: message,
      visibilityTime: 3000,
      position: "top",
      topOffset: 50,
    });
  }, []);

  return { showError, showSuccess, showInfo, showWarning };
};

export const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: "#4CAF50",
        borderLeftWidth: 5,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontWeight: "600",
      }}
      text2Style={{
        fontSize: 14,
        color: "#666",
      }}
    />
  ),
  error: (props: any) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: "#F44336",
        borderLeftWidth: 5,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontWeight: "600",
      }}
      text2Style={{
        fontSize: 14,
        color: "#666",
      }}
    />
  ),
  info: (props: any) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: "#2196F3",
        borderLeftWidth: 5,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontWeight: "600",
      }}
      text2Style={{
        fontSize: 14,
        color: "#666",
      }}
    />
  ),
  warning: (props: any) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: "#FF9800",
        borderLeftWidth: 5,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontWeight: "600",
      }}
      text2Style={{
        fontSize: 14,
        color: "#666",
      }}
    />
  ),
};
