"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import useCartStore from "@/store";

export default function WishlistSync() {
  const { user, isLoaded } = useUser();

  const addToWishlist = useCartStore(
    (state) => state.addToWishlist
  );

  const removeFromWishlist = useCartStore(
    (state) => state.removeFromWishlist
  );

  useEffect(() => {
    if (!isLoaded) return;

    // No logged-in user → clear local wishlist
    if (!user) {
      const currentWishlist = useCartStore.getState().wishlist;

      currentWishlist.forEach((product) => {
        removeFromWishlist(product._id);
      });

      return;
    }

    const loadWishlist = async () => {
      try {
        const response = await fetch("/api/wishlist");
        const data = await response.json();

        if (!response.ok) {
          console.error("Failed to load wishlist:", data);
          return;
        }

        // Clear old local wishlist
        const currentWishlist = useCartStore.getState().wishlist;

        currentWishlist.forEach((product) => {
          removeFromWishlist(product._id);
        });

        // Load current user's wishlist from MySQL
        data.wishlist.forEach((product: any) => {
          addToWishlist(product);
        });

       //"Wishlist loaded from MySQL:",data.wishlist
      } catch (error) {
        console.error("Failed to load wishlist:", error);
      }
    };

    loadWishlist();
  }, [
    user,
    isLoaded,
    addToWishlist,
    removeFromWishlist,
  ]);

  return null;
}