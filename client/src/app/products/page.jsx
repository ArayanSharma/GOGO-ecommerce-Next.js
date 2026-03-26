'use client'
import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
import { IoChevronDown } from 'react-icons/io5'
import Productitem from '../components/Productitem'
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';


const page = () => {
  const [sortOpen, setSortOpen] = useState(false)
  const [sortOption, setSortOption] = useState('Name, A to Z')

  const handleSort = (option) => {
    setSortOption(option)
    setSortOpen(false)
  }

  return (
    <div>
        <section className='py-5 bg-white relative'>
            <div className='container'>
                {/* Sort By - Absolute Right Corner */}
                <div className='absolute top-5 right-5 flex items-center gap-3'>
                    <span className='text-gray-800 font-600'> Sort By </span>

                    <div className='relative'>
                        <button 
                            onClick={() => setSortOpen(!sortOpen)}
                            className='flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors'
                        >
                            {sortOption}
                            <IoChevronDown size={16} className={`transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {sortOpen && (
                            <div className='absolute top-full right-0 mt-2 w-max bg-white border border-gray-300 rounded-lg shadow-lg z-50'>
                                <button 
                                    onClick={() => handleSort('Name, A to Z')}
                                    className='block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors border-b border-gray-200 last:border-b-0 whitespace-nowrap'
                                >
                                    Name, A to Z
                                </button>
                                <button 
                                    onClick={() => handleSort('Name, Z to A')}
                                    className='block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors border-b border-gray-200 last:border-b-0 whitespace-nowrap'
                                >
                                    Name, Z to A
                                </button>
                                <button 
                                    onClick={() => handleSort('Price, Low to High')}
                                    className='block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors border-b border-gray-200 last:border-b-0 whitespace-nowrap'
                                >
                                    Price, Low to High
                                </button>
                                <button 
                                    onClick={() => handleSort('Price, High to Low')}
                                    className='block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors border-b border-gray-200 last:border-b-0 whitespace-nowrap'
                                >
                                    Price, High to Low
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className='flex gap-5'>
                    {/* Sidebar */}
                    <div className='sidebarWrapper w-25%'>
                        <Sidebar />
                    </div>

                    {/* Right Content */}
                    <div className='rightcontent w-82% pl-5'> 
                        <div className='grid grid-cols-4 gap-5'>
                            {/* Product Card */}
                            <Productitem />
                            <Productitem />
                            <Productitem />
                            <Productitem />
                            <Productitem />
                            <Productitem />
                            <Productitem />
                            <Productitem />
                        </div>  
                    </div>
                </div>

                {/* Pagination - Centered at Bottom */}
                <div className='flex items-center justify-center mt-8 py-6'>
                    <Pagination 
                        count={10} 
                        showFirstButton 
                        showLastButton 
                        sx={{
                            '& .MuiButtonBase-root': {
                                color: '#6b7280',
                            },
                            '& .MuiButtonBase-root.Mui-selected': {
                                backgroundColor: '#10b981',
                                color: '#fff',
                                borderRadius: '50%',
                                '&:hover': {
                                    backgroundColor: '#059669',
                                },
                            },
                        }}
                    />
                </div>
            </div>
        </section>
      
    </div>
  )
}

export default page
