import React, { FC } from 'react'
import { motion } from 'motion/react'
import Logo from './Logo';
import { headerData } from '@/constants'
import Link from 'next/link'
import { X } from 'lucide-react';
import { usePathname } from 'next/navigation'
import SocialMedia from './SocialMedia';
import { useOutsideClick } from '@/hooks/useOutsideClick';
interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}
const Sidebar: FC<SidebarProps> = ({ isOpen, onClose }) => {
    const pathname = usePathname();
    const sidebarRef = useOutsideClick<HTMLDivElement>(onClose)
    return (
        <div className={`fixed inset-y-0 left-0 z-50 bg-mauve-900/50 shadow-xl hoverEffect cursor-auto w-full 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.3 }} className='min-w-72 max-w-96  h-full bg-mauve-900
         text-white/70 p-10 border-r border-r-white flex flex-col gap-6'
            ref={sidebarRef}>

                <div className='flex items-center justify-between'>

                    <button onClick={onClose}>
                        <Logo className="text-white">Crystal</Logo>
                    </button>
                    <button className='hover:text-red-500 hoverEffect text-xl' onClick={onClose}>
                        <X />
                    </button>

                </div>
                <div className="flex flex-col gap-3.5 text-base font-semibold tracking-wide">

                    {headerData?.map((item) => (
                        <Link key={item?.title} href={item?.href} className={`hover:text-white  w-24
          transition-all ease-in-out duration-300 cursor-pointer relative group ${pathname === item?.href
                            && 'text-white'
                            }`}>
                            {item?.title}

                            
                        </Link>
                    ))}
                </div>
              <SocialMedia/>
            </motion.div>
        </div>
    )
}

export default Sidebar