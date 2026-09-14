"use client"
import React, { useState } from 'react'
import { AlignLeft } from 'lucide-react'
import Sidebar from './Sidebar'
const MobileMenu = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <>
    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
        <AlignLeft className="hover:text-mauve-900 hoverEffect md:hidden"/>
    </button>
    <div className='md:hidden'>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)}/>
    </div>
  
  </>
  )
}

export default MobileMenu