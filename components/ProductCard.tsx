import { urlFor } from '@/sanity/lib/image'
import Image from 'next/image'
import React from 'react'
import { Product } from "@/sanity.types";
import Link from "next/link";
import PriceView from './PriceView';
import AddToCartButton from './AddToCartButton';
import WishlistButton from './WishlistButton';

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <div className="group w-full max-w-full text-sm rounded-lg overflow-hidden bg-zinc-50 md:max-w-none">

      {/* Product Image */}
      <Link
        href={`/product/${product?.slug?.current}`}
        className="block w-full"
      >
        <div className="bg-gradient-to-r from-zinc-200 via-zinc-300 to-zinc-200 overflow-hidden relative w-full">

          {product?.images?.[0] && (
            <Image
              src={urlFor(product.images[0]).url()}
              width={500}
              height={500}
              alt={product?.name || "product image"}
              priority
              className={`w-full h-56 md:h-80 object-contain hoverEffect ${product?.stock !== 0 ? "group-hover:scale-105" : ""
                }`}
            />
          )}

          {product?.stock === 0 && (
            <div className="absolute inset-0 bg-mauve-900/50 flex items-center justify-center">
              <p className="text-xl text-white font-semibold text-center">
                Out of Stock
              </p>
            </div>
          )}

        </div>
      </Link>

      {/* Product Information */}
      <div className="w-full py-3 px-3 flex flex-col gap-2 bg-zinc-50 border border-t-0 rounded-b-lg">

        {/* Product Name */}
        <Link href={`/product/${product?.slug?.current}`}>
          <h2 className="font-semibold text-base md:text-lg line-clamp-2 hover:text-mauve-900 hoverEffect">
            {product?.name}
          </h2>
        </Link>

        {/* Product Intro */}
        <Link href={`/product/${product?.slug?.current}`}>
          <p className="text-sm text-gray-600 line-clamp-2 hover:text-gray-900">
            {product?.intro}
          </p>
        </Link>

        {/* Price + Wishlist */}
        <div className="flex items-center justify-between gap-2 w-full">

          <PriceView
            className="text-sm md:text-lg"
            price={product?.price}
            discount={product?.discount}
          />

          <WishlistButton product={product} />

        </div>

        {/* Add To Cart */}
        <div className="w-full">
          <AddToCartButton product={product} />
        </div>

      </div>

    </div>
  )
}

export default ProductCard