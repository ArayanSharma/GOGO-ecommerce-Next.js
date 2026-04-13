'use client'

import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import Productitem from './Productitem';
import { fetchProducts } from '../utils/api';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

const Productslider = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchProducts();
        setProducts(data.slice(0, 12));
      } catch (error) {
        console.error('Failed to load product slider items:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <div className='productslider py-4 sm:py-5 md:py-6'>
      <div className='container'>
        {loading ? (
          <div className='rounded-lg sm:rounded-2xl border border-emerald-100 bg-white p-4 sm:p-6 text-center text-xs sm:text-sm text-slate-500 shadow-sm'>
            Loading products...
          </div>
        ) : (
          <Swiper
            slidesPerView={2}
            spaceBetween={8}
            breakpoints={{
              320: { slidesPerView: 2, spaceBetween: 8 },
              640: { slidesPerView: 3, spaceBetween: 10 },
              768: { slidesPerView: 4, spaceBetween: 12 },
              1024: { slidesPerView: 5, spaceBetween: 15 },
              1280: { slidesPerView: 6, spaceBetween: 20 },
            }}
            navigation={true}
            modules={[Navigation]}
            className="mySwiper"
          >
            {products.map((product) => (
              <SwiperSlide key={product.id} className='flex py-2 sm:py-3 px-1 sm:px-2'>
                <Productitem {...product} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </div>
  );
};

export default Productslider;
