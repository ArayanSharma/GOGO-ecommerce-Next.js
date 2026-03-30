'use client'

import React, { useState } from 'react'
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating'
import { useParams } from 'next/navigation'
import Productrow from '@/app/components/Productrow';

// Mock product data - Replace with API call
const MOCK_PRODUCTS = {
  '1': {
    id: '1',
    name: '100 Percent Apple Juice - 64 fl oz Bottle',
    category: 'Beverages',
    price: 25.99,
    originalPrice: 30.10,
    rating: 4,
    reviews: 128,
    inStock: true,
    quantity: 50,
    images: ['/p1.webp', '/p1.webp', '/p1.webp'],
    description: 'Pure, refreshing apple juice made from 100% apples. No added sugars, preservatives, or artificial flavors. Perfect for breakfast or anytime refreshment.',
    details: {
      brand: 'Pure Apple',
      weight: '64 fl oz (1.89 L)',
      ingredients: 'Apple juice concentrate, water',
      manufacturer: 'Fresh Juice Co.',
      origin: 'USA'
    }
  },
  '2': {
    id: '2',
    name: 'Organic Whole Wheat Bread',
    category: 'Breakfast & Bakery',
    price: 4.99,
    originalPrice: 6.50,
    rating: 5,
    reviews: 245,
    inStock: true,
    quantity: 100,
    images: ['/p1.webp', '/p1.webp', '/p1.webp'],
    description: 'Fresh, hearty organic whole wheat bread made with natural ingredients. No preservatives, additives, or artificial colors.',
    details: {
      brand: 'Organic Bakery',
      weight: '24 oz (680g)',
      ingredients: 'Whole wheat flour, water, salt, yeast',
      manufacturer: 'Local Bakery',
      origin: 'USA'
    }
  },
  '3': {
    id: '3',
    name: 'Fresh Salmon Fillet',
    category: 'Meat & Seafood',
    price: 18.99,
    originalPrice: 22.99,
    rating: 4.5,
    reviews: 89,
    inStock: true,
    quantity: 30,
    images: ['/p1.webp', '/p1.webp', '/p1.webp'],
    description: 'Premium quality fresh salmon fillet. Rich in Omega-3 fatty acids. Perfect for grilling, baking, or pan-searing.',
    details: {
      brand: 'Ocean Fresh',
      weight: '8 oz (227g)',
      type: 'Wild Caught',
      manufacturer: 'Ocean Fresh Co.',
      origin: 'Alaska'
    }
  }
};

const ProductDetail = () => {
  const params = useParams();
  const productId = params.productdetId;
  const [quantity, setQuantity] = useState(1);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [mainSwiper, setMainSwiper] = useState(null);

  // Get product data
  const product = MOCK_PRODUCTS[productId] || MOCK_PRODUCTS['1'];

  const handleAddToCart = () => {
    console.log(`Added ${quantity} of product ${productId} to cart`);
    // Add to cart logic here
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= product.quantity) {
      setQuantity(value);
    }
  };

  return (
    <div>
      <section className='py-8'>
        <div className='container'>
          <div className='flex gap-8 py-5'>
            {/* Product Images */}
            <div className='productImages w-[45%]'>
              <div className='mb-4'>
                <Swiper
                  modules={[Navigation, Pagination, Thumbs]}
                  thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                  navigation
                  pagination={{ clickable: true }}
                  className='rounded-lg overflow-hidden bg-gray-50'
                  onSwiper={setMainSwiper}
                >
                  {product.images.map((image, index) => (
                    <SwiperSlide key={index}>
                      <img 
                        src={image} 
                        alt={`Product image ${index + 1}`} 
                        className='w-full h-96 object-cover'
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              {/* Thumbnail Images */}
              <Swiper
                modules={[Thumbs]}
                onSwiper={setThumbsSwiper}
                slidesPerView={4}
                spaceBetween={10}
                className='thumbs-swiper'
              >
                {product.images.map((image, index) => (
                  <SwiperSlide key={index}>
                    <img 
                      src={image} 
                      alt={`Thumbnail ${index + 1}`} 
                      className='w-full h-20 object-cover rounded cursor-pointer border-2 border-transparent hover:border-cyan-500'
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* Product Details */}
            <div className='productDetails w-[55%]'>
              <div className='mb-4'>
                <span className='inline-block bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-[600] mb-3'>
                  {product.category}
                </span>
                <h1 className='text-3xl font-[700] text-gray-800 mb-3'>
                  {product.name}
                </h1>
              </div>

              {/* Rating */}
              <div className='flex items-center gap-3 mb-4'>
                <div className='flex items-center gap-1'>
                  <Rating name="read-only" value={product.rating} readOnly size='medium' />
                </div>
                <span className='text-gray-600 text-sm'>({product.reviews} reviews)</span>
              </div>

              {/* Price */}
              <div className='flex items-center gap-4 mb-6'>
                <span className='text-4xl font-[700] text-red-600'>
                  ${product.price.toFixed(2)}
                </span>
                <span className='text-2xl text-gray-400 line-through font-[500]'>
                  ${product.originalPrice.toFixed(2)}
                </span>
                <span className='inline-block bg-green-100 text-green-600 px-3 py-1 rounded font-[600]'>
                  Save {Math.round((1 - product.price / product.originalPrice) * 100)}%
                </span>
              </div>

              {/* Stock Status */}
              <div className='mb-6'>
                {product.inStock ? (
                  <div className='flex items-center gap-2'>
                    <div className='w-3 h-3 bg-green-500 rounded-full'></div>
                    <span className='text-green-600 font-[600]'>In Stock ({product.quantity} available)</span>
                  </div>
                ) : (
                  <div className='flex items-center gap-2'>
                    <div className='w-3 h-3 bg-red-500 rounded-full'></div>
                    <span className='text-red-600 font-[600]'>Out of Stock</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <p className='text-gray-600 text-base leading-relaxed mb-6'>
                {product.description}
              </p>

              {/* Quantity and Add to Cart */}
              <div className='flex gap-4 mb-8'>
                <div className='flex items-center border-2 border-gray-300 rounded-lg'>
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className='px-4 py-2 text-gray-600 hover:bg-gray-100'
                  >
                    −
                  </button>
                  <input 
                    type='number' 
                    value={quantity}
                    onChange={handleQuantityChange}
                    className='w-16 text-center border-0 outline-none font-[600]'
                    min='1'
                    max={product.quantity}
                  />
                  <button 
                    onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                    className='px-4 py-2 text-gray-600 hover:bg-gray-100'
                  >
                    +
                  </button>
                </div>

                <Button 
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className='flex-1 bg-cyan-500 text-white hover:bg-cyan-600'
                  style={{
                    textTransform: 'uppercase',
                    fontSize: '14px',
                    fontWeight: '600',
                    padding: '12px 20px'
                  }}
                >
                  Add to Cart
                </Button>
              </div>

              {/* Additional Details */}
              <div className='border-t pt-6'>
                <h3 className='text-lg font-[600] text-gray-800 mb-4'>Product Details</h3>
                <div className='space-y-3'>
                  {Object.entries(product.details).map(([key, value]) => (
                    <div key={key} className='flex justify-between text-sm'>
                      <span className='text-gray-600 capitalize font-[500]'>
                        {key.replace(/([A-Z])/g, ' $1').trim()}:
                      </span>
                      <span className='text-gray-800 font-[600]'>{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Share and Wishlist */}
              <div className='flex gap-4 mt-6 pt-6 border-t'>
                <Button 
                  className='border-2 border-gray-300 text-gray-700 hover:bg-gray-100'
                  style={{
                    textTransform: 'capitalize',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  💙 Add to Wishlist
                </Button>
                <Button 
                  className='border-2 border-gray-300 text-gray-700 hover:bg-gray-100'
                  style={{
                    textTransform: 'capitalize',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  📤 Share
                </Button>
              </div>
            </div>
          </div>
        </div>
        <Productrow />
      </section>
    </div>
  )
}

export default ProductDetail
