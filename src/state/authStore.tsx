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
        console.log("🟢 setUser called with:", user);
        set({ user });
      },

      setCurrentOrder: (order) => {
        console.log("🟢 setCurrentOrder:", order);
        set({ currentOrder: order });
      },

      logout: () => {
        console.log("🔴 [Logout Triggered] — clearing Zustand + localStorage...");

        // Clear Zustand in-memory state
        set({ user: null, currentOrder: null });

        try {
          // Clear persisted Zustand data
          localStorage.removeItem("auth-storage");
          console.log("🧹 localStorage: auth-storage removed ✅");

          // Clear session
          sessionStorage.clear();
          console.log("🧹 sessionStorage cleared ✅");

          // Clear MMKV backup
          mmkvStorage.clearAll();
          console.log("🧹 mmkvStorage cleared ✅");

          // Debug log of remaining localStorage keys
          console.log("📦 Remaining localStorage keys:", Object.keys(localStorage));
        } catch (error) {
          console.warn("⚠️ Logout error:", error);
        }

        console.log("✅ Logout complete — Zustand user state should be null:", get().user);
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => ({
        getItem: (key) => {
          const value = localStorage.getItem(key);
          console.log("📥 getItem:", key, value);
          return value;
        },
        setItem: (key, value) => {
          console.log("📤 setItem:", key, value);
          localStorage.setItem(key, value);
        },
        removeItem: (key) => {
          console.log("🗑️ removeItem:", key);
          localStorage.removeItem(key);
        },
      })),
    }
  )
);
