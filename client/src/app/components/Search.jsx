import React from 'react'
import { IoSearchOutline } from "react-icons/io5";



const Search = () => {
  return (
    <div className='search bg-[#E6E6E6] w-[600px] h-[50px] rounded-md px-4 relative border-[rgb(0,0,0,0.1)] border-[1px] flex items-center hover:border-[rgb(0,0,0,0.3)] '>
        <input type="text" placeholder='Search for products, brands and more' className='w-full h-full  outline-none  broder-0 ' />
    <button className='w-10 h-10 rounded-full  bg-gray-200 absolute top-1 right-2 z-50 flex items-center justify-center cursor-pointer hover:bg-gray-600' >
        <IoSearchOutline size={30} /></button>
       



      
    </div>
  )
}

export default Search
