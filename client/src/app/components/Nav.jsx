import React from 'react'
import Link from 'next/link'
import { RiArrowDropDownLine } from "react-icons/ri";

const Nav = () => {
  return (
    <nav className='hidden md:block py-2 md:py-3 bg-linear-to-r from-gray-50 to-blue-50 border-b border-gray-200 shadow-sm'>
      <div className='container flex items-center justify-center gap-1 flex-wrap'>
        <Link href='/' className='text-xs sm:text-sm md:text-[15px] text-gray-800 font-semibold hover:text-blue-600 hover:bg-blue-50 py-2 px-2 md:px-3 rounded-lg transition whitespace-nowrap'>Home</Link>
        <Link href='/products' className='text-xs sm:text-sm md:text-[15px] text-gray-800 font-semibold hover:text-blue-600 hover:bg-blue-50 py-2 px-2 md:px-3 rounded-lg transition whitespace-nowrap'>Fruits & Vegetables</Link>
        <Link href='/products' className='text-xs sm:text-sm md:text-[15px] text-gray-800 font-semibold hover:text-blue-600 hover:bg-blue-50 py-2 px-2 md:px-3 rounded-lg transition whitespace-nowrap'>Meat & Seafood</Link>      
        <Link href='/products' className='text-xs sm:text-sm md:text-[15px] text-gray-800 font-semibold hover:text-blue-600 hover:bg-blue-50 py-2 px-2 md:px-3 rounded-lg transition whitespace-nowrap'>Breakfast & Bakery</Link>
        <Link href='/products' className='text-xs sm:text-sm md:text-[15px] text-gray-800 font-semibold hover:text-blue-600 hover:bg-blue-50 py-2 px-2 md:px-3 rounded-lg transition whitespace-nowrap'>Beverages</Link>
        <Link href='/products' className='text-xs sm:text-sm md:text-[15px] text-gray-800 font-semibold hover:text-blue-600 hover:bg-blue-50 py-2 px-2 md:px-3 rounded-lg transition whitespace-nowrap'>Frozen Food</Link>
        <Link href='/products' className='text-xs sm:text-sm md:text-[15px] text-gray-800 font-semibold hover:text-blue-600 hover:bg-blue-50 py-2 px-2 md:px-3 rounded-lg transition whitespace-nowrap'>Biscuits & Snacks</Link>
        <Link href='/products' className='text-xs sm:text-sm md:text-[15px] text-gray-800 font-semibold hover:text-blue-600 hover:bg-blue-50 py-2 px-2 md:px-3 rounded-lg transition whitespace-nowrap'>Grocery & Staples</Link>
        <div className='relative group'>
          <span className='text-xs sm:text-sm md:text-[15px] text-gray-800 font-semibold hover:text-blue-600 hover:bg-blue-50 flex items-center gap-1 cursor-pointer py-2 px-2 md:px-3 rounded-lg transition whitespace-nowrap'>
            More 
            <RiArrowDropDownLine size={20}/>
          </span> 
          <div className="hidden group-hover:flex flex-col absolute top-full right-0 bg-white shadow-lg rounded-lg overflow-hidden transition z-50 min-w-max border border-gray-200">
            <Link href='/products' className='text-xs sm:text-sm md:text-[15px] text-gray-800 font-semibold hover:bg-blue-50 hover:text-blue-600 py-2 px-4 whitespace-nowrap transition'>Beverages</Link>
            <Link href='/products' className='text-xs sm:text-sm md:text-[15px] text-gray-800 font-semibold hover:bg-blue-50 hover:text-blue-600 py-2 px-4 whitespace-nowrap transition'>Breakfast & Bakery</Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Nav
