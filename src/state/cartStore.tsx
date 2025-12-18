import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { mmkvStorage } from "./storage";

interface CartItem {
  _id: string | number;
  item: any;
  count: number;
  categoryId: string | null;
  finalPrice: number;
}

interface CartStore {
  cart: CartItem[];
  addItem: (item: any) => void;
  removeItem: (id: string | number) => void;
  clearCart: () => void;
  getItemCount: (id: string | number) => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [],

      /* ------------------ ADD TO CART ------------------ */
      addItem: (product) => {
        const currentCart = get().cart;

        const existingIndex = currentCart.findIndex(
          (cartItem) => cartItem._id === product._id
        );

        const finalPrice =
          product.discountprice && product.discountprice > 0
            ? parseFloat(product.discountprice)
            : parseFloat(product.price);

        const categoryId =
          product.CategoryById ||
          product.categoryId ||
          product.category ||
          null;

        if (existingIndex >= 0) {
          const updated = [...currentCart];
          updated[existingIndex] = {
            ...updated[existingIndex],
            count: updated[existingIndex].count + 1,
          };
          set({ cart: updated });
        } else {
          set({
            cart: [
              ...currentCart,
              {
                _id: product._id,
                item: product,
                count: 1,
                categoryId,
                finalPrice,
              },
            ],
          });
        }
      },

      /* ------------------ REMOVE ------------------ */
      removeItem: (id) => {
        const currentCart = get().cart;
        const idx = currentCart.findIndex((c) => c._id === id);

        if (idx === -1) return;

        const updated = [...currentCart];
        const existing = updated[idx];

        if (existing.count > 1) {
          updated[idx] = {
            ...existing,
            count: existing.count - 1,
          };
        } else {
          updated.splice(idx, 1);
        }

        set({ cart: updated });
      },

      /* ------------------ CLEAR ------------------ */
      clearCart: () => set({ cart: [] }),

      /* ------------------ ITEM COUNT ------------------ */
      getItemCount: (id) => {
        const found = get().cart.find((c) => c._id === id);
        return found ? found.count : 0;
      },

      /* ------------------ TOTAL PRICE ------------------ */
      getTotalPrice: () => {
        return get().cart.reduce((total, cartItem) => {
          return total + cartItem.finalPrice * cartItem.count;
        }, 0);
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);
