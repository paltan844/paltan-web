
export const tokenStorage = {
  setString: (key: string, value: string) => {
    localStorage.setItem(key, value);
  },
  getString: (key: string) => {
    return localStorage.getItem(key);
  },
  delete: (key: string) => {
    localStorage.removeItem(key);
  },
  clearAll: () => {
    localStorage.clear();
  },
};

export const mmkvStorage = {
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
    window.addEventListener('storage', listener);
    return {
      remove: () => window.removeEventListener('storage', listener),
    };
  },
  clearAll: () => {
    localStorage.clear();
  },
};

const ADDRESS_KEY = 'savedAddresses';

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
