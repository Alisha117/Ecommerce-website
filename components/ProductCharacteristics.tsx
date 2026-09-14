import React from 'react'
import { Accordion, AccordionContent, AccordionItem,  } from './ui/accordion'
import { AccordionTrigger } from '@base-ui/react'
import { Product } from '@/sanity.types'

const ProductCharacteristics = ({product}:{product:Product}) => {
  return (
    <Accordion type="single" collapsible>
        <AccordionItem >

                {product?.name}: Characteristics

            <AccordionContent className='flex flex-col gap-1'>
                <p className='flex items-center justify-between'>Brand:
                    <span className='font-semibold tracking-wide'>Unknown</span>
                </p>
                <p className='flex items-center justify-between'>Collection:
                    <span className='font-semibold tracking-wide'>2026</span>
                </p>
                <p className='flex items-center justify-between'>Type:
                    <span className='font-semibold tracking-wide'>{product?.variant}</span>
                </p>
                <p className='flex items-center justify-between'>Stock:
                    <span className='font-semibold tracking-wide'>{product?.stock ? 'Available' : 'Out of Stock'}</span>
                </p>
                <p className='flex items-center justify-between'>Intro:
                    <span className='font-semibold tracking-wide'>{product?.intro}</span>
                </p>
            </AccordionContent>
        </AccordionItem>
    </Accordion>
  )
}

export default ProductCharacteristics