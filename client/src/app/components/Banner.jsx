
'use client'
import React from 'react'
import Link from 'next/link';

const Banner = () => {
  return (
    <div className='banner py-8'>
      <div className='container'>
        <div className='grid grid-cols-3 gap-6'>
          {/* Banner 1 */}
          <div className='banner-card bg-gray-100 rounded-lg overflow-hidden flex items-center p-8'>
            <div className='flex-1'>
              <span className='text-orange-500 text-sm font-[600] uppercase'>Only This Week</span>
              <h2 className='text-3xl font-[700] text-gray-800 mt-3 mb-2'>We provide you the best quality products</h2>
              <p className='text-gray-600 text-sm mb-6'>A family place for grocery</p>
              <Link href='/shop' className='text-cyan-500 font-[600] flex items-center gap-2 hover:gap-4 transition-all'>
                Shop Now <span>→</span>
              </Link>
            </div>
            <div className='flex-1 flex justify-end'>
              <img src="/b1.png" alt='Juice' className='h-48 object-cover' />
            </div>
          </div>
 
          {/* Banner 2 */}
          <div className='banner-card bg-purple-100 rounded-lg overflow-hidden flex items-center p-8'>
            <div className='flex-1'>
              <span className='text-orange-500 text-sm font-[600] uppercase'>Only This Week</span>
              <h2 className='text-3xl font-[700] text-gray-800 mt-3 mb-2'>We make your grocery shopping more exciting</h2>
              <p className='text-gray-600 text-sm mb-6'>Shine the morning...</p>
              <Link href='/shop' className='text-cyan-500 font-[600] flex items-center gap-2 hover:gap-4 transition-all'>
                Shop Now <span>→</span>
              </Link>
            </div>
            <div className='flex-1 flex justify-end'>
              <img src="/b2.png" alt='Popcorn' className='h-48 object-cover' />
            </div>
          </div>

          {/* Banner 3 */}
          <div className='banner-card bg-green-100 rounded-lg overflow-hidden flex items-center p-8'>
            <div className='flex-1'>
              <span className='text-orange-500 text-sm font-[600] uppercase'>Special Offer</span>
              <h2 className='text-3xl font-[700] text-gray-800 mt-3 mb-2'>Fresh & Organic Products</h2>
              <p className='text-gray-600 text-sm mb-6'>Get the best deals</p>
              <Link href='/shop' className='text-cyan-500 font-[600] flex items-center gap-2 hover:gap-4 transition-all'>
                Shop Now <span>→</span>
              </Link>
            </div>
            <div className='flex-1 flex justify-end'>
              <img src="/b3.png" alt='Products' className='h-48 object-cover' />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Banner
