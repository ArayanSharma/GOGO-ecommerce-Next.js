'use client'

import React, { useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

import { Navigation } from 'swiper/modules';
import Productitem from './Productitem';

// Import Swiper styles


const Productslider = () => {
  return (
    <div className='productslider py-5'>
      <Swiper
      sliderperview={6}
        spaceBetween={10}
          navigation={true}
        modules={[Navigation]}
        className="mySwiper"
      >
        <SwiperSlide className='flex py-3 px-2 '>
          <Productitem />
          </SwiperSlide>
        
        <SwiperSlide className='flex py-3 px-2 '>
          <Productitem />
          </SwiperSlide>
        
        <SwiperSlide className='flex py-3 px-2 '>
          <Productitem />
          </SwiperSlide>
        
        <SwiperSlide className='flex py-3 px-2 '>
          <Productitem />
          </SwiperSlide>
        
        <SwiperSlide className='flex py-3 px-2 '>
          <Productitem />
          </SwiperSlide>
        
        <SwiperSlide className='flex py-3 px-2 '>
          <Productitem />
          </SwiperSlide>
        
        <SwiperSlide className='flex py-3 px-2 '>
          <Productitem />
          </SwiperSlide>
        
        <SwiperSlide className='flex py-3 px-2 '>
          <Productitem />
          </SwiperSlide>
        
        

      </Swiper>
      
    </div>
  )
}

export default Productslider
