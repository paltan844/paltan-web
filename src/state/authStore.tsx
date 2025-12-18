import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { mmkvStorage } from "./storage";

interface AuthStore {
  user: Record<string, any> | null;
  currentOrder: Record<string, any> | null;
  setUser: (user: any) => void;
  setCurrentOrder: (order: any) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      currentOrder: null,

      setUser: (user) => {
        set({ user });
      },

      setCurrentOrder: (order) => {
        set({ currentOrder: order });
      },

      logout: () => {
        set({ user: null, currentOrder: null });

        try {
          localStorage.removeItem("auth-storage");
          sessionStorage.clear();
          mmkvStorage.clearAll();
        } catch (error) {
          console.warn("⚠️ Logout error:", error);
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => ({
        getItem: (key) => {
          const value = localStorage.getItem(key);
          return value;
        },
        setItem: (key, value) => {
          localStorage.setItem(key, value);
        },
        removeItem: (key) => {
          localStorage.removeItem(key);
        },
      })),
    }
  )
);
