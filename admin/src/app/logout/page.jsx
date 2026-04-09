'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut, Heart, Sparkles, CheckCircle2 } from 'lucide-react'
import { clearAdminToken, adminGetData } from '@/utils/api'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default function LogoutPage() {
  const router = useRouter()
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    const handleLogout = async () => {
      try {
        // Simulate progress
        const progressInterval = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 90) {
              clearInterval(progressInterval)
              return 90
            }
            return prev + Math.random() * 30
          })
        }, 200)

        // Call logout API endpoint to revoke token on server
        try {
          await adminGetData('/api/admin/logout')
        } catch (err) {
          // API might not have logout endpoint, continue with client-side logout
          console.log('API logout not available, clearing client data')
        }

        // Clear JWT token from cookies
        clearAdminToken();

        // Clear all localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('adminToken')
          localStorage.removeItem('adminUser')
          localStorage.removeItem('adminEmail')
          // Clear all admin-related items
          Object.keys(localStorage).forEach((key) => {
            if (key.includes('admin') || key.includes('gogo')) {
              localStorage.removeItem(key)
            }
          })
        }

        clearInterval(progressInterval)
        setProgress(100)
        setIsComplete(true)

        // Redirect to login after short delay
        setTimeout(() => {
          router.push('/admin-login')
        }, 1500)
      } catch (error) {
        console.error('Logout error:', error)
        // Clear token and force redirect even if error occurs
        clearAdminToken();
        router.push('/admin-login')
      }
    }

    handleLogout()
  }, [router])

  return (
    <div className='min-h-screen bg-linear-to-br from-emerald-50 via-blue-50 to-emerald-100 flex items-center justify-center p-4 overflow-hidden'>
      {/* Animated Background Circles */}
      <div className='absolute top-10 left-10 w-40 h-40 bg-emerald-300/30 rounded-full blur-3xl animate-pulse'></div>
      <div className='absolute bottom-20 right-20 w-48 h-48 bg-yellow-300/20 rounded-full blur-3xl animate-pulse' style={{ animationDelay: '1s' }}></div>
      <div className='absolute top-1/2 left-1/3 w-32 h-32 bg-green-300/20 rounded-full blur-3xl animate-pulse' style={{ animationDelay: '2s' }}></div>

      <div className='w-full max-w-md relative z-10'>
        {/* Main Card */}
        <div className='bg-white/95 backdrop-blur-xl shadow-2xl rounded-2xl p-10 border border-emerald-100'>
          {/* Top Accent Bar */}
          <div className='absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-emerald-500 via-yellow-400 to-green-500 rounded-t-2xl'></div>

          {/* Header with Logo */}
          <div className='flex justify-center mb-8'>
            <div className='relative'>
              <div className='w-20 h-20 bg-linear-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center shadow-lg'>
                {!isComplete ? (
                  <LogOut size={40} className='text-white animate-bounce' style={{ animationDelay: '0.1s' }} />
                ) : (
                  <CheckCircle2 size={40} className='text-yellow-300 animate-pulse' />
                )}
              </div>
              <div className='absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center'>
                <Sparkles size={14} className='text-white' />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className='text-center mb-8'>
            <h1 className='text-3xl font-bold bg-linear-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-3'>
              {isComplete ? 'See You Soon!' : 'Logging Out'}
            </h1>
            <p className='text-gray-600 text-sm leading-relaxed'>
              {isComplete 
                ? 'You have been successfully logged out. Redirecting to login...'
                : 'Securely clearing your session and data...'}
            </p>
          </div>

          {/* Progress Bar */}
          <div className='mb-8'>
            <div className='w-full h-2 bg-gray-200 rounded-full overflow-hidden shadow-inner'>
              <div
                className='h-full bg-linear-to-r from-emerald-500 via-yellow-400 to-green-500 rounded-full transition-all duration-300 ease-out shadow-lg'
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className='text-xs text-gray-500 mt-2 font-medium'>{Math.round(progress)}%</p>
          </div>

          {/* Status Messages */}
          <div className='space-y-2 mb-8'>
            <div className='flex items-center text-sm text-emerald-600'>
              <div className='w-2 h-2 bg-emerald-500 rounded-full mr-2'></div>
              <span>Clearing session data</span>
            </div>
            <div className='flex items-center text-sm text-emerald-600'>
              <div className='w-2 h-2 bg-emerald-500 rounded-full mr-2'></div>
              <span>Revoking access tokens</span>
            </div>
            <div className='flex items-center text-sm text-emerald-600'>
              <div className='w-2 h-2 bg-emerald-500 rounded-full mr-2'></div>
              <span>Preparing redirect</span>
            </div>
          </div>

          {/* Footer Message */}
          <div className='pt-6 border-t border-gray-100'>
            <p className='text-xs text-gray-500 text-center'>
              <Heart size={12} className='inline text-red-500 mr-1' />
              Thanks for using GOGO Admin
            </p>
          </div>
        </div>

        {/* Decorative Footer */}
        <div className='text-center mt-6'>
          <p className='text-xs text-gray-500'>
            Redirecting in a moment...
          </p>
        </div>
      </div>
    </div>
  )
}
