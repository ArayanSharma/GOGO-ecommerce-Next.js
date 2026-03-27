'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const page = () => {
  const router = useRouter()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    // Simulate login
    try {
      setTimeout(() => {
        setEmail('');
        setPassword('');
        setLoading(false);
        router.push('/');
      }, 1500);
    } catch (err) {
      setError('Login failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-500 via-blue-600 to-purple-700 flex items-center justify-center p-4'>
      <div className='w-full max-w-md'>
        {/* Card */}
        <div className='bg-white shadow-2xl rounded-lg p-8'>
          {/* Header */}
          <div className='mb-8 text-center'>
            <div className='w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4'>
              <span className='text-white text-2xl font-bold'>A</span>
            </div>
            <h1 className='text-3xl font-bold text-gray-800 mb-2'>Admin Login</h1>
            <p className='text-gray-600'>Welcome back to your dashboard</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className='mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded'>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className='space-y-4'>
            {/* Email */}
            <div>
              <label className='block text-gray-700 font-semibold mb-2'>Email Address</label>
              <input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition'
                placeholder='Enter your email'
              />
            </div>

            {/* Password */}
            <div>
              <label className='block text-gray-700 font-semibold mb-2'>Password</label>
              <input
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition'
                placeholder='Enter your password'
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className='flex items-center justify-between text-sm'>
              <label className='flex items-center text-gray-700'>
                <input type='checkbox' className='w-4 h-4 mr-2' />
                Remember me
              </label>
              <a href='#' className='text-blue-500 hover:underline'>
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type='submit'
              href=''
              disabled={loading}
              className='w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {/* Divider */}
          <div className='my-6 flex items-center'>
            <div className='flex-1 border-t border-gray-300'></div>
            <div className='px-3 text-gray-500 text-sm'>or</div>
            <div className='flex-1 border-t border-gray-300'></div>
          </div>

          {/* Footer */}
          <p className='text-center text-gray-600 text-sm'>
            Don't have an account?{' '}
            <a href='#' className='text-blue-500 font-semibold hover:underline'>
              Contact Admin
            </a>
          </p>
        </div>

        {/* Security Note */}
        <div className='mt-6 text-center text-white text-sm'>
          <p>🔒 Your login information is secure and encrypted</p>
        </div>
      </div>
    </div>
  )
}

export default page
