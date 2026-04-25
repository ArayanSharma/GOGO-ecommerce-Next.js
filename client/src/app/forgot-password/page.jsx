'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, HelpCircle } from 'lucide-react';
import { gsap } from 'gsap';

/* ─── Spinner ─────────────────────────────────── */
const Spinner = () => (
  <span className="inline-block w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
    style={{ borderColor:'white white white transparent' }}/>
)

/* ─── Steps ───────────────────────────────────── */
const STEPS = [
  { num:'01', label:'Enter your email' },
  { num:'02', label:'Receive OTP code'  },
  { num:'03', label:'Reset password'    },
]

export default function ForgotPasswordPage() {
  const router  = useRouter()
  const [email,   setEmail]   = useState('')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const [success, setSuccess] = useState('')
  const [focused, setFocused] = useState(false)
  const [sent,    setSent]    = useState(false)

  const pageRef  = useRef(null)
  const leftRef  = useRef(null)
  const cardRef  = useRef(null)
  const formRef  = useRef(null)

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
      gsap.fromTo(formRef.current?.querySelectorAll('.fp-item') || [],
        { opacity:0, y:18 },
        { opacity:1, y:0, duration:.45, stagger:.07, delay:.3, ease:'power2.out' }
      )
    }, pageRef)
    return () => ctx.revert()
  }, [])

  /* ── success icon animation ── */
  useEffect(() => {
    if (!sent) return
    const el = document.querySelector('.fp-success-icon')
    if (el) {
      gsap.fromTo(el,
        { scale:0, rotation:-20 },
        { scale:1, rotation:0, duration:.6, ease:'back.out(1.8)' }
      )
    }
  }, [sent])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) return setError('Please enter your email address')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError('Please enter a valid email address')
    setLoading(true); setError(''); setSuccess('')

    try {
      const normalizedEmail = email.trim().toLowerCase()
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/users/forgot-password`,
        {
          method:'POST',
          headers:{ 'Content-Type':'application/json' },
          credentials:'include',
          body: JSON.stringify({ email: normalizedEmail }),
        }
      )
      const data = await response.json()

      if (!response.ok || !data.success) {
        setError(data.message || 'Failed to send OTP')
        setLoading(false)
        return
      }

      setSuccess('OTP sent successfully! Redirecting…')
      setSent(true)
      setEmail('')
      setTimeout(() => {
        router.push(`/verify?email=${encodeURIComponent(normalizedEmail)}&type=forgot-password`)
      }, 2200)
    } catch (err) {
      setError(err.message || 'Failed to send reset email')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,800&family=DM+Sans:wght@300;400;500;600&display=swap');
        .fp-root    { font-family:'DM Sans',sans-serif; }
        .fp-display { font-family:'Bricolage Grotesque',sans-serif; }

        .fp-input {
          outline:none;
          transition:border-color .2s,box-shadow .2s,background .2s;
        }
        .fp-input:focus {
          border-color:#0d9488 !important;
          box-shadow:0 0 0 3px rgba(13,148,136,.12);
          background:#fff !important;
        }

        .fp-btn {
          transition:transform .15s,box-shadow .2s;
        }
        .fp-btn:hover:not(:disabled) {
          transform:translateY(-2px);
          box-shadow:0 10px 28px rgba(13,148,136,.38);
        }
        .fp-btn:active:not(:disabled) { transform:scale(.96); }

        /* left panel */
        @keyframes fp-float {
          0%,100% { transform:translateY(0) rotate(0); }
          50%     { transform:translateY(-14px) rotate(3deg); }
        }
        @keyframes fp-spin { to { transform:rotate(360deg); } }
        @keyframes fp-pulse {
          0%,100% { opacity:.45; transform:scale(1); }
          50%     { opacity:.75; transform:scale(1.08); }
        }
        @keyframes fp-glow {
          0%,100% { opacity:.6; }
          50%     { opacity:1; }
        }

        .fp-icon-float { animation:fp-float 5s ease-in-out infinite; }
        .fp-spin-ring  { animation:fp-spin 22s linear infinite; }
        .fp-pulse      { animation:fp-pulse 3s ease-in-out infinite; }
        .fp-glow       { animation:fp-glow 2s ease-in-out infinite; }

        @keyframes fp-check {
          0%   { stroke-dashoffset:60; }
          100% { stroke-dashoffset:0; }
        }
        .fp-check-path {
          stroke-dasharray:60;
          stroke-dashoffset:60;
          animation:fp-check .6s .3s ease forwards;
        }

        .fp-step {
          transition:background .2s,border-color .2s;
        }

        @keyframes fp-shake {
          0%,100% { transform:translateX(0); }
          20%,60% { transform:translateX(-6px); }
          40%,80% { transform:translateX(6px); }
        }
        .fp-shake { animation:fp-shake .4s ease; }
      `}</style>

      <div ref={pageRef} className="fp-root min-h-screen w-full flex">

        {/* ══ LEFT PANEL ══ */}
        <div
          ref={leftRef}
          className="hidden lg:flex lg:w-[44%] xl:w-[46%] relative flex-col justify-between p-12 xl:p-16 overflow-hidden"
          style={{ background:'linear-gradient(145deg,#042f2e 0%,#134e4a 50%,#0f766e 100%)' }}
        >
          {/* BG effects */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage:'radial-gradient(circle,rgba(255,255,255,.5) 1px,transparent 1px)',
              backgroundSize:'32px 32px',
            }}/>
            <div className="fp-pulse absolute rounded-full" style={{
              width:460, height:460, top:-140, right:-120,
              background:'radial-gradient(circle,rgba(45,212,191,.22) 0%,transparent 70%)',
              filter:'blur(40px)',
            }}/>
            <div className="absolute rounded-full" style={{
              width:300, height:300, bottom:-80, left:-60,
              background:'radial-gradient(circle,rgba(20,184,166,.2) 0%,transparent 70%)',
              filter:'blur(40px)',
            }}/>
            <div className="fp-spin-ring absolute rounded-full" style={{
              width:350, height:350, top:'50%', left:'50%',
              marginTop:-175, marginLeft:-175,
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
              <span className="fp-display block text-white font-extrabold text-2xl leading-none tracking-tight">GOGO</span>
              <span className="text-teal-400 text-[10px] font-semibold uppercase tracking-[.2em]">Grocery</span>
            </div>
          </div>

          {/* Center */}
          <div className="relative z-10 flex flex-col items-center gap-8">
            {/* Lock illustration */}
            <div className="fp-icon-float relative flex items-center justify-center">
              <div className="absolute w-44 h-44 rounded-full" style={{
                background:'rgba(45,212,191,.1)', border:'1px dashed rgba(45,212,191,.25)',
              }}/>
              <div className="absolute w-32 h-32 rounded-full" style={{
                background:'rgba(45,212,191,.12)',
              }}/>
              <div className="w-24 h-24 rounded-3xl flex items-center justify-center z-10 shadow-2xl"
                style={{
                  background:'linear-gradient(135deg,#2dd4bf,#0d9488)',
                  boxShadow:'0 16px 48px rgba(13,148,136,.5)',
                }}>
                <Lock size={42} strokeWidth={1.8} className="text-white"/>
              </div>
              {/* Help circle badge */}
              <div className="absolute bottom-1 right-1 w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-4 border-[#0f766e]"
                style={{ background:'linear-gradient(135deg,#fb923c,#f97316)' }}>
                <HelpCircle size={18} className="text-white"/>
              </div>
            </div>

            <div className="text-center">
              <h2 className="fp-display text-white font-extrabold text-3xl leading-tight mb-3">
                Forgot Your<br/>
                <span className="text-teal-300">Password?</span>
              </h2>
              <p className="text-teal-100/55 text-sm leading-relaxed max-w-xs font-light">
                No worries! Enter your email and we'll send an OTP code to securely reset your password in minutes.
              </p>
            </div>

            {/* How it works */}
            <div className="w-full max-w-xs flex flex-col gap-3">
              {STEPS.map((step, i) => (
                <div key={step.num}
                  className="fp-step flex items-center gap-4 px-4 py-3 rounded-2xl"
                  style={{ background:'rgba(255,255,255,.07)', border:'1px solid rgba(255,255,255,.1)' }}>
                  <span
                    className="fp-display w-8 h-8 rounded-xl flex items-center justify-center text-xs font-extrabold text-white flex-shrink-0"
                    style={{ background:'rgba(45,212,191,.25)', border:'1px solid rgba(45,212,191,.35)' }}>
                    {step.num}
                  </span>
                  <span className="text-teal-100/70 text-sm">{step.label}</span>
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
        <div className="flex-1 flex items-center justify-center px-4 py-10 sm:px-8"
          style={{ background:'linear-gradient(160deg,#f0fdfa 0%,#ffffff 50%,#f0fdfa 100%)' }}>

          <div ref={cardRef} className="w-full max-w-[400px] opacity-0">

            <div
              className="bg-white rounded-3xl p-8 sm:p-10"
              style={{ boxShadow:'0 8px 48px rgba(0,0,0,.08),0 2px 12px rgba(13,148,136,.08)', border:'1px solid rgba(13,148,136,.1)' }}
            >
              <div ref={formRef}>

                {/* Mobile logo */}
                <div className="fp-item lg:hidden flex items-center gap-2.5 mb-6">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-extrabold text-lg"
                    style={{ background:'linear-gradient(135deg,#2dd4bf,#0d9488)' }}>G</div>
                  <span className="fp-display text-teal-700 font-extrabold text-xl tracking-tight">GOGO</span>
                </div>

                {/* Sent state */}
                {sent ? (
                  <div className="flex flex-col items-center gap-5 py-6 text-center">
                    {/* Animated checkmark */}
                    <div className="fp-success-icon w-20 h-20 rounded-full flex items-center justify-center"
                      style={{ background:'linear-gradient(135deg,#d1fae5,#a7f3d0)', boxShadow:'0 8px 32px rgba(16,185,129,.25)' }}>
                      <svg width="40" height="40" viewBox="0 0 50 50" fill="none">
                        <path className="fp-check-path" d="M12 25l10 10 16-18"
                          stroke="#059669" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div>
                      <h2 className="fp-display text-gray-900 font-extrabold text-2xl mb-2">OTP Sent!</h2>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        We've sent a one-time password to your email. Redirecting to verification…
                      </p>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-gray-100 overflow-hidden">
                      <div className="h-full rounded-full"
                        style={{
                          background:'linear-gradient(90deg,#0d9488,#2dd4bf)',
                          animation:'fp-check 2.2s linear forwards',
                          width:'100%',
                        }}/>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Header */}
                    <div className="fp-item mb-7">
                      {/* Icon row */}
                      <div className="flex items-center gap-3 mb-5">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md"
                          style={{ background:'linear-gradient(135deg,#ccfbf1,#99f6e4)' }}>
                          <Lock size={22} strokeWidth={2} className="text-teal-600"/>
                        </div>
                        <div>
                          <h1 className="fp-display text-gray-900 font-extrabold text-2xl leading-tight">
                            Reset Password
                          </h1>
                          <p className="text-gray-400 text-xs mt-0.5">We'll send an OTP to your inbox</p>
                        </div>
                      </div>

                      <p className="text-gray-500 text-sm leading-relaxed font-light">
                        Enter the email address linked to your account and we'll send you a verification code.
                      </p>
                    </div>

                    {/* Error */}
                    {error && (
                      <div className="fp-item fp-shake mb-5 flex items-start gap-3 p-4 rounded-2xl text-sm font-medium"
                        style={{ background:'#fef2f2', border:'1px solid #fecaca', color:'#dc2626' }}>
                        <span className="text-base shrink-0 mt-0.5">⚠️</span>
                        <span>{error}</span>
                      </div>
                    )}

                    {/* Success */}
                    {success && (
                      <div className="fp-item mb-5 flex items-start gap-3 p-4 rounded-2xl text-sm font-medium"
                        style={{ background:'#f0fdf4', border:'1px solid #bbf7d0', color:'#15803d' }}>
                        <span className="text-base shrink-0 mt-0.5">✅</span>
                        <span>{success}</span>
                      </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="fp-item">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-[.12em] mb-2">
                          Email Address
                        </label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">✉️</span>
                          <input
                            type="email"
                            placeholder="your@email.com"
                            value={email}
                            onChange={(e) => { setEmail(e.target.value); setError('') }}
                            onFocus={() => setFocused(true)}
                            onBlur={() => setFocused(false)}
                            className="fp-input w-full pl-10 pr-4 py-3.5 rounded-xl text-sm text-gray-800 placeholder-gray-300"
                            style={{
                              border:`1.5px solid ${focused ? '#0d9488' : '#e5e7eb'}`,
                              background:'#f9fafb',
                            }}
                            autoComplete="email"
                            required
                          />
                        </div>
                      </div>

                      <div className="fp-item">
                        <button
                          type="submit"
                          disabled={loading}
                          className="fp-btn w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-white text-sm font-extrabold tracking-wide disabled:opacity-60 disabled:cursor-not-allowed"
                          style={{
                            background:'linear-gradient(135deg,#0d9488,#2dd4bf)',
                            boxShadow:'0 4px 20px rgba(13,148,136,.3)',
                          }}
                        >
                          {loading ? <><Spinner/> Sending OTP…</> : '📧 Send OTP'}
                        </button>
                      </div>
                    </form>

                    {/* Back to login */}
                    <div className="fp-item mt-6 flex items-center justify-center">
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

            {/* Below card */}
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