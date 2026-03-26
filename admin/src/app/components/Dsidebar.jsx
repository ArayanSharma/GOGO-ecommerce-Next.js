'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import {
  Home,
  Sliders,
  Package,
  Plus,
  ShoppingCart,
  LogOut,
  ChevronRight,
  Menu,
  X
} from 'lucide-react'

const Dsidebar = () => {
  const [isOpen, setIsOpen] = useState(true)
  const [activeItem, setActiveItem] = useState('home')

  const menuItems = [
    { id: 'home', label: 'Home', icon: Home, color: 'from-blue-500 to-blue-600', href: '/' },
    { id: 'slider', label: 'Slider', icon: Sliders, color: 'from-purple-500 to-purple-600', href: '/slider' },
    { id: 'products', label: 'Products', icon: Package, color: 'from-pink-500 to-pink-600', href: '/products' },
    { id: 'addproduct', label: 'Add Product', icon: Plus, color: 'from-green-500 to-green-600', href: '/addproduct' },
    { id: 'orders', label: 'Orders', icon: ShoppingCart, color: 'from-orange-500 to-orange-600', href: '/orders' },
    { id: 'logout', label: 'Logout', icon: LogOut, color: 'from-red-500 to-red-600', href: '/logout' }
  ]

  useEffect(() => {
    // Animate sidebar on mount
    gsap.fromTo(
      '.sidebar-wrapper',
      { x: -100, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
    )

    // Animate menu items staggered
    gsap.fromTo(
      '.menu-item',
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: 'back.out',
        delay: 0.3
      }
    )
  }, [])

  useEffect(() => {
    // Animate active item indicator
    gsap.to('.active-indicator', {
      duration: 0.3,
      ease: 'power2.out'
    })
  }, [activeItem])

  const handleMenuClick = (id) => {
    setActiveItem(id)
    // Add animation when item is clicked
    gsap.fromTo(
      '.menu-item-click',
      { scale: 0.95 },
      { scale: 1, duration: 0.2 }
    )
  }

  return (
    <div className="flex h-screen">
      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-gradient-to-r from-slate-800 to-slate-900 text-white p-2 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`sidebar-wrapper h-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl transition-all duration-300 ease-in-out w-64 md:w-64 flex flex-col border-r border-slate-700/50 ${
          isOpen ? 'translate-x-0' : 'hidden md:flex'
        } md:translate-x-0 z-40`}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-700/50 bg-gradient-to-r from-slate-800/80 to-transparent backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-11 h-11 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-xl flex items-center justify-center font-bold text-lg shadow-lg relative overflow-hidden group">
              <div className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-all" />
              <span className="relative">A</span>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Admin
              </h1>
              <p className="text-xs text-slate-500">Shop Manager</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeItem === item.id

            return (
              <div
                key={item.id}
                className="relative menu-item group"
              >
                {/* Active Indicator */}
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-transparent rounded-r-full active-indicator shadow-lg shadow-blue-500/50" />
                )}

                {/* Menu Button */}
                <Link href={item.href}>
                  <button
                    onClick={() => handleMenuClick(item.id)}
                    className={`menu-item-click w-full px-4 py-3.5 rounded-xl transition-all duration-300 flex items-center gap-3 relative overflow-hidden ${
                      isActive
                        ? `bg-gradient-to-r ${item.color} text-white shadow-lg shadow-blue-500/30`
                        : 'text-slate-300 hover:bg-slate-700/40 group-hover:text-slate-100'
                    }`}
                  >
                    {/* Hover Background */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                    />

                    {/* Icon */}
                    <div
                      className={`relative p-2.5 rounded-lg transition-all duration-300 ${
                        isActive
                          ? 'bg-white/20 shadow-lg'
                          : 'bg-slate-700/30 group-hover:bg-slate-600/50'
                      }`}
                    >
                      <Icon
                        size={20}
                        className={`${
                          isActive
                            ? 'text-white'
                            : 'text-slate-400 group-hover:text-slate-200'
                        }`}
                      />
                    </div>

                    {/* Label */}
                    <span className="flex-1 text-left font-semibold text-sm relative">
                      {item.label}
                    </span>

                    {/* Chevron */}
                    <ChevronRight
                      size={18}
                      className={`transition-all duration-300 ${
                        isActive ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0'
                      }`}
                    />
                  </button>
                </Link>
              </div>
            )
          })}
        </nav>

        {/* Footer Stats */}
        <div className="p-4 border-t border-slate-700/50 bg-gradient-to-t from-slate-900/80 to-transparent backdrop-blur-sm">
          <div className="grid grid-cols-3 gap-2">
            <div className="p-3 bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 rounded-lg hover:from-yellow-500/20 hover:to-yellow-600/10 transition-all cursor-pointer border border-yellow-500/20 group">
              <p className="text-yellow-400 font-bold text-base">24</p>
              <p className="text-slate-500 text-xs group-hover:text-slate-400 transition-colors">Orders</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-green-500/10 to-green-600/5 rounded-lg hover:from-green-500/20 hover:to-green-600/10 transition-all cursor-pointer border border-green-500/20 group">
              <p className="text-green-400 font-bold text-base">156</p>
              <p className="text-slate-500 text-xs group-hover:text-slate-400 transition-colors">Products</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-lg hover:from-blue-500/20 hover:to-blue-600/10 transition-all cursor-pointer border border-blue-500/20 group">
              <p className="text-blue-400 font-bold text-base">89</p>
              <p className="text-slate-500 text-xs group-hover:text-slate-400 transition-colors">Users</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/60 md:hidden z-30 backdrop-blur-sm"
        />
      )}
    </div>
  )
}

export default Dsidebar
