'use client'
import React, { useEffect, useRef } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* ─── Card data ─────────────────────────────────── */
const BANNERS = [
  {
    tag:        'Only This Week',
    title:      'Best Quality',
    titleBold:  'Products',
    sub:        'A family place for grocery',
    img:        '/b1.png',
    alt:        'Juice',
    href:       '/products',
    bg:         'linear-gradient(135deg,#fff7ed 0%,#ffedd5 60%,#fed7aa 100%)',
    tagColor:   '#ea580c',
    tagBg:      '#fff7ed',
    accentLine: '#fb923c',
    ctaColor:   '#ea580c',
    imgGlow:    'rgba(251,146,60,0.30)',
    badge:      '🔥 30% OFF',
    badgeBg:    '#ea580c',
    dot1: '#fed7aa', dot2: '#fb923c',
  },
  {
    tag:        'Flash Deal',
    title:      'Exciting Grocery',
    titleBold:  'Shopping',
    sub:        'Shine your morning ritual',
    img:        '/b2.png',
    alt:        'Popcorn',
    href:       '/products',
    bg:         'linear-gradient(135deg,#faf5ff 0%,#f3e8ff 60%,#e9d5ff 100%)',
    tagColor:   '#9333ea',
    tagBg:      '#faf5ff',
    accentLine: '#c084fc',
    ctaColor:   '#9333ea',
    imgGlow:    'rgba(192,132,252,0.30)',
    badge:      '⚡ BUY 2 GET 1',
    badgeBg:    '#9333ea',
    dot1: '#e9d5ff', dot2: '#c084fc',
  },
  {
    tag:        'Special Offer',
    title:      'Fresh & Organic',
    titleBold:  'Products',
    sub:        'Get the best deals today',
    img:        '/b3.png',
    alt:        'Organic',
    href:       '/products',
    bg:         'linear-gradient(135deg,#f0fdf4 0%,#dcfce7 60%,#bbf7d0 100%)',
    tagColor:   '#16a34a',
    tagBg:      '#f0fdf4',
    accentLine: '#4ade80',
    ctaColor:   '#16a34a',
    imgGlow:    'rgba(74,222,128,0.30)',
    badge:      '🌿 ORGANIC',
    badgeBg:    '#16a34a',
    dot1: '#bbf7d0', dot2: '#4ade80',
  },
]

/* ─── Single card ───────────────────────────────── */
function BannerCard({ b, idx, cardRef }) {
  const imgRef = useRef(null)

  /* floating image */
  useEffect(() => {
    if (!imgRef.current) return
    gsap.to(imgRef.current, {
      y: -12, duration: 2.2 + idx * 0.3,
      ease: 'sine.inOut', yoyo: true, repeat: -1, delay: idx * 0.4,
    })
  }, [idx])

  return (
    <div
      ref={cardRef}
      className="bn-card group relative rounded-3xl overflow-hidden flex flex-col sm:flex-row items-center gap-4 p-6 sm:p-7 md:p-8 min-h-[220px] sm:min-h-[200px]"
      style={{ background: b.bg }}
    >
      {/* Decorative circles */}
      <div className="absolute top-[-30px] right-[-30px] w-32 h-32 rounded-full opacity-40 pointer-events-none"
        style={{ background: b.dot1 }}/>
      <div className="absolute bottom-[-20px] left-[-20px] w-24 h-24 rounded-full opacity-30 pointer-events-none"
        style={{ background: b.dot2 }}/>

      {/* Dot grid pattern */}
      <div className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, ${b.dot2}88 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Noise grain */}
      <div className="absolute inset-0 opacity-20 pointer-events-none rounded-3xl"
        style={{
          backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.05'/%3E%3C/svg%3E")`,
          backgroundSize:'180px',
        }}
      />

      {/* LEFT — Text */}
      <div className="flex-1 relative z-10 flex flex-col gap-3">

        {/* Tag row */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Pill tag */}
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border"
            style={{ color: b.tagColor, background: b.tagBg, borderColor: `${b.accentLine}55` }}
          >
            <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: b.tagColor }}/>
            {b.tag}
          </span>
          {/* Discount badge */}
          <span
            className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-extrabold text-white tracking-wide shadow-md"
            style={{ background: b.badgeBg, boxShadow: `0 4px 12px ${b.imgGlow}` }}
          >
            {b.badge}
          </span>
        </div>

        {/* Headline */}
        <div>
          {/* Accent line */}
          <div className="w-8 h-1 rounded-full mb-2" style={{ background: b.accentLine }}/>
          <h2 className="bn-title text-gray-800 leading-tight">
            <span className="block font-medium text-gray-500 text-base sm:text-lg">{b.title}</span>
            <span
              className="block font-extrabold"
              style={{
                fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)',
                color: b.tagColor,
                letterSpacing: '-0.02em',
              }}
            >
              {b.titleBold}
            </span>
          </h2>
        </div>

        {/* Sub */}
        <p className="text-gray-500 text-sm font-medium leading-snug max-w-[200px]">{b.sub}</p>

        {/* CTA */}
        <Link
          href={b.href}
          className="bn-cta group/btn mt-1 inline-flex items-center gap-2 text-sm font-bold w-fit"
          style={{ color: b.ctaColor }}
        >
          <span
            className="relative overflow-hidden inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-2 transition-all duration-200 group-hover/btn:text-white"
            style={{
              borderColor: b.ctaColor,
              transition: 'background .22s, color .22s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = b.ctaColor; e.currentTarget.style.color = '#fff' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = b.ctaColor }}
          >
            Shop Now
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="transition-transform duration-200 group-hover/btn:translate-x-1">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </span>
        </Link>
      </div>

      {/* RIGHT — Image */}
      <div className="relative flex-shrink-0 flex items-center justify-center w-36 h-36 sm:w-44 sm:h-44 md:w-48 md:h-48">
        {/* Glow disc */}
        <div
          className="absolute inset-2 rounded-full"
          style={{ background: b.imgGlow, filter: 'blur(16px)' }}
        />
        <img
          ref={imgRef}
          src={b.img}
          alt={b.alt}
          className="relative z-10 w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
          style={{ filter: `drop-shadow(0 16px 32px ${b.imgGlow})` }}
        />
      </div>
    </div>
  )
}

/* ─── Main Banner component ─────────────────────── */
export default function Banner() {
  const sectionRef  = useRef(null)
  const headRef     = useRef(null)
  const cardRefs    = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* heading */
      gsap.fromTo(headRef.current,
        { opacity: 0, y: 28 },
        {
          opacity: 1, y: 0, duration: 0.6, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 88%' },
        }
      )
      /* cards stagger */
      gsap.fromTo(cardRefs.current.filter(Boolean),
        { opacity: 0, y: 40, scale: 0.96 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.55, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 82%' },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,800&family=DM+Sans:wght@300;400;500&display=swap');
        .bn-root  { font-family:'DM Sans',sans-serif; }
        .bn-title { font-family:'Bricolage Grotesque',sans-serif; }

        .bn-card {
          transition: transform .28s cubic-bezier(.22,1,.36,1), box-shadow .28s;
          will-change: transform;
        }
        .bn-card:hover {
          transform: translateY(-4px) scale(1.01);
          box-shadow: 0 24px 60px rgba(0,0,0,.10);
        }
      `}</style>

      <section
        ref={sectionRef}
        className="bn-root w-full bg-white py-10 md:py-14"
      >
        <div className="w-full max-w-[1520px] mx-auto px-4 md:px-10 xl:px-16">

          {/* Section label */}
          <div ref={headRef} className="flex items-center justify-between mb-6 md:mb-8 opacity-0">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.22em] text-gray-400 mb-1">
                This Week's Picks
              </p>
              <h2 className="bn-title text-2xl md:text-3xl font-extrabold text-gray-900">
                Exclusive{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-purple-500 to-green-500">
                  Deals
                </span>
              </h2>
            </div>
            <Link
              href="/products"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-bold text-gray-500 hover:text-gray-800 transition-colors"
            >
              All offers
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
            </Link>
          </div>

          {/* 3-column grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 xl:gap-6">
            {BANNERS.map((b, i) => (
              <BannerCard
                key={b.tag + i}
                b={b}
                idx={i}
                cardRef={el => (cardRefs.current[i] = el)}
              />
            ))}
          </div>

        </div>
      </section>
    </>
  )
}