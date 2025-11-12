// ✅ Safe browser detection (important for Render builds)
const isBrowser = typeof window !== "undefined" && typeof localStorage !== "undefined";

// ✅ tokenStorage — web safe
export const tokenStorage = {
  setString: (key: string, value: string) => {
    if (isBrowser) localStorage.setItem(key, value);
  },
  getString: (key: string) => {
    return isBrowser ? localStorage.getItem(key) : null;
  },
  delete: (key: string) => {
    if (isBrowser) localStorage.removeItem(key);
  },
  clearAll: () => {
    if (isBrowser) {
      console.log("🧹 tokenStorage.clearAll() called");
      localStorage.clear();
    }
  },
};

// ✅ mmkvStorage — fallbacks for server-side (Render build)
export const mmkvStorage = isBrowser
  ? {
      setItem: (key: string, value: string) => {
        localStorage.setItem(key, value);
      },
      getItem: (key: string) => {
        const value = localStorage.getItem(key);
        return value ?? null;
      },
      removeItem: (key: string) => {
        localStorage.removeItem(key);
      },
      addOnValueChangedListener: (callback: (key: string) => void) => {
        const listener = (event: StorageEvent) => {
          if (event.key) callback(event.key);
        };
        window.addEventListener("storage", listener);
        return {
          remove: () => window.removeEventListener("storage", listener),
        };
      },
      clearAll: () => {
        localStorage.clear();
      },
    }
  : {
      // Fallback when no window/localStorage (Render build)
      setItem: () => {},
      getItem: () => null,
      removeItem: () => {},
      addOnValueChangedListener: () => ({ remove: () => {} }),
      clearAll: () => {},
    };

// ✅ Address helpers
const ADDRESS_KEY = "savedAddresses";

export const saveAddresses = (addresses: string[]) => {
  mmkvStorage.setItem(ADDRESS_KEY, JSON.stringify(addresses));
};

export const getAddresses = (): string[] => {
  const saved = mmkvStorage.getItem(ADDRESS_KEY);
  return saved ? JSON.parse(saved) : [];
};

export const clearAddresses = () => {
  mmkvStorage.removeItem(ADDRESS_KEY);
};
