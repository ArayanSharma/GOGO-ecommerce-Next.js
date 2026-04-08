'use client'

import Link from 'next/link'
import React, { useMemo } from 'react'
import { FaHeart, FaTrashAlt } from 'react-icons/fa'
import { useWishlist } from '@/context/WishlistContext'

const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 2,
})

const formatINR = (value) => inrFormatter.format(Number(value || 0))

const WishlistPage = () => {
  const { wishlistItems, wishlistCount, removeFromWishlist, clearWishlist } = useWishlist()

  const totals = useMemo(() => {
    const subtotal = wishlistItems.reduce((sum, item) => sum + Number(item.price || 0), 0)
    const original = wishlistItems.reduce((sum, item) => sum + Number(item.originalPrice || item.price || 0), 0)
    const savings = Math.max(0, original - subtotal)
    return { subtotal, savings }
  }, [wishlistItems])

  return (
    <section className='relative overflow-hidden bg-[radial-gradient(circle_at_8%_10%,#ecfdf5,transparent_45%),radial-gradient(circle_at_80%_0%,#ccfbf1,transparent_40%),linear-gradient(160deg,#f8fafc_0%,#f0fdfa_45%,#ecfeff_100%)] py-10 md:py-16'>
      <div className='pointer-events-none absolute -left-24 top-20 h-56 w-56 rounded-full bg-emerald-300/20 blur-3xl' />
      <div className='pointer-events-none absolute -right-20 bottom-12 h-64 w-64 rounded-full bg-cyan-300/20 blur-3xl' />

      <div className='container relative z-10'>
        <div className='mb-8 flex flex-col items-start justify-between gap-4 rounded-3xl border border-white/80 bg-white/70 p-6 shadow-lg backdrop-blur md:flex-row md:items-center'>
          <div>
            <p className='text-xs font-bold uppercase tracking-[0.3em] text-emerald-600'>Your personal shelf</p>
            <h1 className='mt-2 text-3xl font-bold text-slate-900 md:text-4xl'>Wishlist</h1>
            <p className='mt-1 text-sm text-slate-600'>You have {wishlistCount} saved item{wishlistCount === 1 ? '' : 's'} ready to buy.</p>
          </div>

          <div className='flex items-center gap-3'>
            <Link href='/products' className='rounded-xl border border-emerald-200 bg-white px-4 py-2 font-semibold text-emerald-700 transition hover:bg-emerald-50'>
              Continue Shopping
            </Link>
            <button
              type='button'
              onClick={clearWishlist}
              disabled={wishlistCount === 0}
              className='rounded-xl bg-red-500 px-4 py-2 font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50'
            >
              Clear Wishlist
            </button>
          </div>
        </div>

        {wishlistCount === 0 ? (
          <div className='rounded-3xl border border-dashed border-emerald-200 bg-white/80 px-6 py-16 text-center shadow-sm'>
            <div className='mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600'>
              <FaHeart size={20} />
            </div>
            <h2 className='text-2xl font-bold text-slate-800'>Your wishlist is empty</h2>
            <p className='mx-auto mt-2 max-w-xl text-slate-600'>Save products you love and come back later. Your picks will stay here for quick access.</p>
            <Link href='/products' className='mt-6 inline-block rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700'>
              Explore Products
            </Link>
          </div>
        ) : (
          <div className='grid gap-6 lg:grid-cols-[1fr_340px]'>
            <div className='space-y-4'>
              {wishlistItems.map((item) => (
                <div key={item.id} className='group flex flex-col gap-4 rounded-2xl border border-white/70 bg-white/85 p-4 shadow-sm backdrop-blur transition hover:shadow-md sm:flex-row'>
                  <Link href={`/productdet/${item.id}`} className='shrink-0'>
                    <img src={item.image} alt={item.name} className='h-28 w-28 rounded-xl object-cover ring-1 ring-emerald-100 sm:h-32 sm:w-32' />
                  </Link>

                  <div className='flex flex-1 flex-col justify-between gap-3'>
                    <div>
                      <p className='text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600'>{item.category}</p>
                      <Link href={`/productdet/${item.id}`} className='mt-1 block text-lg font-semibold text-slate-900 transition group-hover:text-emerald-700'>
                        {item.name}
                      </Link>
                      <p className='mt-1 text-sm text-slate-500'>Stock: {Number(item.stock || 0) > 0 ? `${item.stock} available` : 'Out of stock'}</p>
                    </div>

                    <div className='flex items-end justify-between'>
                      <div className='flex items-center gap-2'>
                        <span className='text-xl font-bold text-emerald-700'>{formatINR(item.price)}</span>
                        {Number(item.originalPrice || 0) > Number(item.price || 0) && (
                          <span className='text-sm text-slate-400 line-through'>{formatINR(item.originalPrice)}</span>
                        )}
                      </div>

                      <button
                        type='button'
                        onClick={() => removeFromWishlist(item.id)}
                        className='inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50'
                      >
                        <FaTrashAlt size={12} />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <aside className='h-fit rounded-2xl border border-white/80 bg-white/85 p-6 shadow-lg backdrop-blur'>
              <h3 className='text-xl font-bold text-slate-900'>Wishlist Summary</h3>
              <div className='mt-5 space-y-3 text-sm'>
                <div className='flex items-center justify-between text-slate-600'>
                  <span>Total items</span>
                  <span className='font-semibold text-slate-900'>{wishlistCount}</span>
                </div>
                <div className='flex items-center justify-between text-slate-600'>
                  <span>Current value</span>
                  <span className='font-semibold text-slate-900'>{formatINR(totals.subtotal)}</span>
                </div>
                <div className='flex items-center justify-between text-emerald-700'>
                  <span>Potential savings</span>
                  <span className='font-semibold'>{formatINR(totals.savings)}</span>
                </div>
              </div>

              <div className='mt-6 space-y-3'>
                <Link href='/checkout' className='block rounded-xl bg-emerald-600 px-4 py-3 text-center font-semibold text-white transition hover:bg-emerald-700'>
                  Proceed to Checkout
                </Link>
                <Link href='/products' className='block rounded-xl border border-slate-200 px-4 py-3 text-center font-semibold text-slate-700 transition hover:bg-slate-50'>
                  Add More Items
                </Link>
              </div>
            </aside>
          </div>
        )}
      </div>
    </section>
  )
}

export default WishlistPage
