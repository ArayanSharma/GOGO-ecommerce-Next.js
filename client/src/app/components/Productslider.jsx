'use client'
import React, { useEffect, useState, useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Autoplay } from 'swiper/modules'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Productitem from './Productitem'
import { fetchProducts } from '../utils/api'
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi'
import { BsArrowRight } from 'react-icons/bs'
import Link from 'next/link'

import 'swiper/css'
import 'swiper/css/navigation'

gsap.registerPlugin(ScrollTrigger)

/* ─── Skeleton card ─────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm w-full">
      <div className="ps-shimmer aspect-square w-full" />
      <div className="p-3 space-y-2.5">
        <div className="ps-shimmer h-3 w-3/4 rounded-full" />
        <div className="ps-shimmer h-3 w-2/5 rounded-full" />
        <div className="ps-shimmer h-9 w-full rounded-xl mt-2" />
      </div>
    </div>
  )
}

export default function Productslider() {
  const [products, setProducts] = useState([])
  const [loading,  setLoading]  = useState(true)

  const sectionRef = useRef(null)
  const headRef    = useRef(null)
  const wrapRef    = useRef(null)
  const prevRef    = useRef(null)
  const nextRef    = useRef(null)

  /* ── fetch ── */
  useEffect(() => {
    ;(async () => {
      try {
        setLoading(true)
        const data = await fetchProducts()
        setProducts(data.slice(0, 12))
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  /* ── GSAP entrance ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.65, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 88%' },
        }
      )
      gsap.fromTo(wrapRef.current,
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0, duration: 0.6, delay: 0.15, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 85%' },
        }
      )
      gsap.fromTo([prevRef.current, nextRef.current].filter(Boolean),
        { opacity: 0, scale: 0.6 },
        {
          opacity: 1, scale: 1, duration: 0.4, stagger: 0.08, delay: 0.3,
          ease: 'back.out(1.8)',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 88%' },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [loading])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');
        .ps-root { font-family:'Outfit',sans-serif; }

        @keyframes ps-shimmer {
          0%   { background-position:-700px 0; }
          100% { background-position: 700px 0; }
        }
        .ps-shimmer {
          background: linear-gradient(90deg,#f3f4f6 25%,#e8eaec 50%,#f3f4f6 75%);
          background-size: 900px 100%;
          animation: ps-shimmer 1.6s infinite;
          border-radius: 8px;
        }

        /* hide default swiper arrows */
        .ps-swiper .swiper-button-prev,
        .ps-swiper .swiper-button-next { display:none !important; }

        /* overflow visible so card shadows aren't clipped */
        .ps-swiper { overflow: visible !important; }
        .ps-swiper .swiper-wrapper { padding: 8px 2px 16px; }

        .ps-nav {
          transition: background .2s, transform .15s, box-shadow .2s;
        }
        .ps-nav:hover { transform: scale(1.1); }
        .ps-nav:active { transform: scale(.92); }
        .ps-nav:disabled { opacity:.3; cursor:not-allowed; transform:none; }

        .ps-badge {
          animation: ps-badge-pop .5s cubic-bezier(.22,1,.36,1) both;
        }
        @keyframes ps-badge-pop {
          from { opacity:0; transform:scale(.5) rotate(-10deg); }
          70%  {            transform:scale(1.08) rotate(2deg); }
          to   { opacity:1; transform:scale(1) rotate(0); }
        }
      `}</style>

      <section
        ref={sectionRef}
        className="ps-root w-full py-12 md:py-16"
        style={{ background: 'linear-gradient(180deg,#f8fffe 0%,#ffffff 50%,#f8fffe 100%)' }}
      >
        <div className="w-full max-w-[1520px] mx-auto px-4 md:px-10 xl:px-16">

          {/* ── Header ── */}
          <div
            ref={headRef}
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 opacity-0"
          >
            {/* Left */}
            <div className="flex flex-col gap-2">
              <span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[.22em] w-fit px-3 py-1.5 rounded-full text-green-700 bg-green-50 border border-green-200">
                🛒 Handpicked For You
              </span>
              <div className="relative">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
                  Top{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-400">
                    Selling
                  </span>{' '}
                  Products
                </h2>
                <div className="mt-1.5 h-1 w-16 rounded-full bg-gradient-to-r from-green-500 to-emerald-300 origin-left" />
              </div>
              <p className="text-gray-400 text-sm font-medium">
                Bestsellers customers love — updated every week
              </p>
            </div>

            {/* Right: nav + view all */}
            <div className="flex items-center gap-3 shrink-0">
              {/* Custom prev/next */}
              <button
                ref={prevRef}
                className="ps-nav ps-prev w-10 h-10 rounded-full flex items-center justify-center bg-white border-2 border-gray-200 text-gray-500 hover:border-green-400 hover:text-green-600 shadow-sm opacity-0"
                aria-label="Previous"
              >
                <HiChevronLeft size={20} />
              </button>
              <button
                ref={nextRef}
                className="ps-nav ps-next w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md opacity-0"
                style={{
                  background: 'linear-gradient(135deg,#16a34a,#22c55e)',
                  boxShadow: '0 4px 16px rgba(22,163,74,.35)',
                }}
                aria-label="Next"
              >
                <HiChevronRight size={20} />
              </button>

              <div className="w-px h-8 bg-gray-200 mx-1" />

              <Link
                href="/products"
                className="group inline-flex items-center gap-1.5 text-sm font-bold text-green-600 hover:text-green-700 transition-colors"
              >
                View All
                <BsArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* ── Slider ── */}
          <div ref={wrapRef} className="opacity-0">
            {loading ? (
              /* skeleton row */
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-5">
                {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : (
              <Swiper
                className="ps-swiper"
                modules={[Navigation, Autoplay]}
                slidesPerView={2}
                spaceBetween={12}
                autoplay={{ delay: 3500, disableOnInteraction: false, pauseOnMouseEnter: true }}
                navigation={{ prevEl: '.ps-prev', nextEl: '.ps-next' }}
                breakpoints={{
                  480:  { slidesPerView: 2.4, spaceBetween: 12 },
                  640:  { slidesPerView: 3,   spaceBetween: 14 },
                  768:  { slidesPerView: 3.5, spaceBetween: 16 },
                  1024: { slidesPerView: 4,   spaceBetween: 16 },
                  1280: { slidesPerView: 5,   spaceBetween: 18 },
                  1440: { slidesPerView: 6,   spaceBetween: 20 },
                }}
              >
                {products.map((product, i) => (
                  <SwiperSlide key={product.id}>
                    <div className="relative">
                      {/* Rank badge on first 3 */}
                      {i < 3 && (
                        <div
                          className="ps-badge absolute top-2 left-2 z-20 w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-extrabold shadow-lg"
                          style={{
                            background: i === 0
                              ? 'linear-gradient(135deg,#f59e0b,#d97706)'
                              : i === 1
                              ? 'linear-gradient(135deg,#94a3b8,#64748b)'
                              : 'linear-gradient(135deg,#cd7c2f,#a16207)',
                            boxShadow: i === 0 ? '0 4px 12px rgba(245,158,11,.5)' : 'none',
                          }}
                        >
                          #{i + 1}
                        </div>
                      )}
                      <Productitem {...product} />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>

          {/* ── Bottom CTA ── */}
          {!loading && products.length > 0 && (
            <div className="flex items-center gap-4 mt-10">
              <div className="flex-1 h-px bg-gradient-to-r from-green-100 to-transparent" />
              <Link
                href="/products"
                className="group inline-flex items-center gap-2.5 px-7 py-3 rounded-full text-white text-sm font-bold shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
                style={{
                  background: 'linear-gradient(135deg,#16a34a,#22c55e)',
                  boxShadow: '0 6px 24px rgba(22,163,74,.35)',
                }}
              >
                🛒 Browse All Products
                <BsArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1.5" />
              </Link>
              <div className="flex-1 h-px bg-gradient-to-l from-green-100 to-transparent" />
            </div>
          )}

        </div>
      </section>
    </>
  )
}