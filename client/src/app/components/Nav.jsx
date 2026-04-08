import React from 'react'
import Link from 'next/link'
import { RiArrowDropDownLine } from "react-icons/ri";

const Nav = () => {
  return (
    <nav className='py-4 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200 shadow-sm'>

      <div className='container flex items-center justify-center gap-1 flex-wrap'>
        <Link href='/' className='text-[15px] text-gray-800 font-[600] hover:text-blue-600 hover:bg-blue-50 flex py-2 px-3 whitespace-nowrap rounded-lg transition-all duration-200'>Home</Link>
        <Link href='/products' className='text-[15px] text-gray-800 font-[600] hover:text-blue-600 hover:bg-blue-50 flex py-2 px-3 whitespace-nowrap rounded-lg transition-all duration-200'>Fruits & Vegetables</Link>
        <Link href='/products' className='text-[15px] text-gray-800 font-[600] hover:text-blue-600 hover:bg-blue-50 flex py-2 px-3 whitespace-nowrap rounded-lg transition-all duration-200'>Meat & Seafood</Link>      
        <Link href='/products' className='text-[15px] text-gray-800 font-[600] hover:text-blue-600 hover:bg-blue-50 flex py-2 px-3 whitespace-nowrap rounded-lg transition-all duration-200'>Breakfast & Bakery</Link>
        <Link href='/products' className='text-[15px] text-gray-800 font-[600] hover:text-blue-600 hover:bg-blue-50 flex py-2 px-3 whitespace-nowrap rounded-lg transition-all duration-200'>Beverages</Link>
        <Link href='/products' className='text-[15px] text-gray-800 font-[600] hover:text-blue-600 hover:bg-blue-50 flex py-2 px-3 whitespace-nowrap rounded-lg transition-all duration-200'>Frozen Food</Link>
        <Link href='/products' className='text-[15px] text-gray-800 font-[600] hover:text-blue-600 hover:bg-blue-50 flex py-2 px-3 whitespace-nowrap rounded-lg transition-all duration-200'>Biscuits & Snacks</Link>
        <Link href='/products' className='text-[15px] text-gray-800 font-[600] hover:text-blue-600 hover:bg-blue-50 flex py-2 px-3 whitespace-nowrap rounded-lg transition-all duration-200'>Grocery & Staples</Link>
      <div className='relative group'>
        <span className='text-[15px] text-gray-800 font-[600] hover:text-blue-600 hover:bg-blue-50 flex items-center gap-1 cursor-pointer py-2 px-3 whitespace-nowrap rounded-lg transition-all duration-200'>
          More 
          <RiArrowDropDownLine size={24}/>
        </span> 
        
        <div className="flex flex-col absolute top-full right-0 bg-white shadow-lg rounded-lg overflow-hidden hidden group-hover:flex transition-all duration-300 z-50 min-w-max border border-gray-200">
          <Link href='/products' className='text-[15px] text-gray-800 font-[600] hover:bg-blue-50 hover:text-blue-600 py-2 px-4 whitespace-nowrap transition-all duration-200'>Beverages</Link>
          <Link href='/products' className='text-[15px] text-gray-800 font-[600] hover:bg-blue-50 hover:text-blue-600 py-2 px-4 whitespace-nowrap transition-all duration-200'>Breakfast & Bakery</Link>
        </div>
      </div>

    </div>
    </nav>

  )
}

export default Nav
