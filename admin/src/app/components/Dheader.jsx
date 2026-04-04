'use client'

import React, { useState, useEffect } from 'react'
import gsap from 'gsap'
import {
  Search,
  Bell,
  Settings,
  User,
  LogOut,
  ChevronDown,
  Calendar,
  Clock,
  MessageSquare,
  Eye,
  TrendingUp,
  Zap
} from 'lucide-react'

const Dheader = () => {
  const [searchOpen, setSearchOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState('--:--')
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)

    // Update time immediately
    const updateTime = () => {
      const now = new Date()
      const hours = String(now.getHours()).padStart(2, '0')
      const minutes = String(now.getMinutes()).padStart(2, '0')
      setCurrentTime(`${hours}:${minutes}`)
    }
    updateTime()
    const interval = setInterval(updateTime, 60000)

    // Animate header on mount
    if (typeof window !== 'undefined') {
      gsap.fromTo(
        '.header-wrapper',
        { y: -60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
      )

      // Animate header items
      gsap.fromTo(
        '.header-item',
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: 'back.out',
          delay: 0.3
        }
      )
    }

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (dropdownOpen && typeof window !== 'undefined') {
      gsap.fromTo(
        '.profile-dropdown',
        { opacity: 0, y: -15, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'power2.out' }
      )
    }
  }, [dropdownOpen])

  useEffect(() => {
    if (notificationsOpen && typeof window !== 'undefined') {
      gsap.fromTo(
        '.notifications-popup',
        { opacity: 0, y: -15, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'power2.out' }
      )
    }
  }, [notificationsOpen])

  const notifications = [
    { id: 1, message: '🎉 New order received #12345', time: '5 min ago', color: 'from-blue-500 to-cyan-500', icon: TrendingUp },
    { id: 2, message: '⚠️ Product "Laptop" out of stock', time: '15 min ago', color: 'from-orange-500 to-red-500', icon: Zap },
    { id: 3, message: '👤 New customer registration', time: '1 hour ago', color: 'from-green-500 to-emerald-500', icon: User }
  ]

  return (
    <div className="header-wrapper w-full" suppressHydrationWarning>
      {/* Main Header */}
      <header className="bg-transparent w-full" suppressHydrationWarning>
        <div className="px-6 lg:px-8 py-4 flex items-center justify-between gap-6" suppressHydrationWarning>
          {/* Left - Breadcrumb */}
          <div className="hidden md:flex items-center gap-2" suppressHydrationWarning>
            <span className="text-sm font-semibold text-white" suppressHydrationWarning>Dashboard</span>
            <ChevronDown size={16} className="text-slate-500 rotate-90" suppressHydrationWarning />
            <span className="text-sm text-slate-400" suppressHydrationWarning>Welcome back, Administrator</span>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center gap-4 ml-auto" suppressHydrationWarning>
            
            {/* Date & Time */}
            {isClient && (
              <div className="header-item hidden lg:flex items-center gap-2 px-4 py-2.5 bg-slate-800/50 rounded-lg border border-slate-700/50 shadow-lg hover:shadow-purple-500/20 hover:border-purple-500/30 transition-all duration-300 backdrop-blur-sm group" suppressHydrationWarning>
                <Clock size={16} className="text-purple-400 group-hover:text-purple-300 transition-colors" />
                <div className="text-right">
                  <p className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors">Current Time</p>
                  <p className="text-sm font-bold text-white">{currentTime}</p>
                </div>
              </div>
            )}

            {/* Notifications */}
            <div className="header-item relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2.5 rounded-lg hover:bg-slate-700/50 transition-all duration-300 group"
              >
                <Bell size={20} className="text-slate-300 group-hover:text-blue-400 transition-colors" />
                <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-pulse shadow-lg shadow-red-500/50 group-hover:shadow-red-500/70" />
              </button>

              {/* Notifications Popup */}
              {notificationsOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setNotificationsOpen(false)}
                  />
                  <div className="notifications-popup absolute right-0 mt-3 w-96 bg-slate-800/95 rounded-2xl shadow-2xl border border-slate-700/50 z-50 overflow-hidden backdrop-blur-xl">
                    <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-6 py-4 text-white">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-lg">Notifications</p>
                        <Bell size={18} className="text-white/80" />
                      </div>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notif, idx) => {
                        const Icon = notif.icon
                        return (
                          <div
                            key={notif.id}
                            className="px-6 py-4 border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors group"
                            style={{
                              animation: `slideIn 0.5s ease-out ${idx * 0.1}s both`
                            }}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br ${notif.color} flex items-center justify-center shadow-lg`}>
                                <Icon size={20} className="text-white" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors">{notif.message}</p>
                                <p className="text-xs text-slate-400 mt-1.5">{notif.time}</p>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                    <div className="px-6 py-3 bg-slate-700/30 border-t border-slate-700/50">
                      <button className="text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors">
                        View all notifications →
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Settings */}
            <button className="header-item p-2.5 rounded-lg hover:bg-slate-700/50 transition-all duration-300 group">
              <Settings size={20} className="text-slate-300 group-hover:text-purple-400 group-hover:rotate-90 transition-all duration-500" />
            </button>

            {/* Divider */}
            <div className="w-px h-7 bg-gradient-to-b from-slate-700 via-slate-600 to-slate-700" />

            {/* Profile Dropdown */}
            <div className="header-item relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-700/50 transition-all duration-300 group"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg group-hover:shadow-purple-500/50 transition-shadow">
                  A
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold text-white">Admin</p>
                  <p className="text-xs text-slate-400">Administrator</p>
                </div>
                <ChevronDown
                  size={16}
                  className={`text-slate-400 transition-transform duration-300 ${
                    dropdownOpen ? 'rotate-180 text-blue-400' : ''
                  }`}
                />
              </button>

              {/* Profile Dropdown Menu */}
              {dropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setDropdownOpen(false)}
                  />
                  <div className="profile-dropdown absolute right-0 mt-3 w-72 bg-slate-800/95 rounded-2xl shadow-2xl border border-slate-700/50 z-50 overflow-hidden backdrop-blur-xl">
                    <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg relative overflow-hidden">
                          <div className="absolute inset-0 bg-white/10 animate-pulse rounded-full" />
                          A
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm">Administrator</p>
                          <p className="text-xs text-blue-100">admin@ecommerce.com</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 space-y-1">
                      <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-700/50 transition-all text-slate-200 text-sm font-medium group">
                        <User size={16} className="text-blue-400 group-hover:scale-110 transition-transform" />
                        <span>My Profile</span>
                      </button>
                      <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-700/50 transition-all text-slate-200 text-sm font-medium group">
                        <Settings size={16} className="text-purple-400 group-hover:scale-110 transition-transform" />
                        <span>Settings</span>
                      </button>
                      <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-700/50 transition-all text-slate-200 text-sm font-medium group">
                        <MessageSquare size={16} className="text-pink-400 group-hover:scale-110 transition-transform" />
                        <span>Help & Support</span>
                      </button>
                    </div>

                    <div className="border-t border-slate-700/50 p-3">
                      <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-500/20 transition-all text-red-400 text-sm font-bold group">
                        <LogOut size={16} className="group-hover:scale-110 transition-transform" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  )
}

export default Dheader
