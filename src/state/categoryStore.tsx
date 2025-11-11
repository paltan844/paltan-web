// src/state/categoryStore.ts
import { create } from 'zustand';
import { getMainCategories } from '@service/productService';

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface CategoryState {
  categories: Category[];
  loading: boolean;
  initialized: boolean;
  fetchCategories: () => Promise<void>;
  reloadCategories: () => Promise<void>;
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  loading: true,
  initialized: false,

  fetchCategories: async () => {
    if (get().initialized) return; // Already fetched
    try {
      set({ loading: true });
      const data = await getMainCategories();
      set({ categories: data, initialized: true });
    } catch (err) {
      console.error('❌ Category fetch error:', err);
      set({ categories: [] });
    } finally {
      set({ loading: false });
    }
  },

  reloadCategories: async () => {
    try {
      set({ loading: true });
      const data = await getMainCategories();
      set({ categories: data, initialized: true });
    } catch (err) {
      console.error('❌ Category reload error:', err);
      set({ categories: [] });
    } finally {
      set({ loading: false });
    }
  },
}));
