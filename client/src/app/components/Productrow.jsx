'use client'
import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import Productitem from './Productitem'
import { fetchProducts } from '../utils/api'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { BsArrowRight } from 'react-icons/bs'
import { HiSparkles } from 'react-icons/hi'

gsap.registerPlugin(ScrollTrigger)

/* ─── Section filter logic ───────────────────────── */
const getProductsForRow = (products, title) => {
  const t = String(title || '').toLowerCase()
  if (t.includes('latest'))
    return products.filter(p => String(p.section || '').toLowerCase() === 'latest products')
  if (t.includes('new arrivals'))
    return products.filter(p => String(p.section || '').toLowerCase() === 'new arrivals')
  if (t.includes('breakfast'))
    return products.filter(p => String(p.category || '').toLowerCase() === 'breakfast & bakery')
  return products
}

/* ─── Skeleton card ──────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm">
      <div className="pr-shimmer aspect-square w-full" />
      <div className="p-3 space-y-2">
        <div className="pr-shimmer h-3 w-3/4 rounded-full" />
        <div className="pr-shimmer h-3 w-2/5 rounded-full" />
        <div className="pr-shimmer h-9 w-full rounded-xl mt-3" />
      </div>
    </div>
  )
}

/* ─── Main Component ─────────────────────────────── */
export default function Productrow({ title }) {
  const [products, setProducts] = useState([])
  const [loading,  setLoading]  = useState(true)

  const sectionRef = useRef(null)
  const headRef    = useRef(null)
  const gridRef    = useRef(null)
  const lineRef    = useRef(null)

  /* ── fetch ── */
  useEffect(() => {
    ;(async () => {
      try {
        setLoading(true)
        const data = await fetchProducts()
        setProducts(data)
      } catch (e) {
        console.error('Failed to fetch products:', e)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const visible = useMemo(
    () => getProductsForRow(products, title).slice(0, 6),
    [products, title]
  )

  /* ── mount + scroll trigger ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      /* heading */
      gsap.fromTo(headRef.current,
        { opacity: 0, y: 32 },
        {
          opacity: 1, y: 0, duration: 0.65, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 88%' },
        }
      )
      /* accent line expand */
      gsap.fromTo(lineRef.current,
        { scaleX: 0, opacity: 0 },
        {
          scaleX: 1, opacity: 1, duration: 0.6, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 88%' },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  /* ── grid cards stagger in ── */
  const animateGrid = useCallback(() => {
    if (!gridRef.current) return
    gsap.fromTo(
      gridRef.current.querySelectorAll('.pr-card'),
      { opacity: 0, y: 28, scale: 0.94 },
      { opacity: 1, y: 0,  scale: 1, duration: 0.45, stagger: 0.07, ease: 'power3.out' }
    )
  }, [])

  useEffect(() => { if (!loading) animateGrid() }, [loading, animateGrid])

  /* ── title styling helpers ── */
  const isNew     = title?.toLowerCase().includes('new')
  const isLatest  = title?.toLowerCase().includes('latest')
  const isBreakfast = title?.toLowerCase().includes('breakfast')

  const accent = isNew ? '#8b5cf6' : isLatest ? '#f59e0b' : isBreakfast ? '#ec4899' : '#16a34a'
  const accentLight = isNew ? '#f5f3ff' : isLatest ? '#fffbeb' : isBreakfast ? '#fdf2f8' : '#f0fdf4'
  const eyebrow = isNew ? '🆕 New Arrivals' : isLatest ? '⚡ Latest Drops' : isBreakfast ? '☀️ Morning Picks' : '✨ Featured Collection'

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');
        .pr-root { font-family:'Outfit',sans-serif; }

        @keyframes pr-shimmer {
          0%   { background-position:-600px 0; }
          100% { background-position: 600px 0; }
        }
        .pr-shimmer {
          background:linear-gradient(90deg,#f3f4f6 25%,#e9ebec 50%,#f3f4f6 75%);
          background-size:800px 100%;
          animation:pr-shimmer 1.5s infinite;
          border-radius:8px;
        }

        .pr-viewall {
          transition: gap .2s, color .2s, background .2s;
        }
        .pr-viewall:hover { color:white; }
      `}</style>

      <section
        ref={sectionRef}
        className="pr-root w-full py-12 md:py-16"
        style={{ background: `linear-gradient(180deg, ${accentLight}55 0%, #ffffff 40%)` }}
      >
        <div className="w-full max-w-[1520px] mx-auto px-4 md:px-10 xl:px-16">

          {/* ── Header ── */}
          <div
            ref={headRef}
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 md:mb-10 opacity-0"
          >
            {/* Left */}
            <div className="flex flex-col gap-2">
              {/* Eyebrow */}
              <span
                className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[.22em] w-fit px-3 py-1.5 rounded-full"
                style={{ color: accent, background: `${accent}18`, border: `1px solid ${accent}33` }}
              >
                {eyebrow}
              </span>

              {/* Title + animated underline */}
              <div className="relative">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
                  {title}
                </h2>
                <div
                  ref={lineRef}
                  className="mt-1.5 h-1 w-16 rounded-full origin-left"
                  style={{ background: `linear-gradient(90deg,${accent},${accent}44)`, opacity: 0 }}
                />
              </div>

              <p className="text-gray-400 text-sm font-medium">
                Handpicked just for you — updated daily
              </p>
            </div>

            {/* Right: View All */}
            <Link
              href="/products"
              className="pr-viewall group inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold border-2 transition-all duration-200 hover:scale-105 active:scale-95 shrink-0 self-start sm:self-auto"
              style={{
                color: accent,
                borderColor: accent,
                background: 'white',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = accent; e.currentTarget.style.color = '#fff' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'white';  e.currentTarget.style.color = accent }}
            >
              View All
              <BsArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1"/>
            </Link>
          </div>

          {/* ── Loading skeletons ── */}
          {loading && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-5">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i}/>)}
            </div>
          )}

          {/* ── Empty state ── */}
          {!loading && visible.length === 0 && (
            <div
              className="flex flex-col items-center justify-center py-16 rounded-3xl border-2 border-dashed text-center gap-3"
              style={{ borderColor: `${accent}44`, background: `${accent}08` }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
                style={{ background: `${accent}15` }}
              >
                📦
              </div>
              <div>
                <p className="font-bold text-gray-700">No products yet</p>
                <p className="text-gray-400 text-sm mt-0.5">Check back soon for new items</p>
              </div>
              <Link
                href="/products"
                className="mt-1 px-5 py-2 rounded-full text-white text-sm font-bold transition-all hover:scale-105 active:scale-95"
                style={{ background: accent, boxShadow: `0 4px 16px ${accent}44` }}
              >
                Browse All Products
              </Link>
            </div>
          )}

          {/* ── Product grid ── */}
          {!loading && visible.length > 0 && (
            <>
              <div
                ref={gridRef}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-5"
              >
                {visible.map(product => (
                  <div key={product.id} className="pr-card opacity-0">
                    <Productitem {...product} />
                  </div>
                ))}
              </div>

              {/* Bottom CTA */}
              <div className="flex items-center gap-4 mt-10">
                <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${accent}30, transparent)` }}/>
                <Link
                  href="/products"
                  className="group inline-flex items-center gap-2 px-7 py-3 rounded-full text-white text-sm font-bold shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
                  style={{
                    background: `linear-gradient(135deg, ${accent}, ${accent}cc)`,
                    boxShadow: `0 6px 24px ${accent}44`,
                  }}
                >
                  <HiSparkles size={15}/>
                  See All {title}
                  <BsArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1.5"/>
                </Link>
                <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, transparent, ${accent}30)` }}/>
              </div>
            </>
          )}

        </div>
      </section>
    </>
  )
}