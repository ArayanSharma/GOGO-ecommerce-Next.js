
'use client'

import React, { useRef, useState } from 'react';
import Link from 'next/link';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

import { Navigation } from 'swiper/modules';
import Productitem from './Productitem';

const Productrow = (Props) => {
  return (
  <section className='bg-white py-3 mt-6 rounded-md '>
        <div className='container'>
            <div className='flex items-center justify-between mb-6 gap-6'>
                <div className='coll w-[30%]'>
                    <h2 className='text-2xl font-[600] text-gray-800'>{Props.title}</h2>
                    
                   
                </div>
                <div className='coll w-[70%] flex items-center justify-end'>
                    <Link href='/shop' className='text-cyan-500 font-[600] flex items-center gap-2 hover:gap-4 transition-all'>
                        View All <span>→</span>
                    </Link>
                </div>
            </div>
            <div className='grid grid-cols-6 gap-4 mt-8'>
                <Productitem />
                <Productitem />
                <Productitem />
                <Productitem />
                <Productitem />
                <Productitem />
            </div>
        </div>
      </section>
            
  )
}

export default Productrow
