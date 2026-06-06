// src/stores/sessionStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: number;
  username: string;
  email: string;
  business_name?: string;
  phone_number?: string;
  has_configuration: boolean;
}

interface SessionState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  setSession: (payload: {
    accessToken: string;
    refreshToken: string;
    user: User | null;
  }) => void;
  isAuthenticated: () => boolean;
  clearSession: () => void;
  updateUserConfiguration: (has_configuration: boolean) => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      user: null,

      setSession: ({ accessToken, refreshToken, user }) =>
        set({ accessToken, refreshToken, user }),

      // logout
      clearSession: () =>
        set({ accessToken: null, refreshToken: null, user: null }),

      isAuthenticated: () => !!get().accessToken,

      updateUserConfiguration: (has_configuration: boolean) =>
        set((state) => ({
          user: state.user ? { ...state.user, has_configuration } : null,
        })),
    }),
    {
      name: "session-storage", // localstorage key name
    }
  )
);
