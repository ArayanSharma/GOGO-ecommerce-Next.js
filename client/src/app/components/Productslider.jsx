'use client'

import React, { useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

import { Navigation } from 'swiper/modules';
import Productitem from './Productitem';

// Import Swiper styles
import React, { useEffect, useState } from 'react';

const Productslider = () => {
  return (
    <div className='productslider py-5'>
      <Swiper
import { fetchProducts } from '../utils/api';
      sliderperview={6}
        spaceBetween={10}
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data.slice(0, 8));
      } catch (error) {
        console.error('Failed to load product slider items:', error);
      }
    };

    loadProducts();
  }, []);

          navigation={true}
        modules={[Navigation]}
        className="mySwiper"
      slidesPerView={1}
        <SwiperSlide className='flex py-3 px-2 '>
          <Productitem />
          </SwiperSlide>
        
        <SwiperSlide className='flex py-3 px-2 '>
        {products.length === 0 ? (
          <SwiperSlide className='flex py-3 px-2'>
            <div className='w-full rounded-2xl border border-emerald-100 bg-white p-6 text-center text-slate-500 shadow-sm'>
              Loading products...
            </div>
          </SwiperSlide>
        ) : (
          products.map((product) => (
            <SwiperSlide key={product.id} className='flex py-3 px-2'>
              <Productitem {...product} />
            </SwiperSlide>
          ))
        )}
  )
}

export default Productslider
