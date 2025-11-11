import { create } from 'zustand';
import { getAllCategoriesByMainCategoryId, getProductByCategoryIdByMainId } from '@service/productService';

interface Category {
  _id: string;
  name: string;
  icon?: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  image?: string;
}

interface ProductStore {
  categories: Record<string, Category[]>; // mainCategoryId → categories[]
  products: Record<string, Product[]>; // categoryId → products[]
  loading: boolean;
  fetchCategories: (mainId: string, force?: boolean) => Promise<void>;
  fetchProducts: (categoryId: string, force?: boolean) => Promise<void>;
  clearCache: () => void;
}

export const useProductStore = create<ProductStore>((set, get) => ({
  categories: {},
  products: {},
  loading: false,

  fetchCategories: async (mainId, force = false) => {
    const { categories } = get();
    if (!force && categories[mainId]) {return;} // ✅ already cached
    set({ loading: true });
    try {
      const data = await getAllCategoriesByMainCategoryId(mainId);
      set((state) => ({
        categories: { ...state.categories, [mainId]: data || [] },
      }));
    } catch (error) {
      console.error('❌ Error fetching categories:', error);
    } finally {
      set({ loading: false });
    }
  },

  fetchProducts: async (categoryId, force = false) => {
    const { products } = get();
    if (!force && products[categoryId]) {return;} // ✅ cached
    set({ loading: true });
    try {
      const data = await getProductByCategoryIdByMainId(categoryId);
      set((state) => ({
        products: { ...state.products, [categoryId]: data || [] },
      }));
    } catch (error) {
      console.error('❌ Error fetching products:', error);
    } finally {
      set({ loading: false });
    }
  },

  clearCache: () => {
    set({ categories: {}, products: {} });
  },
}));
