import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type User = {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
  isProfileComplete?: boolean;
};

type AuthResponse = {
  token: string;
  refreshToken: string;
  user: User;
};

type AuthState = {
  token: string | null;
  refreshToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  hasSeenOnboarding: boolean;
  hasSeenGetStarted: boolean;
  isInitialized: boolean;

  setAuth: (data: AuthResponse) => Promise<void>;
  updateToken: (token: string) => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  logout: () => Promise<void>;
  loadAuth: () => Promise<void>;
  fetchProfile: () => Promise<void>;

  completeOnboarding: () => void;
  completeGetStarted: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      isLoading: true,
      isInitialized: false,

      hasSeenOnboarding: false,
      hasSeenGetStarted: false,

      setAuth: async ({ token, refreshToken, user }) => {
        await SecureStore.setItemAsync("token", token);
        await SecureStore.setItemAsync("refreshToken", refreshToken);

        set({
          token,
          refreshToken,
          user,
          isAuthenticated: true,
          isInitialized: true,
        });
      },

      updateToken: async (token) => {
        await SecureStore.setItemAsync("token", token);
        set({ token });
      },

      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),

      logout: async () => {
        await SecureStore.deleteItemAsync("token");
        await SecureStore.deleteItemAsync("refreshToken");

        set({
          token: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
        });
      },

      loadAuth: async () => {
        try {
          set({ isLoading: true });
          if (!get().isInitialized) {
            await SecureStore.deleteItemAsync("token");
            await SecureStore.deleteItemAsync("refreshToken");
            set({ isInitialized: true });
          }

          const token = await SecureStore.getItemAsync("token");
          const refreshToken = await SecureStore.getItemAsync("refreshToken");

          if (token && refreshToken) {
            set({
              token,
              refreshToken,
              isAuthenticated: true,
            });
          }
        } catch (e) {
          console.error("Auth load error", e);
        } finally {
          set({ isLoading: false });
        }
      },

      fetchProfile: async () => {
        try {
          const { apiHandler } = await import("@/src/Services/apiHandler");
          const { ENDPOINTS } = await import("@/src/Services/endpoints");
          const result = await apiHandler.get(ENDPOINTS.USER.PROFILE);
          console.log("result : ", result)
          set({ user: result });
        } catch (e) {
          console.error("Fetch profile error", e);
        }
      },

      completeOnboarding: () => set({ hasSeenOnboarding: true }),
      completeGetStarted: () => set({ hasSeenGetStarted: true }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),

      partialize: (state) => ({
        user: state.user,
        hasSeenOnboarding: state.hasSeenOnboarding,
        hasSeenGetStarted: state.hasSeenGetStarted,
        isInitialized: state.isInitialized,
      }),
    },
  ),
);
