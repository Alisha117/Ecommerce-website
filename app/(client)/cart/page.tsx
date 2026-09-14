"use client";
import Container from '@/components/Container';
import EmptyCart from '@/components/EmptyCart';
import Loading from '@/components/Loading';
import NoAccessToCart from '@/components/NoAccessToCart';
import useCartStore from '@/store';
import { useAuth } from '@clerk/nextjs';
import React, { useEffect, useState } from 'react'
import { useUser } from "@clerk/nextjs";
import { Bold, Heart, ShoppingBag, Trash } from 'lucide-react';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';
import Link from 'next/link';
import { Tooltip, TooltipTrigger, TooltipProvider, TooltipContent } from '@/components/ui/tooltip';
import toast from 'react-hot-toast';
import Priceformatter from '@/components/Priceformatter';
import QuantityButtons from '@/components/QuantityButtons';
import { Button } from '@base-ui/react';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';
const CartPage = () => {
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { isSignedIn } = useAuth()
  const { deleteCartProduct, getTotalPrice, getItemCount, getSubTotalPrice, resetCart, getGroupedItems,
    addToWishlist, removeFromWishlist, isInWishlist, } = useCartStore();
  const { user } = useUser();
  useEffect(() => {
    setIsClient(true)
  })
  if (!isClient) {
    return <Loading />
  }
  const cartProducts = getGroupedItems();

  const handleResetCart = () => {
    const confirmed = window.confirm('Are you sure to reset your cart?')
    if (confirmed) {
      resetCart()
      toast.success('Your cart reset successfully')
    }
  }
  const handleDeleteProduct = async (id: string) => {
    await deleteCartProduct(id, user?.id);
    toast.success("Product deleted successfully");
  }

  const handleCheckout = () => {
    if (!cartProducts || cartProducts.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    router.push("/checkout");
  };
  return (
    <div className='bg-gray-50 pb-52 md:pb-10'>{isSignedIn ?
      <Container>{cartProducts?.length ?
        <>
          <div className='flex items-center gap-2 py-5'>
            <ShoppingBag />
            <h1 className='text-2xl font-semibold'>Shopping Cart</h1>
          </div>
          <div className='grid lg:grid-cols-3 md:gap-8'>
            {/* Products */}
            <div className='lg:col-span-2 rounded-lg'>
              <div className='borderbg-white rounded-md'>
                {cartProducts?.map(({ product }) => {
                  const itemCount = getItemCount(product?._id)
                  return (
                    <div key={product?._id} className='border-b p-2.5 last:border-0 flex items-center justify-between gap-5'>
                      <div className='flex flex-1 items-center gap-2 h-36 md:h-44'>
                        {product?.images && <Link href={`/product/${product?.slug?.current}`} className='border p-0.5 md:p-1 mr-2 rounded-md overflow-hidden group'>
                          <Image src={urlFor(product?.images[0]).url()} alt='productIamge' width={500} height={500}
                            loading='lazy' className='w-32 md:w-50 h-32 md:h-40 object-cover group-hover:scale-105 overflow-hidden hoverEffect' />
                        </Link>}
                        <div className='h-full flex flex-1 flex-col items-start justify-between py-1'>
                          <div className='space-y-1.5'>
                            <h2 className='font-semibold line-clamp-1'>{product?.name}</h2>
                            <p className='text-sm text-zinc-500 font-medium'>{product?.intro}</p>
                            <p className='text-sm capitalize'>Variant:<span className='font-semibold'>{product.variant}</span></p>
                            <p>Status:<span className='font-semibold'>{product?.status}</span></p>
                          </div>
                          <div className='text-gray-500 flex items-center gap-2'>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Heart
                                    onClick={async () => {
                                      if (isInWishlist(product._id)) {
                                        removeFromWishlist(product._id);

                                        await fetch("/api/wishlist", {
                                          method: "DELETE",
                                          headers: {
                                            "Content-Type": "application/json",
                                          },
                                          body: JSON.stringify({
                                            productId: product._id,
                                          }),
                                        });

                                        toast.success("Removed from wishlist");
                                      } else {
                                        addToWishlist(product);

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
                                        toast.success("Added to wishlist");
                                      }
                                    }}
                                    className={`w-4 h-4 md:w-5 md:h-5 cursor-pointer hoverEffect ${isInWishlist(product._id)
                                      ? "fill-red-500 text-red-500"
                                      : "hover:text-red-500"
                                      }`}
                                  />
                                  <TooltipContent className='font-bold'>
                                    Add to favorite
                                  </TooltipContent>
                                </TooltipTrigger>
                              </Tooltip>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Trash onClick={() => {
                                    handleDeleteProduct(product?._id)
                                  }} className='w-4 h-4 md:w-5 md:h-5 hover:text-red-600 hoverEffect' />
                                  <TooltipContent className='font-bold bg-red-600'>
                                    Delete product
                                  </TooltipContent>
                                </TooltipTrigger>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>
                        <div className='flex flex-col items-start justify-between h-36 md:h-44 p-0.5 md:p-1'>
                          <Priceformatter amount={(product?.price as number) * itemCount} className='font-bold text-lg' />
                          <QuantityButtons product={product} />
                        </div>
                      </div>
                    </div>
                  )
                })}
                <Button disabled={loading} onClick={handleResetCart} className='m-5 font-semibold rounded-md py-2 px-3 bg-red-600 text-white' >Reset Cart</Button>
              </div>
            </div>
            {/* Summary */}
            <div className='lg:col-span-1'>
              <div className='hidden md:inline-block w-full bg-white p-6 rounded-lg border'>
                <h2 className='text-xl font-semiboldmb-4'>Order Summary</h2>
                <div className='space-y-4'>
                  <div className='flex justify-between'>
                    <span>Subtotal</span>
                    <Priceformatter amount={getSubTotalPrice()} />
                  </div>
                  <div className='flex justify-between'>
                    <span>Discount</span>
                    <Priceformatter amount={getSubTotalPrice() - getTotalPrice()} />
                  </div>
                  <Separator />
                  <div className='flex justify-between'>
                    <span>Total</span>
                    <Priceformatter amount={getTotalPrice()} className='text-lg font-bold text-black' />
                  </div>
                  <button
                    onClick={handleCheckout}
                    disabled={loading}
                    className="w-full flex items-center justify-center py-2 border bg-amber-200 border-mauve-900/50 rounded-full hover:border-mauve-900 hover:bg-amber-300 hoverEffect"
                  >
                    Place Order
                  </button>
                </div>
              </div>
            </div>
            
           {/* Order Summary for mobile view */}
<div className='md:hidden w-full mt-6'>
  <div className='w-full bg-white p-6 rounded-lg border'>
    <h2 className='text-xl font-semibold mb-4'>Order Summary</h2>

    <div className='space-y-4'>
      <div className='flex justify-between'>
        <span>Subtotal</span>
        <Priceformatter amount={getSubTotalPrice()} />
      </div>

      <div className='flex justify-between'>
        <span>Discount</span>
        <Priceformatter amount={getSubTotalPrice() - getTotalPrice()} />
      </div>

      <Separator />

      <div className='flex justify-between'>
        <span>Total</span>
        <Priceformatter
          amount={getTotalPrice()}
          className='text-lg font-bold text-black'
        />
      </div>

      <button
        onClick={handleCheckout}
        disabled={loading}
        className='w-full flex items-center justify-center py-2 border bg-amber-200 border-mauve-900/50 rounded-full hover:border-mauve-900 hover:bg-amber-300 hoverEffect'
      >
        Place Order
      </button>
    </div>
  </div>
</div>
          </div>
        </>
        : <EmptyCart />
      }
      </Container>
      : <NoAccessToCart />
    }
    </div>
  )
}

export default CartPage