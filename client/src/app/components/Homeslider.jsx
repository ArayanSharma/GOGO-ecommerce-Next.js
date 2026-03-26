'use client'
import React from 'react'

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation , Autoplay} from 'swiper/modules';
import Image from 'next/image';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';



const Homeslider = () => {
  return (
    <div className='homeslider'>
        <Swiper navigation={true}
         modules={[Navigation, Autoplay]}
         autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        
        className="mySwiper">
        <SwiperSlide>
            <div className='item'>
                <Image src={"/s1.png"} alt='slider1' width={900} height={300} className='w-full ' />
            </div>

        </SwiperSlide>
        <SwiperSlide>
            <div className='item'>
                <Image src={"/s2.png"} alt='slider1' width={900} height={300} className='w-full ' />
            </div>
            
        </SwiperSlide>
        
      </Swiper>

      
    </div>
  )
}

export default Homeslider
