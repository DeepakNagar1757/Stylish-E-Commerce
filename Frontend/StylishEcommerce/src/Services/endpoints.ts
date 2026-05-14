export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/send-otp",
    OTP_VERIFY: "/auth/verify-otp",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    REFRESH: "/auth/refresh",
  },
  HOME: {
    DASHBOARD: "/home",
  },
  PRODUCTS: {
    GET_ALL: "/products",
    GET_BY_ID: (id: string) => `/products/${id}`,
  },
  WISHLIST: {
    GET_ALL: "/wishlist",
    TOGGLE: "/wishlist/toggle",
    STATUS: (id: string) => `/wishlist/status/${id}`,
  },
  USER: {
    PROFILE: "/user/profile",
    CHANGE_PASSWORD: "/user/change-password",
    ADDRESSES: "/user/addresses",
    ADDRESS_BY_ID: (id: string) => `/user/addresses/${id}`,
    SET_DEFAULT: (id: string) => `/user/addresses/${id}/default`,
  },
  CART: {
    GET_CART: "/cart",
    ADD_TO_CART: "/cart/add",
    UPDATE_QUANTITY: "/cart/update",
    REMOVE_FROM_CART: (productId: string, size: string) =>
      `/cart/remove/${productId}/${size}`,
    CLEAR_CART: "/cart/clear",
  },
  PAYMENT: {
    CREATE_ORDER: "/payment/order",
    VERIFY_PAYMENT: "/payment/verify",
  },
  ORDERS: {
    GET_ALL: "/orders",
  },
};
