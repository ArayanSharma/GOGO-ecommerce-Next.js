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
    <footer className="relative bg-linear-to-b from-slate-900 via-slate-800 to-slate-900 text-gray-100">
      {/* Top Banner with Features */}
      <div className="bg-linear-to-r from-slate-800 to-slate-700 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="flex items-center gap-3 text-center md:text-left">
              <div className="bg-linear-to-br from-green-400 to-emerald-500 p-3 rounded-full">
                <FaLeaf className="text-white text-lg" />
              </div>
              <div>
                <h5 className="font-semibold text-white text-sm">Fresh Products</h5>
                <p className="text-gray-400 text-xs">Always fresh and quality</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-center gap-3 text-center md:text-left">
              <div className="bg-linear-to-br from-blue-400 to-cyan-500 p-3 rounded-full">
                <FaTruck className="text-white text-lg" />
              </div>
              <div>
                <h5 className="font-semibold text-white text-sm">Fast Delivery</h5>
                <p className="text-gray-400 text-xs">Quick shipping nationwide</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-center gap-3 text-center md:text-left">
              <div className="bg-linear-to-br from-purple-400 to-pink-500 p-3 rounded-full">
                <FaShieldAlt className="text-white text-lg" />
              </div>
              <div>
                <h5 className="font-semibold text-white text-sm">Secure Payment</h5>
                <p className="text-gray-400 text-xs">100% safe & encrypted</p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex items-center gap-3 text-center md:text-left">
              <div className="bg-linear-to-br from-red-400 to-rose-500 p-3 rounded-full">
                <FaHeartbeat className="text-white text-lg" />
              </div>
              <div>
                <h5 className="font-semibold text-white text-sm">Health First</h5>
                <p className="text-gray-400 text-xs">Premium quality guarantee</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-linear-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">G</span>
              </div>
              <h3 className="text-2xl font-bold bg-linear-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">GOGO</h3>
            </div>
            <p className="text-gray-400 mb-4 text-sm leading-relaxed">
              Your trusted platform for fresh groceries and quality products delivered to your doorstep.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-400 hover:text-green-400 transition group cursor-pointer">
                <div className="bg-slate-700 group-hover:bg-green-500 p-2 rounded transition w-fit">
                  <FaMapMarkerAlt className="text-sm" />
                </div>
                <span className="text-sm">Nx-one , Noida</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400 hover:text-blue-400 transition group cursor-pointer">
                <div className="bg-slate-700 group-hover:bg-blue-500 p-2 rounded transition w-fit">
                  <FaPhone className="text-sm" />
                </div>
                <span className="text-sm">+91 7417162939</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400 hover:text-purple-400 transition group cursor-pointer">
                <div className="bg-slate-700 group-hover:bg-purple-500 p-2 rounded transition w-fit">
                  <FaEnvelope className="text-sm" />
                </div>
                <span className="text-sm">support@gogo.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-white mb-5 pb-3 border-b-2 border-green-500">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link href="/" className="text-gray-400 hover:text-green-400 transition hover:translate-x-1 inline-block font-medium text-sm">→ Home</Link></li>
              <li><Link href="/products" className="text-gray-400 hover:text-green-400 transition hover:translate-x-1 inline-block font-medium text-sm">→ Shop</Link></li>
              <li><a href="#" className="text-gray-400 hover:text-green-400 transition hover:translate-x-1 inline-block font-medium text-sm">→ About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-green-400 transition hover:translate-x-1 inline-block font-medium text-sm">→ Contact</a></li>
              <li><a href="#" className="text-gray-400 hover:text-green-400 transition hover:translate-x-1 inline-block font-medium text-sm">→ Blog</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-bold text-white mb-5 pb-3 border-b-2 border-blue-500">Support</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition hover:translate-x-1 inline-block font-medium text-sm">→ Shipping Info</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition hover:translate-x-1 inline-block font-medium text-sm">→ Returns</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition hover:translate-x-1 inline-block font-medium text-sm">→ Track Order</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition hover:translate-x-1 inline-block font-medium text-sm">→ Size Guide</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition hover:translate-x-1 inline-block font-medium text-sm">→ Help Center</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg font-bold text-white mb-5 pb-3 border-b-2 border-purple-500">Legal</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-purple-400 transition hover:translate-x-1 inline-block font-medium text-sm">→ Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-purple-400 transition hover:translate-x-1 inline-block font-medium text-sm">→ Terms & Conditions</a></li>
              <li><a href="#" className="text-gray-400 hover:text-purple-400 transition hover:translate-x-1 inline-block font-medium text-sm">→ Cookie Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-purple-400 transition hover:translate-x-1 inline-block font-medium text-sm">→ Refund Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-purple-400 transition hover:translate-x-1 inline-block font-medium text-sm">→ FAQ</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-bold text-white mb-5 pb-3 border-b-2 border-pink-500">Newsletter</h4>
            <p className="text-gray-400 text-sm mb-4">Get exclusive deals and fresh product updates!</p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-700 text-white placeholder-gray-500 border border-slate-600 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-400 focus:ring-opacity-50 transition text-sm"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-linear-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold py-2.5 rounded-lg transition transform hover:scale-105 text-sm"
              >
                {subscribed ? '✓ Subscribed!' : 'Subscribe'}
              </button>
            </form>
            <p className="text-gray-500 text-xs mt-3">We respect your privacy. No spam!</p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-700 my-8"></div>

        {/* Payment & Social Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Social Media */}
          <div className="text-center md:text-left">
            <h5 className="text-white font-semibold mb-4 text-sm">Follow Us</h5>
            <div className="flex gap-3 justify-center md:justify-start">
              <a href="#" className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transition transform hover:scale-110 hover:shadow-lg hover:shadow-blue-500/50">
                <FaFacebook />
              </a>
              <a href="#" className="bg-sky-500 hover:bg-sky-600 text-white p-3 rounded-full transition transform hover:scale-110 hover:shadow-lg hover:shadow-sky-500/50">
                <FaTwitter />
              </a>
              <a href="#" className="bg-pink-600 hover:bg-pink-700 text-white p-3 rounded-full transition transform hover:scale-110 hover:shadow-lg hover:shadow-pink-500/50">
                <FaInstagram />
              </a>
              <a href="#" className="bg-blue-800 hover:bg-blue-900 text-white p-3 rounded-full transition transform hover:scale-110 hover:shadow-lg hover:shadow-blue-700/50">
                <FaLinkedin />
              </a>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="text-center">
            <h5 className="text-white font-semibold mb-4 text-sm">We Accept</h5>
            <div className="flex gap-4 justify-center items-center flex-wrap">
              <div className="bg-slate-700 hover:bg-slate-600 p-2 rounded transition">
                <FaCreditCard className="text-green-400 text-lg" />
              </div>
              <div className="bg-slate-700 hover:bg-slate-600 p-2 rounded transition">
                <FaGooglePay className="text-blue-400 text-lg" />
              </div>
              <div className="bg-slate-700 hover:bg-slate-600 p-2 rounded transition">
                <FaApple className="text-gray-300 text-lg" />
              </div>
              <span className="text-gray-400 text-sm">& More</span>
            </div>
          </div>

          {/* Back to Top */}
          <div className="text-center md:text-right">
            <h5 className="text-white font-semibold mb-4 text-sm">Quick Access</h5>
            <button
              onClick={scrollToTop}
              className="bg-linear-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-2.5 rounded-lg transition transform hover:scale-105 inline-flex items-center gap-2 font-semibold text-sm group"
            >
              <FaArrowUp className="group-hover:animate-bounce" />
              Back to Top
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-700 my-8"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          {/* Copyright */}
          <div className="text-gray-400 text-sm mb-4 md:mb-0">
            <p>&copy; {currentYear} <span className="font-bold text-white">GOGO</span> • All rights reserved. | Made with <span className="text-red-500">❤</span> for you</p>
          </div>

          {/* Bottom Links */}
          <div className="flex gap-4 text-xs text-gray-400">
            <a href="#" className="hover:text-white transition">Sitemap</a>
            <span>•</span>
            <a href="#" className="hover:text-white transition">Accessibility</a>
            <span>•</span>
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
