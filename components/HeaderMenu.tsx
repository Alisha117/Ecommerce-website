"use client";
import Link from 'next/link'
import React from 'react'
import { usePathname } from 'next/navigation'
import {CATEGORIES_QUERY_RESULT} from '@/sanity.types'

const HeaderMenu = ({categories}:{categories: CATEGORIES_QUERY_RESULT}) => {
  const pathname = usePathname();
  return (
    <div className='hidden md:inline-flex w-1/3 items-center gap-5 text-sm capitalize font-semibold'>

    <Link href={'/'} className={`hover:text-mauve-950 
          transition-all ease-in-out duration-300 cursor-pointer relative group ${pathname === "/"
            && 'text-mauve-950'
          }`}>Home</Link>

      {categories?.map((category) => (
        <Link key={category?._id} href={`/category/${category?.slug?.current}`} className={`hover:text-mauve-950 
          transition-all ease-in-out duration-300 cursor-pointer relative group ${pathname === `/category/${category?.slug?.current}`
            && 'text-mauve-950'
          }`}>
        {category?.title}

        <span className={`absolute -bottom-0.5 left-1/2 w-0 h-0.5 bg-mauve-950 transition-all 
        ease-in-out duration-300 cursor-pointer group-hover:w-1/2 group-hover:left-0 ${pathname === `/category/${category?.slug?.current}` && 'w-1/2'}`}/>

        <span className={`absolute -bottom-0.5 right-1/2 w-0 h-0.5 bg-mauve-950 transition-all 
        ease-in-out duration-300 cursor-pointer group-hover:w-1/2 group-hover:right-0 ${pathname === `/category/${category?.slug?.current}` &&  'w-1/2'}`}/>
        </Link>
        ))}
    </div>
  )
}

export default HeaderMenu