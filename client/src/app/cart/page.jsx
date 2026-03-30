'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Rating } from '@mui/material'
import { MdClose } from 'react-icons/md'

const Cart = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      brand: 'Fortune',
      name: 'Fortune Sunlite Refined Sunflower Oil 1 L',
      rating: 5,
      reviews: 123,
      price: 25.99,
      originalPrice: 38.10,
      discount: 14,
      quantity: 1,
      image: '/p1.webp'
    },
    {
      id: 2,
      brand: 'Zandu',
      name: 'Chyavanprashad With No Added Sugar 900 gm',
      rating: 5,
      reviews: 85,
      price: 25.99,
      originalPrice: 38.10,
      discount: 14,
      quantity: 1,
      image: '/p1.webp'
    },
    {
      id: 3,
      brand: 'Gemini',
      name: 'Gemini Refined Sunflower Oil 1 L',
      rating: 5,
      reviews: 156,
      price: 25.99,
      originalPrice: 38.10,
      discount: 14,
      quantity: 1,
      image: '/p1.webp'
    },
    {
      id: 4,
      brand: "Lay's",
      name: "Lay's American Style Cream & Onion Potato Chips 82 g",
      rating: 5,
      reviews: 92,
      price: 25.99,
      originalPrice: 38.10,
      discount: 14,
      quantity: 1,
      image: '/p1.webp'
    }
  ])

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity > 0) {
      setCartItems(cartItems.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      ))
    }
  }

  const handleRemoveItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id))
  }

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shipping = 0
  const total = subtotal + shipping

  return (
    <div className='min-h-screen bg-white'>
      <div className='max-w-7xl mx-auto px-4 py-8'>
        <h1 className='text-3xl font-bold mb-8 text-gray-800'>Cart</h1>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Cart Items */}
          <div className='lg:col-span-2'>
            <div className='bg-white rounded-lg'>
              <div className='mb-6 pb-4 border-b'>
                <p className='text-[20px] font-semibold text-gray-800'>Your Cart</p>
                <p className='text-gray-500 text-sm'>There are {cartItems.length} products in your cart</p>
              </div>

              {/* Cart Item List */}
              <div className='space-y-4'>
                {cartItems.length > 0 ? (
                  cartItems.map(item => (
                    <div key={item.id} className='bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow'>
                      <div className='flex gap-4'>
                        {/* Product Image */}
                        <Link href={`/productdet/${item.id}`}>
                          <div className='flex-shrink-0 w-24 h-24 bg-white rounded-md overflow-hidden cursor-pointer hover:opacity-80'>
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className='w-full h-full object-cover'
                            />
                          </div>
                        </Link>

                        {/* Product Details */}
                        <div className='flex-1'>
                          <Link href={`/productdet/${item.id}`}>
                            <p className='text-gray-500 text-sm font-[500] cursor-pointer hover:text-blue-600'>{item.brand}</p>
                            <h3 className='text-gray-800 font-[600] text-sm mb-2 cursor-pointer hover:text-blue-600 line-clamp-2'>
                              {item.name}
                            </h3>
                          </Link>

                          <div className='flex items-center gap-2 mb-2'>
                            <Rating name={`rating-${item.id}`} value={item.rating} readOnly size='small' />
                            <span className='text-gray-500 text-xs'>({item.reviews})</span>
                          </div>

                          <div className='flex items-center gap-3'>
                            <span className='text-red-500 font-bold'>${item.price.toFixed(2)}</span>
                            <span className='text-gray-400 line-through text-sm'>${item.originalPrice.toFixed(2)}</span>
                            <span className='text-green-600 font-bold text-sm'>{item.discount}% OFF</span>
                          </div>
                        </div>

                        {/* Quantity & Remove */}
                        <div className='flex flex-col items-end justify-between'>
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className='text-gray-400 hover:text-red-500 transition-colors'
                          >
                            <MdClose size={24} />
                          </button>

                          <div className='flex items-center border border-gray-300 rounded-md'>
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              className='px-2 py-1 hover:bg-gray-200 transition-colors'
                            >
                              −
                            </button>
                            <input
                              type='number'
                              min='1'
                              value={item.quantity}
                              onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                              className='w-12 text-center border-l border-r border-gray-300 py-1 focus:outline-none'
                            />
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              className='px-2 py-1 hover:bg-gray-200 transition-colors'
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className='text-center text-gray-500 py-8'>Your cart is empty</p>
                )}
              </div>
            </div>
          </div>

          {/* Cart Totals Sidebar */}
          <div className='h-fit'>
            <div className='bg-gray-50 rounded-lg p-6 sticky top-20'>
              <h2 className='text-xl font-semibold text-gray-800 mb-6'>Cart Totals</h2>

              <div className='space-y-4 mb-6'>
                <div className='flex justify-between items-center'>
                  <span className='text-gray-700'>Subtotal</span>
                  <span className='text-red-500 font-semibold'>${subtotal.toFixed(2)}</span>
                </div>

                <div className='flex justify-between items-center border-b pb-4'>
                  <span className='text-gray-700'>Shipping</span>
                  <span className='text-green-600 font-semibold'>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                </div>

                <div className='flex justify-between items-center text-gray-500 text-sm mb-4'>
                  <span>Estimate for</span>
                  <span>India</span>
                </div>

                <div className='flex justify-between items-center border-t pt-4'>
                  <span className='font-semibold text-gray-800'>Total</span>
                  <span className='text-red-500 font-bold text-lg'>${total.toFixed(2)}</span>
                </div>
              </div>

              <Link href='/checkout' className='w-full'>
                <button className='w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 rounded-md transition-colors'>
                  Proceed to Checkout
                </button>
              </Link>

              <Link href='/' className='w-full block mt-3'>
                <button className='w-full border border-gray-300 hover:bg-gray-100 text-gray-700 font-semibold py-2 rounded-md transition-colors'>
                  Continue Shopping
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
