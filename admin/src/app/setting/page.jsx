'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { LockKeyhole, Eye, EyeOff, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const SettingPage = () => {
  const router = useRouter()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [adminEmail, setAdminEmail] = useState('')

  useEffect(() => {
    try {
      const savedAdmin = localStorage.getItem('adminData')
      if (savedAdmin) {
        const parsed = JSON.parse(savedAdmin)
        setAdminEmail(parsed?.email || '')
      }
    } catch {
      setAdminEmail('')
    }
  }, [])

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Please fill in all password fields.')
      return
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long.')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match.')
      return
    }

    setLoading(true)

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : ''

      const response = await fetch(`${API_BASE_URL}/api/admin/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        credentials: 'include',
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      })

      const result = await response.json()

      if (!response.ok || result?.success === false) {
        throw new Error(result?.message || 'Failed to update password.')
      }

      setSuccess(result?.message || 'Password updated successfully.')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')

      localStorage.removeItem('adminToken')
      localStorage.removeItem('adminData')
      document.cookie = 'adminToken=; path=/; max-age=0; samesite=lax'

      setTimeout(() => {
        router.push('/login')
      }, 1400)
    } catch (changeError) {
      setError(changeError?.message || 'Failed to update password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='relative min-h-screen overflow-hidden bg-linear-to-br from-emerald-100 via-lime-50 to-yellow-50 p-4 md:p-6'>
      <div className='pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-emerald-300/40 blur-3xl' />
      <div className='pointer-events-none absolute -right-24 top-16 h-80 w-80 rounded-full bg-yellow-300/45 blur-3xl' />
      <div className='pointer-events-none absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-lime-300/35 blur-3xl' />

      <div className='relative mx-auto grid min-h-[calc(100vh-2rem)] w-full max-w-6xl items-center'>
        <div className='grid overflow-hidden rounded-3xl border border-white/70 bg-white/80 shadow-[0_20px_70px_rgba(16,185,129,0.22)] backdrop-blur-xl lg:grid-cols-2'>
          <div className='relative flex flex-col justify-between bg-linear-to-br from-emerald-600 via-emerald-500 to-lime-500 p-8 text-white md:p-10'>
            <div className='absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.2),transparent_35%),radial-gradient(circle_at_80%_30%,rgba(253,224,71,0.4),transparent_40%)]' />
            <div className='relative'>
              <div className='inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/15 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em]'>
                <Sparkles size={14} />
                Password Settings
              </div>
              <h2 className='mt-5 text-3xl font-bold leading-tight'>
                Change Admin Password
              </h2>
              <p className='mt-3 max-w-md text-sm text-white/90'>
                Update your admin password securely from one attractive settings screen.
              </p>
            </div>

            <div className='relative mt-10 grid gap-3'>
              <div className='rounded-2xl border border-white/20 bg-white/15 p-4 backdrop-blur'>
                <p className='text-xs font-semibold uppercase tracking-[0.14em] text-white/90'>
                  Secure Update
                </p>
                <p className='mt-1 text-sm text-white/85'>
                  Current password verification protects every change.
                </p>
              </div>
              <div className='rounded-2xl border border-white/20 bg-white/15 p-4 backdrop-blur'>
                <p className='text-xs font-semibold uppercase tracking-[0.14em] text-white/90'>
                  Session Refresh
                </p>
                <p className='mt-1 text-sm text-white/85'>
                  After update, you will be redirected to login again.
                </p>
              </div>
            </div>
          </div>

          <div className='p-7 md:p-10'>
            <div className='mb-7 flex items-start justify-between gap-4'>
              <div>
                <div className='inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 shadow-inner'>
                  <ShieldCheck size={28} />
                </div>
                <h1 className='mt-4 text-3xl font-bold text-slate-900'>Settings</h1>
                <p className='mt-1 text-sm text-slate-600'>
                  Change your admin password securely.
                </p>
              </div>
              {adminEmail ? (
                <div className='rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-right'>
                  <p className='text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-700'>Signed in as</p>
                  <p className='mt-1 text-sm font-semibold text-emerald-900'>{adminEmail}</p>
                </div>
              ) : null}
            </div>

            {error && (
              <div className='mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700'>
                {error}
              </div>
            )}

            {success && (
              <div className='mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700'>
                <CheckCircle2 size={18} />
                {success}
              </div>
            )}

            <form onSubmit={handleChangePassword} className='space-y-4'>
              <div>
                <label className='mb-2 block text-sm font-semibold text-slate-700'>Current Password</label>
                <div className='flex items-center rounded-xl border border-slate-200 bg-white px-3 shadow-sm transition focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-200'>
                  <LockKeyhole size={18} className='text-slate-400' />
                  <input
                    type={showCurrent ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className='w-full bg-transparent px-3 py-3.5 text-slate-800 placeholder:text-slate-400 focus:outline-none'
                    placeholder='Enter current password'
                  />
                  <button type='button' onClick={() => setShowCurrent((prev) => !prev)} className='text-slate-500 hover:text-emerald-700'>
                    {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className='mb-2 block text-sm font-semibold text-slate-700'>New Password</label>
                <div className='flex items-center rounded-xl border border-slate-200 bg-white px-3 shadow-sm transition focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-200'>
                  <LockKeyhole size={18} className='text-slate-400' />
                  <input
                    type={showNew ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className='w-full bg-transparent px-3 py-3.5 text-slate-800 placeholder:text-slate-400 focus:outline-none'
                    placeholder='Enter new password'
                  />
                  <button type='button' onClick={() => setShowNew((prev) => !prev)} className='text-slate-500 hover:text-emerald-700'>
                    {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className='mb-2 block text-sm font-semibold text-slate-700'>Confirm New Password</label>
                <div className='flex items-center rounded-xl border border-slate-200 bg-white px-3 shadow-sm transition focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-200'>
                  <LockKeyhole size={18} className='text-slate-400' />
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className='w-full bg-transparent px-3 py-3.5 text-slate-800 placeholder:text-slate-400 focus:outline-none'
                    placeholder='Confirm new password'
                  />
                  <button type='button' onClick={() => setShowConfirm((prev) => !prev)} className='text-slate-500 hover:text-emerald-700'>
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type='submit'
                disabled={loading}
                className='w-full rounded-xl bg-linear-to-r from-emerald-600 via-emerald-500 to-lime-500 px-4 py-3.5 font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60'
              >
                {loading ? 'Updating Password...' : 'Update Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingPage
