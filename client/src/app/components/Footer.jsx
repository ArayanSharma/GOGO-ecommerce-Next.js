import React from 'react'
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-100">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">GOGO</h3>
            <p className="text-gray-400 mb-4">
              Your one-stop destination for quality products at amazing prices.
            </p>
            <div className="space-y-2 text-gray-400 text-sm">
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-blue-400" />
                <span>123 Commerce Street, City NY</span>
              </div>
              <div className="flex items-center gap-2">
                <FaPhone className="text-blue-400" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <FaEnvelope className="text-blue-400" />
                <span>support@gogo.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition">Home</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition">Shop</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition">Contact</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition">FAQ</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition">Shipping Info</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition">Returns</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition">Size Guide</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition">Track Order</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Newsletter</h4>
            <p className="text-gray-400 text-sm mb-4">Subscribe to get special offers and updates!</p>
            <form className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded bg-gray-800 text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:border-blue-400 transition"
              />
              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded transition"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-8"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          
          {/* Copyright */}
          <div className="text-gray-400 text-sm mb-4 md:mb-0">
            <p>&copy; {currentYear} GOGO. All rights reserved.</p>
          </div>

          {/* Social Media */}
          <div className="flex gap-6 items-center">
            <div>
              <p className="text-gray-400 text-sm mb-3">Follow Us</p>
            </div>
            <a href="#" className="text-gray-400 hover:text-blue-400 transition text-xl">
              <FaFacebook />
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-400 transition text-xl">
              <FaTwitter />
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-400 transition text-xl">
              <FaInstagram />
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-400 transition text-xl">
              <FaLinkedin />
            </a>
          </div>

          {/* Payment Methods */}
          <div className="text-gray-400 text-sm">
            <p>We accept: Visa • Mastercard • PayPal</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
