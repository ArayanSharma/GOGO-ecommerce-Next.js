'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaPhone, FaEnvelope, FaMapMarkerAlt, FaHeartbeat, FaLeaf, FaShieldAlt, FaTruck, FaArrowUp, FaCreditCard, FaGooglePay, FaApple } from 'react-icons/fa'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 3000)
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="relative bg-linear-to-b from-slate-900 via-slate-800 to-slate-950 text-gray-100 overflow-hidden">
      {/* Top Banner with Features */}
      <div className="bg-linear-to-r from-slate-800 via-slate-700 to-slate-800 border-b border-slate-700/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            {/* Feature 1 */}
            <div className="flex items-center gap-2 sm:gap-3 text-center sm:text-left hover:scale-105 transition-transform duration-300 cursor-pointer group">
              <div className="bg-gradient-to-br from-green-400 to-emerald-500 p-2 sm:p-3 rounded-full flex-shrink-0 shadow-lg group-hover:shadow-green-500/50 transition-shadow">
                <FaLeaf className="text-white text-sm sm:text-lg" />
              </div>
              <div className="min-w-0">
                <h5 className="font-semibold text-white text-xs sm:text-sm">Fresh Products</h5>
                <p className="text-gray-400 text-xs">Always fresh and quality</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-center gap-2 sm:gap-3 text-center sm:text-left hover:scale-105 transition-transform duration-300 cursor-pointer group">
              <div className="bg-gradient-to-br from-blue-400 to-cyan-500 p-2 sm:p-3 rounded-full flex-shrink-0 shadow-lg group-hover:shadow-blue-500/50 transition-shadow">
                <FaTruck className="text-white text-sm sm:text-lg" />
              </div>
              <div className="min-w-0">
                <h5 className="font-semibold text-white text-xs sm:text-sm">Fast Delivery</h5>
                <p className="text-gray-400 text-xs">Quick shipping nationwide</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-center gap-2 sm:gap-3 text-center sm:text-left hover:scale-105 transition-transform duration-300 cursor-pointer group">
              <div className="bg-gradient-to-br from-purple-400 to-pink-500 p-2 sm:p-3 rounded-full flex-shrink-0 shadow-lg group-hover:shadow-pink-500/50 transition-shadow">
                <FaShieldAlt className="text-white text-sm sm:text-lg" />
              </div>
              <div className="min-w-0">
                <h5 className="font-semibold text-white text-xs sm:text-sm">Secure Payment</h5>
                <p className="text-gray-400 text-xs">100% safe & encrypted</p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex items-center gap-2 sm:gap-3 text-center sm:text-left hover:scale-105 transition-transform duration-300 cursor-pointer group">
              <div className="bg-gradient-to-br from-red-400 to-rose-500 p-2 sm:p-3 rounded-full flex-shrink-0 shadow-lg group-hover:shadow-rose-500/50 transition-shadow">
                <FaHeartbeat className="text-white text-sm sm:text-lg" />
              </div>
              <div className="min-w-0">
                <h5 className="font-semibold text-white text-xs sm:text-sm">Health First</h5>
                <p className="text-gray-400 text-xs">Premium quality guarantee</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 md:gap-8 mb-8 md:mb-12">
          
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-linear-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-base sm:text-xl">G</span>
              </div>
              <h3 className="text-lg sm:text-2xl font-bold bg-linear-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">GOGO</h3>
            </div>
            <p className="text-gray-400 mb-3 sm:mb-4 text-xs sm:text-sm leading-relaxed">
              Your trusted platform for fresh groceries and quality products delivered to your doorstep.
            </p>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center gap-2 sm:gap-3 text-gray-400 hover:text-green-400 transition group cursor-pointer">
                <div className="bg-slate-700 group-hover:bg-green-500 p-1.5 sm:p-2 rounded transition w-fit flex-shrink-0">
                  <FaMapMarkerAlt className="text-xs sm:text-sm" />
                </div>
                <span className="text-xs sm:text-sm">Nx-one , Noida</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 text-gray-400 hover:text-blue-400 transition group cursor-pointer">
                <div className="bg-slate-700 group-hover:bg-blue-500 p-1.5 sm:p-2 rounded transition w-fit flex-shrink-0">
                  <FaPhone className="text-xs sm:text-sm" />
                </div>
                <span className="text-xs sm:text-sm">+91 7417162939</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 text-gray-400 hover:text-purple-400 transition group cursor-pointer">
                <div className="bg-slate-700 group-hover:bg-purple-500 p-1.5 sm:p-2 rounded transition w-fit flex-shrink-0">
                  <FaEnvelope className="text-xs sm:text-sm" />
                </div>
                <span className="text-xs sm:text-sm">support@gogo.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base sm:text-lg font-bold text-white mb-4 sm:mb-5 pb-2 sm:pb-3 border-b-2 border-green-500">Quick Links</h4>
            <ul className="space-y-2 sm:space-y-3">
              <li><Link href="/" className="text-gray-400 hover:text-green-400 transition hover:translate-x-1 inline-block font-medium text-xs sm:text-sm">→ Home</Link></li>
              <li><Link href="/products" className="text-gray-400 hover:text-green-400 transition hover:translate-x-1 inline-block font-medium text-xs sm:text-sm">→ Shop</Link></li>
              <li><a href="#" className="text-gray-400 hover:text-green-400 transition hover:translate-x-1 inline-block font-medium text-xs sm:text-sm">→ About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-green-400 transition hover:translate-x-1 inline-block font-medium text-xs sm:text-sm">→ Contact</a></li>
              <li><a href="#" className="text-gray-400 hover:text-green-400 transition hover:translate-x-1 inline-block font-medium text-xs sm:text-sm">→ Blog</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-base sm:text-lg font-bold text-white mb-4 sm:mb-5 pb-2 sm:pb-3 border-b-2 border-blue-500">Support</h4>
            <ul className="space-y-2 sm:space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition hover:translate-x-1 inline-block font-medium text-xs sm:text-sm">→ Shipping Info</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition hover:translate-x-1 inline-block font-medium text-xs sm:text-sm">→ Returns</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition hover:translate-x-1 inline-block font-medium text-xs sm:text-sm">→ Track Order</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition hover:translate-x-1 inline-block font-medium text-xs sm:text-sm">→ Size Guide</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition hover:translate-x-1 inline-block font-medium text-xs sm:text-sm">→ Help Center</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-base sm:text-lg font-bold text-white mb-4 sm:mb-5 pb-2 sm:pb-3 border-b-2 border-purple-500">Legal</h4>
            <ul className="space-y-2 sm:space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-purple-400 transition hover:translate-x-1 inline-block font-medium text-xs sm:text-sm">→ Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-purple-400 transition hover:translate-x-1 inline-block font-medium text-xs sm:text-sm">→ Terms & Conditions</a></li>
              <li><a href="#" className="text-gray-400 hover:text-purple-400 transition hover:translate-x-1 inline-block font-medium text-xs sm:text-sm">→ Cookie Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-purple-400 transition hover:translate-x-1 inline-block font-medium text-xs sm:text-sm">→ Refund Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-purple-400 transition hover:translate-x-1 inline-block font-medium text-xs sm:text-sm">→ FAQ</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-base sm:text-lg font-bold text-white mb-4 sm:mb-5 pb-2 sm:pb-3 border-b-2 border-gradient-to-r from-pink-500 via-pink-400 to-pink-500">Newsletter</h4>
            <p className="text-gray-400 text-xs sm:text-sm mb-4 sm:mb-5">Get exclusive deals and fresh product updates!</p>
            <form onSubmit={handleSubscribe} className="space-y-3 sm:space-y-4">
              <div className="relative group">
                <input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg md:rounded-xl bg-gradient-to-r from-slate-700 to-slate-600 text-white placeholder-gray-500 border-2 border-slate-600 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-400 focus:ring-opacity-30 transition-all duration-300 text-xs sm:text-sm group-hover:border-slate-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-500 via-pink-500 to-rose-500 hover:from-pink-600 hover:via-pink-600 hover:to-rose-600 text-white font-bold py-2.5 sm:py-3 rounded-lg md:rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-pink-500/30 active:scale-95 text-xs sm:text-sm"
              >
                {subscribed ? '✓ Subscribed!' : 'Subscribe Now'}
              </button>
            </form>
            <p className="text-gray-500 text-xs mt-3 sm:mt-4">We respect your privacy. No spam guaranteed! 🔒</p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-700 my-8"></div>

        {/* Payment & Social Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-10 mb-8">
          {/* Social Media */}
          <div className="text-center sm:text-left">
            <h5 className="text-white font-bold mb-4 md:mb-5 text-sm uppercase tracking-wide">Connect With Us</h5>
            <div className="flex gap-3 md:gap-4 justify-center sm:justify-start">
              <a href="#" className="bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-3 md:p-4 rounded-full transition-all duration-300 transform hover:scale-125 hover:shadow-2xl hover:shadow-blue-500/40 inline-flex items-center justify-center">
                <FaFacebook size={18} />
              </a>
              <a href="#" className="bg-gradient-to-br from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white p-3 md:p-4 rounded-full transition-all duration-300 transform hover:scale-125 hover:shadow-2xl hover:shadow-sky-500/40 inline-flex items-center justify-center">
                <FaTwitter size={18} />
              </a>
              <a href="#" className="bg-gradient-to-br from-pink-600 to-red-600 hover:from-pink-700 hover:to-red-700 text-white p-3 md:p-4 rounded-full transition-all duration-300 transform hover:scale-125 hover:shadow-2xl hover:shadow-pink-500/40 inline-flex items-center justify-center">
                <FaInstagram size={18} />
              </a>
              <a href="#" className="bg-gradient-to-br from-blue-700 to-blue-900 hover:from-blue-800 hover:to-blue-950 text-white p-3 md:p-4 rounded-full transition-all duration-300 transform hover:scale-125 hover:shadow-2xl hover:shadow-blue-700/40 inline-flex items-center justify-center">
                <FaLinkedin size={18} />
              </a>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="text-center">
            <h5 className="text-white font-bold mb-4 md:mb-5 text-sm uppercase tracking-wide">Accepted Payments</h5>
            <div className="flex gap-3 md:gap-4 justify-center items-center flex-wrap">
              <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 hover:from-green-500/40 hover:to-emerald-500/40 border border-green-500/30 p-3 rounded-lg transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-green-500/20">
                <FaCreditCard className="text-green-400 text-lg md:text-xl" />
              </div>
              <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 hover:from-blue-500/40 hover:to-blue-600/40 border border-blue-500/30 p-3 rounded-lg transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-blue-500/20">
                <FaGooglePay className="text-blue-400 text-lg md:text-xl" />
              </div>
              <div className="bg-gradient-to-br from-gray-400/20 to-gray-500/20 hover:from-gray-400/40 hover:to-gray-500/40 border border-gray-500/30 p-3 rounded-lg transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-gray-500/20">
                <FaApple className="text-gray-300 text-lg md:text-xl" />
              </div>
              <span className="text-gray-400 text-xs md:text-sm font-medium">& More</span>
            </div>
          </div>

          {/* Back to Top */}
          <div className="text-center sm:text-center md:text-right">
            <h5 className="text-white font-bold mb-4 md:mb-5 text-sm uppercase tracking-wide">Quick Access</h5>
            <button
              onClick={scrollToTop}
              className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 text-white px-5 md:px-7 py-2.5 md:py-3 rounded-lg md:rounded-xl transition-all duration-300 transform hover:scale-110 hover:shadow-2xl hover:shadow-green-500/40 inline-flex items-center gap-2.5 font-bold text-xs md:text-sm group active:scale-95"
            >
              <FaArrowUp className="group-hover:animate-bounce text-sm" />
              Back to Top
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-700 my-8"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col gap-4 sm:gap-6 md:gap-0 md:flex-row justify-between items-center text-center md:text-left">
          {/* Copyright */}
          <div className="text-gray-400 text-xs sm:text-sm">
            <p>&copy; {currentYear} <span className="font-bold text-white">GOGO</span> • All rights reserved. | Made with <span className="text-red-500">❤</span> for you</p>
          </div>

          {/* Bottom Links */}
          <div className="flex gap-3 text-xs text-gray-400 flex-wrap justify-center">
            <a href="#" className="hover:text-white transition">Sitemap</a>
            <span className="hidden sm:inline">•</span>
            <a href="#" className="hover:text-white transition">Accessibility</a>
            <span className="hidden sm:inline">•</span>
            <a href="#" className="hover:text-white transition">Security</a>
          </div>
        </div>
      </div>

      {/* Top gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-green-500 to-transparent opacity-50"></div>
    </footer>
  )
}

export default Footer
