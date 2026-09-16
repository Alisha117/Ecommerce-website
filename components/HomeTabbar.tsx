"use client";

import { productType } from '@/constants';
import React from 'react'

interface Props {
  selectedTab: string;
  onTabSelect: (tab: string) => void;
}

const HomeTabbar = ({ selectedTab, onTabSelect }: Props) => {
  return (
    <div className='flex items-center gap-1.5 text-sm font-semibold'>
      <div className='flex items-center gap-1.5 w-full'>
        {productType?.map((item) => (
          <button
            key={item.value}
            className={`border border-mauve-900 
            px-2 py-1.5 text-xs flex-1
            md:px-6 md:py-2 md:text-sm md:flex-none
            rounded-full hover:bg-mauve-900 hover:text-white hoverEffect
            ${selectedTab === item?.value && 'bg-mauve-900 text-white'}`}
            onClick={() => onTabSelect(item?.value)}
          >
            {item.title}
          </button>
        ))}
      </div>
    </div>
  )
}

export default HomeTabbar