'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ShieldCheck, Lock, Mail, ArrowRight } from 'lucide-react'
import { adminPostData } from '@/utils/api'

const LoginPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const redirectPath = searchParams.get('redirect') || '/'

  useEffect(() => {
    document.title = 'Admin Login | GOGO'
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await adminPostData('/api/admin/login', { email, password })

      if (response?.error || response?.success === false) {
        setError(response?.message || 'Login failed')
        return
      }

      router.replace(redirectPath)
      router.refresh()
    } catch (loginError) {
      setError(loginError.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_0%_0%,#ecfccb,transparent_35%),radial-gradient(circle_at_100%_0%,#dbeafe,transparent_30%),linear-gradient(160deg,#0f172a_0%,#0f766e_45%,#f59e0b_100%)] px-4 py-10'>
      <div className='pointer-events-none absolute -left-20 top-16 h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl' />
      <div className='pointer-events-none absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-amber-300/20 blur-3xl' />

      <div className='relative w-full max-w-5xl overflow-hidden rounded-4xl border border-white/20 bg-white/10 shadow-2xl backdrop-blur-2xl'>
        <div className='grid md:grid-cols-2'>
          <div className='hidden flex-col justify-between p-10 text-white md:flex'>
            <div>
              <div className='mb-6 inline-flex items-center gap-3 rounded-full bg-white/10 px-4 py-2 ring-1 ring-white/15'>
                <ShieldCheck size={18} />
                <span className='text-sm font-semibold'>Protected Admin Access</span>
              </div>
              <h1 className='max-w-md text-4xl font-bold leading-tight'>Sign in to manage orders, products, users, and reports.</h1>
              <p className='mt-4 max-w-md text-sm leading-6 text-white/80'>Only records stored in the Admin collection can open the dashboard. Your email and password are checked on the server before any dashboard route is shown.</p>
            </div>

            <div className='grid grid-cols-2 gap-4 text-sm'>
              <div className='rounded-2xl border border-white/15 bg-white/10 p-4'>
                <p className='text-white/70'>Secure login</p>
                <p className='mt-1 font-semibold'>DB verified</p>
              </div>
              <div className='rounded-2xl border border-white/15 bg-white/10 p-4'>
                <p className='text-white/70'>Protected routes</p>
                <p className='mt-1 font-semibold'>Middleware guarded</p>
              </div>
            </div>
          </div>

          <div className='bg-white/95 p-8 sm:p-10'>
            <div className='mb-8'>
              <div className='mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-emerald-700 ring-1 ring-emerald-100'>
                <Lock size={14} /> Admin Login
              </div>
              <h2 className='text-3xl font-bold text-slate-900'>Welcome back</h2>
              <p className='mt-2 text-sm text-slate-500'>Enter your admin email and password to continue.</p>
            </div>

            {error && (
              <div className='mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700'>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className='space-y-4'>
              <div className='space-y-2'>
                <label className='text-sm font-semibold text-slate-700'>Email</label>
                <div className='flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 focus-within:border-emerald-400 focus-within:ring-4 focus-within:ring-emerald-100'>
                  <Mail size={18} className='text-slate-400' />
                  <input
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className='w-full bg-transparent text-slate-900 outline-none placeholder:text-slate-400'
                    placeholder='admin@example.com'
                    required
                  />
                </div>
              </div>

              <div className='space-y-2'>
                <label className='text-sm font-semibold text-slate-700'>Password</label>
                <div className='flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 focus-within:border-emerald-400 focus-within:ring-4 focus-within:ring-emerald-100'>
                  <Lock size={18} className='text-slate-400' />
                  <input
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className='w-full bg-transparent text-slate-900 outline-none placeholder:text-slate-400'
                    placeholder='Enter password'
                    required
                  />
                </div>
              </div>

              <button
                type='submit'
                disabled={loading}
                className='group mt-2 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-emerald-600 to-amber-500 px-5 py-3.5 font-semibold text-white shadow-lg shadow-emerald-200 transition hover:from-emerald-700 hover:to-amber-600 disabled:cursor-not-allowed disabled:opacity-60'
              >
                {loading ? 'Signing In...' : 'Login to Dashboard'}
                {!loading && <ArrowRight size={18} className='transition-transform group-hover:translate-x-1' />}
              </button>
            </form>

            <p className='mt-6 text-center text-xs text-slate-500'>This page is protected. Only admins stored in the database can sign in.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
