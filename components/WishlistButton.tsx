"use client";

import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import useCartStore from "@/store";

interface WishlistButtonProps {
  product: any;
}

export default function WishlistButton({
  product,
}: WishlistButtonProps) {
  const { user, isLoaded } = useUser();

  const addToWishlist = useCartStore(
    (state) => state.addToWishlist
  );

  const removeFromWishlist = useCartStore(
    (state) => state.removeFromWishlist
  );

  const isInWishlist = useCartStore(
    (state) => state.isInWishlist
  );

  const [loading, setLoading] = useState(false);

  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (isLoaded && user) {
      setLiked(isInWishlist(product._id));
    } else {
      setLiked(false);
    }
  }, [isLoaded, user, product._id, isInWishlist]);

  const handleWishlist = async () => {
    if (!isLoaded) return;

    if (!user) {
      alert("Please login to add products to wishlist");
      return;
    }

    if (loading) return;

    setLoading(true);

    try {
      if (liked) {
        // Remove from Zustand
        removeFromWishlist(product._id);

        // Remove from MySQL
        const response = await fetch("/api/wishlist", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId: product._id,
          }),
        });

        const data = await response.json();

        console.log("WISHLIST DELETE:", response.status, data);

        if (!response.ok) {
          // Restore if API fails
          addToWishlist(product);
          setLiked(true);
          return;
        }

        setLiked(false);
      } else {
        // Add to Zustand
        addToWishlist(product);

        // Add to MySQL
        const response = await fetch("/api/wishlist", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId: product._id,
          }),
        });

        const data = await response.json();

        console.log("WISHLIST POST:", response.status, data);

        if (!response.ok) {
          // Remove if API fails
          removeFromWishlist(product._id);
          setLiked(false);
          return;
        }

        setLiked(true);
      }
    } catch (error) {
      console.error("Wishlist error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleWishlist}
      disabled={loading}
     className="text-mauve-900/60 hover:text-red-500 hoverEffect cursor-pointer"
    >
      <Heart
        className={`w-5 h-5 ${
          liked
            ? "fill-red-500 text-red-500"
            : ""
        }`}
      />
    </button>
  );
}