'use client'
import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react'
import Sidebar from '../components/Sidebar'
import Productitem from '../components/Productitem'
import { fetchProducts } from '../utils/api'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  IoChevronDown, IoSearchOutline, IoCloseCircle,
  IoGridOutline, IoListOutline, IoFilterOutline,
} from 'react-icons/io5'
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi'
import { BsArrowRight } from 'react-icons/bs'

gsap.registerPlugin(ScrollTrigger)

/* ─── Sort options ───────────────────────────────── */
const SORT_OPTIONS = [
  { label: 'Name, A → Z',       value: 'az'    },
  { label: 'Name, Z → A',       value: 'za'    },
  { label: 'Price: Low to High', value: 'price_asc'  },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Top Rated',         value: 'rating' },
]

/* ─── Skeleton card ──────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm">
      <div className="pp-shimmer aspect-square w-full"/>
      <div className="p-3 space-y-2.5">
        <div className="pp-shimmer h-3 w-3/4 rounded-full"/>
        <div className="pp-shimmer h-3 w-2/5 rounded-full"/>
        <div className="pp-shimmer h-9 w-full rounded-xl mt-2"/>
      </div>
    </div>
  )
}

/* ─── Custom Pagination ──────────────────────────── */
function CustomPagination({ page, total, perPage, onChange }) {
  const totalPages = Math.max(1, Math.ceil(total / perPage))
  if (totalPages <= 1) return null

  const getPages = () => {
    const pages = []
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
      return pages
    }
    pages.push(1)
    if (page > 3) pages.push('...')
    for (let i = Math.max(2, page-1); i <= Math.min(totalPages-1, page+1); i++) pages.push(i)
    if (page < totalPages - 2) pages.push('...')
    pages.push(totalPages)
    return pages
  }

  return (
    <div className="flex items-center justify-center gap-1.5 mt-10">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="w-9 h-9 rounded-xl flex items-center justify-center border border-gray-200 text-gray-500 hover:border-green-400 hover:text-green-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <HiChevronLeft size={16}/>
      </button>

      {getPages().map((p, i) =>
        p === '...' ? (
          <span key={`dots-${i}`} className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-semibold transition-all duration-200"
            style={page === p
              ? { background:'linear-gradient(135deg,#16a34a,#22c55e)', color:'#fff', boxShadow:'0 4px 14px rgba(22,163,74,.35)' }
              : { background:'transparent', color:'#6b7280', border:'1px solid #e5e7eb' }
            }
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="w-9 h-9 rounded-xl flex items-center justify-center border border-gray-200 text-gray-500 hover:border-green-400 hover:text-green-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <HiChevronRight size={16}/>
      </button>
    </div>
  )
}

/* ─── Main page ──────────────────────────────────── */
const ITEMS_PER_PAGE = 20

export default function ProductsPage() {
  const pathname = usePathname()

  const [products,    setProducts]    = useState([])
  const [loading,     setLoading]     = useState(true)
  const [searchText,  setSearchText]  = useState('')
  const [sortValue,   setSortValue]   = useState('az')
  const [sortOpen,    setSortOpen]    = useState(false)
  const [viewMode,    setViewMode]    = useState('grid')   // 'grid' | 'list'
  const [currentPage, setCurrentPage] = useState(1)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [filters, setFilters] = useState({
    categories: [], priceRange: [0, 10000], ratings: [],
  })

  const pageRef    = useRef(null)
  const headerRef  = useRef(null)
  const gridRef    = useRef(null)
  const sortRef    = useRef(null)

  const searchQuery = searchText.trim().toLowerCase()

  /* ── read URL search param ── */
  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    setSearchText(params.get('search') || '')
  }, [pathname])

  /* ── fetch ── */
  useEffect(() => {
    ;(async () => {
      try {
        setLoading(true)
        const data = await fetchProducts()
        setProducts(data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  /* ── mount GSAP ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headerRef.current,
        { opacity:0, y:-20 },
        { opacity:1, y:0, duration:.55, ease:'power3.out' }
      )
    }, pageRef)
    return () => ctx.revert()
  }, [])

  /* ── grid stagger when products change ── */
  const animateGrid = useCallback(() => {
    if (!gridRef.current) return
    gsap.fromTo(gridRef.current.querySelectorAll('.pp-card'),
      { opacity:0, y:24, scale:.95 },
      { opacity:1, y:0, scale:1, duration:.4, stagger:.04, ease:'power3.out' }
    )
  }, [])

  useEffect(() => { if (!loading) animateGrid() }, [loading, sortValue, filters, currentPage, animateGrid])

  /* ── close sort on outside click ── */
  useEffect(() => {
    const fn = (e) => { if (sortRef.current && !sortRef.current.contains(e.target)) setSortOpen(false) }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  /* ── filter + sort ── */
  const filteredProducts = useMemo(() => {
    let res = products

    if (searchQuery) res = res.filter(p => {
      const n = String(p.name || p.product || '').toLowerCase()
      const c = String(p.category || '').toLowerCase()
      const s = String(p.section || '').toLowerCase()
      return n.includes(searchQuery) || c.includes(searchQuery) || s.includes(searchQuery)
    })

    if (filters.categories.length > 0)
      res = res.filter(p => filters.categories.some(cat => String(p.category||'').includes(cat) || cat.includes(String(p.category||''))))

    res = res.filter(p => {
      const pr = Number(p.price || 0)
      return pr >= filters.priceRange[0] && pr <= filters.priceRange[1]
    })

    if (filters.ratings.length > 0)
      res = res.filter(p => filters.ratings.some(r => Math.ceil(Number(p.rating||0)) >= r))

    return res
  }, [products, searchQuery, filters])

  const sortedProducts = useMemo(() => {
    const items = [...filteredProducts]
    switch (sortValue) {
      case 'za':         return items.sort((a,b) => String(b.name||'').localeCompare(String(a.name||'')))
      case 'price_asc':  return items.sort((a,b) => Number(a.price||0) - Number(b.price||0))
      case 'price_desc': return items.sort((a,b) => Number(b.price||0) - Number(a.price||0))
      case 'rating':     return items.sort((a,b) => Number(b.rating||0) - Number(a.rating||0))
      default:           return items.sort((a,b) => String(a.name||'').localeCompare(String(b.name||'')))
    }
  }, [filteredProducts, sortValue])

  /* ── paginate ── */
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return sortedProducts.slice(start, start + ITEMS_PER_PAGE)
  }, [sortedProducts, currentPage])

  const handlePageChange = (p) => {
    setCurrentPage(p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const activeSortLabel = SORT_OPTIONS.find(o => o.value === sortValue)?.label || 'Sort'

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
          background:linear-gradient(90deg,#f3f4f6 25%,#e8eaec 50%,#f3f4f6 75%);
          background-size:900px 100%; animation:pp-shimmer 1.5s infinite;
          border-radius:8px;
        }

        .pp-sort-item {
          transition:background .15s,padding-left .2s,color .15s;
        }
        .pp-sort-item:hover { background:#f0fdf4; padding-left:1.1rem; color:#15803d; }
        .pp-sort-item.active { background:#f0fdf4; color:#15803d; font-weight:700; }

        .pp-view-btn { transition:background .18s,color .18s; }
        .pp-view-btn.active { background:#16a34a; color:#fff; }
        .pp-view-btn:not(.active) { color:#6b7280; }
        .pp-view-btn:not(.active):hover { background:#f0fdf4; color:#16a34a; }
      `}</style>

      <div ref={pageRef} className="pp-root w-full min-h-screen bg-gray-50/50">

        {/* ── PAGE HEADER ── */}
        <div
          ref={headerRef}
          className="w-full bg-white border-b border-gray-100"
          style={{ boxShadow:'0 1px 12px rgba(0,0,0,0.05)' }}
        >
          <div className="w-full max-w-[1520px] mx-auto px-4 md:px-10 xl:px-16 py-4 md:py-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">

              {/* Left: breadcrumb + count */}
              <div>
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-1 font-medium">
                  <Link href="/" className="hover:text-green-600 transition-colors">Home</Link>
                  <span>/</span>
                  <span className="text-gray-600 font-semibold">Products</span>
                </div>
                <div className="flex items-center gap-3">
                  <h1 className="text-xl font-extrabold text-gray-900">
                    {searchQuery
                      ? <>Results for <span className="text-green-600">"{searchText}"</span></>
                      : 'All Products'
                    }
                  </h1>
                  {!loading && (
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-green-50 text-green-700 border border-green-200">
                      {sortedProducts.length} items
                    </span>
                  )}
                </div>
              </div>

              {/* Right: controls */}
              <div className="flex items-center gap-2 flex-wrap">

                {/* Mobile sidebar toggle */}
                <button
                  onClick={() => setSidebarOpen(v => !v)}
                  className="lg:hidden flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-green-50 hover:border-green-300 hover:text-green-700 transition-all"
                >
                  <IoFilterOutline size={16}/> Filters
                </button>

                {/* View toggle */}
                <div className="flex items-center rounded-xl border border-gray-200 overflow-hidden p-0.5 bg-white">
                  {[{icon:<IoGridOutline size={16}/>, mode:'grid'}, {icon:<IoListOutline size={16}/>, mode:'list'}].map(v => (
                    <button key={v.mode} onClick={() => setViewMode(v.mode)}
                      className={`pp-view-btn w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${viewMode===v.mode?'active':''}`}>
                      {v.icon}
                    </button>
                  ))}
                </div>

                {/* Sort dropdown */}
                <div ref={sortRef} className="relative">
                  <button
                    onClick={() => setSortOpen(v => !v)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:border-green-300 hover:text-green-700 transition-all"
                  >
                    <span className="hidden sm:inline max-w-[130px] truncate">{activeSortLabel}</span>
                    <span className="sm:hidden">Sort</span>
                    <IoChevronDown size={15} className={`transition-transform duration-200 ${sortOpen?'rotate-180':''}`}/>
                  </button>

                  {sortOpen && (
                    <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl shadow-black/8 border border-gray-100 p-1.5 z-50">
                      <p className="px-3 pt-1.5 pb-1 text-[10px] font-extrabold text-gray-400 uppercase tracking-[.18em]">Sort By</p>
                      {SORT_OPTIONS.map(opt => (
                        <button key={opt.value} onClick={() => { setSortValue(opt.value); setSortOpen(false); setCurrentPage(1) }}
                          className={`pp-sort-item w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 ${sortValue===opt.value?'active':''}`}>
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── SEARCH RESULT BANNER ── */}
        {searchQuery && !loading && (
          <div className="w-full max-w-[1520px] mx-auto px-4 md:px-10 xl:px-16 mt-4">
            <div className="flex flex-wrap items-center gap-3 px-5 py-3.5 rounded-2xl text-sm"
              style={{ background:'#eff6ff', border:'1px solid #bfdbfe' }}>
              <IoSearchOutline size={16} className="text-blue-500 flex-shrink-0"/>
              <p className="text-gray-700">
                Showing <span className="font-bold text-gray-900">{sortedProducts.length}</span> results for{' '}
                <span className="font-bold text-blue-700">"{searchText}"</span>
              </p>
              <Link href="/products"
                className="ml-auto flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-blue-200 text-blue-600 text-xs font-bold hover:bg-blue-50 transition-colors">
                <IoCloseCircle size={14}/> Clear
              </Link>
            </div>
          </div>
        )}

        {/* ── MAIN LAYOUT ── */}
        <div className="w-full max-w-[1520px] mx-auto px-4 md:px-10 xl:px-16 py-6 md:py-8">
          <div className="flex gap-6 md:gap-8 items-start">

            {/* ─ Sidebar (desktop) ─ */}
            <div className="hidden lg:block w-64 xl:w-72 flex-shrink-0 sticky top-20">
              <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden"
                style={{ boxShadow:'0 4px 24px rgba(0,0,0,0.06)' }}>
                <Sidebar onFiltersChange={(f) => { setFilters(f); setCurrentPage(1) }}/>
              </div>
            </div>

            {/* ─ Mobile sidebar overlay ─ */}
            {sidebarOpen && (
              <>
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
                  onClick={() => setSidebarOpen(false)}/>
                <div className="fixed top-0 left-0 h-full w-72 bg-white z-50 overflow-y-auto shadow-2xl lg:hidden">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <span className="font-extrabold text-gray-900">Filters</span>
                    <button onClick={() => setSidebarOpen(false)}
                      className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-500">
                      <IoCloseCircle size={20}/>
                    </button>
                  </div>
                  <Sidebar onFiltersChange={(f) => { setFilters(f); setCurrentPage(1) }}/>
                </div>
              </>
            )}

            {/* ─ Product grid ─ */}
            <div className="flex-1 min-w-0">

              {/* Loading */}
              {loading && (
                <div className={`grid gap-3 md:gap-4 ${
                  viewMode==='grid'
                    ? 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4'
                    : 'grid-cols-1 sm:grid-cols-2'
                }`}>
                  {Array.from({ length: 12 }).map((_,i) => <SkeletonCard key={i}/>)}
                </div>
              )}

              {/* Empty */}
              {!loading && sortedProducts.length === 0 && (
                <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-4xl">🔍</div>
                  <div>
                    <h3 className="text-lg font-extrabold text-gray-700">No products found</h3>
                    <p className="text-gray-400 text-sm mt-1">
                      {searchQuery ? `No results for "${searchText}".` : 'No products match your filters.'}
                    </p>
                  </div>
                  <Link href="/products"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-green-600 text-white text-sm font-bold hover:bg-green-700 transition-all hover:scale-105">
                    Clear Filters <BsArrowRight size={13}/>
                  </Link>
                </div>
              )}

              {/* Grid */}
              {!loading && paginatedProducts.length > 0 && (
                <>
                  <div
                    ref={gridRef}
                    className={`grid gap-3 md:gap-4 ${
                      viewMode === 'grid'
                        ? 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4'
                        : 'grid-cols-1 sm:grid-cols-2'
                    }`}
                  >
                    {paginatedProducts.map(product => (
                      <div key={product.id} className="pp-card opacity-0">
                        <Productitem {...product}/>
                      </div>
                    ))}
                  </div>

                  {/* Stats row */}
                  <div className="flex items-center justify-between mt-6 text-sm text-gray-400 font-medium">
                    <span>
                      Showing{' '}
                      <span className="font-bold text-gray-700">
                        {(currentPage-1)*ITEMS_PER_PAGE+1}–{Math.min(currentPage*ITEMS_PER_PAGE, sortedProducts.length)}
                      </span>{' '}
                      of <span className="font-bold text-gray-700">{sortedProducts.length}</span> products
                    </span>
                    <span className="text-xs">Page {currentPage}</span>
                  </div>

                  {/* Pagination */}
                  <CustomPagination
                    page={currentPage}
                    total={sortedProducts.length}
                    perPage={ITEMS_PER_PAGE}
                    onChange={handlePageChange}
                  />
                </>
              )}
            </div>
          </div>
        </div>

      </div>
    </>
  )
}