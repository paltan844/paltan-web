import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { mmkvStorage } from "./storage";

/* ------------------------------------------------------------------
✅ A universal safe wrapper for localStorage — works in Node, Browser & Render builds
------------------------------------------------------------------ */
const isBrowser =
  typeof window !== "undefined" && typeof localStorage !== "undefined";

export const safeLocalStorage = isBrowser
  ? localStorage
  : {
      getItem: (_key: string) => null,
      setItem: (_key: string, _value: string) => {},
      removeItem: (_key: string) => {},
      clear: () => {},
    };

/* ------------------------------------------------------------------
✅ Auth Store (Zustand)
------------------------------------------------------------------ */
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
        console.log("🔴 [Logout Triggered] — clearing Zustand + storages...");

        // ✅ Clear Zustand in-memory state
        set({ user: null, currentOrder: null });

        try {
          // ✅ Safe clear (no crash on Render build)
          safeLocalStorage.removeItem("auth-storage");
          console.log("🧹 localStorage cleared ✅");

          mmkvStorage.clearAll();
          console.log("🧹 mmkvStorage cleared ✅");

          if (isBrowser) {
            sessionStorage.clear();
            console.log("🧹 sessionStorage cleared ✅");
          }
        } catch (error) {
          console.warn("⚠️ Logout error:", error);
        }

        console.log(
          "✅ Logout complete — Zustand user state should be null:",
          get().user
        );
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => ({
        getItem: (key) => safeLocalStorage.getItem(key),
        setItem: (key, value) => safeLocalStorage.setItem(key, value),
        removeItem: (key) => safeLocalStorage.removeItem(key),
      })),
    }
  )
);
