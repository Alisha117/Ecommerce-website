import React from 'react'
import Container from './Container'
import FooterTop from './FooterTop'
import Logo from './Logo'
import SocialMedia from './SocialMedia'
import { Input } from './ui/input'
import { categoriesData, qiuckLinksData } from '@/constants'
import Link from 'next/link'

const Footer = () => {
  return (
    <footer className='bg-white border-t'>
      <Container>
        <FooterTop/>
        <div className='py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
          <div className='space-y-4'>
            <Logo>Crystal</Logo>
            <p className='text-gray-600 text-sm'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Accusantium, sapiente temporibus! Debitis unde expedita tempore.</p>
            <SocialMedia className='text-mauve-900/60' iconClassName='border-mauve-900/60 
            hover:border-mauve-900 hover:text-mauve-900' tooltipClassName='bg-mauve-900 text-white'/>
            </div>
          <div>
            <h3 className='font-semibold text-mauve-900 mb-4'>Quick Links</h3>
            <div className='flex flex-col gap-3'>
              {qiuckLinksData?.map((item)=>(
                <Link key={item?.title} href={item?.href} className='text-gray-600 hover:text-mauve-900
                text-sm font-medium hoverEffect'>{item?.title}</Link>
              ))}
            </div>
          </div>
          <div>
             <h3 className='font-semibold text-mauve-900 mb-4'>Categories</h3>
            <div className='flex flex-col gap-3'>
              {categoriesData?.map((item)=>(
                <Link key={item?.href} href={`/category=${item?.href}`} className='text-gray-600 hover:text-mauve-900
                text-sm font-medium hoverEffect'>{item?.title}</Link>
              ))}
            </div>
          </div>
          <div>
            <h3 className='font-semibold text-mauve-900 mb-4'>NewsLetter</h3>
            <p className='text-gray-600 text-sm mb-4'> Subscribe to our newsletter to recieve updates and exclusive offers. </p>
            <form className='space-y-3'>
              <Input type='email' placeholder='Enter your email' required className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200'/>
              <button type='submit' className='w-full bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors'>Subscribe</button>
            </form>
          </div>
        </div>
      </Container>
    </footer>
  )
}

export default Footer