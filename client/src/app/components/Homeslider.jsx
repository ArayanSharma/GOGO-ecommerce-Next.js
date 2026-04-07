'use client'
import React, { useEffect, useState } from 'react'

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation , Autoplay} from 'swiper/modules';
import Image from 'next/image';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';



const Homeslider = () => {
  const [slides, setSlides] = useState([
    { _id: 'fallback-1', image: '/c1.avif', title: 'slider1' },
    { _id: 'fallback-2', image: '/c2.avif', title: 'slider2' },
  ]);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const response = await fetch(`${apiUrl}/api/sliders`, { cache: 'no-store' });
        const result = await response.json();

        if (result.success && Array.isArray(result.data) && result.data.length > 0) {
          setSlides(result.data);
        }
      } catch (error) {
        console.error('Failed to load homepage slides:', error);
      }
    };

    fetchSlides();
  }, []);

  return (
    <div className='homeslider'>
        <Swiper navigation={true}
         modules={[Navigation, Autoplay]}
         autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        

        //add imaegs
        className="mySwiper">
        {slides.map((slide) => (
          <SwiperSlide key={slide._id || slide.image}>
            <div className='item'>
              <Image
                src={slide.image}
                alt={slide.title || 'slider-image'}
                width={900}
                height={300}
                className='w-full h-auto'
              />
            </div>
          </SwiperSlide>
        ))}
        
      </Swiper>

      
    </div>
  )
}

export default Homeslider
