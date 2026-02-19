

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { mmkvStorage } from "./storage";

/* ---------------- TYPES ---------------- */

interface AuthStore {
  user: Record<string, any> | null;
  currentOrder: Record<string, any> | null;

  // 🔁 RETURN FLOW
  returnItems: any[] | null;

  setUser: (user: any) => void;
  setCurrentOrder: (order: any) => void;

  // 🔁 RETURN ACTIONS
  setReturnItems: (items: any[]) => void;
  clearReturnItems: () => void;

  logout: () => void;
}

/* ---------------- STORE ---------------- */

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      currentOrder: null,

      // 🔁 return flow
      returnItems: null,

      /* -------- SETTERS -------- */

      setUser: (user) => {
        set({ user });
      },

      setCurrentOrder: (order) => {
        set({ currentOrder: order });
      },

      setReturnItems: (items) => {
        set({ returnItems: items });
      },

      clearReturnItems: () => {
        set({ returnItems: null });
      },

      /* -------- LOGOUT -------- */

      logout: () => {
        set({
          user: null,
          currentOrder: null,
          returnItems: null,
        });

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
          return localStorage.getItem(key);
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

