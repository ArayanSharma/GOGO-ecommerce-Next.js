'use client';

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Search from './Search'
import { FaRegHeart, FaSignOutAlt } from "react-icons/fa";
import { IoCartOutline } from "react-icons/io5";
import { FaCircleUser } from "react-icons/fa6";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import Nav from './Nav';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';

const Header = () => {
  const { isAuthenticated, userName, userEmail, logout } = useAuth();
  const { wishlistCount } = useWishlist();
  const { cartCount } = useCart();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const displayName = userName || (userEmail ? userEmail.split('@')[0] : 'My Account');

  return (
   <>
   <div className='headerWrapper sticky top-0 z-50 bg-gradient-to-r from-white via-white to-emerald-50/20 py-2 sm:py-3 md:py-4 shadow-md border-b border-emerald-100/20'>
    <header className="sticky top-0 z-50">
      {/* Desktop Header */}
      <div className='container flex items-center justify-between gap-2 sm:gap-4 md:gap-8 py-2 md:py-3'>
        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setShowMobileNav(!showMobileNav)}
          className='md:hidden flex items-center justify-center h-10 w-10 rounded-lg hover:bg-gradient-to-r hover:from-emerald-100 hover:to-emerald-50 transition-all duration-300 text-gray-700 hover:text-emerald-600'
          aria-label="Toggle menu"
        >
          {showMobileNav ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
        </button>

        {/* Logo */}
        <div className='logo shrink-0 hover:scale-105 transition-transform duration-300'>
          <Link href="/" className='block'> 
            <Image 
              src={"/gog.png"} 
              alt='logo' 
              width={230} 
              height={61} 
              loading="eager" 
              className='h-auto w-24 sm:w-32 md:w-40' 
            />
          </Link>
        </div>
        
        {/* Search Bar - Hidden on mobile */}
        <div className='hidden sm:flex flex-1'>
          <Search />
        </div>

        {/* Actions */}
        <div className='flex items-center gap-2 sm:gap-3 md:gap-4'>
          {isAuthenticated ? (
            <div className='relative'>
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className='flex items-center justify-center h-10 w-10 rounded-lg hover:bg-gradient-to-r hover:from-blue-100 hover:to-blue-50 transition-all duration-300 text-gray-700 hover:text-blue-600 hover:scale-110'
                title={displayName}
              >
                <FaCircleUser size={24} />
              </button>
              {showUserMenu && (
                <div className='absolute right-0 mt-3 w-56 sm:w-64 bg-white border border-gray-200 rounded-xl shadow-2xl z-10 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200'>
                  <div className='px-4 py-4 bg-gradient-to-r from-blue-50 via-blue-50/50 to-emerald-50/30 border-b border-blue-100/30'>
                    <p className='text-xs sm:text-sm font-bold text-gray-800 truncate'>{displayName}</p>
                    {userEmail && <p className='text-xs text-gray-600 mt-1.5 truncate'>{userEmail}</p>}
                  </div>
                  <button 
                    onClick={() => {
                      logout();
                      setShowUserMenu(false);
                    }}
                    className='w-full text-left px-4 py-3 hover:bg-gradient-to-r hover:from-red-50 hover:to-transparent text-red-600 font-semibold flex items-center gap-2 transition-all duration-300 text-sm hover:translate-x-1 border-t border-gray-100'
                  >
                    <FaSignOutAlt size={14} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className='hidden sm:flex items-center gap-3 text-xs sm:text-sm font-medium'>
              <Link href="/login" className='px-3 py-2 rounded-lg text-gray-700 hover:bg-gradient-to-r hover:from-blue-100 hover:to-blue-50 transition-all duration-300 hover:text-blue-600'>Login</Link>
              <span className='text-gray-300'>|</span>
              <Link href="/register" className='px-3 py-2 rounded-lg text-gray-700 hover:bg-gradient-to-r hover:from-emerald-100 hover:to-emerald-50 transition-all duration-300 hover:text-emerald-600'>Signup</Link>
            </div>
          )}
          
          {/* Cart & Wishlist */}
          <Link href="/wishlist" className='relative inline-flex items-center justify-center h-10 w-10 hover:bg-gradient-to-r hover:from-red-100 hover:to-red-50 rounded-lg transition-all duration-300 text-gray-700 hover:text-red-600 hover:scale-110'>
            <FaRegHeart size={20} />
            {wishlistCount > 0 && (
              <span className='absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg ring-1 ring-white'>
                {wishlistCount}
              </span>
            )}
          </Link>
          
          <Link href="/cart" className='relative inline-flex items-center justify-center h-10 w-10 hover:bg-gradient-to-r hover:from-emerald-100 hover:to-emerald-50 rounded-lg transition-all duration-300 text-gray-700 hover:text-emerald-600 hover:scale-110'>
            <IoCartOutline size={20} />
            {cartCount > 0 && (
              <span className='absolute -top-2 -right-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg ring-1 ring-white'>
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className='block sm:hidden px-3 py-3 border-t border-gray-200/50 bg-gray-50/50'>
        <Search />
      </div>
    </header>

    {/* Mobile Navigation Menu */}
    {showMobileNav && (
      <div className='md:hidden bg-white border-t border-gray-200/50 px-3 py-3 space-y-1 animate-in slide-in-from-top duration-200'>
        <Link href="/" className='block px-3 py-2.5 rounded-lg hover:bg-gradient-to-r hover:from-emerald-100 hover:to-emerald-50 text-gray-800 font-medium text-sm transition-all duration-300 hover:translate-x-1'>Home</Link>
        <Link href="/products" className='block px-3 py-2.5 rounded-lg hover:bg-gradient-to-r hover:from-emerald-100 hover:to-emerald-50 text-gray-800 font-medium text-sm transition-all duration-300 hover:translate-x-1'>Products</Link>
        <Link href="/login" className='block px-3 py-2.5 rounded-lg hover:bg-gradient-to-r hover:from-blue-100 hover:to-blue-50 text-gray-800 font-medium text-sm sm:hidden transition-all duration-300 hover:translate-x-1'>Login</Link>
        <Link href="/register" className='block px-3 py-2.5 rounded-lg hover:bg-gradient-to-r hover:from-emerald-100 hover:to-emerald-50 text-gray-800 font-medium text-sm sm:hidden transition-all duration-300 hover:translate-x-1'>Signup</Link>
      </div>
    )}
   </div>
    <Nav />
   </>
  )
}

export default Header
