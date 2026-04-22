'use client'
import React, { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'

const SLIDES = [
  {
    id: 0,
    label: 'FRESH PICKS',
    number: '01',
    title: 'Cold Pressed',
    titleBold: 'Juice',
    titleEnd: 'Collection',
    desc: 'Vitamins. Vitality. Life. Straight from nature into your glass every single morning.',
    price: '₹99',
    was: '₹149',
    off: '34% OFF',
    cta: 'Order Now',
    img: '/b1.png',
    alt: 'Juice',
    gradA: '#ff9a3c',
    gradB: '#ff4e50',
    cardBg: 'rgba(255,255,255,0.10)',
    chip: '#fff',
    chipText: '#ff4e50',
  },
  {
    id: 1,
    label: 'SNACK TIME',
    number: '02',
    title: 'Gourmet',
    titleBold: 'Popcorn',
    titleEnd: 'Bites',
    desc: 'Exotic spices. Artisan butter. Crafted for the moments that deserve something special.',
    price: '₹149',
    was: '₹220',
    off: '32% OFF',
    cta: 'Grab Yours',
    img: '/b2.png',
    alt: 'Popcorn',
    gradA: '#f7971e',
    gradB: '#ffd200',
    cardBg: 'rgba(255,255,255,0.10)',
    chip: '#fff',
    chipText: '#c47800',
  },
  {
    id: 2,
    label: 'ORGANIC',
    number: '03',
    title: 'Farm to',
    titleBold: 'Table',
    titleEnd: 'Goodness',
    desc: 'Zero chemicals. Zero compromise. Pure certified organic produce, delivered daily.',
    price: '₹199',
    was: '₹260',
    off: '23% OFF',
    cta: 'Shop Fresh',
    img: '/b3.png',
    alt: 'Organic',
    gradA: '#11998e',
    gradB: '#38ef7d',
    cardBg: 'rgba(255,255,255,0.10)',
    chip: '#fff',
    chipText: '#0a6e62',
  },
]

export default function HeroSlider() {
  const [cur, setCur]       = useState(0)
  const [anim, setAnim]     = useState(false)
  const [pct, setPct]       = useState(0)
  const rafRef              = useRef(null)
  const startRef            = useRef(null)

  const goTo = useCallback((idx) => {
    if (anim || idx === cur) return
    setAnim(true)
    setTimeout(() => {
      setCur(idx)
      setAnim(false)
    }, 420)
  }, [anim, cur])

  const next  = useCallback(() => goTo((cur + 1) % SLIDES.length), [cur, goTo])
  const prev  = useCallback(() => goTo((cur - 1 + SLIDES.length) % SLIDES.length), [cur, goTo])

  useEffect(() => {
    setPct(0); startRef.current = null
    const D = 5500
    const tick = (ts) => {
      if (!startRef.current) startRef.current = ts
      const p = Math.min(((ts - startRef.current) / D) * 100, 100)
      setPct(p)
      if (p < 100) rafRef.current = requestAnimationFrame(tick)
      else next()
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [cur, next])

  const s = SLIDES[cur]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,300;12..96,500;12..96,700;12..96,800&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');

        .hb { font-family:'Plus Jakarta Sans',sans-serif; }
        .hb-display { font-family:'Bricolage Grotesque',sans-serif; }

        @keyframes hb-in {
          from { opacity:0; transform:translateY(36px) scale(.97); }
          to   { opacity:1; transform:translateY(0)    scale(1);   }
        }
        @keyframes hb-out {
          from { opacity:1; transform:translateY(0) scale(1);      }
          to   { opacity:0; transform:translateY(-28px) scale(.96);}
        }
        @keyframes hb-img-in {
          from { opacity:0; transform:scale(.7) rotate(-8deg); }
          60%  {            transform:scale(1.05) rotate(2deg);}
          to   { opacity:1; transform:scale(1)   rotate(0deg);}
        }
        @keyframes hb-float {
          0%,100% { transform:translateY(0) rotate(0deg); }
          50%     { transform:translateY(-20px) rotate(3deg); }
        }
        @keyframes hb-spin {
          to { transform:rotate(360deg); }
        }
        @keyframes hb-pulse {
          0%,100% { transform:scale(1);   opacity:.5; }
          50%     { transform:scale(1.12); opacity:.8; }
        }
        @keyframes hb-shimmer {
          0%   { background-position:-600px 0; }
          100% { background-position: 600px 0; }
        }
        @keyframes hb-ticker {
          from { transform:translateX(0); }
          to   { transform:translateX(-50%); }
        }
        @keyframes hb-streak {
          0%   { transform:translateX(-100%) skewX(-12deg); opacity:0; }
          30%  { opacity:.5; }
          100% { transform:translateX(300%) skewX(-12deg); opacity:0; }
        }
        @keyframes hb-count {
          from { opacity:0; transform:translateY(16px); }
          to   { opacity:1; transform:translateY(0); }
        }

        .hb-content-in  { animation: hb-in  .45s cubic-bezier(.22,1,.36,1) both; }
        .hb-content-out { animation: hb-out .35s cubic-bezier(.22,1,.36,1) both; }
        .hb-img-pop     { animation: hb-img-in .65s cubic-bezier(.22,1,.36,1) both; }
        .hb-float       { animation: hb-float 4.5s ease-in-out infinite; }
        .hb-spin        { animation: hb-spin 22s linear infinite; }
        .hb-pulse       { animation: hb-pulse 2.5s ease-in-out infinite; }
        .hb-ticker      { animation: hb-ticker 20s linear infinite; }
        .hb-streak      { animation: hb-streak 2.8s ease-in-out infinite; }
        .hb-count       { animation: hb-count .4s .1s both; }

        .hb-t1 { animation: hb-in .4s .00s both; }
        .hb-t2 { animation: hb-in .4s .08s both; }
        .hb-t3 { animation: hb-in .4s .16s both; }
        .hb-t4 { animation: hb-in .4s .24s both; }
        .hb-t5 { animation: hb-in .4s .32s both; }

        .hb-glass {
          background: rgba(255,255,255,0.10);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.22);
        }
        .hb-glass-dark {
          background: rgba(0,0,0,0.18);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.10);
        }
        .hb-shimmer-btn {
          background-size: 600px 100%;
          animation: hb-shimmer 2.8s infinite linear;
        }
      `}</style>

      <section className="hb relative w-full overflow-hidden" style={{ height:'clamp(560px,88vh,720px)', minHeight:560 }}>

        {/* ── FULL BLEED GRADIENT BG ── */}
        <div
          className="absolute inset-0 transition-all duration-700"
          style={{ background:`linear-gradient(135deg, ${s.gradA} 0%, ${s.gradB} 100%)` }}
        />

        {/* Noise texture */}
        <div className="absolute inset-0 opacity-30 pointer-events-none" style={{
          backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='f'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23f)' opacity='0.08'/%3E%3C/svg%3E")`,
          backgroundSize:'256px',
        }}/>

        {/* Large bg circle */}
        <div className="hb-pulse absolute rounded-full pointer-events-none" style={{
          width:700, height:700,
          right:-200, top:'50%', marginTop:-350,
          background:'rgba(255,255,255,0.08)',
        }}/>
        <div className="absolute rounded-full pointer-events-none" style={{
          width:400, height:400,
          left:-100, bottom:-150,
          background:'rgba(0,0,0,0.08)',
        }}/>

        {/* Spinning dashed ring */}
        <div className="hb-spin absolute pointer-events-none" style={{
          width:520, height:520,
          right:-80, top:'50%', marginTop:-260,
          border:'1.5px dashed rgba(255,255,255,0.18)',
          borderRadius:'50%',
        }}/>

        {/* Light streak */}
        <div className="hb-streak absolute pointer-events-none" style={{
          width:120, height:'200%', top:'-50%', left:0,
          background:'rgba(255,255,255,0.12)',
        }}/>

        {/* ── CONTENT WRAPPER ── */}
        <div
          key={cur}
          className={`relative z-10 h-full flex flex-col md:flex-row items-center max-w-7xl mx-auto px-6 md:px-16 gap-8 ${anim ? 'hb-content-out' : 'hb-content-in'}`}
          style={{ paddingBottom:80 }}
        >

          {/* LEFT */}
          <div className="flex-1 flex flex-col gap-6 pt-10 md:pt-0">

            {/* Label chip */}
            <div className="hb-t1">
              <span className="hb-glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold tracking-[0.18em] uppercase text-white">
                <span className="w-1.5 h-1.5 rounded-full bg-white inline-block" style={{ boxShadow:'0 0 6px #fff' }}/>
                {s.label}
              </span>
            </div>

            {/* Big headline */}
            <div className="hb-t2">
              <h1 className="hb-display text-white leading-none" style={{ fontSize:'clamp(3rem,7.5vw,6rem)', letterSpacing:'-0.03em' }}>
                <span className="block font-light opacity-80">{s.title}</span>
                <span className="block font-extrabold" style={{ WebkitTextStroke:'2px rgba(255,255,255,0.15)', paintOrder:'stroke fill' }}>
                  {s.titleBold}
                </span>
                <span className="block font-medium opacity-60" style={{ fontSize:'0.55em' }}>{s.titleEnd}</span>
              </h1>
            </div>

            {/* Desc */}
            <p className="hb-t3 text-white/70 font-light leading-relaxed max-w-sm" style={{ fontSize:'1rem' }}>
              {s.desc}
            </p>

            {/* Price + off badge */}
            <div className="hb-t4 flex items-center gap-4 flex-wrap">
              <div className="flex items-baseline gap-2">
                <span className="hb-display text-white font-extrabold" style={{ fontSize:'clamp(2rem,4vw,3rem)' }}>{s.price}</span>
                <span className="text-white/40 text-lg line-through">{s.was}</span>
              </div>
              <span className="hb-glass rounded-full px-3 py-1.5 text-xs font-bold text-white tracking-wider uppercase">
                🔥 {s.off}
              </span>
            </div>

            {/* CTA row */}
            <div className="hb-t5 flex items-center gap-4 flex-wrap">
              <Link
                href="/products"
                className="group relative overflow-hidden inline-flex items-center gap-3 rounded-2xl font-semibold text-sm transition-all duration-200 hover:scale-105 active:scale-95"
                style={{
                  padding:'16px 36px',
                  background:'rgba(255,255,255,0.95)',
                  color: s.gradB,
                  boxShadow:'0 16px 48px rgba(0,0,0,0.25)',
                }}
              >
                <span>{s.cta}</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1.5 font-bold text-base">→</span>
                {/* shine sweep */}
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                  style={{ background:'linear-gradient(90deg,transparent,rgba(255,255,255,.4),transparent)', backgroundSize:'200% 100%' }}
                />
              </Link>

              <Link
                href="/products"
                className="hb-glass inline-flex items-center gap-2 rounded-2xl text-white text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95"
                style={{ padding:'16px 28px' }}
              >
                View All
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
              </Link>
            </div>

            {/* Trust badges */}
            <div className="hb-t5 flex items-center gap-5">
              {['🚚 Free Delivery','⭐ 4.9 Rating','🔄 Easy Returns'].map(t => (
                <span key={t} className="text-white/50 text-xs font-medium">{t}</span>
              ))}
            </div>
          </div>

          {/* RIGHT — Product showcase */}
          <div className="relative flex-shrink-0 flex items-center justify-center" style={{ width:'clamp(280px,40vw,480px)', height:'clamp(280px,40vw,480px)' }}>

            {/* Outer glow */}
            <div className="absolute rounded-full" style={{
              width:'85%', height:'85%',
              background:'rgba(255,255,255,0.12)',
              filter:'blur(30px)',
            }}/>

            {/* Glass disc */}
            <div className="hb-glass absolute rounded-full" style={{ width:'78%', height:'78%' }}/>

            {/* Product image */}
            <img
              key={cur}
              src={s.img}
              alt={s.alt}
              className="hb-img-pop hb-float relative z-10 object-contain"
              style={{
                width:'72%', height:'72%',
                filter:'drop-shadow(0 40px 60px rgba(0,0,0,0.35))',
              }}
            />

            {/* Price card — floating bottom left */}
            <div className="hb-glass absolute z-20 rounded-2xl px-4 py-3 flex flex-col gap-0.5"
              style={{ bottom:'8%', left:'-5%', minWidth:120 }}>
              <span className="text-white/60 text-xs">Starting from</span>
              <span className="hb-display text-white font-extrabold text-xl">{s.price}</span>
            </div>

            {/* Rating card — floating top right */}
            <div className="hb-glass absolute z-20 rounded-2xl px-4 py-3 flex items-center gap-2"
              style={{ top:'8%', right:'-5%' }}>
              <span className="text-yellow-300 text-base">★★★★★</span>
              <span className="text-white font-semibold text-sm">4.9</span>
            </div>

            {/* Category dot */}
            <div className="absolute z-20 rounded-full w-12 h-12 flex items-center justify-center hb-glass"
              style={{ top:'38%', right:'-8%' }}>
              <span style={{ fontSize:22 }}>🛒</span>
            </div>
          </div>
        </div>

        {/* ── BOTTOM CONTROLS ── */}
        <div className="absolute bottom-10 left-0 right-0 z-20 flex items-center justify-between px-6 md:px-16">

          {/* Slide number */}
          <div className="hb-count hb-display text-white font-extrabold flex items-end gap-1" key={cur}>
            <span style={{ fontSize:'2.5rem', lineHeight:1 }}>{s.number}</span>
            <span className="text-white/30 text-sm mb-1">/ 03</span>
          </div>

          {/* Dot progress */}
          <div className="flex items-center gap-3">
            {SLIDES.map((_, i) => (
              <button key={i} onClick={() => goTo(i)} className="relative overflow-hidden rounded-full transition-all duration-300"
                style={{ width: i===cur?48:10, height:10, background:'rgba(255,255,255,0.25)' }}>
                {i===cur && (
                  <div style={{
                    position:'absolute', left:0, top:0, height:'100%',
                    width:`${pct}%`, background:'#fff', transition:'none', borderRadius:'inherit',
                  }}/>
                )}
              </button>
            ))}
          </div>

          {/* Arrows */}
          <div className="flex items-center gap-2">
            <button onClick={prev}
              className="hb-glass w-11 h-11 rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-110 active:scale-95">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            </button>
            <button onClick={next}
              className="w-11 h-11 rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-110 active:scale-95"
              style={{ background:'rgba(255,255,255,0.25)', border:'1px solid rgba(255,255,255,0.4)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>

        {/* ── MARQUEE STRIP ── */}
        <div className="absolute bottom-0 left-0 right-0 z-20 overflow-hidden flex" style={{
          height:34, background:'rgba(0,0,0,0.22)', borderTop:'1px solid rgba(255,255,255,0.10)',
        }}>
          <div className="hb-ticker flex items-center whitespace-nowrap">
            {[...Array(8)].map((_, i) => (
              <span key={i} className="inline-flex items-center gap-8 px-8 text-white/60 text-xs font-medium uppercase tracking-widest">
                <span>Free Delivery Above ₹499</span>
                <span className="text-white/20">◆</span>
                <span>100% Organic</span>
                <span className="text-white/20">◆</span>
                <span>50,000+ Customers</span>
                <span className="text-white/20">◆</span>
                <span>Easy Returns</span>
                <span className="text-white/20">◆</span>
              </span>
            ))}
          </div>
        </div>

      </section>
    </>
  )
}
