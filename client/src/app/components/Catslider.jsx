'use client'
import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import Link from 'next/link';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

const Catslider = () => {
  const categories = [
    { name: 'Fruits & Vegetables', image: '/c1.avif' },
    { name: 'Meat & Seafood', image: '/c2.avif' },
    { name: 'Breakfast & Bakery', image: '/c3.webp' },
    { name: 'Beverages', image: '/c5.jpg' },
    { name: 'Bread & Bakery', image: '/c4.jpg' },
    { name: 'Frozen Food', image: '/c6.png' },
    { name: 'Biscuits & Snacks', image: '/c7.jpg' },
    { name: 'Baby & Pregnancy', image: '/c11.png' },
    { name: 'Healthcare', image: '/c9.png' },
    { name: 'Grocery & Staples', image: '/c10.png' },
  ];

  return (
    <div className='py-3 sm:py-4 md:py-5'>
      <div className='container'>
        <Swiper
          slidesPerView={3}
          spaceBetween={10}
          breakpoints={{
            320: { slidesPerView: 2, spaceBetween: 8 },
            640: { slidesPerView: 3, spaceBetween: 10 },
            768: { slidesPerView: 4, spaceBetween: 12 },
            1024: { slidesPerView: 6, spaceBetween: 15 },
          }}
          navigation={false}
          pagination={{ clickable: true }}
          modules={[Navigation]}
          className="mySwiper"
        >
          {categories.map((category, index) => (
            <SwiperSlide key={index}>
              <Link href="/products" className='group block'>
                <div className='bg-white p-2 sm:p-3 w-full rounded-md shadow-md flex items-center justify-center group-hover:shadow-lg group-hover:bg-primary/10 transition-all duration-300'>
                  <img src={category.image} alt={category.name} className='w-full h-auto max-h-32 object-contain' />
                </div>
                <h4 className='text-center text-xs sm:text-sm md:text-base font-semibold mt-2 sm:mt-3 text-gray-700 group-hover:text-primary transition-colors duration-300 line-clamp-2'>
                  {category.name}
                </h4>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )
}

export default Catslider
