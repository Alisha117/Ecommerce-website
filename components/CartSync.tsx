"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import useCartStore from "@/store";

export default function CartSync() {
  const { user, isLoaded } = useUser();

  const loadCart = useCartStore((state) => state.loadCart);
  const resetCart = useCartStore((state) => state.resetCart);

  useEffect(() => {
    if (!isLoaded) return;

    // No logged-in user → clear local cart
    if (!user) {
      resetCart();
      return;
    }

    const loadUserCart = async () => {
      try {
        const response = await fetch("/api/cart");
        const data = await response.json();

        if (!response.ok) {
          console.error("Failed to load cart:", data);
          return;
        }

        loadCart(data.cart);

        //Cart loaded from MySQL: , data.cart;
      } catch (error) {
        console.error("Failed to load cart:", error);
      }
    };

    loadUserCart();
  }, [user, isLoaded, loadCart, resetCart]);

  return null;
}