import React from 'react'
import { Button } from './ui/button';
import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import useCartStore from '@/store';
import { Product } from '@/sanity.types';
import { useUser } from "@clerk/nextjs";
interface Props{
    product:Product;
    className?: string;

}
const QuantityButtons = ({ product, className }: Props) => {
    const { addItem, getItemCount, removeItem } = useCartStore();
    const { user } = useUser();
    const itemCount = getItemCount(product?._id);
    const isOutOfStock = product?.stock === 0;
   const handleRemoveProduct = () => {
  console.log("MINUS BUTTON CLICKED");
  
  removeItem(product?._id, user?.id);

  if(itemCount > 1){
    toast.success("Quantity decreased successfully")
  }else{
    toast.success(`${product?.name?.substring(0,12)} removed successfully`)
  }
}
  return (
    <div className={cn('flex items-center gap-1 text-base pb-1', className)}>
        <Button onClick={handleRemoveProduct} disabled = {itemCount === 0 || isOutOfStock} variant='outline' size="icon" className='w-6 h-6'><Minus/></Button>
        <span className='font-semibold w-8 text-center text-mauve-900'>{itemCount}</span>
        <Button  onClick={()=>{
       addItem(product, user?.id);
        toast.success(`${product?.name?.substring(0,12)}... added successfully`)
        }} disabled = {isOutOfStock} variant='outline' size="icon" className='w-6 h-6'><Plus/></Button>
    </div>
  )
}

export default QuantityButtons