
'use client'
import React from 'react'
import Link from 'next/link';

const Banner = () => {
  return (
    <div className='banner py-4 sm:py-6 md:py-8'>
      <div className='container'>
        <div className='grid gap-3 sm:gap-4 md:gap-6 grid-cols-1 md:grid-cols-3'>
          {/* Banner 1 */}
          <div className='banner-card bg-gray-100 rounded-lg overflow-hidden flex flex-col md:flex-row items-center p-4 sm:p-6 md:p-8'>
            <div className='flex-1 mb-4 md:mb-0 text-center md:text-left'>
              <span className='text-orange-500 text-xs sm:text-sm font-semibold uppercase'>Only This Week</span>
              <h2 className='text-lg sm:text-2xl md:text-3xl font-bold text-gray-800 mt-2 sm:mt-3 mb-1 sm:mb-2'>We provide you the best quality products</h2>
              <p className='text-gray-600 text-xs sm:text-sm mb-3 sm:mb-6'>A family place for grocery</p>
              <Link href='/products' className='text-cyan-500 font-semibold flex items-center gap-2 hover:gap-4 transition-all justify-center md:justify-start text-sm sm:text-base'>
                Shop Now <span>→</span>
              </Link>
            </div>
            <div className='w-full md:flex-1 md:flex md:justify-end'>
              <img src="/b1.png" alt='Juice' className='w-full h-auto max-h-40 sm:max-h-48 object-contain' />
            </div>
          </div>
 
          {/* Banner 2 */}
          <div className='banner-card bg-purple-100 rounded-lg overflow-hidden flex flex-col md:flex-row items-center p-4 sm:p-6 md:p-8'>
            <div className='flex-1 mb-4 md:mb-0 text-center md:text-left'>
              <span className='text-orange-500 text-xs sm:text-sm font-semibold uppercase'>Only This Week</span>
              <h2 className='text-lg sm:text-2xl md:text-3xl font-bold text-gray-800 mt-2 sm:mt-3 mb-1 sm:mb-2'>We make your grocery shopping more exciting</h2>
              <p className='text-gray-600 text-xs sm:text-sm mb-3 sm:mb-6'>Shine the morning...</p>
              <Link href='/products' className='text-cyan-500 font-semibold flex items-center gap-2 hover:gap-4 transition-all justify-center md:justify-start text-sm sm:text-base'>
                Shop Now <span>→</span>
              </Link>
            </div>
            <div className='w-full md:flex-1 md:flex md:justify-end'>
              <img src="/b2.png" alt='Popcorn' className='w-full h-auto max-h-40 sm:max-h-48 object-contain' />
            </div>
          </div>

          {/* Banner 3 */}
          <div className='banner-card bg-green-100 rounded-lg overflow-hidden flex flex-col md:flex-row items-center p-4 sm:p-6 md:p-8'>
            <div className='flex-1 mb-4 md:mb-0 text-center md:text-left'>
              <span className='text-orange-500 text-xs sm:text-sm font-semibold uppercase'>Special Offer</span>
              <h2 className='text-lg sm:text-2xl md:text-3xl font-bold text-gray-800 mt-2 sm:mt-3 mb-1 sm:mb-2'>Fresh & Organic Products</h2>
              <p className='text-gray-600 text-xs sm:text-sm mb-3 sm:mb-6'>Get the best deals</p>
              <Link href='/products' className='text-cyan-500 font-semibold flex items-center gap-2 hover:gap-4 transition-all justify-center md:justify-start text-sm sm:text-base'>
                Shop Now <span>→</span>
              </Link>
            </div>
            <div className='w-full md:flex-1 md:flex md:justify-end'>
              <img src="/b3.png" alt='Products' className='w-full h-auto max-h-40 sm:max-h-48 object-contain' />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Banner
