
'use client'

import React, { useRef, useState } from 'react';
import Link from 'next/link';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

import { Navigation } from 'swiper/modules';
import Productitem from './Productitem';

const Productrow = (Props) => {
  // Sample products - Replace with API data
  const products = [
    { id: '1', category: 'Beverages', name: '100 Percent Apple Juice - 64 fl oz Bottle', image: '/p1.webp', rating: 4, price: 25.99, originalPrice: 30.10 },
    { id: '2', category: 'Breakfast & Bakery', name: 'Organic Whole Wheat Bread', image: '/p1.webp', rating: 5, price: 4.99, originalPrice: 6.50 },
    { id: '3', category: 'Meat & Seafood', name: 'Fresh Salmon Fillet', image: '/p1.webp', rating: 4.5, price: 18.99, originalPrice: 22.99 },
    { id: '4', category: 'Frozen Food', name: 'Frozen Mixed Vegetables', image: '/p1.webp', rating: 4, price: 3.99, originalPrice: 5.49 },
    { id: '5', category: 'Dairy', name: 'Organic Milk - 1 Gallon', image: '/p1.webp', rating: 4.5, price: 4.49, originalPrice: 5.99 },
    { id: '6', category: 'Snacks', name: 'Organic Almonds - 1 lb', image: '/p1.webp', rating: 5, price: 12.99, originalPrice: 15.99 },
  ];

  return (
  <section className='bg-white py-3 mt-6 rounded-md '>
        <div className='container'>
            <div className='flex items-center justify-between mb-6 gap-6'>
                <div className='coll w-[30%]'>
                    <h2 className='text-2xl font-[600] text-gray-800'>{Props.title}</h2>
                    
                   
                </div>
                <div className='coll w-[70%] flex items-center justify-end'>
                    <Link href='/products' className='text-cyan-500 font-[600] flex items-center gap-2 hover:gap-4 transition-all'>
                        View All <span>→</span>
                    </Link>
                </div>
            </div>
            <div className='grid grid-cols-6 gap-4 mt-8'>
                {products.map((product) => (
                  <Productitem 
                    key={product.id}
                    id={product.id}
                    category={product.category}
                    name={product.name}
                    image={product.image}
                    rating={product.rating}
                    price={product.price}
                    originalPrice={product.originalPrice}
                  />
                ))}
            </div>
        </div>
      </section>
            
  )
}

export default Productrow
