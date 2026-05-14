import { AxiosError } from "axios";
import { useAuthStore } from "../Store/authStore";

export interface ApiError {
  success: false;
  message: string;
  status?: number;
  code?: string;
  data?: any;
}

// User-friendly error messages based on status codes
const ERROR_MESSAGES: Record<number, string> = {
  // Client Errors (4xx)
  400: "Invalid request. Please check your input and try again.",
  401: "Your session has expired. Please log in again.",
  403: "You don't have permission to access this resource.",
  404: "The requested information could not be found.",
  405: "This action is not allowed.",
  408: "Request timeout. Please check your connection and try again.",
  409: "This action conflicts with existing data. Please refresh and try again.",
  422: "The submitted data is invalid. Please check and try again.",
  429: "Too many requests. Please wait a moment before trying again.",

  // Server Errors (5xx)
  500: "Something went wrong on our end. Please try again later.",
  502: "Service temporarily unavailable. Please try again in a moment.",
  503: "Service is currently under maintenance. Please try again later.",
  504: "Request timeout. Please check your connection and try again.",
};

// Network and other error types
const NETWORK_ERROR_MESSAGES = {
  NETWORK_ERROR: "Unable to connect. Please check your internet connection.",
  TIMEOUT_ERROR:
    "Request took too long. Please check your connection and try again.",
  CANCELLED_ERROR: "Request was cancelled. Please try again.",
  UNKNOWN_ERROR: "An unexpected error occurred. Please try again.",
};

/**
 * Get user-friendly error message based on error type
 */
export const getErrorMessage = (error: AxiosError): string => {
  // Check if it's a network error
  if (error.code === "ERR_NETWORK") {
    return NETWORK_ERROR_MESSAGES.NETWORK_ERROR;
  }

  // Check if it's a timeout error
  if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
    return NETWORK_ERROR_MESSAGES.TIMEOUT_ERROR;
  }

  // Check if request was cancelled
  if (error.code === "ERR_CANCELLED") {
    return NETWORK_ERROR_MESSAGES.CANCELLED_ERROR;
  }

  // Get status code
  const status = error.response?.status;

  // Try to get message from response
  const data = error.response?.data as
    | { message?: string; error?: string }
    | undefined;
  const responseMessage = data?.message || data?.error;

  // If server provided a message, use it (if it's user-friendly)
  if (
    responseMessage &&
    typeof responseMessage === "string" &&
    responseMessage.length < 200
  ) {
    return responseMessage;
  }

  // Use predefined message based on status code
  if (status && ERROR_MESSAGES[status]) {
    return ERROR_MESSAGES[status];
  }

  // Default unknown error
  return NETWORK_ERROR_MESSAGES.UNKNOWN_ERROR;
};

/**
 * Handle different error status codes with specific actions
 */
export const handleErrorByStatus = (status?: number): void => {
  if (!status) return;

  switch (status) {
    case 401:
      // Unauthorized - logout user
      useAuthStore.getState().logout();
      break;

    case 403:
      // Forbidden - could navigate to access denied page
      // navigationRef.navigate('AccessDenied');
      break;

    case 404:
      // Not found - could show a specific message or page
      break;

    case 429:
      // Rate limited - could implement exponential backoff
      break;

    case 503:
      // Service unavailable - could show maintenance page
      break;

    default:
      // Handle other status codes as needed
      break;
  }
};

/**
 * Format axios error into standardized ApiError format
 */
export const formatApiError = (error: AxiosError): ApiError => {
  const status = error.response?.status;
  const message = getErrorMessage(error);

  return {
    success: false,
    message,
    status,
    code: error.code,
    data: error.response?.data,
  };
};

/**
 * Log errors for debugging (can be extended to send to error tracking service)
 */
export const logError = (error: ApiError, context?: string): void => {
  // if (__DEV__) {
  console.group(`🔴 API Error ${context ? `- ${context}` : ""}`);
  console.error("Message:", error.message);
  console.error("Status:", error.status);
  console.error("Code:", error.code);
  console.error("Data:", error.data);
  console.groupEnd();
  // }
  // In production, you could send to error tracking service
  // e.g., Sentry, LogRocket, etc.
  // Sentry.captureException(error);
};
