'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import Cookies from 'js-cookie';
import { gsap } from 'gsap';

/* ─── Spinner ─────────────────────────────────── */
const Spinner = () => (
  <span className="inline-block w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
    style={{ borderColor:'white white white transparent' }}/>
)

/* ─── Password strength ───────────────────────── */
const getStrength = (pw) => {
  if (!pw) return 0
  let s = 0
  if (pw.length >= 8)           s++
  if (/[A-Z]/.test(pw))        s++
  if (/[0-9]/.test(pw))        s++
  if (/[^A-Za-z0-9]/.test(pw)) s++
  return s
}
const STRENGTH_LABEL = ['', 'Weak', 'Fair', 'Good', 'Strong']
const STRENGTH_COLOR = ['', '#ef4444', '#f59e0b', '#3b82f6', '#0d9488']

/* ─── Requirements list ───────────────────────── */
const REQS = [
  { label: 'At least 8 characters', test: pw => pw.length >= 8       },
  { label: 'One uppercase letter',   test: pw => /[A-Z]/.test(pw)    },
  { label: 'One lowercase letter',   test: pw => /[a-z]/.test(pw)    },
  { label: 'One number',             test: pw => /[0-9]/.test(pw)    },
]

export default function ResetPasswordPage() {
  const router = useRouter()
  const [email,               setEmail]               = useState('')
  const [newPassword,         setNewPassword]         = useState('')
  const [confirmPassword,     setConfirmPassword]     = useState('')
  const [showPassword,        setShowPassword]        = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading,             setLoading]             = useState(false)
  const [error,               setError]               = useState('')
  const [success,             setSuccess]             = useState(false)
  const [focused,             setFocused]             = useState('')

  const pageRef = useRef(null)
  const leftRef = useRef(null)
  const cardRef = useRef(null)
  const formRef = useRef(null)

  const pwStrength = getStrength(newPassword)
  const passwordsMatch = confirmPassword && newPassword === confirmPassword

  /* ── get email from cookie ── */
  useEffect(() => {
    const resetEmail = Cookies.get('resetEmail')
    if (resetEmail) {
      setEmail(resetEmail)
    } else {
      setError('Session expired. Redirecting…')
      setTimeout(() => router.push('/forgot-password'), 2000)
    }
  }, [router])

  /* ── mount GSAP ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(leftRef.current,
        { opacity:0, x:-50 },
        { opacity:1, x:0, duration:.7, ease:'power3.out' }
      )
      gsap.fromTo(cardRef.current,
        { opacity:0, y:36, scale:.96 },
        { opacity:1, y:0, scale:1, duration:.65, delay:.12, ease:'power3.out' }
      )
      gsap.fromTo(formRef.current?.querySelectorAll('.rp-item') || [],
        { opacity:0, y:18 },
        { opacity:1, y:0, duration:.45, stagger:.07, delay:.3, ease:'power2.out' }
      )
    }, pageRef)
    return () => ctx.revert()
  }, [])

  /* ── success animation ── */
  useEffect(() => {
    if (!success) return
    const el = document.querySelector('.rp-success-icon')
    if (el) gsap.fromTo(el,
      { scale:0, rotation:-15 },
      { scale:1, rotation:0, duration:.65, ease:'back.out(1.8)' }
    )
  }, [success])

  const validatePassword = (pw) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/.test(pw)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!newPassword || !confirmPassword) return setError('Please fill in all fields')
    if (newPassword.length < 8)           return setError('Password must be at least 8 characters')
    if (!validatePassword(newPassword))   return setError('Password must contain uppercase, lowercase, and numbers')
    if (newPassword !== confirmPassword)  return setError('Passwords do not match')

    setLoading(true); setError('')
    try {
      const normalizedEmail = email.trim().toLowerCase()
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/users/forgot-password/change-password`,
        {
          method:'POST',
          headers:{ 'Content-Type':'application/json' },
          credentials:'include',
          body: JSON.stringify({ email:normalizedEmail, newPassword, confirmPassword }),
        }
      )
      const data = await response.json()
      if (!response.ok || !data.success) {
        setError(data.message || 'Failed to reset password')
        setLoading(false)
        return
      }
      setSuccess(true)
      setTimeout(() => {
        Cookies.remove('resetEmail')
        router.push('/login')
      }, 2400)
    } catch (err) {
      setError(err.message || 'Failed to reset password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,800&family=DM+Sans:wght@300;400;500;600&display=swap');
        .rp-root    { font-family:'DM Sans',sans-serif; }
        .rp-display { font-family:'Bricolage Grotesque',sans-serif; }

        .rp-input {
          outline:none;
          transition:border-color .2s,box-shadow .2s,background .2s;
        }
        .rp-input:focus {
          border-color:#0d9488 !important;
          box-shadow:0 0 0 3px rgba(13,148,136,.12);
          background:#fff !important;
        }
        .rp-input:disabled {
          background:#f1f5f9 !important;
          color:#94a3b8;
          cursor:not-allowed;
        }

        .rp-btn {
          transition:transform .15s,box-shadow .2s;
        }
        .rp-btn:hover:not(:disabled) {
          transform:translateY(-2px);
          box-shadow:0 10px 28px rgba(13,148,136,.38);
        }
        .rp-btn:active:not(:disabled) { transform:scale(.96); }

        /* left */
        @keyframes rp-float {
          0%,100% { transform:translateY(0) rotate(0deg); }
          50%     { transform:translateY(-16px) rotate(4deg); }
        }
        @keyframes rp-spin { to { transform:rotate(360deg); } }
        @keyframes rp-pulse {
          0%,100% { opacity:.45; transform:scale(1); }
          50%     { opacity:.8;  transform:scale(1.1); }
        }
        .rp-float     { animation:rp-float  5.5s ease-in-out infinite; }
        .rp-spin-ring { animation:rp-spin   24s  linear     infinite; }
        .rp-pulse     { animation:rp-pulse  3.2s ease-in-out infinite; }

        .rp-strength-bar { transition:width .4s ease,background .4s ease; }

        @keyframes rp-check {
          0%   { stroke-dashoffset:60; }
          100% { stroke-dashoffset:0; }
        }
        .rp-check-path {
          stroke-dasharray:60; stroke-dashoffset:60;
          animation:rp-check .6s .25s ease forwards;
        }

        @keyframes rp-progress {
          from { width:0; }
          to   { width:100%; }
        }
        .rp-progress { animation:rp-progress 2.4s linear forwards; }

        .rp-req { transition:color .2s; }

        @keyframes rp-shake {
          0%,100% { transform:translateX(0); }
          20%,60% { transform:translateX(-5px); }
          40%,80% { transform:translateX(5px); }
        }
        .rp-shake { animation:rp-shake .4s ease; }
      `}</style>

      <div ref={pageRef} className="rp-root min-h-screen w-full flex">

        {/* ══ LEFT PANEL ══ */}
        <div
          ref={leftRef}
          className="hidden lg:flex lg:w-[44%] xl:w-[46%] relative flex-col justify-between p-12 xl:p-16 overflow-hidden"
          style={{ background:'linear-gradient(145deg,#042f2e 0%,#115e59 50%,#0f766e 100%)' }}
        >
          {/* BG effects */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage:'radial-gradient(circle,rgba(255,255,255,.5) 1px,transparent 1px)',
              backgroundSize:'32px 32px',
            }}/>
            <div className="rp-pulse absolute rounded-full" style={{
              width:480, height:480, top:-150, right:-130,
              background:'radial-gradient(circle,rgba(45,212,191,.22) 0%,transparent 70%)',
              filter:'blur(40px)',
            }}/>
            <div className="absolute rounded-full" style={{
              width:320, height:320, bottom:-80, left:-60,
              background:'radial-gradient(circle,rgba(20,184,166,.18) 0%,transparent 70%)',
              filter:'blur(40px)',
            }}/>
            <div className="rp-spin-ring absolute rounded-full" style={{
              width:360, height:360, top:'50%', left:'50%',
              marginTop:-180, marginLeft:-180,
              border:'1px dashed rgba(255,255,255,.1)',
            }}/>
          </div>

          {/* Logo */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-extrabold text-xl"
              style={{ background:'linear-gradient(135deg,#2dd4bf,#0d9488)', boxShadow:'0 6px 24px rgba(45,212,191,.4)' }}>
              G
            </div>
            <div>
              <span className="rp-display block text-white font-extrabold text-2xl leading-none tracking-tight">GOGO</span>
              <span className="text-teal-400 text-[10px] font-semibold uppercase tracking-[.2em]">Grocery</span>
            </div>
          </div>

          {/* Center illustration */}
          <div className="relative z-10 flex flex-col items-center gap-7">
            {/* Shield icon floating */}
            <div className="rp-float relative flex items-center justify-center">
              <div className="absolute w-44 h-44 rounded-full" style={{
                background:'rgba(45,212,191,.08)', border:'1px dashed rgba(45,212,191,.2)',
              }}/>
              <div className="absolute w-32 h-32 rounded-full" style={{
                background:'rgba(45,212,191,.1)',
              }}/>
              <div className="w-24 h-24 rounded-3xl flex items-center justify-center z-10 shadow-2xl"
                style={{
                  background:'linear-gradient(135deg,#2dd4bf,#0d9488)',
                  boxShadow:'0 16px 48px rgba(13,148,136,.5)',
                }}>
                <ShieldCheck size={44} strokeWidth={1.6} className="text-white"/>
              </div>
              {/* Lock badge */}
              <div className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-4 border-[#115e59]"
                style={{ background:'linear-gradient(135deg,#7c3aed,#6d28d9)' }}>
                <Lock size={16} className="text-white"/>
              </div>
            </div>

            <div className="text-center">
              <h2 className="rp-display text-white font-extrabold text-3xl leading-tight mb-3">
                Set Your New<br/>
                <span className="text-teal-300">Password</span>
              </h2>
              <p className="text-teal-100/55 text-sm leading-relaxed max-w-xs font-light">
                Choose a strong password that you haven't used before. Make it memorable but hard to guess.
              </p>
            </div>

            {/* Password tips */}
            <div className="w-full max-w-xs space-y-2.5">
              <p className="text-teal-300/70 text-[10px] font-bold uppercase tracking-[.18em] mb-3">
                Password requirements
              </p>
              {REQS.map(req => (
                <div key={req.label} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background:'rgba(45,212,191,.15)', border:'1px solid rgba(45,212,191,.25)' }}>
                    <span className="text-[10px]">✓</span>
                  </div>
                  <span className="text-teal-100/60 text-xs">{req.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom */}
          <div className="relative z-10 flex items-center justify-between">
            <p className="text-teal-100/25 text-xs">© {new Date().getFullYear()} GOGO Grocery</p>
            <Link href="/login" className="text-teal-300 text-xs font-semibold hover:text-white transition-colors">
              Back to login →
            </Link>
          </div>
        </div>

        {/* ══ RIGHT PANEL ══ */}
        <div className="flex-1 flex items-center justify-center px-4 py-10 sm:px-8 overflow-y-auto"
          style={{ background:'linear-gradient(160deg,#f0fdfa 0%,#ffffff 50%,#f0fdfa 100%)' }}>

          <div ref={cardRef} className="w-full max-w-[420px] opacity-0">

            <div className="bg-white rounded-3xl p-8 sm:p-10"
              style={{ boxShadow:'0 8px 48px rgba(0,0,0,.08),0 2px 12px rgba(13,148,136,.08)', border:'1px solid rgba(13,148,136,.1)' }}>

              <div ref={formRef}>

                {/* Mobile logo */}
                <div className="rp-item lg:hidden flex items-center gap-2.5 mb-6">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-extrabold text-lg"
                    style={{ background:'linear-gradient(135deg,#2dd4bf,#0d9488)' }}>G</div>
                  <span className="rp-display text-teal-700 font-extrabold text-xl tracking-tight">GOGO</span>
                </div>

                {/* ── SUCCESS STATE ── */}
                {success ? (
                  <div className="flex flex-col items-center gap-5 py-6 text-center">
                    <div className="rp-success-icon w-20 h-20 rounded-full flex items-center justify-center"
                      style={{ background:'linear-gradient(135deg,#d1fae5,#a7f3d0)', boxShadow:'0 8px 32px rgba(16,185,129,.25)' }}>
                      <svg width="40" height="40" viewBox="0 0 50 50" fill="none">
                        <path className="rp-check-path" d="M12 25l10 10 16-18"
                          stroke="#059669" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div>
                      <h2 className="rp-display text-gray-900 font-extrabold text-2xl mb-2">Password Reset!</h2>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        Your password has been updated successfully.<br/>Redirecting to login…
                      </p>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-gray-100 overflow-hidden">
                      <div className="rp-progress h-full rounded-full"
                        style={{ background:'linear-gradient(90deg,#0d9488,#2dd4bf)' }}/>
                    </div>
                    <Link href="/login"
                      className="text-sm font-bold text-teal-600 hover:text-teal-700 transition-colors">
                      Go to Login →
                    </Link>
                  </div>
                ) : (
                  <>
                    {/* Header */}
                    <div className="rp-item mb-7">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md"
                          style={{ background:'linear-gradient(135deg,#ccfbf1,#99f6e4)' }}>
                          <ShieldCheck size={22} strokeWidth={2} className="text-teal-600"/>
                        </div>
                        <div>
                          <h1 className="rp-display text-gray-900 font-extrabold text-2xl leading-tight">
                            New Password
                          </h1>
                          <p className="text-gray-400 text-xs mt-0.5">Secure your GOGO account</p>
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm leading-relaxed font-light">
                        Create a strong password. It should be at least 8 characters with mixed case and numbers.
                      </p>
                    </div>

                    {/* Error */}
                    {error && (
                      <div className="rp-item rp-shake mb-5 flex items-start gap-3 p-4 rounded-2xl text-sm font-medium"
                        style={{ background:'#fef2f2', border:'1px solid #fecaca', color:'#dc2626' }}>
                        <span className="text-base shrink-0 mt-0.5">⚠️</span>
                        <span>{error}</span>
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">

                      {/* Email (read-only) */}
                      <div className="rp-item">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-[.12em] mb-2">
                          Account Email
                        </label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 text-sm">✉️</span>
                          <input
                            type="email" value={email} disabled
                            className="rp-input w-full pl-10 pr-4 py-3.5 rounded-xl text-sm"
                            style={{ border:'1.5px solid #e5e7eb', background:'#f8fafc', color:'#94a3b8' }}
                          />
                        </div>
                      </div>

                      {/* New password */}
                      <div className="rp-item">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-[.12em] mb-2">
                          New Password
                        </label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔒</span>
                          <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={e => { setNewPassword(e.target.value); setError('') }}
                            onFocus={() => setFocused('new')}
                            onBlur={() => setFocused('')}
                            className="rp-input w-full pl-10 pr-11 py-3.5 rounded-xl text-sm text-gray-800 placeholder-gray-300"
                            style={{ border:`1.5px solid ${focused==='new'?'#0d9488':'#e5e7eb'}`, background:'#f9fafb' }}
                            autoComplete="new-password"
                          />
                          <button type="button" onClick={() => setShowPassword(v => !v)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                            {showPassword ? <EyeOff size={17}/> : <Eye size={17}/>}
                          </button>
                        </div>

                        {/* Strength bar */}
                        {newPassword && (
                          <div className="mt-2.5 space-y-1.5">
                            <div className="flex gap-1">
                              {[1,2,3,4].map(i => (
                                <div key={i} className="flex-1 h-1.5 rounded-full overflow-hidden bg-gray-100">
                                  <div className="rp-strength-bar h-full rounded-full"
                                    style={{
                                      width: pwStrength >= i ? '100%' : '0%',
                                      background: STRENGTH_COLOR[pwStrength],
                                    }}/>
                                </div>
                              ))}
                            </div>
                            <p className="text-xs font-semibold" style={{ color:STRENGTH_COLOR[pwStrength] }}>
                              {STRENGTH_LABEL[pwStrength]} password
                            </p>
                          </div>
                        )}

                        {/* Requirements */}
                        {newPassword && (
                          <div className="mt-3 grid grid-cols-2 gap-1.5">
                            {REQS.map(req => {
                              const ok = req.test(newPassword)
                              return (
                                <div key={req.label} className="rp-req flex items-center gap-1.5 text-[11px] font-medium"
                                  style={{ color: ok ? '#0d9488' : '#9ca3af' }}>
                                  <span className="text-xs">{ok ? '✓' : '○'}</span>
                                  {req.label}
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>

                      {/* Confirm password */}
                      <div className="rp-item">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-[.12em] mb-2">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔑</span>
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={e => { setConfirmPassword(e.target.value); setError('') }}
                            onFocus={() => setFocused('confirm')}
                            onBlur={() => setFocused('')}
                            className="rp-input w-full pl-10 pr-11 py-3.5 rounded-xl text-sm text-gray-800 placeholder-gray-300"
                            style={{
                              border:`1.5px solid ${
                                confirmPassword
                                  ? passwordsMatch ? '#0d9488' : '#f87171'
                                  : focused==='confirm' ? '#0d9488' : '#e5e7eb'
                              }`,
                              background:'#f9fafb',
                            }}
                            autoComplete="new-password"
                          />
                          <button type="button" onClick={() => setShowConfirmPassword(v => !v)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                            {showConfirmPassword ? <EyeOff size={17}/> : <Eye size={17}/>}
                          </button>
                        </div>

                        {/* Match indicator */}
                        {confirmPassword && (
                          <p className="mt-1.5 text-xs font-semibold flex items-center gap-1"
                            style={{ color: passwordsMatch ? '#0d9488' : '#ef4444' }}>
                            {passwordsMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
                          </p>
                        )}
                      </div>

                      {/* Submit */}
                      <div className="rp-item pt-1">
                        <button
                          type="submit"
                          disabled={loading}
                          className="rp-btn w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-white text-sm font-extrabold tracking-wide disabled:opacity-60 disabled:cursor-not-allowed"
                          style={{
                            background:'linear-gradient(135deg,#0d9488,#2dd4bf)',
                            boxShadow:'0 4px 20px rgba(13,148,136,.3)',
                          }}
                        >
                          {loading ? <><Spinner/> Resetting…</> : '🔐 Reset Password'}
                        </button>
                      </div>
                    </form>

                    {/* Back to login */}
                    <div className="rp-item mt-5 flex justify-center">
                      <Link href="/login"
                        className="group inline-flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-teal-600 transition-colors">
                        <svg className="transition-transform duration-200 group-hover:-translate-x-1" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M19 12H5M12 19l-7-7 7-7"/>
                        </svg>
                        Back to Login
                      </Link>
                    </div>

                  </>
                )}
              </div>
            </div>

            <p className="text-center text-gray-400 text-xs mt-5 font-light">
              Remember your password?{' '}
              <Link href="/login" className="text-teal-600 font-semibold hover:text-teal-700 underline underline-offset-2 transition-colors">
                Sign in
              </Link>
            </p>

          </div>
        </div>

      </div>
    </>
  )
}