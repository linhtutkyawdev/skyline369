import { create } from "zustand";
// import { persist, createJSONStorage } from "zustand/middleware";

type Store = {
  productCodes: string[];
  setProductCodes: (productCodes: string[]) => void;
};

export const useProductCodeStore = create<Store>()(
  //   persist(
  (set) => ({
    productCodes: [],
    setProductCodes: (productCodes: string[]) => set(() => ({ productCodes })),
  })
  // {
  //   name: "product-code-storage",
  //   storage: createJSONStorage(() => sessionStorage),
  // }
  //   )
);
