import React from 'react'
import Link from 'next/link'
import { RiArrowDropDownLine } from "react-icons/ri";

const Nav = () => {
  return (
    <nav className='py-4'>

      <div className='container flex items-center justify-between gap-5'>
        <Link href='/' className='text-[17px] text-gray-800 font-[600] hover:text-primary flex py-2 px-4 whitespace-nowrap'>Home</Link>
        <Link href='/products' className='text-[17px] text-gray-800 font-[600] hover:text-primary flex py-2 px-4 whitespace-nowrap'>Fruits & Vegetables</Link>
        <Link href='/products' className='text-[17px] text-gray-800 font-[600] hover:text-primary flex py-2 px-4 whitespace-nowrap'>Meat & Seafood</Link>      
        <Link href='/products' className='text-[17px] text-gray-800 font-[600] hover:text-primary flex py-2 px-4 whitespace-nowrap'>Breakfast & Bakery</Link>
        <Link href='/products' className='text-[17px] text-gray-800 font-[600] hover:text-primary flex py-2 px-4 whitespace-nowrap'>Beverages</Link>
        <Link href='/products' className='text-[17px] text-gray-800 font-[600] hover:text-primary flex py-2 px-4 whitespace-nowrap'>Frozen Food</Link>
        <Link href='/products' className='text-[17px] text-gray-800 font-[600] hover:text-primary flex py-2 px-4 whitespace-nowrap'>Biscuits & Snacks</Link>
        <Link href='/products' className='text-[17px] text-gray-800 font-[600] hover:text-primary flex py-2 px-4 whitespace-nowrap'>Grocery & Staples</Link>
      <div className='relative group'>
        <span className='text-[17px] text-gray-800 font-[600] hover:text-primary flex items-center gap-1 cursor-pointer py-2 px-4 whitespace-nowrap'>
          More 
          <RiArrowDropDownLine size={30}/>
        </span> 
        
        <div className="flex flex-col absolute top-full right-0 bg-white shadow-lg rounded-md overflow-hidden hidden group-hover:flex transition-all duration-300 z-50 min-w-max">
          <Link href='/products' className='text-[17px] text-gray-800 font-[600] hover:bg-gray-100 hover:text-primary py-2 px-4 whitespace-nowrap'>Beverages</Link>
          <Link href='/products' className='text-[17px] text-gray-800 font-[600] hover:bg-gray-100 hover:text-primary py-2 px-4 whitespace-nowrap'>Breakfast & Bakery</Link>
        </div>
      </div>

    </div>
    </nav>

  )
}

export default Nav
