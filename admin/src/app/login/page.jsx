'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShieldCheck, LockKeyhole, Mail, Sparkles } from 'lucide-react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const LoginPage = () => {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields')
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          gmail: email,
          password,
        }),
      })

      const result = await response.json()

      if (!response.ok || result?.success === false) {
        throw new Error(result?.message || 'Login failed. Please try again.')
      }

      const token = result?.data?.token
      const adminData = result?.data?.admin

      if (!token) {
        throw new Error('Token not received from server.')
      }

      localStorage.setItem('adminToken', token)
      localStorage.setItem('adminData', JSON.stringify(adminData || {}))
      document.cookie = `adminToken=${token}; path=/; max-age=86400; samesite=lax`

      setEmail('')
      setPassword('')
      router.push('/')
    } catch (err) {
      setError(err?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='relative min-h-screen overflow-hidden bg-linear-to-br from-emerald-100 via-lime-50 to-yellow-50 p-4 md:p-6'>
      <div className='pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-emerald-300/40 blur-3xl' />
      <div className='pointer-events-none absolute -right-24 top-16 h-80 w-80 rounded-full bg-yellow-300/45 blur-3xl' />
      <div className='pointer-events-none absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-lime-300/35 blur-3xl' />

      <div className='relative mx-auto grid min-h-[calc(100vh-2rem)] w-full max-w-5xl items-center'>
        <div className='grid overflow-hidden rounded-3xl border border-white/70 bg-white/80 shadow-[0_20px_70px_rgba(16,185,129,0.22)] backdrop-blur-xl md:grid-cols-2'>
          <div className='relative flex flex-col justify-between bg-linear-to-br from-emerald-600 via-emerald-500 to-lime-500 p-8 text-white md:p-10'>
            <div className='absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.2),transparent_35%),radial-gradient(circle_at_80%_30%,rgba(253,224,71,0.4),transparent_40%)]' />
            <div className='relative'>
              <div className='inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/15 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em]'>
                <Sparkles size={14} />
                Secure Access
              </div>
              <h2 className='mt-5 text-3xl font-bold leading-tight'>
                GOGO Admin
              </h2>
              <p className='mt-3 max-w-sm text-sm text-white/90'>
                Manage products, users, orders, and store growth from one modern dashboard.
              </p>
            </div>

            <div className='relative mt-10 grid gap-3'>
              <div className='rounded-2xl border border-white/20 bg-white/15 p-4 backdrop-blur'>
                <p className='text-xs font-semibold uppercase tracking-[0.14em] text-white/90'>
                  Real-time Control
                </p>
                <p className='mt-1 text-sm text-white/85'>
                  Inventory updates, order tracking, and customer insights at your fingertips.
                </p>
              </div>
              <div className='rounded-2xl border border-white/20 bg-white/15 p-4 backdrop-blur'>
                <p className='text-xs font-semibold uppercase tracking-[0.14em] text-white/90'>
                  Protected Session
                </p>
                <p className='mt-1 text-sm text-white/85'>
                  Token-based admin authentication with automatic route protection.
                </p>
              </div>
            </div>
          </div>

          <div className='p-7 md:p-10'>
            <div className='mb-7'>
              <div className='inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 shadow-inner'>
                <ShieldCheck size={28} />
              </div>
              <h1 className='mt-4 text-3xl font-bold text-slate-900'>Admin Login</h1>
              <p className='mt-1 text-sm text-slate-600'>Welcome back. Enter your credentials to continue.</p>
            </div>

            {error && (
              <div className='mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700'>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className='space-y-4'>
              <div>
                <label className='mb-2 block text-sm font-semibold text-slate-700'>Gmail</label>
                <div className='flex items-center rounded-xl border border-slate-200 bg-white px-3 shadow-sm transition focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-200'>
                  <Mail size={18} className='text-slate-400' />
                  <input
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className='w-full bg-transparent px-3 py-3.5 text-slate-800 placeholder:text-slate-400 focus:outline-none'
                    placeholder='admin@gmail.com'
                  />
                </div>
              </div>

              <div>
                <label className='mb-2 block text-sm font-semibold text-slate-700'>Password</label>
                <div className='flex items-center rounded-xl border border-slate-200 bg-white px-3 shadow-sm transition focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-200'>
                  <LockKeyhole size={18} className='text-slate-400' />
                  <input
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className='w-full bg-transparent px-3 py-3.5 text-slate-800 placeholder:text-slate-400 focus:outline-none'
                    placeholder='Enter your password'
                  />
                </div>
              </div>

              <div className='flex items-center justify-between text-sm'>
                <label className='flex items-center gap-2 text-slate-600'>
                  <input type='checkbox' className='h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-400' />
                  Remember me
                </label>
                <button type='button' className='font-semibold text-emerald-700 hover:text-emerald-800'>
                  Need help?
                </button>
              </div>

              <button
                type='submit'
                disabled={loading}
                className='w-full rounded-xl bg-linear-to-r from-emerald-600 via-emerald-500 to-lime-500 px-4 py-3.5 font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60'
              >
                {loading ? 'Logging in...' : 'Login to Dashboard'}
              </button>
            </form>

            <div className='mt-6 rounded-xl border border-emerald-100 bg-emerald-50/60 px-4 py-3 text-xs text-emerald-800'>
              Your login session is encrypted and protected for admin-only access.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
