import { cn } from '@/lib/utils';
import React from 'react'
interface Props{
    amount: number | undefined;
    className?: string;
}
const Priceformatter = ({amount, className}:Props) => {
    const formattedPrice = new Number(amount).toLocaleString('en-IN',{
        currency:"INR",
        style:"currency",
        minimumFractionDigits:2,
    })
  return (
    <span className={cn('text-sm font-semibold text-mauve-900', className)}>{formattedPrice}</span>
  )
}

export default Priceformatter