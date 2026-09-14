"use client";
import React from 'react'
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast'
import QuantityButtons from './QuantityButtons';
import Priceformatter from './Priceformatter';
import useCartStore from '@/store';
import { Product } from '@/sanity.types';
import { useUser } from "@clerk/nextjs";
interface Props{
    product:Product;
    className?: string;

}
const AddToCartButton = ({product, className}:Props) => {
    const {addItem, getItemCount} = useCartStore();
    const { user } = useUser();
    const itemCount = getItemCount(product?._id);
    const isOutOfStock = product?.stock === 0;
   
  return (
    <div className='w-full h-12 flex items-center'>
     {itemCount? 
     <div className='w-full text-sm'>
        <div className='flex items-center justify-between'>
            <span className='text-xs text-muted-foreground'>Quantity</span>
            <QuantityButtons product={product}/>
            </div>
        <div className='flex items-center justify-between border-t pt-1'>
            <span className='text-xs font-semibold'>SubTotal</span>
         <Priceformatter amount={(product.price ?? 0) * itemCount} />
        </div>
     </div> 
     : <Button onClick={()=>{
        addItem(product, user?.id);
        toast.success(`${product?.name?.substring(0,12)}... added successfully`)
        }}
         disabled={isOutOfStock}
         className={cn('w-full bg-transparent text-mauve-900 shadow-none border border-mauve-900/30 font-semibold tracking-wide hover:text-white hoverEffect')}>
         Add to cart</Button>}
    </div>
  )
}

export default AddToCartButton