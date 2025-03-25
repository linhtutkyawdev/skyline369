import { Product } from "@/types/product";
import { create } from "zustand";

type Store = {
  products: Product[];
  setProducts: (products: Product[]) => void;
  getProduct: (gameType: string) => Product;
  setProduct: (product: Product) => void;
};

export const useProductStore = create<Store>()((set, get) => ({
  products: [],
  setProducts: (products: Product[]) =>
    set((state) => ({ ...state, products })),

  getProduct: (gameType: string) => {
    return get().products.find((product) => product.gameType === gameType);
  },

  setProduct: (product: Product) =>
    set((state) => ({
      products: state.products.map((eachProduct) =>
        product.gameType === eachProduct.gameType ? product : eachProduct
      ),
    })),
}));
