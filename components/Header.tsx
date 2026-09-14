import React from 'react'
import HeaderMenu from './HeaderMenu'
import Logo from './Logo'
import Container from './Container'
import MobileMenu from './MobileMenu'
import SearchBar from './SearchBar'
import CartIcon from './CartIcon'
import { currentUser } from '@clerk/nextjs/server'
import { unstable_noStore as noStore } from "next/cache";
import AuthButtons from "./AuthButtons";
import {
  SignInButton,
  SignUpButton,
  Show,
  UserButton,
} from "@clerk/nextjs";
import WishlistIcon from "./WishlistIcon";
import { getAllCategories } from '@/sanity/helpers/queries'


const Header = async () => {
   noStore();
  const user = await currentUser();
  const categories = await getAllCategories();
  
  return (
    <header className='border-b border-b-gray-400 py-5 sticky top-0 z-50 bg-white'>
      <Container >
        <div className="flex items-center justify-between gap-7 text-mauve-700">
          <HeaderMenu categories={categories} />
          <MobileMenu />
          <div className='w-auto md:w-1/2 flex items-center justify-center gap-2.5'>
            <Logo>
              Crystal
            </Logo>
          </div>
          <div className='w-auto md:w-1/3 flex items-center justify-end gap-5 '>
            <SearchBar />
            <WishlistIcon/>
            <CartIcon />

           <AuthButtons />
          
          </div>
        </div>
      </Container>
    </header>
  )
}

export default Header