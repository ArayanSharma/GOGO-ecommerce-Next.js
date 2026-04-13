'use client'

import React from 'react'
import Link from 'next/link'
import Rating from '@mui/material/Rating'
import Button from '@mui/material/Button';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';

const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 2,
});

const formatINR = (value) => inrFormatter.format(Number(value || 0));

const Productitem = ({
  id = '1',
  category = 'Bingo',
  name = '100 Percent Apple Juice - 64 fl oz Bottle',
  image = '/p1.webp',
  rating = 4,
  price = 25.99,
  originalPrice = 30.10,
}) => {
  const safePrice = Number(price || 0);
  const safeOriginalPrice = Number(originalPrice || safePrice || 0);
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart, isInCart, getCartQuantity } = useCart();
  const inWishlist = isInWishlist(id);
  const inCart = isInCart(id);
  const cartQuantity = getCartQuantity(id);

  const handleWishlistToggle = () => {
    toggleWishlist({
      id,
      category,
      name,
      image,
      rating,
      price: safePrice,
      originalPrice: safeOriginalPrice,
    });
  };

  const handleAddToCart = () => {
    addToCart({
      id,
      category,
      name,
      image,
      rating,
      price: safePrice,
      originalPrice: safeOriginalPrice,
    }, 1);
  };

  return (
    <div className='productitem group relative w-full rounded-lg md:rounded-2xl border border-emerald-100/60 bg-gradient-to-br from-white to-emerald-50/40 p-3 sm:p-4 md:p-6 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2'>
        <button
          type='button'
          onClick={handleWishlistToggle}
          className='absolute right-3 top-3 sm:right-4 sm:top-4 md:right-7 md:top-7 z-10 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-white/95 text-red-500 shadow-lg ring-1 ring-red-100/50 transition-all duration-300 hover:scale-110 hover:bg-red-50 active:scale-95'
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          {inWishlist ? <FaHeart size={14} className='animate-pulse' /> : <FaRegHeart size={14} />}
        </button>
        <div className='img mb-2 sm:mb-3 md:mb-4 overflow-hidden rounded-lg md:rounded-xl bg-gradient-to-br from-gray-100 to-emerald-100/50 h-32 sm:h-40 md:h-48 flex items-center justify-center'>
          <Link href={`/productdet/${id}`}>
            <img src={image} alt={name} className='w-full h-full object-contain group-hover:scale-110 transition-transform duration-500' />
          </Link>
        </div>
        <div className='flex flex-col gap-2 sm:gap-2.5'>
            <p className='text-xs sm:text-sm font-semibold text-emerald-600 uppercase tracking-wide'>{category}</p>
            <Link href={`/productdet/${id}`} className='text-center text-xs sm:text-sm md:text-[15px] font-bold text-slate-800 group-hover:text-emerald-700 transition-colors duration-300 line-clamp-2 hover:underline underline-offset-2'>
              {name}
            </Link>
            <div className='flex justify-center'>
              <Rating name="read-only" value={rating} readOnly size='small'/>
            </div>
            <div className='flex justify-center gap-2 mt-1 sm:mt-2'>
              <span className='text-emerald-600 text-sm sm:text-base md:text-lg font-bold'>{formatINR(safePrice)}</span>
              <span className='text-slate-400 text-sm sm:text-base md:text-lg font-medium line-through'>{formatINR(safeOriginalPrice)}</span>
            </div>
        </div>
        
        <Button
          onClick={handleAddToCart}
          className='w-full mt-3 sm:mt-4 md:mt-5 relative overflow-hidden rounded-lg md:rounded-xl font-bold text-xs sm:text-sm min-h-10 md:min-h-11 transition-all duration-300 group/btn hover:scale-105 active:scale-95'
          style={{
            background: inCart 
              ? 'linear-gradient(135deg, #06b6d4 0%, #10b981 100%)' 
              : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            textTransform: 'uppercase',
            fontWeight: '600',
            letterSpacing: '0.5px',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)'
          }}
        >
          <span className='relative z-10'>
            {inCart ? `In Cart (${cartQuantity})` : 'Add to Cart'}
          </span>
        </Button>
    </div>
  )
}

export default Productitem
