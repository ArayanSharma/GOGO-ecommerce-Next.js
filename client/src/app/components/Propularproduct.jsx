'use client'
import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import Productitem from './Productitem'
import { fetchProducts } from '../utils/api'
import { gsap } from 'gsap'
import { HiChevronRight, HiChevronLeft } from 'react-icons/hi'
import { BsArrowRight } from 'react-icons/bs'

/* ─── Tabs ──────────────────────────────────────── */
const TABS = [
  { label: 'All',                 emoji: '✨', color: '#16a34a' },
  { label: 'Fruits & Vegetables', emoji: '🥦', color: '#15803d' },
  { label: 'Meat & Seafood',      emoji: '🥩', color: '#be123c' },
  { label: 'Breakfast & Bakery',  emoji: '🥐', color: '#b45309' },
  { label: 'Beverages',           emoji: '🧃', color: '#1d4ed8' },
  { label: 'Bread & Bakery',      emoji: '🍞', color: '#92400e' },
  { label: 'Frozen Food',         emoji: '🧊', color: '#0e7490' },
  { label: 'Biscuits & Snacks',   emoji: '🍪', color: '#7e22ce' },
  { label: 'Baby & Pregnancy',    emoji: '🍼', color: '#be185d' },
  { label: 'Healthcare',          emoji: '💊', color: '#0f766e' },
  { label: 'Grocery & Staples',   emoji: '🛒', color: '#c2410c' },
]

/* ─── Skeleton ──────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm">
      <div className="pp-shimmer h-44 w-full" />
      <div className="p-3 space-y-2.5">
        <div className="pp-shimmer h-3 w-2/3 rounded-full" />
        <div className="pp-shimmer h-3 w-2/5 rounded-full" />
        <div className="pp-shimmer h-9 w-full rounded-xl mt-2" />
      </div>
    </div>
  )
}

export default function PopularProducts() {
  const [activeTab, setActiveTab] = useState(0)
  const [products,  setProducts]  = useState([])
  const [loading,   setLoading]   = useState(true)
  const [tabsCanScrollLeft,  setTabsCanScrollLeft]  = useState(false)
  const [tabsCanScrollRight, setTabsCanScrollRight] = useState(true)

  const sectionRef    = useRef(null)
  const headRef       = useRef(null)
  const tabsWrapRef   = useRef(null)
  const tabsScrollRef = useRef(null)
  const indicatorRef  = useRef(null)
  const gridRef       = useRef(null)
  const tabEls        = useRef([])

  /* ── fetch ── */
  useEffect(() => {
    ;(async () => {
      try {
        setLoading(true)
        const data = await fetchProducts()
        setProducts(data)
      } catch (e) { console.error(e) }
      finally { setLoading(false) }
    })()
  }, [])

  /* ── filtered list ── */
  const visible = useMemo(() => {
    const cat = TABS[activeTab].label
    const list = cat === 'All'
      ? products
      : products.filter(p => String(p.category || '').toLowerCase() === cat.toLowerCase())
    return list.slice(0, 10)
  }, [products, activeTab])

  /* ── mount animation ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headRef.current,
        { opacity: 0, y: 36 },
        { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out' }
      )
      gsap.fromTo(tabsWrapRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, delay: 0.2, ease: 'power3.out' }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  /* ── grid card animation ── */
  const animateGrid = useCallback(() => {
    if (!gridRef.current) return
    gsap.fromTo(gridRef.current.querySelectorAll('.pp-card'),
      { opacity: 0, y: 28, scale: 0.94 },
      { opacity: 1, y: 0,  scale: 1, duration: 0.42, stagger: 0.05, ease: 'power3.out' }
    )
  }, [])

  useEffect(() => { if (!loading) animateGrid() }, [visible, loading, animateGrid])

  /* ── indicator position ── */
  const moveIndicator = useCallback((idx) => {
    const el = tabEls.current[idx]
    const scroll = tabsScrollRef.current
    if (!el || !indicatorRef.current || !scroll) return
    gsap.to(indicatorRef.current, {
      x: el.offsetLeft,
      width: el.offsetWidth,
      duration: 0.3, ease: 'power2.inOut',
    })
  }, [])

  useEffect(() => { moveIndicator(activeTab) }, [activeTab, moveIndicator])

  /* ── scroll arrows visibility ── */
  const checkScroll = useCallback(() => {
    const el = tabsScrollRef.current
    if (!el) return
    setTabsCanScrollLeft(el.scrollLeft > 4)
    setTabsCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }, [])

  useEffect(() => {
    const el = tabsScrollRef.current
    if (!el) return
    el.addEventListener('scroll', checkScroll, { passive: true })
    checkScroll()
    return () => el.removeEventListener('scroll', checkScroll)
  }, [checkScroll])

  const scrollTabs = (dir) => {
    tabsScrollRef.current?.scrollBy({ left: dir * 200, behavior: 'smooth' })
  }

  const handleTab = (i) => {
    if (i === activeTab) return
    setActiveTab(i)
    tabEls.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }

  const activeColor = TABS[activeTab].color

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');
        .pp-root { font-family:'Outfit',sans-serif; }

        @keyframes pp-shimmer {
          0%   { background-position:-700px 0; }
          100% { background-position: 700px 0; }
        }
        .pp-shimmer {
          background:linear-gradient(90deg,#f0f0f0 25%,#e4e4e4 50%,#f0f0f0 75%);
          background-size:900px 100%;
          animation:pp-shimmer 1.5s infinite;
          border-radius:8px;
        }

        .pp-tabs-scroll { -ms-overflow-style:none; scrollbar-width:none; }
        .pp-tabs-scroll::-webkit-scrollbar { display:none; }

        .pp-tab {
          position:relative; z-index:10;
          transition: color .22s ease;
          white-space:nowrap;
        }
        .pp-tab.is-active  { font-weight:700; }
        .pp-tab:not(.is-active) { color:#94a3b8; }
        .pp-tab:not(.is-active):hover { color:#475569; }

        .pp-scroll-btn {
          transition:opacity .2s, transform .15s;
        }
        .pp-scroll-btn:hover { transform:scale(1.1); }
        .pp-scroll-btn:active { transform:scale(.9); }

        .pp-cta {
          transition:box-shadow .2s, transform .15s;
        }
        .pp-cta:hover {
          box-shadow:0 10px 30px rgba(22,163,74,.35);
          transform:translateY(-2px);
        }
        .pp-cta:active { transform:scale(.96); }

        @keyframes pp-bounce {
          0%,100% { transform:translateY(0); }
          50%     { transform:translateY(-3px); }
        }
        .pp-arrow-bounce { animation:pp-bounce 1.2s ease-in-out infinite; }
      `}</style>

      <section
        ref={sectionRef}
        className="pp-root w-full"
        style={{ background: 'linear-gradient(180deg,#f8fffe 0%,#ffffff 60%,#f8fffe 100%)' }}
      >

        {/* ══ HEADER BAND ══ */}
        <div
          ref={headRef}
          className="w-full px-4 md:px-10 xl:px-16 pt-14 pb-6 opacity-0"
        >
          <div className="max-w-[1520px] mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-4">

            {/* Left */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">🔥</span>
                <p className="text-xs font-extrabold uppercase tracking-[.22em] text-green-600">
                  Trending Now
                </p>
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
                Popular{' '}
                <span
                  className="relative inline-block"
                  style={{ color: activeColor, transition: 'color .4s' }}
                >
                  Products
                  {/* underline accent */}
                  <svg className="absolute -bottom-1 left-0 w-full" height="6" viewBox="0 0 200 6" preserveAspectRatio="none">
                    <path d="M0 5 Q50 0 100 5 Q150 10 200 5" stroke={activeColor} strokeWidth="2.5" fill="none" opacity="0.5"/>
                  </svg>
                </span>
              </h2>
              <p className="text-gray-400 text-sm mt-2">
                Handpicked bestsellers — fresh deals every day
              </p>
            </div>

            {/* Right: View All */}
            <Link
              href="/products"
              className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-2 text-sm font-bold transition-all duration-200 hover:scale-105 active:scale-95 shrink-0 self-start sm:self-auto"
              style={{
                borderColor: activeColor,
                color: activeColor,
                transition: 'border-color .4s, color .4s',
              }}
            >
              View All Products
              <BsArrowRight size={15} className="pp-arrow-bounce"/>
            </Link>
          </div>
        </div>

        {/* ══ TAB BAR — full width ══ */}
        <div
          ref={tabsWrapRef}
          className="w-full border-y border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-30 opacity-0"
          style={{ boxShadow:'0 1px 0 #f1f5f9, 0 2px 12px rgba(0,0,0,0.04)' }}
        >
          <div className="max-w-[1520px] mx-auto relative flex items-center">

            {/* Left arrow */}
            {tabsCanScrollLeft && (
              <button
                className="pp-scroll-btn absolute left-0 z-20 flex items-center justify-center w-10 h-full bg-gradient-to-r from-white via-white to-transparent shrink-0"
                onClick={() => scrollTabs(-1)}
              >
                <span className="w-8 h-8 rounded-full bg-white border border-gray-200 shadow flex items-center justify-center text-gray-500">
                  <HiChevronLeft size={16}/>
                </span>
              </button>
            )}

            {/* Scrollable tabs */}
            <div
              ref={tabsScrollRef}
              className="pp-tabs-scroll flex items-center overflow-x-auto relative w-full"
            >
              {/* Sliding background pill */}
              <div
                ref={indicatorRef}
                className="absolute top-1/2 -translate-y-1/2 h-9 rounded-full pointer-events-none z-0"
                style={{
                  background: `${activeColor}14`,
                  border: `1.5px solid ${activeColor}35`,
                  transition: 'background .4s, border-color .4s',
                }}
              />

              {TABS.map((tab, i) => (
                <button
                  key={tab.label}
                  ref={el => (tabEls.current[i] = el)}
                  onClick={() => handleTab(i)}
                  className={`pp-tab flex items-center gap-1.5 px-4 py-4 text-[13px] font-semibold ${
                    activeTab === i ? 'is-active' : ''
                  }`}
                  style={activeTab === i ? { color: activeColor, transition: 'color .4s' } : {}}
                >
                  <span className="text-sm leading-none">{tab.emoji}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Right arrow */}
            {tabsCanScrollRight && (
              <button
                className="pp-scroll-btn absolute right-0 z-20 flex items-center justify-center w-10 h-full bg-gradient-to-l from-white via-white to-transparent shrink-0"
                onClick={() => scrollTabs(1)}
              >
                <span className="w-8 h-8 rounded-full bg-white border border-gray-200 shadow flex items-center justify-center text-gray-500">
                  <HiChevronRight size={16}/>
                </span>
              </button>
            )}
          </div>
        </div>

        {/* ══ PRODUCT GRID — full width ══ */}
        <div className="w-full px-4 md:px-10 xl:px-16 py-8 md:py-10">
          <div className="max-w-[1520px] mx-auto">

            {/* Loading */}
            {loading && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-5">
                {Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i}/>)}
              </div>
            )}

            {/* Empty */}
            {!loading && visible.length === 0 && (
              <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-4xl">
                  🛒
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-700">No products in this category</h3>
                  <p className="text-gray-400 text-sm mt-1">Try selecting a different category above</p>
                </div>
                <button
                  onClick={() => setActiveTab(0)}
                  className="px-6 py-2.5 rounded-full text-white text-sm font-bold transition-all hover:scale-105 active:scale-95"
                  style={{ background: activeColor }}
                >
                  Show All Products
                </button>
              </div>
            )}

            {/* Grid */}
            {!loading && visible.length > 0 && (
              <div
                ref={gridRef}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-5"
              >
                {visible.map(product => (
                  <div key={product.id} className="pp-card opacity-0">
                    <Productitem {...product} />
                  </div>
                ))}
              </div>
            )}

            {/* ── Browse all CTA ── */}
            {!loading && visible.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
                {/* divider lines */}
                <div className="hidden sm:block flex-1 h-px bg-gradient-to-r from-transparent to-gray-200"/>

                <Link
                  href="/products"
                  className="pp-cta group inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full text-white text-sm font-bold shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${activeColor}, #22c55e)`,
                    boxShadow: `0 6px 24px ${activeColor}44`,
                    transition: 'background .4s, box-shadow .4s',
                  }}
                >
                  Browse All Products
                  <BsArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1.5"/>
                </Link>

                <div className="hidden sm:block flex-1 h-px bg-gradient-to-l from-transparent to-gray-200"/>
              </div>
            )}
          </div>
        </div>

      </section>
    </>
  )
}