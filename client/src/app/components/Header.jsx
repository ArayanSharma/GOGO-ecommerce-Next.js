'use client';

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Search from './Search'
import { FaRegHeart  } from "react-icons/fa";
import { IoCartOutline } from "react-icons/io5";
import Nav from './Nav';
import { useAuth } from '@/context/AuthContext';

const Header = () => {
  const { isAuthenticated, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
   <>
   <div className='headerWrapper sticky top-0 z-50 bg-white py-4'>
    <header className="sticky top-0 z-50 bg-white shadow-sm py-4">
    <div className='max-w-7xl mx-auto px-4 flex items-center justify-between gap-8'>
        <div className='logo flex-shrink-0'>
            <Link href="/" className='block'> 
            <Image src={"/gog.png"} alt='logo' width={230} height={61} loading="eager" />
            </Link>
        </div>
        
        <div className='flex-1'>
            <Search />
        </div>

        <div className='flex items-center gap-6'>
            {isAuthenticated ? (
              <div className='relative'>
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className='text-gray-700 hover:text-blue-600 transition-colors text-sm font-semibold'
                >
                  My Account ▼
                </button>
                {showUserMenu && (
                  <div className='absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10'>
                    <button 
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                      }}
                      className='w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 font-semibold rounded-lg'
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className='flex items-center gap-2 text-sm'>
                <Link href="/login" className='text-gray-700 hover:text-blue-600 transition-colors'>Login</Link>
                <span className='text-gray-300'>|</span>
                <Link href="/register" className='text-gray-700 hover:text-blue-600 transition-colors'>Signup</Link>
              </div>
            )}
            
            <div className='flex items-center gap-4'>
                <Link href="/wishlist" className='relative flex items-center text-gray-700 hover:text-red-500 transition-colors'>
                    <FaRegHeart size={24} />
                    <span className='absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center'>3</span>
                </Link>
                
                <Link href="/cart" className='relative flex items-center text-gray-700 hover:text-blue-600 transition-colors'>
                    <IoCartOutline size={24} />
                    <span className='absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center'>3</span>
                </Link>
            </div>
        </div>
    </div>
    
    </header>
    </div>
    <Nav />
   </>
  )
}

export default Header
