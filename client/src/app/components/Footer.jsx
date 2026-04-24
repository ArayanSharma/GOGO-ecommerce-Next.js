'use client'
import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  FaFacebook, FaTwitter, FaInstagram, FaLinkedin,
  FaPhone, FaEnvelope, FaMapMarkerAlt,
  FaLeaf, FaShieldAlt, FaTruck, FaHeartbeat,
  FaCreditCard, FaGooglePay, FaApple,
} from 'react-icons/fa'
import { HiArrowUp } from 'react-icons/hi'
import { BsArrowRight } from 'react-icons/bs'

gsap.registerPlugin(ScrollTrigger)

/* ─── Data ──────────────────────────────────────── */
const FEATURES = [
  { icon: <FaLeaf  size={18}/>, label:'100% Fresh',    sub:'Farm to doorstep',     from:'#22c55e', to:'#16a34a', glow:'rgba(34,197,94,.3)'  },
  { icon: <FaTruck size={18}/>, label:'Fast Delivery',  sub:'Same-day in metro',   from:'#38bdf8', to:'#0284c7', glow:'rgba(56,189,248,.3)' },
  { icon: <FaShieldAlt size={18}/>, label:'Safe Pay',  sub:'256-bit encryption',   from:'#a78bfa', to:'#7c3aed', glow:'rgba(167,139,250,.3)'},
  { icon: <FaHeartbeat size={18}/>, label:'Health First', sub:'Quality guaranteed', from:'#fb7185', to:'#e11d48', glow:'rgba(251,113,133,.3)'},
]

const QUICK  = ['Home','Shop','About Us','Contact','Blog','Careers']
const SUPPORT= ['Shipping Info','Returns','Track Order','Help Center','Size Guide','FAQs']
const LEGAL  = ['Privacy Policy','Terms & Conditions','Cookie Policy','Refund Policy','Accessibility','Security']

const SOCIALS = [
  { icon:<FaFacebook size={16}/>, href:'#', label:'Facebook',  from:'#1877f2', to:'#1565c0' },
  { icon:<FaTwitter  size={16}/>, href:'#', label:'Twitter',   from:'#1da1f2', to:'#0d8ecf' },
  { icon:<FaInstagram size={16}/>,href:'#', label:'Instagram', from:'#f43f5e', to:'#ec4899' },
  { icon:<FaLinkedin size={16}/>, href:'#', label:'LinkedIn',  from:'#0077b5', to:'#005582' },
]

/* ─── Feature pill ──────────────────────────────── */
function FeaturePill({ f, i }) {
  const ref = useRef(null)
  return (
    <div
      ref={ref}
      className="ft-pill group flex items-center gap-3.5 px-5 py-4 rounded-2xl cursor-default"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        transition: 'background .25s, transform .22s, box-shadow .25s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = `${f.glow.replace('.3','0.12')}`
        e.currentTarget.style.transform  = 'translateY(-3px)'
        e.currentTarget.style.boxShadow  = `0 12px 32px ${f.glow}`
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
        e.currentTarget.style.transform  = 'translateY(0)'
        e.currentTarget.style.boxShadow  = 'none'
      }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-white flex-shrink-0"
        style={{ background: `linear-gradient(135deg,${f.from},${f.to})`, boxShadow:`0 4px 14px ${f.glow}` }}
      >
        {f.icon}
      </div>
      <div>
        <p className="text-white font-bold text-sm leading-tight">{f.label}</p>
        <p className="text-gray-500 text-xs mt-0.5">{f.sub}</p>
      </div>
    </div>
  )
}

/* ─── Link list ─────────────────────────────────── */
function FooterLinks({ title, links, accent }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-5">
        <span className="w-1 h-5 rounded-full" style={{ background: accent }}/>
        <h4 className="text-white font-extrabold text-sm uppercase tracking-[.16em]">{title}</h4>
      </div>
      <ul className="space-y-2.5">
        {links.map(l => (
          <li key={l}>
            <a
              href="#"
              className="ft-link group flex items-center gap-2 text-gray-500 text-sm font-medium transition-colors duration-200 hover:text-white"
            >
              <span
                className="w-0 group-hover:w-3 h-px transition-all duration-250 rounded-full"
                style={{ background: accent }}
              />
              {l}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ─── Main Footer ───────────────────────────────── */
export default function Footer() {
  const year = new Date().getFullYear()
  const [email,      setEmail]      = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [visible,    setVisible]    = useState(false)

  const footerRef   = useRef(null)
  const featuresRef = useRef(null)
  const colsRef     = useRef(null)
  const bottomRef   = useRef(null)

  /* scroll to top button visibility */
  useEffect(() => {
    const fn = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  /* GSAP scroll animations */
  useEffect(() => {
    const ctx = gsap.context(() => {
      /* features bar */
      gsap.fromTo(featuresRef.current?.querySelectorAll('.ft-pill') || [],
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: featuresRef.current, start: 'top 88%' } }
      )
      /* columns */
      gsap.fromTo(colsRef.current?.children || [],
        { opacity: 0, y: 32 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: colsRef.current, start: 'top 85%' } }
      )
      /* bottom bar */
      gsap.fromTo(bottomRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.6, ease: 'power2.out',
          scrollTrigger: { trigger: bottomRef.current, start: 'top 95%' } }
      )
    }, footerRef)
    return () => ctx.revert()
  }, [])

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (!email) return
    setSubscribed(true)
    setEmail('')
    setTimeout(() => setSubscribed(false), 3500)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Outfit:wght@300;400;500;600&display=swap');
        .ft-root     { font-family:'Outfit',sans-serif; }
        .ft-display  { font-family:'Syne',sans-serif; }

        .ft-link { transition:color .2s, gap .2s; }

        @keyframes ft-shimmer {
          0%   { background-position:-500px 0; }
          100% { background-position: 500px 0; }
        }

        @keyframes ft-spin { to { transform:rotate(360deg); } }
        .ft-spin-slow { animation:ft-spin 20s linear infinite; }

        @keyframes ft-float {
          0%,100% { transform:translateY(0); }
          50%     { transform:translateY(-8px); }
        }
        .ft-float { animation:ft-float 4s ease-in-out infinite; }

        .ft-input:focus { outline:none; }
        .ft-sub-btn {
          transition:transform .18s, box-shadow .18s, background .2s;
        }
        .ft-sub-btn:hover {
          transform:translateY(-2px);
          box-shadow:0 8px 28px rgba(22,163,74,.4);
        }
        .ft-sub-btn:active { transform:scale(.95); }

        .ft-social {
          transition:transform .2s, box-shadow .2s;
        }
        .ft-social:hover {
          transform:translateY(-3px) scale(1.12);
        }

        .ft-scroll-btn {
          transition:transform .2s, opacity .3s, box-shadow .2s;
        }
        .ft-scroll-btn:hover {
          transform:translateY(-3px);
          box-shadow:0 12px 32px rgba(22,163,74,.45);
        }
      `}</style>

      <footer ref={footerRef} className="ft-root relative w-full overflow-hidden" style={{
        background:'linear-gradient(170deg,#0d1117 0%,#0f1923 40%,#0d1117 100%)',
      }}>

        {/* ── TOP GRADIENT LINE ── */}
        <div className="w-full h-px" style={{
          background:'linear-gradient(90deg,transparent,#16a34a,#22c55e,#16a34a,transparent)',
        }}/>

        {/* ── BG EFFECTS ── */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* dot grid */}
          <div className="absolute inset-0 opacity-[0.04]" style={{
            backgroundImage:'radial-gradient(circle,rgba(255,255,255,.6) 1px,transparent 1px)',
            backgroundSize:'36px 36px',
          }}/>
          {/* large orbs */}
          <div className="absolute rounded-full opacity-10" style={{
            width:600, height:600, top:-200, left:-150,
            background:'radial-gradient(circle,#16a34a 0%,transparent 70%)',
            filter:'blur(60px)',
          }}/>
          <div className="absolute rounded-full opacity-8" style={{
            width:500, height:500, bottom:-150, right:-100,
            background:'radial-gradient(circle,#0ea5e9 0%,transparent 70%)',
            filter:'blur(60px)',
          }}/>
          {/* spinning dashed ring */}
          <div className="ft-spin-slow absolute rounded-full opacity-10" style={{
            width:700, height:700,
            bottom:-250, right:-200,
            border:'1px dashed #16a34a',
          }}/>
        </div>

        {/* ══ FEATURES BAR ══ */}
        <div ref={featuresRef} className="relative z-10 border-b border-white/5">
          <div className="w-full max-w-[1520px] mx-auto px-4 md:px-10 xl:px-16 py-7">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              {FEATURES.map((f, i) => <FeaturePill key={f.label} f={f} i={i}/>)}
            </div>
          </div>
        </div>

        {/* ══ MAIN COLUMNS ══ */}
        <div className="relative z-10 w-full max-w-[1520px] mx-auto px-4 md:px-10 xl:px-16 py-14 md:py-18">
          <div ref={colsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-10 md:gap-12">

            {/* ── Col 1: Brand (spans 2) ── */}
            <div className="lg:col-span-2">
              {/* Logo */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-extrabold text-xl shadow-lg"
                  style={{ background:'linear-gradient(135deg,#22c55e,#16a34a)', boxShadow:'0 6px 24px rgba(34,197,94,.35)' }}>
                  G
                </div>
                <div>
                  <span className="ft-display block text-white font-extrabold text-2xl tracking-tight leading-none">GOGO</span>
                  <span className="text-green-500 text-[10px] font-semibold uppercase tracking-[.2em]">Grocery</span>
                </div>
              </div>

              <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-xs">
                India's trusted platform for farm-fresh groceries, organic produce & daily essentials — delivered fast, always fresh.
              </p>

              {/* Contact details */}
              <div className="space-y-3">
                {[
                  { icon:<FaMapMarkerAlt size={12}/>, text:'Nx-One, Noida, UP', color:'#4ade80' },
                  { icon:<FaPhone size={12}/>,        text:'+91 74171 62939',   color:'#60a5fa' },
                  { icon:<FaEnvelope size={12}/>,     text:'support@gogo.com',  color:'#c084fc' },
                ].map(c => (
                  <div key={c.text} className="group flex items-center gap-3 cursor-pointer">
                    <span
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-white flex-shrink-0 transition-all duration-200 group-hover:scale-110"
                      style={{ background:`${c.color}22`, border:`1px solid ${c.color}44`, color:c.color }}
                    >
                      {c.icon}
                    </span>
                    <span className="text-gray-500 text-xs group-hover:text-gray-200 transition-colors duration-200">{c.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Col 2: Quick Links ── */}
            <div className="lg:col-span-1">
              <FooterLinks title="Quick Links" links={QUICK}   accent="#22c55e"/>
            </div>

            {/* ── Col 3: Support ── */}
            <div className="lg:col-span-1">
              <FooterLinks title="Support"     links={SUPPORT} accent="#38bdf8"/>
            </div>

            {/* ── Col 4: Legal ── */}
            <div className="lg:col-span-1">
              <FooterLinks title="Legal"       links={LEGAL}   accent="#a78bfa"/>
            </div>

            {/* ── Col 5: Newsletter ── */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2 mb-5">
                <span className="w-1 h-5 rounded-full bg-rose-500"/>
                <h4 className="ft-display text-white font-extrabold text-sm uppercase tracking-[.16em]">Newsletter</h4>
              </div>
              <p className="text-gray-500 text-xs leading-relaxed mb-5">
                Get exclusive deals, fresh arrivals & weekly offers — straight to your inbox.
              </p>

              <form onSubmit={handleSubscribe} className="space-y-3">
                <div className="relative">
                  <FaEnvelope size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600"/>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="ft-input w-full pl-9 pr-4 py-3 rounded-xl text-white placeholder-gray-600 text-sm"
                    style={{
                      background:'rgba(255,255,255,0.05)',
                      border:'1px solid rgba(255,255,255,0.1)',
                      transition:'border .2s',
                    }}
                    onFocus={e  => e.target.style.border='1px solid rgba(34,197,94,.5)'}
                    onBlur={e   => e.target.style.border='1px solid rgba(255,255,255,0.1)'}
                  />
                </div>
                <button
                  type="submit"
                  className="ft-sub-btn w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white text-sm font-bold"
                  style={{ background:subscribed
                    ? 'linear-gradient(135deg,#16a34a,#15803d)'
                    : 'linear-gradient(135deg,#f43f5e,#e11d48)',
                    boxShadow: subscribed
                      ? '0 4px 20px rgba(22,163,74,.35)'
                      : '0 4px 20px rgba(244,63,94,.35)',
                  }}
                >
                  {subscribed
                    ? <><span>✓</span> Subscribed!</>
                    : <><span>Subscribe</span><BsArrowRight size={13}/></>
                  }
                </button>
              </form>
              <p className="text-gray-600 text-[11px] mt-3 flex items-center gap-1">
                <FaShieldAlt size={10} className="text-green-600"/> No spam. Unsubscribe anytime.
              </p>
            </div>

          </div>
        </div>

        {/* ══ MIDDLE DIVIDER ROW ══ */}
        <div className="relative z-10 w-full border-t border-white/5">
          <div className="w-full max-w-[1520px] mx-auto px-4 md:px-10 xl:px-16 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">

              {/* Socials */}
              <div className="flex items-center gap-3">
                <span className="text-gray-600 text-xs font-bold uppercase tracking-widest hidden sm:block">Follow</span>
                <div className="w-px h-4 bg-white/10 hidden sm:block"/>
                <div className="flex gap-2.5">
                  {SOCIALS.map(s => (
                    <a
                      key={s.label}
                      href={s.href}
                      aria-label={s.label}
                      className="ft-social w-9 h-9 rounded-xl flex items-center justify-center text-white"
                      style={{
                        background:`linear-gradient(135deg,${s.from},${s.to})`,
                        boxShadow:`0 4px 14px ${s.from}44`,
                      }}
                    >
                      {s.icon}
                    </a>
                  ))}
                </div>
              </div>

              {/* Payment methods */}
              <div className="flex items-center gap-4">
                <span className="text-gray-600 text-xs font-bold uppercase tracking-widest hidden sm:block">Pay with</span>
                <div className="w-px h-4 bg-white/10 hidden sm:block"/>
                <div className="flex items-center gap-2.5">
                  {[
                    { icon:<FaCreditCard size={17}/>, label:'Card',      color:'#22c55e' },
                    { icon:<FaGooglePay  size={17}/>, label:'GPay',      color:'#60a5fa' },
                    { icon:<FaApple     size={17}/>, label:'Apple Pay', color:'#e2e8f0' },
                  ].map(p => (
                    <div
                      key={p.label}
                      title={p.label}
                      className="w-10 h-10 rounded-xl flex items-center justify-center cursor-default transition-all duration-200 hover:scale-110"
                      style={{
                        background:`${p.color}14`,
                        border:`1px solid ${p.color}30`,
                        color: p.color,
                      }}
                    >
                      {p.icon}
                    </div>
                  ))}
                  <span className="text-gray-600 text-xs">& more</span>
                </div>
              </div>

              {/* App store badges */}
              <div className="hidden xl:flex items-center gap-2">
                {['App Store','Google Play'].map(a => (
                  <button
                    key={a}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-white transition-all duration-200 hover:scale-105"
                    style={{ background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.1)' }}
                  >
                    {a === 'App Store' ? <FaApple size={14}/> : <FaGooglePay size={14}/>}
                    {a}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ══ BOTTOM BAR ══ */}
        <div ref={bottomRef} className="relative z-10 w-full border-t border-white/5 opacity-0">
          <div className="w-full max-w-[1520px] mx-auto px-4 md:px-10 xl:px-16 py-5">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <p className="text-gray-600 text-xs">
                © {year}{' '}
                <span className="ft-display text-white font-bold">GOGO Grocery</span>
                {' '}— All rights reserved. Made with{' '}
                <span className="text-rose-500">♥</span> in India
              </p>
              <div className="flex gap-4 text-[11px] text-gray-600">
                {['Sitemap','Accessibility','Security'].map(l => (
                  <a key={l} href="#" className="hover:text-gray-200 transition-colors duration-150">{l}</a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ══ SCROLL TO TOP ══ */}
        <button
          onClick={() => window.scrollTo({ top:0, behavior:'smooth' })}
          className="ft-scroll-btn fixed bottom-8 right-6 z-50 w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-xl"
          style={{
            background:'linear-gradient(135deg,#22c55e,#16a34a)',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            pointerEvents: visible ? 'all' : 'none',
            transition:'opacity .3s, transform .3s, box-shadow .2s',
            boxShadow:'0 6px 24px rgba(34,197,94,.45)',
          }}
          aria-label="Scroll to top"
        >
          <HiArrowUp size={18}/>
        </button>

      </footer>
    </>
  )
}