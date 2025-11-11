import { getLocationData } from '@service/productService';
import { create } from 'zustand';
import { mmkvStorage } from './storage';

type LocationState = {
  selectedLocation: string;
  selectedLocationObject: Record<string, any> | null;
  setSelectedLocation: (location: string) => void;
  setSelectedLocationObject: (locationObj: Record<string, any>) => void;
  resetLocation: () => void;
};

interface LocationStore {
  locationData: any[];
  setLocationData: (data: any[]) => void;
  fetchLocationData: () => Promise<void>;
}


const initialSelectedLocation = mmkvStorage.getItem('selectedLocation') || '';
const rawSelectedLocationObject = mmkvStorage.getItem('selectedLocationObject');


let parsedSelectedLocationObject = null;
try {
  parsedSelectedLocationObject = rawSelectedLocationObject
    ? JSON.parse(rawSelectedLocationObject)
    : null;
} catch (e) {
  console.warn('⚠️ MMKV parse error for selectedLocationObject', e);
}

export const useLocationStore = create<LocationState & {
  resetLocation: () => void;
  selectedLocationObject: any;
  setSelectedLocationObject: (obj: any) => void;
}>((set, _get) => ({
  selectedLocation: initialSelectedLocation,
  selectedLocationObject: parsedSelectedLocationObject,

  setSelectedLocation: (location) => {
    set({ selectedLocation: location });
    mmkvStorage.setItem('selectedLocation', location ?? '');
  },

  setSelectedLocationObject: (obj) => {
    set({ selectedLocationObject: obj });
    if (obj && typeof obj === 'object') {
      mmkvStorage.setItem('selectedLocationObject', JSON.stringify(obj));
    }
  },

  resetLocation: () => {
    set({ selectedLocation: '', selectedLocationObject: null });
    mmkvStorage.removeItem('selectedLocation');
    mmkvStorage.removeItem('selectedLocationObject');
  },
}));



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
