"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import useCartStore from "@/store";

const WishlistIcon = () => {
  const wishlist = useCartStore((state) => state.wishlist);

  return (
    <Link
      href="/wishlist"
      className="relative flex items-center justify-center"
    >
      <Heart className="w-5 h-5" />

      {wishlist.length > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
          {wishlist.length}
        </span>
      )}
    </Link>
  );
};

export default WishlistIcon;