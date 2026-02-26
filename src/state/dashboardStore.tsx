/*
import { create } from 'zustand';
import {
  getMainCategories,
  getAllCategoriesByMainCategoryId,
  getAllProducts,
} from '@service/productService';

interface MainCategory {
  id: string;
  name: string;
}

interface CategoryById {
  _id: string;
  name: string;
  image: string;
  navigateTo: string;
}

interface Section {
  mainCategory: MainCategory;
  categories: CategoryById[];
}

interface DashboardState {
  sections: Section[];
  products: any[];
  sectionsLoading: boolean;
  productsLoading: boolean;
  initialized: boolean;
  fetchDashboard: () => Promise<void>;
  reloadDashboard: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  sections: [],
  products: [],
  sectionsLoading: true,
  productsLoading: true,
  initialized: false,

  fetchDashboard: async () => {
    if (get().initialized) {return;}
    try {
      set({ sectionsLoading: true, productsLoading: true });
      const mainCats: MainCategory[] = await getMainCategories();
      const sectionData = await Promise.all(
        mainCats.map(async cat => {
          const categories = await getAllCategoriesByMainCategoryId(cat.id);
          return { mainCategory: cat, categories };
        })
      );
      const productData = await getAllProducts(1, 20);
      const enriched = productData.map(item => ({
        ...item,
        categoryId: item?.categoryId?._id || '',
        navigateTo: item?.categoryId?.navigateTo || '',
      }));
      set({
        sections: sectionData,
        products: enriched,
        sectionsLoading: false,
        productsLoading: false,
        initialized: true,
      });
    } catch (err) {
      console.error('❌ Dashboard fetch error:', err);
      set({ sections: [], products: [], sectionsLoading: false, productsLoading: false });
    }
  },

  reloadDashboard: async () => {
    try {
      set({ sectionsLoading: true, productsLoading: true });
      const mainCats: MainCategory[] = await getMainCategories();
      const sectionData = await Promise.all(
        mainCats.map(async cat => {
          const categories = await getAllCategoriesByMainCategoryId(cat.id);
          return { mainCategory: cat, categories };
        })
      );
      const productData = await getAllProducts(1, 20);
      const enriched = productData.map(item => ({
        ...item,
        categoryId: item?.categoryId?._id || '',
        navigateTo: item?.categoryId?.navigateTo || '',
      }));
      set({
        sections: sectionData,
        products: enriched,
        sectionsLoading: false,
        productsLoading: false,
        initialized: true,
      });
    } catch (err) {
      console.error('❌ Dashboard reload error:', err);
      set({ sections: [], products: [], sectionsLoading: false, productsLoading: false });
    }
  },
}));
*/


import { create } from "zustand";
import {
  getMainCategories,
  getAllCategoriesByMainCategoryId,
  getAllProducts,
} from "@service/productService";

interface DashboardState {
  sections: any[];
  products: any[];
  nextCursor: string | null;
  hasMore: boolean;

  sectionsLoading: boolean;
  productsLoading: boolean;
  loadingMore: boolean;

  initialized: boolean;

  fetchDashboard: () => Promise<void>;
  fetchMoreProducts: () => Promise<void>;
  reloadDashboard: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  sections: [],
  products: [],
  nextCursor: null,
  hasMore: true,

  sectionsLoading: true,
  productsLoading: true,
  loadingMore: false,

  initialized: false,

  fetchDashboard: async () => {
    if (get().initialized) return;

    try {
      set({ sectionsLoading: true, productsLoading: true });

      const mainCats = await getMainCategories();

      const sectionData = await Promise.all(
        mainCats.map(async (cat) => {
          const categories = await getAllCategoriesByMainCategoryId(cat.id);
          return { mainCategory: cat, categories };
        })
      );

      const res = await getAllProducts({ limit: 12 });

      set({
        sections: sectionData,
        products: res.data,
        nextCursor: res.nextCursor,
        hasMore: res.hasMore,
        sectionsLoading: false,
        productsLoading: false,
        initialized: true,
      });
    } catch (err) {
      console.error("❌ Dashboard fetch error:", err);
      set({ sectionsLoading: false, productsLoading: false });
    }
  },

  fetchMoreProducts: async () => {
    const { nextCursor, hasMore, loadingMore } = get();
    if (!hasMore || loadingMore) return;

    try {
      set({ loadingMore: true });

      const res = await getAllProducts({
        cursor: nextCursor,
        limit: 12,
      });

      set((state) => ({
        products: [...state.products, ...res.data],
        nextCursor: res.nextCursor,
        hasMore: res.hasMore,
        loadingMore: false,
      }));
    } catch (err) {
      console.error("❌ Load more error:", err);
      set({ loadingMore: false });
    }
  },

  reloadDashboard: async () => {
    set({
      products: [],
      nextCursor: null,
      hasMore: true,
      initialized: false,
    });

    await get().fetchDashboard();
  },
}));
