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
    <div className='productitem group relative w-full rounded-2xl border border-emerald-100 bg-white p-4 shadow-md transition hover:-translate-y-1 hover:shadow-xl'>
        <button
          type='button'
          onClick={handleWishlistToggle}
          className='absolute right-7 top-7 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-red-500 shadow-md ring-1 ring-red-100 transition hover:scale-105 hover:bg-red-50'
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          {inWishlist ? <FaHeart size={16} /> : <FaRegHeart size={16} />}
        </button>
        <div className='img mb-3 overflow-hidden rounded-xl bg-emerald-50'>
        <Link href={`/productdet/${id}`}>
            <img src={image} alt={name} className='w-full h-auto group-hover:scale-110 transition-transform duration-300' />
          </Link>
        </div>
        <div className='flex flex-col gap-2'>
            <p className='text-sm font-semibold text-emerald-600'>{category}</p>
            <Link href={`/productdet/${id}`} className='text-center text-[15px] font-bold text-slate-800 group-hover:text-emerald-700 transition-colors line-clamp-2'>
              {name}
            </Link>
            <div className='flex justify-center'>
              <Rating name="read-only" value={rating} readOnly size='small'/>
            </div>
            <div className='flex justify-center gap-2 mt-2'>
              <span className='text-red-600 text-lg font-bold'>{formatINR(safePrice)}</span>
              <span className='text-slate-400 text-lg font-medium line-through'>{formatINR(safeOriginalPrice)}</span>
            </div>
        </div>
        
        <Button
          onClick={handleAddToCart}
          className='w-full mt-3 border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all'
          style={{textTransform: 'uppercase', fontSize: '12px', fontWeight: '600'}}
        >
          {inCart ? `In Cart (${cartQuantity})` : 'Add to Cart'}
        </Button>
    </div>
  )
}

export default Productitem
