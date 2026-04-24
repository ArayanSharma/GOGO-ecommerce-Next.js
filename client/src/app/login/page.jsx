'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import Cookies from 'js-cookie';
import { postData } from '@/utils/api';
import { useRouter } from 'next/navigation';
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

/* ─── Google icon ───────────────────────────────── */
const GoogleIcon = () => (
  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

/* ─── Spinner ───────────────────────────────────── */
const Spinner = ({ color = 'white' }) => (
  <span
    className="inline-block w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
    style={{ borderColor: `${color} ${color} ${color} transparent` }}
  />
);

export default function Login() {
  const [formData,      setFormData]      = useState({ email: '', password: '' });
  const [showPassword,  setShowPassword]  = useState(false);
  const [loading,       setLoading]       = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error,         setError]         = useState('');
  const [focused,       setFocused]       = useState('');

  const router    = useRouter();
  const pageRef   = useRef(null);
  const cardRef   = useRef(null);
  const leftRef   = useRef(null);
  const formRef   = useRef(null);

  /* ── mount animation ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Left panel slides in
      gsap.fromTo(leftRef.current,
        { opacity: 0, x: -60 },
        { opacity: 1, x: 0, duration: 0.75, ease: 'power3.out' }
      );
      // Card scales up
      gsap.fromTo(cardRef.current,
        { opacity: 0, y: 40, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.65, delay: 0.1, ease: 'power3.out' }
      );
      // Form elements stagger
      gsap.fromTo(formRef.current?.querySelectorAll('.lg-item') || [],
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.45, stagger: 0.07, delay: 0.3, ease: 'power2.out' }
      );
    }, pageRef);
    return () => ctx.revert();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) return setError('Please fill in all fields');
    setLoading(true); setError('');
    try {
      const res = await postData('/api/users/login', { email: formData.email, password: formData.password });
      if (res?.success === true && res?.date?.accessToken) {
        Cookies.set('accessToken', res.date.accessToken, { expires: 7, ...authCookieOptions });
        if (res.date.refreshToken) Cookies.set('refreshToken', res.date.refreshToken, { expires: 30, ...authCookieOptions });
        Cookies.set('userEmail', formData.email, { expires: 7 });
        Cookies.set('userName', formData.email.split('@')[0], { expires: 7 });
        router.push('/');
      } else setError(res?.message || 'Login failed. Please check your credentials.');
    } catch (err) { setError(err.message || 'Login failed'); }
    finally { setLoading(false); }
  };

  const signWithGoogle = async () => {
    setGoogleLoading(true); setError('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user   = result.user;
      const fields = {
        name:     user.displayName || 'Google User',
        email:    user.email || user.providerData?.[0]?.email,
        password: null,
        avatar:   user.photoURL || '',
        mobile:   user.phoneNumber || '',
      };
      if (!fields.email) throw new Error('Google account email is required');
      const res = await postData('/api/users/authWithGoogle', fields);
      if (res?.success === true) {
        if (res?.data?.accessToken)  Cookies.set('accessToken',  res.data.accessToken,  { expires: 7,  ...authCookieOptions });
        if (res?.data?.refreshToken) Cookies.set('refreshToken', res.data.refreshToken, { expires: 30, ...authCookieOptions });
        if (res?.data?.userName)     Cookies.set('userName',     res.data.userName,     { expires: 7 });
        if (res?.data?.userEmail)    Cookies.set('userEmail',    res.data.userEmail,    { expires: 7 });
        router.push('/');
      } else setError(res?.message || 'Google login failed');
    } catch (err) { setError(err?.message || 'Google login failed'); }
    finally { setGoogleLoading(false); }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,800&family=Outfit:wght@300;400;500;600;700&display=swap');
        .lg-root    { font-family:'Outfit',sans-serif; }
        .lg-display { font-family:'Bricolage Grotesque',sans-serif; }

        .lg-input {
          transition: border-color .2s, box-shadow .2s, background .2s;
          outline: none;
        }
        .lg-input:focus {
          border-color: #16a34a;
          box-shadow: 0 0 0 3px rgba(22,163,74,.12);
          background: #fff;
        }

        .lg-btn-main {
          transition: transform .15s, box-shadow .18s, background .2s;
        }
        .lg-btn-main:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(22,163,74,.38);
        }
        .lg-btn-main:active:not(:disabled) { transform: scale(.96); }

        .lg-btn-google {
          transition: background .2s, border-color .2s, transform .15s, box-shadow .18s;
        }
        .lg-btn-google:hover:not(:disabled) {
          background: #f8fafc;
          border-color: #cbd5e1;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0,0,0,.08);
        }
        .lg-btn-google:active:not(:disabled) { transform:scale(.96); }

        /* left panel floating shapes */
        @keyframes lg-float1 {
          0%,100% { transform:translateY(0) rotate(0); }
          50%     { transform:translateY(-18px) rotate(4deg); }
        }
        @keyframes lg-float2 {
          0%,100% { transform:translateY(0) rotate(0); }
          50%     { transform:translateY(-12px) rotate(-3deg); }
        }
        .lg-blob1 { animation:lg-float1 6s ease-in-out infinite; }
        .lg-blob2 { animation:lg-float2 8s ease-in-out infinite 1s; }

        @keyframes lg-spin { to { transform:rotate(360deg); } }
        .lg-spin-ring { animation:lg-spin 20s linear infinite; }

        @keyframes lg-pulse {
          0%,100% { opacity:.5; transform:scale(1); }
          50%     { opacity:.8; transform:scale(1.06); }
        }
        .lg-pulse { animation:lg-pulse 3s ease-in-out infinite; }
      `}</style>

      <div ref={pageRef} className="lg-root min-h-screen w-full flex">

        {/* ══ LEFT PANEL — Branding ══ */}
        <div
          ref={leftRef}
          className="hidden lg:flex lg:w-[46%] xl:w-[50%] relative flex-col justify-between p-12 xl:p-16 overflow-hidden"
          style={{ background: 'linear-gradient(145deg,#052e16 0%,#14532d 45%,#166534 100%)' }}
        >
          {/* Background effects */}
          <div className="absolute inset-0 pointer-events-none">
            {/* dot grid */}
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage:'radial-gradient(circle,rgba(255,255,255,.5) 1px,transparent 1px)',
              backgroundSize:'32px 32px',
            }}/>
            {/* orb top-right */}
            <div className="lg-pulse absolute rounded-full" style={{
              width:400, height:400, top:-120, right:-100,
              background:'radial-gradient(circle,rgba(74,222,128,.25) 0%,transparent 70%)',
              filter:'blur(40px)',
            }}/>
            {/* orb bottom-left */}
            <div className="absolute rounded-full" style={{
              width:320, height:320, bottom:-80, left:-80,
              background:'radial-gradient(circle,rgba(21,128,61,.3) 0%,transparent 70%)',
              filter:'blur(40px)',
            }}/>
            {/* spinning ring */}
            <div className="lg-spin-ring absolute rounded-full" style={{
              width:320, height:320, top:'50%', left:'50%',
              marginTop:-160, marginLeft:-160,
              border:'1px dashed rgba(255,255,255,.1)',
            }}/>
          </div>

          {/* Logo */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center font-extrabold text-white text-xl shadow-lg"
              style={{ background:'linear-gradient(135deg,#4ade80,#16a34a)', boxShadow:'0 6px 24px rgba(74,222,128,.4)' }}>
              G
            </div>
            <div>
              <span className="lg-display block text-white font-extrabold text-2xl leading-none tracking-tight">GOGO</span>
              <span className="text-green-400 text-[10px] font-semibold uppercase tracking-[.2em]">Grocery</span>
            </div>
          </div>

          {/* Center content */}
          <div className="relative z-10 flex flex-col gap-6">
            {/* Floating product emojis */}
            <div className="flex gap-4 mb-2">
              {['🥦','🥛','🍎','🧃','🥚'].map((e,i) => (
                <div key={i}
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl"
                  style={{
                    background:'rgba(255,255,255,.1)',
                    border:'1px solid rgba(255,255,255,.15)',
                    animationDelay:`${i * 0.4}s`,
                  }}>
                  {e}
                </div>
              ))}
            </div>

            <h2 className="lg-display text-white font-extrabold leading-tight"
              style={{ fontSize:'clamp(2rem,4vw,3.2rem)' }}>
              Fresh Groceries,<br/>
              <span className="text-green-400">Delivered Fast.</span>
            </h2>

            <p className="text-green-100/60 text-base leading-relaxed max-w-sm font-light">
              Join 50,000+ happy customers who trust GOGO for farm-fresh, organic produce delivered right to their door.
            </p>

            {/* Trust badges */}
            <div className="flex flex-col gap-3 mt-2">
              {[
                { icon:'🚚', label:'Free delivery above ₹499' },
                { icon:'🌿', label:'100% certified organic' },
                { icon:'🔄', label:'Easy 7-day returns' },
              ].map(b => (
                <div key={b.label} className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0"
                    style={{ background:'rgba(74,222,128,.15)', border:'1px solid rgba(74,222,128,.2)' }}>
                    {b.icon}
                  </span>
                  <span className="text-green-100/70 text-sm">{b.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom */}
          <div className="relative z-10">
            <p className="text-green-100/30 text-xs">© {new Date().getFullYear()} GOGO Grocery. All rights reserved.</p>
          </div>
        </div>

        {/* ══ RIGHT PANEL — Form ══ */}
        <div className="flex-1 flex items-center justify-center px-4 py-10 sm:px-8"
          style={{ background: 'linear-gradient(160deg,#f0fdf4 0%,#ffffff 50%,#f8fffe 100%)' }}>

          <div
            ref={cardRef}
            className="w-full max-w-[420px] opacity-0"
          >
            {/* Card */}
            <div
              className="bg-white rounded-3xl p-8 sm:p-10"
              style={{ boxShadow:'0 8px 48px rgba(0,0,0,0.08), 0 2px 12px rgba(22,163,74,0.08)', border:'1px solid rgba(22,163,74,0.1)' }}
            >
              <div ref={formRef}>

                {/* Header */}
                <div className="lg-item mb-7">
                  {/* Mobile logo */}
                  <div className="lg:hidden flex items-center gap-2.5 mb-5">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-extrabold text-lg"
                      style={{ background:'linear-gradient(135deg,#4ade80,#16a34a)' }}>G</div>
                    <span className="lg-display text-green-700 font-extrabold text-xl tracking-tight">GOGO</span>
                  </div>

                  <h1 className="lg-display text-gray-900 font-extrabold leading-tight" style={{ fontSize:'clamp(1.6rem,3vw,2rem)' }}>
                    Welcome back 👋
                  </h1>
                  <p className="text-gray-400 text-sm mt-1.5 font-light">
                    Sign in to your GOGO account
                  </p>
                </div>

                {/* Error */}
                {error && (
                  <div className="lg-item mb-5 flex items-start gap-3 p-4 rounded-2xl text-sm font-medium"
                    style={{ background:'#fef2f2', border:'1px solid #fecaca', color:'#dc2626' }}>
                    <span className="text-base shrink-0 mt-0.5">⚠️</span>
                    <span>{error}</span>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">

                  {/* Email */}
                  <div className="lg-item">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-[.12em] mb-2">
                      Email address
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">✉️</span>
                      <input
                        type="email" name="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={handleChange}
                        onFocus={() => setFocused('email')}
                        onBlur={() => setFocused('')}
                        className="lg-input w-full pl-10 pr-4 py-3.5 rounded-xl text-sm text-gray-800 placeholder-gray-300"
                        style={{ border:`1.5px solid ${focused==='email' ? '#16a34a' : '#e5e7eb'}`, background:'#f9fafb' }}
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="lg-item">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-[.12em]">
                        Password
                      </label>
                      <Link href="/forgot-password" className="text-xs font-semibold text-green-600 hover:text-green-700 transition-colors">
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔒</span>
                      <input
                        type={showPassword ? 'text' : 'password'} name="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        onFocus={() => setFocused('password')}
                        onBlur={() => setFocused('')}
                        className="lg-input w-full pl-10 pr-11 py-3.5 rounded-xl text-sm text-gray-800 placeholder-gray-300"
                        style={{ border:`1.5px solid ${focused==='password' ? '#16a34a' : '#e5e7eb'}`, background:'#f9fafb' }}
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(v => !v)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                      </button>
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="lg-item pt-1">
                    <button
                      type="submit"
                      disabled={loading}
                      className="lg-btn-main w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-white text-sm font-extrabold tracking-wide disabled:opacity-60 disabled:cursor-not-allowed"
                      style={{
                        background: 'linear-gradient(135deg,#16a34a,#22c55e)',
                        boxShadow: '0 4px 20px rgba(22,163,74,.3)',
                      }}
                    >
                      {loading ? <><Spinner/> Signing in…</> : 'Sign In →'}
                    </button>
                  </div>
                </form>

                {/* Sign up link */}
                <p className="lg-item text-center text-gray-400 text-sm mt-5 font-medium">
                  Don't have an account?{' '}
                  <Link href="/register" className="text-green-600 font-bold hover:text-green-700 transition-colors">
                    Create one free
                  </Link>
                </p>

                {/* Divider */}
                <div className="lg-item flex items-center gap-3 my-5">
                  <div className="flex-1 h-px bg-gray-100"/>
                  <span className="text-gray-300 text-xs font-bold uppercase tracking-wider">or</span>
                  <div className="flex-1 h-px bg-gray-100"/>
                </div>

                {/* Google */}
                <div className="lg-item">
                  <button
                    type="button"
                    onClick={signWithGoogle}
                    disabled={googleLoading}
                    className="lg-btn-google w-full flex items-center justify-center gap-3 py-3.5 rounded-xl text-sm font-bold text-gray-700 disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{ background:'#fff', border:'1.5px solid #e5e7eb' }}
                  >
                    {googleLoading
                      ? <><Spinner color="#4285F4"/> Connecting…</>
                      : <><GoogleIcon/> Continue with Google</>
                    }
                  </button>
                </div>

              </div>
            </div>

            {/* Below card */}
            <p className="text-center text-gray-400 text-xs mt-5 font-light">
              By signing in, you agree to our{' '}
              <a href="#" className="underline hover:text-gray-600 transition-colors">Terms</a> &amp;{' '}
              <a href="#" className="underline hover:text-gray-600 transition-colors">Privacy Policy</a>
            </p>
          </div>
        </div>

      </div>
    </>
  );
}