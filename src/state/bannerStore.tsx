// src/state/bannerStore.ts
import { create } from 'zustand';
import { getBanners } from '@service/productService';

interface BannerItem {
  id: string;
  title: string;
  icon?: string;
}

interface BannerState {
  banners: BannerItem[];
  loading: boolean;
  initialized: boolean;
  fetchBanners: () => Promise<void>;
  reloadBanners: () => Promise<void>;
}

export const useBannerStore = create<BannerState>((set, get) => ({
  banners: [],
  loading: false,
  initialized: false,

  fetchBanners: async () => {
    const { initialized } = get();
    if (initialized) {return;} // ✅ only once

    try {
      set({ loading: true });
      const data = await getBanners();
      if (Array.isArray(data)) {
        set({ banners: data, initialized: true });
      } else {
        console.warn('⚠️ Unexpected banner data:', data);
      }
    } catch (err) {
      console.error('❌ Banner fetch error:', err);
      set({ banners: [] });
    } finally {
      set({ loading: false });
    }
  },

  reloadBanners: async () => {
    try {
      set({ loading: true });
      const data = await getBanners();
      if (Array.isArray(data)) {
        set({ banners: data, initialized: true });
      }
    } catch (err) {
      console.error('❌ Banner reload error:', err);
      set({ banners: [] });
    } finally {
      set({ loading: false });
    }
  },
}));
