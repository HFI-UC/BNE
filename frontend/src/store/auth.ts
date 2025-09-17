import { create } from "zustand";
import { apiClient } from "../api/client";
import type { User } from "../api/hooks";

export type AuthState = {
  user: User | null;
  isLoading: boolean;
  error?: string;
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: undefined,
  initialize: async () => {
    set({ isLoading: true, error: undefined });
    try {
      const { data } = await apiClient.get<{ user: User | null }>("/auth/me");
      set({ user: data.user, isLoading: false });
    } catch (error) {
      set({ user: null, isLoading: false });
    }
  },
  login: async (email: string, password: string) => {
    set({ isLoading: true, error: undefined });
    try {
      const { data } = await apiClient.post<{ user: User }>("/auth/login", {
        email,
        password,
      });
      set({ user: data.user, isLoading: false });
    } catch (error: any) {
      const message = error?.response?.data?.message ?? "登录失败，请检查账号密码";
      set({ error: message, isLoading: false, user: null });
      throw error;
    }
  },
  logout: async () => {
    await apiClient.post("/auth/logout");
    set({ user: null });
  },
}));
