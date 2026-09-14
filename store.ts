import { Product } from "./sanity.types";
import { create } from "zustand";


export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  wishlist: Product[];
  loadCart: (items: CartItem[]) => void;
  addItem: (product: Product, userId?: string) => Promise<void>;
  removeItem: (productId: string, userId?: string) => Promise<void>;
  deleteCartProduct: (productId: string, userId?: string) => Promise<void>;
  resetCart: () => void;

  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  getWishlistCount: () => number;

  getTotalPrice: () => number;
  getSubTotalPrice: () => number;
  getItemCount: (productId: string) => number;
  getGroupedItems: () => CartItem[];
}

const useCartStore = create<CartState>()(
  (set, get) => ({
      items: [],
      wishlist: [],
      loadCart: (items) => set({ items }),
     addItem: async (product, userId) => {
      
  // Update Zustand immediately
  set((state) => {
    const existingItem = state.items.find(
      (item) => item.product._id === product._id
    );

    if (existingItem) {
      return {
        items: state.items.map((item) =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      };
    }

    return {
      items: [...state.items, { product, quantity: 1 }],
    };
  });

  // Save to MySQL
  if (userId) {
    try {
      await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product._id,
          quantity: 1,
        }),
      });
    } catch (error) {
      console.error("Failed to save cart to MySQL:", error);
    }
  }
},
removeItem: async (productId, userId) => {
  console.log("removeItem called:", productId, userId);
  // Update Zustand immediately
  set((state) => ({
    items: state.items.reduce((acc, item) => {
      if (item.product._id === productId) {
        if (item.quantity > 1) {
          acc.push({
            ...item,
            quantity: item.quantity - 1,
          });
        }
      } else {
        acc.push(item);
      }

      return acc;
    }, [] as CartItem[]),
  }));

  // Update MySQL
  if (userId) {
    try {
     const response = await fetch("/api/cart", {
  method: "PATCH",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    productId,
  }),
});

const data = await response.json();

console.log("PATCH cart response:", response.status, data);
    } catch (error) {
      console.error(
        "Failed to decrease cart quantity in MySQL:",
        error
      );
    }
  }
},
deleteCartProduct: async (productId, userId) => {
  // Remove from Zustand
  set((state) => ({
    items: state.items.filter(
      ({ product }) => product?._id !== productId
    ),
  }));

  // Remove from MySQL
  if (userId) {
    try {
      await fetch("/api/cart", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
        }),
      });
    } catch (error) {
      console.error(
        "Failed to delete cart product from MySQL:",
        error
      );
    }
  }
},
      resetCart: () => set({ items: [] }),
      addToWishlist: (product) =>
        set((state) => {
          const alreadyExists = state.wishlist.some(
            (item) => item._id === product._id
          );

          if (alreadyExists) {
            return state;
          }

          return {
            wishlist: [...state.wishlist, product],
          };
        }),

      removeFromWishlist: (productId) =>
        set((state) => ({
          wishlist: state.wishlist.filter(
            (product) => product._id !== productId
          ),
        })),

      isInWishlist: (productId) =>
        get().wishlist.some(
          (product) => product._id === productId
        ),

      getWishlistCount: () => get().wishlist.length,
      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + (item.product.price ?? 0) * item.quantity,
          0
        );
      },
      getSubTotalPrice: () => {
        return get().items.reduce((total, item) => {
          const price = item.product.price ?? 0;
          const discount = ((item.product.discount ?? 0) * price) / 100;
          const discountedPrice = price + discount;
          return total + discountedPrice * item.quantity;
        }, 0);
      },
      getItemCount: (productId) => {
        const item = get().items.find((item) => item.product._id === productId);
        return item ? item.quantity : 0;
      },
      getGroupedItems: () => get().items,
    }),
   
  
);

export default useCartStore;
