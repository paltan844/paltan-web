
import { create } from 'zustand';
import { getLocationData } from '@service/productService';

interface LocationStore {
  locationData: any[];
  setLocationData: (data: any[]) => void;
  fetchLocationData: () => Promise<void>;
}

export const useLocationStorePincode = create<LocationStore>((set, get) => ({
  locationData: [],
  setLocationData: (data) => set({ locationData: data }),
  fetchLocationData: async () => {
    if (get().locationData.length === 0) {
      const data = await getLocationData();
      if (data) {
        set({ locationData: data });
      }
    }
  },
}));
