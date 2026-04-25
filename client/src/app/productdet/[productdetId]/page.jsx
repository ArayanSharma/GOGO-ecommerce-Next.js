'use client'
import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Thumbs, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { useParams, useRouter } from 'next/navigation'
import Productrow from '@/app/components/Productrow'
import { fetchProductById } from '@/app/utils/api'
import { useWishlist } from '@/context/WishlistContext'
import { useCart } from '@/context/CartContext'
import { generateProductStructuredData } from '@/utils/seoUtils'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  FaRegHeart, FaHeart, FaShareAlt, FaShieldAlt,
  FaTruck, FaUndo, FaLeaf,
} from 'react-icons/fa'
import { HiStar, HiChevronRight, HiMinus, HiPlus } from 'react-icons/hi'
import { BsArrowLeft, BsCheckCircleFill } from 'react-icons/bs'
import Link from 'next/link'

gsap.registerPlugin(ScrollTrigger)

/* ─── Helpers ───────────────────────────────────── */
const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency', currency: 'INR', maximumFractionDigits: 2,
})
const formatINR = (v) => inrFormatter.format(Number(v || 0))

/* ─── Star rating ───────────────────────────────── */
function Stars({ value = 4, max = 5, size = 16 }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <HiStar key={i} size={size}
          style={{ color: i < Math.round(value) ? '#f59e0b' : '#e5e7eb' }}
        />
      ))}
    </div>
  )
}

/* ─── Skeleton ──────────────────────────────────── */
function Skeleton() {
  return (
    <div className="pd-root w-full min-h-screen bg-gray-50">
      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-10 xl:px-16 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="pd-shimmer aspect-square rounded-3xl"/>
          <div className="space-y-4 pt-4">
            {[80,60,40,50,30,90].map((w,i) => (
              <div key={i} className="pd-shimmer h-5 rounded-full" style={{ width:`${w}%` }}/>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Trust badges ──────────────────────────────── */
const BADGES = [
  { icon:<FaTruck size={15}/>,    label:'Free delivery ₹499+', color:'#16a34a' },
  { icon:<FaUndo size={14}/>,     label:'7-day easy returns',   color:'#0284c7' },
  { icon:<FaShieldAlt size={14}/>,label:'Secure checkout',       color:'#7c3aed' },
  { icon:<FaLeaf size={14}/>,     label:'100% organic',          color:'#d97706' },
]

/* ─── Main Component ─────────────────────────────── */
export default function ProductDetail() {
  const params    = useParams()
  const router    = useRouter()
  const productId = params.productdetId

  const [quantity,     setQuantity]     = useState(1)
  const [thumbsSwiper, setThumbsSwiper] = useState(null)
  const [product,      setProduct]      = useState(null)
  const [loading,      setLoading]      = useState(true)
  const [error,        setError]        = useState('')
  const [addedToCart,  setAddedToCart]  = useState(false)
  const [activeTab,    setActiveTab]    = useState('details')

  const { isInWishlist, toggleWishlist } = useWishlist()
  const { addToCart }                    = useCart()

  const pageRef    = useRef(null)
  const imgRef     = useRef(null)
  const infoRef    = useRef(null)
  const badgesRef  = useRef(null)

  /* ── fetch ── */
  useEffect(() => {
    if (!productId) return
    ;(async () => {
      try {
        setLoading(true); setError('')
        const data = await fetchProductById(productId)
        setProduct(data)
      } catch (e) {
        setError(e.message || 'Failed to load product')
      } finally {
        setLoading(false)
      }
    })()
  }, [productId])

  /* ── JSON-LD ── */
  useEffect(() => {
    if (!product) return
    const s = document.createElement('script')
    s.type = 'application/ld+json'
    s.textContent = JSON.stringify(generateProductStructuredData(product))
    document.head.appendChild(s)
    return () => document.head.removeChild(s)
  }, [product])

  /* ── GSAP entrance ── */
  useEffect(() => {
    if (loading || !product) return
    const ctx = gsap.context(() => {
      gsap.fromTo(imgRef.current,
        { opacity:0, x:-40, scale:.96 },
        { opacity:1, x:0,   scale:1, duration:.7, ease:'power3.out' }
      )
      gsap.fromTo(infoRef.current?.querySelectorAll('.pd-item') || [],
        { opacity:0, y:24 },
        { opacity:1, y:0, duration:.5, stagger:.075, ease:'power3.out', delay:.1 }
      )
      gsap.fromTo(badgesRef.current?.querySelectorAll('.pd-badge') || [],
        { opacity:0, y:16, scale:.92 },
        { opacity:1, y:0, scale:1, duration:.4, stagger:.07, delay:.5, ease:'back.out(1.6)' }
      )
    }, pageRef)
    return () => ctx.revert()
  }, [loading, product])

  /* ── derived values ── */
  const images = useMemo(() => {
    const img = product?.image || '/p1.webp'
    return [img, img, img]
  }, [product])

  if (loading) return <Skeleton/>

  if (error || !product) {
    return (
      <div className="pd-root min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-10 max-w-md">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Product not found</h2>
          <p className="text-gray-400 text-sm mb-6">{error || 'The requested product could not be loaded.'}</p>
          <Link href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-green-600 text-white font-bold text-sm hover:bg-green-700 transition-all hover:scale-105">
            <BsArrowLeft size={14}/> Browse Products
          </Link>
        </div>
      </div>
    )
  }

  const inStock       = Number(product?.stock || 0) > 0
  const price         = Number(product?.price || 0)
  const originalPrice = Number(product?.originalPrice || (price > 0 ? price * 1.15 : 0))
  const discount      = originalPrice > 0 ? Math.max(0, Math.round((1 - price / originalPrice) * 100)) : 0
  const rating        = Number(product?.rating || 4)
  const quantityLimit = Math.max(1, Number(product?.stock || 1))
  const inWishlist    = isInWishlist(product.id)

  const handleAddToCart = () => {
    if (!product) return
    addToCart({ id:product.id, name:product.name, category:product.category,
      image:product.image, rating, stock:product.stock, price, originalPrice }, quantity)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2500)
  }

  const handleBuyNow = () => {
    if (!product || !inStock) return
    handleAddToCart()
    router.push('/checkout')
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,700;0,9..144,900;1,9..144,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        .pd-root    { font-family:'DM Sans',sans-serif; }
        .pd-display { font-family:'Fraunces',serif; }

        @keyframes pd-shimmer {
          0%   { background-position:-700px 0; }
          100% { background-position: 700px 0; }
        }
        .pd-shimmer {
          background:linear-gradient(90deg,#f3f4f6 25%,#e9ebec 50%,#f3f4f6 75%);
          background-size:900px 100%; animation:pd-shimmer 1.5s infinite;
        }

        /* thumb active */
        .thumbs-swiper .swiper-slide-thumb-active img {
          border-color:#16a34a !important;
          box-shadow:0 0 0 2px #16a34a44;
        }
        /* hide default nav arrows */
        .pd-main-swiper .swiper-button-prev,
        .pd-main-swiper .swiper-button-next { display:none !important; }

        .pd-qty-btn {
          transition:background .18s,transform .14s;
        }
        .pd-qty-btn:hover { background:#f0fdf4; transform:scale(1.1); }
        .pd-qty-btn:active { transform:scale(.92); }

        .pd-cart-btn {
          transition:transform .15s,box-shadow .2s;
        }
        .pd-cart-btn:hover:not(:disabled) {
          transform:translateY(-2px);
          box-shadow:0 10px 28px rgba(22,163,74,.38);
        }
        .pd-cart-btn:active { transform:scale(.96); }

        .pd-buy-btn {
          transition:transform .15s,box-shadow .2s;
        }
        .pd-buy-btn:hover:not(:disabled) {
          transform:translateY(-2px);
          box-shadow:0 10px 28px rgba(15,23,42,.22);
        }
        .pd-buy-btn:active { transform:scale(.96); }

        .pd-wishlist-btn {
          transition:background .2s,transform .15s,border-color .2s;
        }
        .pd-wishlist-btn:hover { transform:scale(1.06); }
        .pd-wishlist-btn:active { transform:scale(.93); }

        .pd-tab-btn {
          transition:color .2s,border-color .2s;
          position:relative;
        }
        .pd-tab-btn::after {
          content:''; position:absolute; bottom:-1px; left:0; right:0;
          height:2px; background:#16a34a; border-radius:2px;
          transform:scaleX(0); transition:transform .25s ease;
        }
        .pd-tab-btn.active::after { transform:scaleX(1); }
        .pd-tab-btn.active { color:#15803d; font-weight:700; }
      `}</style>

      <div ref={pageRef} className="pd-root w-full bg-white">

        {/* ── BREADCRUMB ── */}
        <div className="w-full border-b border-gray-100 bg-gray-50/60">
          <div className="max-w-[1400px] mx-auto px-4 md:px-10 xl:px-16 py-3 flex items-center gap-2 text-xs font-medium text-gray-400 overflow-x-auto whitespace-nowrap">
            <Link href="/" className="hover:text-green-600 transition-colors">Home</Link>
            <HiChevronRight size={12}/>
            <Link href="/products" className="hover:text-green-600 transition-colors">Products</Link>
            <HiChevronRight size={12}/>
            <span className="text-gray-500 font-semibold truncate max-w-[160px]">{product.name}</span>
          </div>
        </div>

        {/* ── MAIN PRODUCT SECTION ── */}
        <div className="max-w-[1400px] mx-auto px-4 md:px-10 xl:px-16 py-10 md:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16 items-start">

            {/* ══ LEFT: IMAGE GALLERY ══ */}
            <div ref={imgRef} className="opacity-0 sticky top-6">

              {/* Main image */}
              <div
                className="relative rounded-3xl overflow-hidden mb-3 border border-gray-100"
                style={{ background:'linear-gradient(135deg,#f0fdf4,#f8fffe)', boxShadow:'0 4px 32px rgba(0,0,0,0.07)' }}
              >
                {/* Discount badge */}
                {discount > 0 && (
                  <div className="absolute top-4 left-4 z-20 flex flex-col items-center justify-center rounded-2xl px-3 py-2 text-white font-extrabold shadow-lg"
                    style={{ background:'linear-gradient(135deg,#16a34a,#22c55e)', boxShadow:'0 4px 16px rgba(22,163,74,.4)', minWidth:56 }}>
                    <span className="text-[10px] leading-none opacity-80">SAVE</span>
                    <span className="text-xl leading-tight">{discount}%</span>
                  </div>
                )}

                {/* Stock pill */}
                <div className={`absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
                  inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${inStock ? 'bg-green-500' : 'bg-red-500'}`}/>
                  {inStock ? 'In Stock' : 'Out of Stock'}
                </div>

                <Swiper
                  className="pd-main-swiper"
                  modules={[Navigation, Pagination, Thumbs]}
                  thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                  pagination={{ clickable:true }}
                  style={{ aspectRatio:'1/1' }}
                >
                  {images.map((img, i) => (
                    <SwiperSlide key={i}>
                      <img src={img} alt={`${product.name} ${i+1}`}
                        className="w-full h-full object-contain p-6 md:p-10"
                        style={{ filter:'drop-shadow(0 20px 40px rgba(0,0,0,0.12))' }}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              {/* Thumbnails */}
              <Swiper
                modules={[Thumbs]}
                onSwiper={setThumbsSwiper}
                slidesPerView={4}
                spaceBetween={8}
                className="thumbs-swiper"
              >
                {images.map((img, i) => (
                  <SwiperSlide key={i}>
                    <div className="rounded-2xl overflow-hidden border-2 border-transparent cursor-pointer transition-all duration-200 hover:border-green-300"
                      style={{ background:'#f8fffe' }}>
                      <img src={img} alt={`Thumb ${i+1}`} className="w-full aspect-square object-contain p-2"/>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* ══ RIGHT: PRODUCT INFO ══ */}
            <div ref={infoRef} className="flex flex-col gap-5">

              {/* Category + Name */}
              <div className="pd-item">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-3"
                  style={{ background:'#f0fdf4', color:'#16a34a', border:'1px solid #bbf7d0' }}>
                  {product.category}
                </span>
                <h1 className="pd-display text-3xl md:text-4xl xl:text-5xl font-bold text-gray-900 leading-tight">
                  {product.name}
                </h1>
              </div>

              {/* Rating */}
              <div className="pd-item flex items-center gap-3">
                <Stars value={rating} size={18}/>
                <span className="text-sm font-semibold text-gray-700">{rating.toFixed(1)}</span>
                <span className="text-gray-300">·</span>
                <span className="text-sm text-gray-400">{Number(product.sales || 0)} sold</span>
              </div>

              {/* Price */}
              <div className="pd-item flex items-center gap-4 flex-wrap">
                <span className="pd-display text-4xl md:text-5xl font-bold text-gray-900" style={{ color:'#15803d' }}>
                  {formatINR(price)}
                </span>
                {originalPrice > price && (
                  <span className="text-xl text-gray-300 line-through font-light">{formatINR(originalPrice)}</span>
                )}
                {discount > 0 && (
                  <span className="text-sm font-bold text-green-700 px-3 py-1.5 rounded-full"
                    style={{ background:'#f0fdf4', border:'1.5px solid #86efac' }}>
                    You save {formatINR(originalPrice - price)}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="pd-item text-gray-500 leading-relaxed text-base font-light">
                {product.description || 'Fresh, high-quality product sourced directly from certified farms. Perfect for daily use with guaranteed freshness.'}
              </p>

              {/* Divider */}
              <div className="pd-item h-px bg-gradient-to-r from-green-100 to-transparent"/>

              {/* Quantity + CTA */}
              <div className="pd-item flex flex-col sm:flex-row gap-3 items-start sm:items-center">

                {/* Qty picker */}
                <div className="flex items-center rounded-2xl border-2 border-gray-200 bg-white overflow-hidden shadow-sm"
                  style={{ height:52 }}>
                  <button onClick={() => setQuantity(q => Math.max(1, q-1))}
                    className="pd-qty-btn w-12 h-full flex items-center justify-center text-gray-500">
                    <HiMinus size={16}/>
                  </button>
                  <span className="w-12 text-center font-bold text-gray-800 text-sm">{quantity}</span>
                  <button onClick={() => setQuantity(q => Math.min(quantityLimit, q+1))}
                    className="pd-qty-btn w-12 h-full flex items-center justify-center text-gray-500">
                    <HiPlus size={16}/>
                  </button>
                </div>

                {/* Add to cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={!inStock}
                  className="pd-cart-btn flex-1 flex items-center justify-center gap-2.5 py-3.5 rounded-2xl text-white text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: addedToCart
                      ? 'linear-gradient(135deg,#15803d,#16a34a)'
                      : 'linear-gradient(135deg,#16a34a,#22c55e)',
                    boxShadow:'0 4px 20px rgba(22,163,74,.3)',
                  }}
                >
                  {addedToCart
                    ? <><BsCheckCircleFill size={16}/> Added to Cart!</>
                    : '🛒 Add to Cart'
                  }
                </button>

                {/* Buy now */}
                <button
                  onClick={handleBuyNow}
                  disabled={!inStock}
                  className="pd-buy-btn flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-white text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background:'linear-gradient(135deg,#0f172a,#1e293b)', boxShadow:'0 4px 20px rgba(0,0,0,.2)' }}
                >
                  ⚡ Buy Now
                </button>
              </div>

              {/* Wishlist + Share */}
              <div className="pd-item flex gap-3">
                <button
                  onClick={() => toggleWishlist(product)}
                  className="pd-wishlist-btn flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all"
                  style={inWishlist
                    ? { borderColor:'#fca5a5', color:'#dc2626', background:'#fef2f2' }
                    : { borderColor:'#e5e7eb', color:'#6b7280', background:'white' }
                  }
                >
                  {inWishlist ? <FaHeart size={14} className="text-red-500"/> : <FaRegHeart size={14}/>}
                  {inWishlist ? 'Wishlisted' : 'Wishlist'}
                </button>
                <button
                  className="pd-wishlist-btn flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border-2 border-gray-200 text-gray-500 bg-white"
                  onClick={() => navigator.share?.({ title:product.name, url:window.location.href })}
                >
                  <FaShareAlt size={13}/> Share
                </button>
              </div>

              {/* Trust badges */}
              <div ref={badgesRef} className="pd-item grid grid-cols-2 gap-3">
                {BADGES.map(b => (
                  <div key={b.label}
                    className="pd-badge flex items-center gap-3 px-4 py-3 rounded-2xl border border-gray-100 bg-gray-50/60">
                    <span className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background:`${b.color}15`, color:b.color }}>
                      {b.icon}
                    </span>
                    <span className="text-xs font-semibold text-gray-600">{b.label}</span>
                  </div>
                ))}
              </div>

              {/* Info tabs */}
              <div className="pd-item">
                {/* Tab buttons */}
                <div className="flex gap-5 border-b border-gray-100 mb-4">
                  {['details','specifications'].map(t => (
                    <button key={t} onClick={() => setActiveTab(t)}
                      className={`pd-tab-btn pb-3 text-sm capitalize ${activeTab===t ? 'active' : 'text-gray-400'}`}>
                      {t}
                    </button>
                  ))}
                </div>

                {/* Details tab */}
                {activeTab === 'details' && (
                  <div className="space-y-2.5">
                    {[
                      ['Category',  product.category],
                      ['Section',   product.section],
                      ['In Stock',  `${product.stock} units`],
                      ['Sales',     `${Number(product.sales || 0)} units sold`],
                      ['Image',     product.image ? '✓ Available' : '✗ Not set'],
                    ].map(([k,v]) => (
                      <div key={k} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-400">{k}</span>
                        <span className="text-sm font-semibold text-gray-700">{String(v ?? '—')}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Specifications tab */}
                {activeTab === 'specifications' && (
                  <div className="space-y-2.5">
                    {[
                      ['Product ID', product.id],
                      ['Rating',     `${rating}/5 stars`],
                      ['Price',      formatINR(price)],
                      ['Original',   formatINR(originalPrice)],
                      ['Discount',   discount > 0 ? `${discount}%` : 'None'],
                    ].map(([k,v]) => (
                      <div key={k} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-400">{k}</span>
                        <span className="text-sm font-semibold text-gray-700">{String(v ?? '—')}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* ── RELATED PRODUCTS ── */}
        <div className="border-t border-gray-100 mt-4">
          <Productrow title={product.section || 'Latest Products'}/>
        </div>

      </div>
    </>
  )
}