"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import useCartStore from "@/store";
import { urlFor } from "@/sanity/lib/image";
import { useUser } from "@clerk/nextjs";
import QuantityButtons from "@/components/QuantityButtons";

const WishlistPage = () => {
    const wishlist = useCartStore((state) => state.wishlist);
    const removeFromWishlist = useCartStore(
        (state) => state.removeFromWishlist
    );
    const addItem = useCartStore((state) => state.addItem);
    const cartItems = useCartStore((state) => state.items);

    const handleRemove = (productId: string) => {
        removeFromWishlist(productId);
        toast.success("Removed from wishlist");
    };

    const handleAddToCart = (product: (typeof wishlist)[number]) => {
        addItem(product);
        toast.success("Added to cart");
    };

    if (wishlist.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
                <Heart className="w-16 h-16 text-gray-300 mb-4" />

                <h1 className="text-2xl font-semibold">
                    Your wishlist is empty
                </h1>

                <p className="text-gray-500 mt-2">
                    Save products you love here.
                </p>

                <Link
                    href="/"
                    className="mt-6 bg-black text-white px-6 py-3 rounded-md"
                >
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">
            <div className="flex items-center gap-3 mb-8">
                <Heart className="w-7 h-7 fill-red-500 text-red-500" />

                <h1 className="text-3xl font-semibold">
                    My Wishlist
                </h1>

                <span className="text-gray-500">
                    ({wishlist.length})
                </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {wishlist.map((product) => (
                    <div
                        key={product._id}
                        className="border rounded-lg overflow-hidden bg-white"
                    >
                        <Link
                            href={`/product/${product.slug?.current}`}
                            className="relative aspect-square bg-gray-100 block">

                            {product.images?.[0]?.asset?._ref && (
                                <Image
                                    src={urlFor(product.images[0]).url()}
                                    alt={product.name ?? "Product"}
                                    fill
                                    className="object-contain"
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                />
                            )}

                            <button
                                onClick={() => handleRemove(product._id)}
                                className="absolute top-3 right-3 bg-white rounded-full p-2 shadow"
                            >
                                <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
                        </Link>

                        <div className="p-4">
                            <Link
                                href={`/product/${product.slug?.current}`}
                                className="font-medium line-clamp-2 hover:text-red-500 hoverEffect">
                                {product.name}
                            </Link>

                            <p className="font-semibold mt-2">
                                ₹{product.price ?? 0}
                            </p>

                            {cartItems.find((item) => item.product?._id === product._id) ? (
                                <QuantityButtons
                                    product={product}
                                    className="w-full mt-4"
                                />
                            ) : (
                                <button
                                    onClick={() => handleAddToCart(product)}
                                    className="w-full mt-4 bg-black text-white py-2 rounded-md"
                                >
                                    Add to Cart
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div >
    );
};

export default WishlistPage;