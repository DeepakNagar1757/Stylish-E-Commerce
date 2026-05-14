import apiClient from "./apiClient";

export const apiHandler = {
  get: async (url: string, params?: any) => {
    const res = await apiClient.get(url, { params });
    return res.data;
  },

  post: async (url: string, body: any) => {
    const config = body instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
    const res = await apiClient.post(url, body, config);
    return res.data;
  },

  put: async (url: string, body: any) => {
    const config = body instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
    const res = await apiClient.put(url, body, config);
    return res.data;
  },


  patch: async (url: string, body?: any) => {
    const res = await apiClient.patch(url, body);
    return res.data;
  },

  delete: async (url: string) => {
    const res = await apiClient.delete(url);
    return res.data;
  },
};
