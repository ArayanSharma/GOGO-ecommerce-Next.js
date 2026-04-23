'use client'
import React, { useRef, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Autoplay } from 'swiper/modules'
import Link from 'next/link'
import { gsap } from 'gsap'
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi'
import 'swiper/css'
import 'swiper/css/navigation'

const CATEGORIES = [
  { name: 'Fruits & Vegetables', image: '/c1.avif',  emoji: '🥦', color: '#f0fdf4', border: '#bbf7d0', text: '#15803d' },
  { name: 'Meat & Seafood',      image: '/c2.avif',  emoji: '🥩', color: '#fff1f2', border: '#fecdd3', text: '#be123c' },
  { name: 'Breakfast & Bakery',  image: '/c3.webp',  emoji: '🥐', color: '#fffbeb', border: '#fde68a', text: '#b45309' },
  { name: 'Beverages',           image: '/c5.jpg',   emoji: '🧃', color: '#eff6ff', border: '#bfdbfe', text: '#1d4ed8' },
  { name: 'Bread & Bakery',      image: '/c4.jpg',   emoji: '🍞', color: '#fef3c7', border: '#fcd34d', text: '#92400e' },
  { name: 'Frozen Food',         image: '/c6.png',   emoji: '🧊', color: '#ecfeff', border: '#a5f3fc', text: '#0e7490' },
  { name: 'Biscuits & Snacks',   image: '/c7.jpg',   emoji: '🍪', color: '#fdf4ff', border: '#e9d5ff', text: '#7e22ce' },
  { name: 'Baby & Pregnancy',    image: '/c11.png',  emoji: '🍼', color: '#fdf2f8', border: '#f9a8d4', text: '#be185d' },
  { name: 'Healthcare',          image: '/c9.png',   emoji: '💊', color: '#f0fdfa', border: '#99f6e4', text: '#0f766e' },
  { name: 'Grocery & Staples',   image: '/c10.png',  emoji: '🛒', color: '#fff7ed', border: '#fed7aa', text: '#c2410c' },
]

export default function Catslider() {
  const sectionRef  = useRef(null)
  const titleRef    = useRef(null)
  const prevRef     = useRef(null)
  const nextRef     = useRef(null)
  const slidesRef   = useRef([])

  /* ── Mount animations ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      /* title */
      gsap.fromTo(titleRef.current,
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 85%' } }
      )
      /* cards stagger */
      gsap.fromTo(slidesRef.current.filter(Boolean),
        { opacity: 0, y: 32, scale: 0.92 },
        { opacity: 1, y: 0,  scale: 1,
          duration: 0.5, stagger: 0.07, ease: 'power3.out', delay: 0.15 }
      )
      /* nav buttons */
      gsap.fromTo([prevRef.current, nextRef.current],
        { opacity: 0, scale: 0.7 },
        { opacity: 1, scale: 1, duration: 0.4, stagger: 0.08, delay: 0.3, ease: 'back.out(1.6)' }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  /* card hover */
  const onCardEnter = (el) => {
    gsap.to(el, { y: -6, scale: 1.04, duration: 0.28, ease: 'power2.out' })
  }
  const onCardLeave = (el) => {
    gsap.to(el, { y: 0,  scale: 1,    duration: 0.28, ease: 'power2.out' })
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');
        .cs-root { font-family:'Outfit',sans-serif; }

        .cs-card-img {
          transition: transform .4s ease;
        }
        .cs-card:hover .cs-card-img {
          transform: scale(1.1) rotate(-1deg);
        }

        /* hide default swiper arrows */
        .cs-swiper .swiper-button-prev,
        .cs-swiper .swiper-button-next { display:none !important; }

        .cs-nav-btn {
          transition: background .18s, box-shadow .18s, transform .15s;
        }
        .cs-nav-btn:hover {
          box-shadow: 0 6px 20px rgba(21,128,61,.28);
          transform: scale(1.08);
        }
        .cs-nav-btn:active { transform: scale(.93); }

        @keyframes cs-shimmer {
          0%   { background-position: -400px 0; }
          100% { background-position:  400px 0; }
        }
        .cs-skeleton {
          background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
          background-size: 800px 100%;
          animation: cs-shimmer 1.4s infinite;
        }
      `}</style>

      <section ref={sectionRef} className="cs-root w-full bg-white py-10 md:py-14">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">

          {/* ── Section header ── */}
          <div ref={titleRef} className="flex items-end justify-between mb-7 opacity-0">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.2em] text-green-600 mb-1">
                Browse by type
              </p>
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 leading-tight">
                Shop by{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">
                  Category
                </span>
              </h2>
            </div>

            {/* Custom nav buttons */}
            <div className="flex items-center gap-2">
              <button
                ref={prevRef}
                className="cs-nav-btn cs-prev w-10 h-10 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center text-gray-500 hover:border-green-400 hover:text-green-600 shadow-sm opacity-0"
                aria-label="Prev"
              >
                <HiChevronLeft size={20}/>
              </button>
              <button
                ref={nextRef}
                className="cs-nav-btn cs-next w-10 h-10 rounded-full bg-gradient-to-br from-green-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-green-200 opacity-0"
                aria-label="Next"
              >
                <HiChevronRight size={20}/>
              </button>
            </div>
          </div>

          {/* ── Swiper ── */}
          <Swiper
            className="cs-swiper !overflow-visible"
            modules={[Navigation, Autoplay]}
            slidesPerView={2}
            spaceBetween={12}
            autoplay={{ delay: 3200, disableOnInteraction: false, pauseOnMouseEnter: true }}
            navigation={{
              prevEl: '.cs-prev',
              nextEl: '.cs-next',
            }}
            breakpoints={{
              480:  { slidesPerView: 3,   spaceBetween: 12 },
              640:  { slidesPerView: 4,   spaceBetween: 14 },
              900:  { slidesPerView: 5,   spaceBetween: 16 },
              1200: { slidesPerView: 7,   spaceBetween: 16 },
              1400: { slidesPerView: 8,   spaceBetween: 18 },
            }}
          >
            {CATEGORIES.map((cat, i) => (
              <SwiperSlide key={cat.name}>
                <Link href="/products" className="block outline-none">
                  <div
                    ref={el => (slidesRef.current[i] = el)}
                    className="cs-card group flex flex-col items-center gap-3 cursor-pointer opacity-0"
                    onMouseEnter={e => onCardEnter(e.currentTarget)}
                    onMouseLeave={e => onCardLeave(e.currentTarget)}
                  >
                    {/* Image disc */}
                    <div
                      className="relative w-full aspect-square rounded-2xl overflow-hidden flex items-center justify-center shadow-sm border-2 transition-all duration-300 group-hover:shadow-lg"
                      style={{
                        background: cat.color,
                        borderColor: cat.border,
                      }}
                    >
                      {/* Bg circle accent */}
                      <div
                        className="absolute inset-0 rounded-full scale-75 opacity-30"
                        style={{ background: cat.border }}
                      />

                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="cs-card-img relative z-10 w-[72%] h-[72%] object-contain drop-shadow-md"
                      />

                      {/* Hover overlay */}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                        style={{ background: `${cat.border}55` }}
                      />

                      {/* Emoji badge */}
                      <div
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/80 backdrop-blur flex items-center justify-center text-sm shadow-sm border border-white"
                      >
                        {cat.emoji}
                      </div>
                    </div>

                    {/* Label */}
                    <div className="text-center px-1 w-full">
                      <h4
                        className="text-[12px] md:text-[13px] font-bold leading-tight transition-colors duration-200 line-clamp-2"
                        style={{ color: 'inherit' }}
                      >
                        <span className="text-gray-700 group-hover:text-green-700 transition-colors duration-200">
                          {cat.name}
                        </span>
                      </h4>
                      {/* Animated underline */}
                      <div
                        className="mx-auto mt-1 h-0.5 w-0 group-hover:w-8 transition-all duration-300 rounded-full"
                        style={{ background: cat.text }}
                      />
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* ── All Categories pill ── */}
          <div className="flex justify-center mt-8">
            <Link
              href="/products"
              className="group inline-flex items-center gap-2 px-6 py-2.5 rounded-full border-2 border-green-200 text-green-700 text-sm font-bold hover:bg-green-600 hover:text-white hover:border-green-600 transition-all duration-200 hover:shadow-lg hover:shadow-green-200 hover:scale-105 active:scale-95"
            >
              View All Categories
              <HiChevronRight size={16} className="transition-transform duration-200 group-hover:translate-x-1"/>
            </Link>
          </div>

        </div>
      </section>
    </>
  )
}