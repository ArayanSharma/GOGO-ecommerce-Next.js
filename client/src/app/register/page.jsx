'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { postData } from '@/utils/api';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { firebaseApp } from '@/firebase';
import { gsap } from 'gsap';

const auth           = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();
const isSecureContext = typeof window !== 'undefined' && window.location.protocol === 'https:';
const authCookieOptions = {
  secure: isSecureContext,
  sameSite: isSecureContext ? 'Strict' : 'Lax',
};

/* ─── Google icon ─────────────────────────────── */
const GoogleIcon = () => (
  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

/* ─── Spinner ─────────────────────────────────── */
const Spinner = ({ color = 'white' }) => (
  <span className="inline-block w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
    style={{ borderColor:`${color} ${color} ${color} transparent` }}/>
);

/* ─── Password strength ───────────────────────── */
const getStrength = (pw) => {
  if (!pw) return 0
  let s = 0
  if (pw.length >= 8)       s++
  if (/[A-Z]/.test(pw))     s++
  if (/[0-9]/.test(pw))     s++
  if (/[^A-Za-z0-9]/.test(pw)) s++
  return s
}
const STRENGTH_LABEL = ['','Weak','Fair','Good','Strong']
const STRENGTH_COLOR = ['','#ef4444','#f59e0b','#3b82f6','#16a34a']

export default function RegisterPage() {
  const [formData,      setFormData]      = useState({ name:'', email:'', password:'' })
  const [showPassword,  setShowPassword]  = useState(false)
  const [loading,       setLoading]       = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error,         setError]         = useState('')
  const [focused,       setFocused]       = useState('')

  const router  = useRouter()
  const pageRef = useRef(null)
  const leftRef = useRef(null)
  const cardRef = useRef(null)
  const formRef = useRef(null)

  const pwStrength = getStrength(formData.password)

  /* ── mount GSAP ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(leftRef.current,
        { opacity:0, x:-60 },
        { opacity:1, x:0, duration:.75, ease:'power3.out' }
      )
      gsap.fromTo(cardRef.current,
        { opacity:0, y:40, scale:.96 },
        { opacity:1, y:0, scale:1, duration:.65, delay:.1, ease:'power3.out' }
      )
      gsap.fromTo(formRef.current?.querySelectorAll('.rg-item') || [],
        { opacity:0, y:20 },
        { opacity:1, y:0, duration:.45, stagger:.065, delay:.3, ease:'power2.out' }
      )
    }, pageRef)
    return () => ctx.revert()
  }, [])

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const res = await postData('/api/users/register', formData)
      if (res?.error === false) {
        Cookies.set('userEmail', formData.email)
        setFormData({ name:'', email:'', password:'' })
        router.push('/verify')
      } else setError(res?.message || 'Registration failed')
    } catch (err) { setError(err.message || 'Registration failed') }
    finally { setLoading(false) }
  }

  const handleGoogleSignUp = async () => {
    setGoogleLoading(true); setError('')
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const user   = result.user
      const fields = {
        name:     user.displayName || 'Google User',
        email:    user.email || user.providerData?.[0]?.email,
        password: null,
        avatar:   user.photoURL || '',
        mobile:   user.phoneNumber || '',
      }
      if (!fields.email) throw new Error('Google account email is required')
      const res = await postData('/api/users/authWithGoogle', fields)
      if (res?.success === true) {
        if (res?.data?.accessToken)  Cookies.set('accessToken',  res.data.accessToken,  { expires:7,  ...authCookieOptions })
        if (res?.data?.refreshToken) Cookies.set('refreshToken', res.data.refreshToken, { expires:30, ...authCookieOptions })
        if (res?.data?.userName)     Cookies.set('userName',     res.data.userName,     { expires:7 })
        if (res?.data?.userEmail)    Cookies.set('userEmail',    res.data.userEmail,    { expires:7 })
        router.push('/')
      } else setError(res?.message || 'Google sign-up failed')
    } catch (err) { setError(err?.message || 'Google sign-up failed') }
    finally { setGoogleLoading(false) }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,800&family=Outfit:wght@300;400;500;600;700&display=swap');
        .rg-root    { font-family:'Outfit',sans-serif; }
        .rg-display { font-family:'Bricolage Grotesque',sans-serif; }

        .rg-input {
          outline:none;
          transition:border-color .2s,box-shadow .2s,background .2s;
        }
        .rg-input:focus {
          border-color:#16a34a !important;
          box-shadow:0 0 0 3px rgba(22,163,74,.12);
          background:#fff !important;
        }

        .rg-btn-main {
          transition:transform .15s,box-shadow .18s;
        }
        .rg-btn-main:hover:not(:disabled) {
          transform:translateY(-2px);
          box-shadow:0 10px 28px rgba(22,163,74,.38);
        }
        .rg-btn-main:active:not(:disabled) { transform:scale(.96); }

        .rg-btn-google {
          transition:background .2s,border-color .2s,transform .15s,box-shadow .18s;
        }
        .rg-btn-google:hover:not(:disabled) {
          background:#f8fafc !important;
          border-color:#cbd5e1 !important;
          transform:translateY(-2px);
          box-shadow:0 6px 20px rgba(0,0,0,.08);
        }
        .rg-btn-google:active:not(:disabled) { transform:scale(.96); }

        /* left panel */
        @keyframes rg-float {
          0%,100% { transform:translateY(0) rotate(0); }
          50%     { transform:translateY(-16px) rotate(3deg); }
        }
        @keyframes rg-orbit {
          from { transform:rotate(0deg) translateX(110px) rotate(0deg); }
          to   { transform:rotate(360deg) translateX(110px) rotate(-360deg); }
        }
        @keyframes rg-spin { to { transform:rotate(360deg); } }
        @keyframes rg-pulse {
          0%,100% { opacity:.4; transform:scale(1); }
          50%     { opacity:.7; transform:scale(1.08); }
        }
        .rg-float    { animation:rg-float 5s ease-in-out infinite; }
        .rg-spin-ring{ animation:rg-spin 22s linear infinite; }
        .rg-pulse    { animation:rg-pulse 3.5s ease-in-out infinite; }
        .rg-orbit1   { animation:rg-orbit 8s linear infinite; }
        .rg-orbit2   { animation:rg-orbit 12s linear infinite reverse; }

        /* strength bar fill */
        .rg-strength-bar {
          transition:width .4s ease,background .4s ease;
        }
      `}</style>

      <div ref={pageRef} className="rg-root min-h-screen w-full flex">

        {/* ══ LEFT PANEL ══ */}
        <div
          ref={leftRef}
          className="hidden lg:flex lg:w-[46%] xl:w-[48%] relative flex-col justify-between p-12 xl:p-16 overflow-hidden"
          style={{ background:'linear-gradient(145deg,#0c1445 0%,#1e3a8a 50%,#1d4ed8 100%)' }}
        >
          {/* BG effects */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage:'radial-gradient(circle,rgba(255,255,255,.5) 1px,transparent 1px)',
              backgroundSize:'32px 32px',
            }}/>
            <div className="rg-pulse absolute rounded-full" style={{
              width:440, height:440, top:-140, right:-110,
              background:'radial-gradient(circle,rgba(96,165,250,.28) 0%,transparent 70%)',
              filter:'blur(40px)',
            }}/>
            <div className="absolute rounded-full" style={{
              width:320, height:320, bottom:-100, left:-80,
              background:'radial-gradient(circle,rgba(99,102,241,.25) 0%,transparent 70%)',
              filter:'blur(40px)',
            }}/>
            <div className="rg-spin-ring absolute rounded-full" style={{
              width:340, height:340, top:'50%', left:'50%',
              marginTop:-170, marginLeft:-170,
              border:'1px dashed rgba(255,255,255,.1)',
            }}/>
          </div>

          {/* Logo */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-extrabold text-xl"
              style={{ background:'linear-gradient(135deg,#60a5fa,#3b82f6)', boxShadow:'0 6px 24px rgba(96,165,250,.45)' }}>
              G
            </div>
            <div>
              <span className="rg-display block text-white font-extrabold text-2xl leading-none tracking-tight">GOGO</span>
              <span className="text-blue-300 text-[10px] font-semibold uppercase tracking-[.2em]">Grocery</span>
            </div>
          </div>

          {/* Center */}
          <div className="relative z-10 flex flex-col gap-6">
            {/* Central orbit visual */}
            <div className="relative flex items-center justify-center w-52 h-52 mx-auto mb-2">
              {/* Center cart */}
              <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl shadow-2xl z-10"
                style={{ background:'rgba(255,255,255,.12)', border:'1px solid rgba(255,255,255,.2)' }}>
                🛒
              </div>
              {/* Orbiting items */}
              {['🥦','🍎','🧃','🥚'].map((e,i) => (
                <div
                  key={i}
                  className="absolute w-10 h-10 rounded-2xl flex items-center justify-center text-lg"
                  style={{
                    background:'rgba(255,255,255,.1)',
                    border:'1px solid rgba(255,255,255,.18)',
                    top:'50%', left:'50%',
                    marginTop:-20, marginLeft:-20,
                    animation:`rg-orbit ${7+i*2}s linear infinite ${i%2===0?'':'reverse'}`,
                    transformOrigin:`0 0`,
                    transform:`rotate(${i*90}deg) translateX(90px) rotate(-${i*90}deg)`,
                  }}
                >
                  {e}
                </div>
              ))}
              {/* Ring */}
              <div className="absolute w-48 h-48 rounded-full" style={{
                border:'1px dashed rgba(255,255,255,.15)',
              }}/>
            </div>

            <h2 className="rg-display text-white font-extrabold leading-tight text-center"
              style={{ fontSize:'clamp(1.8rem,3.5vw,2.8rem)' }}>
              Start Your Journey<br/>
              <span className="text-blue-300">to Freshness.</span>
            </h2>

            <p className="text-blue-100/55 text-sm leading-relaxed text-center font-light max-w-xs mx-auto">
              Create your free account in seconds and get access to 5,000+ fresh products from certified farms.
            </p>

            {/* Steps */}
            <div className="flex flex-col gap-3 mt-1">
              {[
                { step:'01', text:'Create your free account' },
                { step:'02', text:'Browse 5,000+ products' },
                { step:'03', text:'Get it delivered same day' },
              ].map(s => (
                <div key={s.step} className="flex items-center gap-3.5">
                  <span
                    className="rg-display w-8 h-8 rounded-xl flex items-center justify-center text-xs font-extrabold text-white flex-shrink-0"
                    style={{ background:'rgba(96,165,250,.25)', border:'1px solid rgba(96,165,250,.35)' }}
                  >{s.step}</span>
                  <span className="text-blue-100/65 text-sm">{s.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom */}
          <div className="relative z-10 flex items-center justify-between">
            <p className="text-blue-100/25 text-xs">© {new Date().getFullYear()} GOGO Grocery</p>
            <Link href="/login" className="text-blue-300 text-xs font-semibold hover:text-white transition-colors">
              Already have an account? →
            </Link>
          </div>
        </div>

        {/* ══ RIGHT PANEL — Form ══ */}
        <div
          className="flex-1 flex items-center justify-center px-4 py-10 sm:px-8 overflow-y-auto"
          style={{ background:'linear-gradient(160deg,#eff6ff 0%,#ffffff 50%,#f0f9ff 100%)' }}
        >
          <div ref={cardRef} className="w-full max-w-[420px] opacity-0">

            {/* Card */}
            <div
              className="bg-white rounded-3xl p-8 sm:p-10"
              style={{ boxShadow:'0 8px 48px rgba(0,0,0,.08),0 2px 12px rgba(59,130,246,.08)', border:'1px solid rgba(59,130,246,.1)' }}
            >
              <div ref={formRef}>

                {/* Header */}
                <div className="rg-item mb-7">
                  {/* Mobile logo */}
                  <div className="lg:hidden flex items-center gap-2.5 mb-5">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-extrabold text-lg"
                      style={{ background:'linear-gradient(135deg,#60a5fa,#3b82f6)' }}>G</div>
                    <span className="rg-display text-blue-700 font-extrabold text-xl tracking-tight">GOGO</span>
                  </div>
                  <h1 className="rg-display text-gray-900 font-extrabold leading-tight"
                    style={{ fontSize:'clamp(1.6rem,3vw,2rem)' }}>
                    Create account 🎉
                  </h1>
                  <p className="text-gray-400 text-sm mt-1.5 font-light">
                    Join 50,000+ happy GOGO customers
                  </p>
                </div>

                {/* Error */}
                {error && (
                  <div className="rg-item mb-5 flex items-start gap-3 p-4 rounded-2xl text-sm font-medium"
                    style={{ background:'#fef2f2', border:'1px solid #fecaca', color:'#dc2626' }}>
                    <span className="text-base shrink-0 mt-0.5">⚠️</span>
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">

                  {/* Name */}
                  <div className="rg-item">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-[.12em] mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">👤</span>
                      <input
                        type="text" name="name" required
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                        onFocus={() => setFocused('name')}
                        onBlur={() => setFocused('')}
                        className="rg-input w-full pl-10 pr-4 py-3.5 rounded-xl text-sm text-gray-800 placeholder-gray-300"
                        style={{ border:`1.5px solid ${focused==='name'?'#3b82f6':'#e5e7eb'}`, background:'#f9fafb' }}
                        autoComplete="name"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="rg-item">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-[.12em] mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">✉️</span>
                      <input
                        type="email" name="email" required
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={handleChange}
                        onFocus={() => setFocused('email')}
                        onBlur={() => setFocused('')}
                        className="rg-input w-full pl-10 pr-4 py-3.5 rounded-xl text-sm text-gray-800 placeholder-gray-300"
                        style={{ border:`1.5px solid ${focused==='email'?'#3b82f6':'#e5e7eb'}`, background:'#f9fafb' }}
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="rg-item">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-[.12em] mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔒</span>
                      <input
                        type={showPassword?'text':'password'} name="password" required
                        placeholder="Min. 8 characters"
                        value={formData.password}
                        onChange={handleChange}
                        onFocus={() => setFocused('password')}
                        onBlur={() => setFocused('')}
                        className="rg-input w-full pl-10 pr-11 py-3.5 rounded-xl text-sm text-gray-800 placeholder-gray-300"
                        style={{ border:`1.5px solid ${focused==='password'?'#3b82f6':'#e5e7eb'}`, background:'#f9fafb' }}
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(v => !v)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                      </button>
                    </div>

                    {/* Strength bar */}
                    {formData.password && (
                      <div className="mt-2.5 space-y-1.5">
                        <div className="flex gap-1">
                          {[1,2,3,4].map(i => (
                            <div key={i} className="flex-1 h-1.5 rounded-full overflow-hidden bg-gray-100">
                              <div
                                className="rg-strength-bar h-full rounded-full"
                                style={{
                                  width: pwStrength >= i ? '100%' : '0%',
                                  background: STRENGTH_COLOR[pwStrength],
                                }}
                              />
                            </div>
                          ))}
                        </div>
                        <p className="text-xs font-semibold" style={{ color:STRENGTH_COLOR[pwStrength] }}>
                          {STRENGTH_LABEL[pwStrength]} password
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Submit */}
                  <div className="rg-item pt-1">
                    <button
                      type="submit"
                      disabled={loading}
                      className="rg-btn-main w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-white text-sm font-extrabold tracking-wide disabled:opacity-60 disabled:cursor-not-allowed"
                      style={{
                        background:'linear-gradient(135deg,#2563eb,#3b82f6)',
                        boxShadow:'0 4px 20px rgba(59,130,246,.32)',
                      }}
                    >
                      {loading ? <><Spinner/> Creating account…</> : 'Create Free Account →'}
                    </button>
                  </div>
                </form>

                {/* Login link */}
                <p className="rg-item text-center text-gray-400 text-sm mt-5 font-medium">
                  Already have an account?{' '}
                  <Link href="/login" className="text-blue-600 font-bold hover:text-blue-700 transition-colors">
                    Sign in
                  </Link>
                </p>

                {/* Divider */}
                <div className="rg-item flex items-center gap-3 my-5">
                  <div className="flex-1 h-px bg-gray-100"/>
                  <span className="text-gray-300 text-xs font-bold uppercase tracking-wider">or</span>
                  <div className="flex-1 h-px bg-gray-100"/>
                </div>

                {/* Google */}
                <div className="rg-item">
                  <button
                    type="button"
                    onClick={handleGoogleSignUp}
                    disabled={googleLoading}
                    className="rg-btn-google w-full flex items-center justify-center gap-3 py-3.5 rounded-xl text-sm font-bold text-gray-700 disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{ background:'#fff', border:'1.5px solid #e5e7eb' }}
                  >
                    {googleLoading
                      ? <><Spinner color="#4285F4"/> Connecting…</>
                      : <><GoogleIcon/> Sign up with Google</>
                    }
                  </button>
                </div>

              </div>
            </div>

            {/* Below card */}
            <p className="text-center text-gray-400 text-xs mt-5 font-light">
              By creating an account you agree to our{' '}
              <a href="#" className="underline hover:text-gray-600 transition-colors">Terms</a> &amp;{' '}
              <a href="#" className="underline hover:text-gray-600 transition-colors">Privacy Policy</a>
            </p>
          </div>
        </div>

      </div>
    </>
  )
}