'use client'
import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import Link from 'next/link';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

const Catslider = () => {
  return (
    <div className='py-5'>
        <div className='container flex items-center justify-between gap-5'>

             <Swiper
        slidesPerView={'10'}
        spaceBetween={20}
        navigation={false}
        pagination={{
          clickable: true,
        }}
        modules={[Navigation]}
        className="mySwiper"
      >
        <SwiperSlide>
            <Link href="/products" className='group'>
            <div className='bg-white p-3 w-full rounded-md shadow-md flex items-center justify-center group-hover:shadow-lg group-hover:bg-primary/10 transition-all duration-300'>
                <img src="/c1.avif" alt='cat1' className='w-full h-auto' />
            </div>
            <h4 className='text-center text-15px font-semibold mt-3 text-gray-700 group-hover:text-primary transition-colors duration-300'>
                Fruits & Vegetables
            </h4>
            </Link>
            </SwiperSlide>
            
            <SwiperSlide>
                <Link href="/products" className='group'>
            <div className='bg-white p-3 w-full rounded-md shadow-md flex items-center justify-center group-hover:shadow-lg group-hover:bg-primary/10 transition-all duration-300'>
                <img src="/c2.avif" alt='cat1' className='w-full h-auto' />
            </div>
            <h4 className='text-center text-15px font-semibold mt-3 text-gray-700 group-hover:text-primary transition-colors duration-300'>
                Meat & Seafood
            </h4>
            </Link>
            </SwiperSlide>
            
            <SwiperSlide>
                <Link href="/products" className='group'>
            <div className='bg-white p-3 w-full rounded-md shadow-md flex items-center justify-center group-hover:shadow-lg group-hover:bg-primary/10 transition-all duration-300'>
                <img src="/c3.webp" alt='cat1' className='w-full h-auto' />
            </div>
            <h4 className='text-center text-15px font-semibold mt-3 text-gray-700 group-hover:text-primary transition-colors duration-300'>
                Breakfast & Bakery
            </h4>
            </Link>
            </SwiperSlide>
            
            <SwiperSlide>
                <Link href="/products" className='group'>
            <div className='bg-white p-3 w-full rounded-md shadow-md flex items-center justify-center group-hover:shadow-lg group-hover:bg-primary/10 transition-all duration-300'>
                <img src="/c5.jpg" alt='cat1' className='w-full h-auto' />
            </div>
            <h4 className='text-center text-15px font-semibold mt-3 text-gray-700 group-hover:text-primary transition-colors duration-300'>
                Beverages
            </h4>
            </Link>
            </SwiperSlide>

            <SwiperSlide>
                <Link href="/products" className='group'>
            <div className='bg-white p-3 w-full rounded-md shadow-md flex items-center justify-center group-hover:shadow-lg group-hover:bg-primary/10 transition-all duration-300'>
                <img src="/c4.jpg" alt='cat1' className='w-full h-auto' />
            </div>
            <h4 className='text-center text-15px font-semibold mt-3 text-gray-700 group-hover:text-primary transition-colors duration-300'>
                Bread & Bakery
            </h4>
            </Link>
            </SwiperSlide>

            
            <SwiperSlide>
                <Link href="/products" className='group'>
            <div className='bg-white p-3 w-full rounded-md shadow-md flex items-center justify-center group-hover:shadow-lg group-hover:bg-primary/10 transition-all duration-300'>
                <img src="/c6.png" alt='cat1' className='w-full h-auto' />
            </div>
            <h4 className='text-center text-15px font-semibold mt-3 text-gray-700 group-hover:text-primary transition-colors duration-300'>
                Frozen Food
            </h4>
            </Link>

            </SwiperSlide>
            
            <SwiperSlide>
                <Link href="/products" className='group'>
            <div className='bg-white p-3 w-full rounded-md shadow-md flex items-center justify-center group-hover:shadow-lg group-hover:bg-primary/10 transition-all duration-300'>
                <img src="/c7.jpg" alt='cat1' className='w-full h-auto' />
            </div>
            <h4 className='text-center text-15px font-semibold mt-3 text-gray-700 group-hover:text-primary transition-colors duration-300'>
                Biscuits & Snacks
            </h4>
            </Link>
            </SwiperSlide>
            
            

            <SwiperSlide>
                <Link href="/products" className='group'>
            <div className='bg-white p-3 w-full rounded-md shadow-md flex items-center justify-center group-hover:shadow-lg group-hover:bg-primary/10 transition-all duration-300'>
                <img src="/c11.png" alt='cat1' className='w-full h-auto' />
            </div>
            <h4 className='text-center text-15px font-semibold mt-3 text-gray-700 group-hover:text-primary transition-colors duration-300'>
                Baby & pregnancy
            </h4>
            </Link>
            </SwiperSlide>
            
            <SwiperSlide>
                <Link href="/products" className='group'>
            <div className='bg-white p-3 w-full rounded-md shadow-md flex items-center justify-center group-hover:shadow-lg group-hover:bg-primary/10 transition-all duration-300'>
                <img src="/c9.png" alt='cat1' className='w-full h-auto' />
            </div>
            <h4 className='text-center text-15px font-semibold mt-3 text-gray-700 group-hover:text-primary transition-colors duration-300'>
                Healtcare
            </h4>
            </Link>
            </SwiperSlide>
            
            
            
            <SwiperSlide>
                <Link href="/products" className='group'>
            <div className='bg-white p-3 w-full rounded-md shadow-md flex items-center justify-center group-hover:shadow-lg group-hover:bg-primary/10 transition-all duration-300'>
                <img src="/c10.png" alt='cat1' className='w-full h-auto' />
            </div>
            <h4 className='text-center text-15px font-semibold mt-3 text-gray-700 group-hover:text-primary transition-colors duration-300'>
                Grocery & Staples
            </h4>
            </Link>
            </SwiperSlide>
      </Swiper>
        </div>
    </div>
  )
}

export default Catslider
