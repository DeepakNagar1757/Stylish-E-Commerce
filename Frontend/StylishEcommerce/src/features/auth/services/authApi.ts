import { apiHandler } from "@/src/Services/apiHandler";
import { ENDPOINTS } from "@/src/Services/endpoints";

export const authApi = {
  login: (data: { email: string; password: string }) => {
    return apiHandler.post(ENDPOINTS.AUTH.LOGIN, data);
  },

  sendOtp: (data: any) => {
    return apiHandler.post(ENDPOINTS.AUTH.REGISTER, data);
  },

  verifyOtp: (data: any) => {
    return apiHandler.post(ENDPOINTS.AUTH.OTP_VERIFY, data);
  },

  forgotPassword: (data: { email: string }) => {
    return apiHandler.post(ENDPOINTS.AUTH.FORGOT_PASSWORD, data);
  },

  resetPassword: (data: any) => {
    return apiHandler.post(ENDPOINTS.AUTH.RESET_PASSWORD, data);
  },
};
