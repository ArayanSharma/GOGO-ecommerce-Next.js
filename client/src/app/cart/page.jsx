'use client'

import React from 'react'
import Link from 'next/link'
import { Rating } from '@mui/material'
import { MdClose } from 'react-icons/md'
import { useCart } from '@/context/CartContext'

const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 2,
})

const formatINR = (value) => inrFormatter.format(Number(value || 0))

const CartPage = () => {
  const {
    cartItems,
    cartCount,
    subtotal,
    shipping,
    total,
    updateCartQuantity,
    removeFromCart,
    clearCart,
  } = useCart()

  return (
    <section className='relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_0%_0%,#d1fae5,transparent_35%),radial-gradient(circle_at_100%_20%,#dbeafe,transparent_35%),linear-gradient(160deg,#f8fafc_0%,#ecfeff_40%,#eff6ff_100%)] py-10'>
      <div className='pointer-events-none absolute -left-16 top-24 h-48 w-48 rounded-full bg-emerald-300/20 blur-3xl' />
      <div className='pointer-events-none absolute -right-24 bottom-8 h-64 w-64 rounded-full bg-blue-300/20 blur-3xl' />

      <div className='container relative z-10'>
        <div className='mb-8 flex flex-col items-start justify-between gap-4 rounded-3xl border border-white/70 bg-white/75 p-6 shadow-lg backdrop-blur md:flex-row md:items-center'>
          <div>
            <p className='text-xs font-bold uppercase tracking-[0.26em] text-emerald-600'>Checkout ready</p>
            <h1 className='mt-2 text-3xl font-bold text-slate-900 md:text-4xl'>Shopping Cart</h1>
            <p className='mt-1 text-sm text-slate-600'>You have {cartCount} item{cartCount === 1 ? '' : 's'} in your cart.</p>
          </div>

          <div className='flex items-center gap-3'>
            <Link href='/products' className='rounded-xl border border-emerald-200 bg-white px-4 py-2 font-semibold text-emerald-700 transition hover:bg-emerald-50'>
              Continue Shopping
            </Link>
            <button
              type='button'
              onClick={clearCart}
              disabled={cartItems.length === 0}
              className='rounded-xl bg-red-500 px-4 py-2 font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50'
            >
              Clear Cart
            </button>
          </div>
        </div>

        {cartItems.length === 0 ? (
          <div className='rounded-3xl border border-dashed border-slate-300 bg-white/80 px-6 py-16 text-center shadow-sm'>
            <h2 className='text-2xl font-bold text-slate-800'>Your cart is empty</h2>
            <p className='mx-auto mt-2 max-w-xl text-slate-600'>Looks like you have not added anything yet. Start exploring and add products you love.</p>
            <Link href='/products' className='mt-6 inline-block rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700'>
              Explore Products
            </Link>
          </div>
        ) : (
          <div className='grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]'>
            <div className='space-y-4'>
              {cartItems.map((item) => {
                const itemPrice = Number(item.price || 0)
                const itemOriginalPrice = Number(item.originalPrice || itemPrice)
                const itemTotal = itemPrice * Number(item.quantity || 1)
                const discount = itemOriginalPrice > 0
                  ? Math.max(0, Math.round((1 - itemPrice / itemOriginalPrice) * 100))
                  : 0

                return (
                  <article key={item.id} className='group rounded-2xl border border-white/70 bg-white/85 p-4 shadow-sm backdrop-blur transition hover:shadow-md'>
                    <div className='flex flex-col gap-4 sm:flex-row'>
                      <Link href={`/productdet/${item.id}`} className='shrink-0'>
                        <img
                          src={item.image}
                          alt={item.name}
                          className='h-28 w-28 rounded-xl object-cover ring-1 ring-emerald-100 sm:h-32 sm:w-32'
                        />
                      </Link>

                      <div className='flex flex-1 flex-col justify-between gap-3'>
                        <div>
                          <p className='text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600'>
                            {item.category}
                          </p>
                          <Link href={`/productdet/${item.id}`} className='mt-1 block text-lg font-semibold text-slate-900 transition group-hover:text-emerald-700'>
                            {item.name}
                          </Link>

                          <div className='mt-2 flex items-center gap-2'>
                            <Rating name={`rating-${item.id}`} value={Number(item.rating || 4)} readOnly size='small' />
                            <span className='text-xs text-slate-500'>Stock: {Number(item.stock || 0)}</span>
                          </div>

                          <div className='mt-2 flex items-center gap-2'>
                            <span className='text-lg font-bold text-emerald-700'>{formatINR(itemPrice)}</span>
                            {itemOriginalPrice > itemPrice && (
                              <span className='text-sm text-slate-400 line-through'>{formatINR(itemOriginalPrice)}</span>
                            )}
                            {discount > 0 && (
                              <span className='rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700'>
                                {discount}% OFF
                              </span>
                            )}
                          </div>
                        </div>

                        <div className='flex flex-wrap items-center justify-between gap-3'>
                          <div className='flex items-center rounded-xl border border-slate-200 bg-white'>
                            <button
                              onClick={() => updateCartQuantity(item.id, Math.max(1, item.quantity - 1))}
                              className='px-3 py-2 text-slate-700 transition hover:bg-slate-100'
                            >
                              −
                            </button>
                            <input
                              type='number'
                              min='1'
                              value={item.quantity}
                              onChange={(e) => updateCartQuantity(item.id, Number(e.target.value))}
                              className='w-14 border-x border-slate-200 py-2 text-center text-sm font-semibold outline-none'
                            />
                            <button
                              onClick={() => updateCartQuantity(item.id, Number(item.quantity || 1) + 1)}
                              className='px-3 py-2 text-slate-700 transition hover:bg-slate-100'
                            >
                              +
                            </button>
                          </div>

                          <div className='flex items-center gap-4'>
                              <span className='text-base font-bold text-slate-900'>{formatINR(itemTotal)}</span>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className='text-slate-400 transition hover:text-red-500'
                              aria-label='Remove item'
                            >
                              <MdClose size={22} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>

            <aside className='h-fit rounded-2xl border border-white/80 bg-white/85 p-6 shadow-lg backdrop-blur lg:sticky lg:top-24'>
              <h2 className='text-xl font-bold text-slate-900'>Cart Totals</h2>

              <div className='mt-6 space-y-4 border-b border-slate-200 pb-5'>
                <div className='flex items-center justify-between text-sm text-slate-600'>
                  <span>Subtotal</span>
                  <span className='font-semibold text-slate-900'>{formatINR(subtotal)}</span>
                </div>
                <div className='flex items-center justify-between text-sm text-slate-600'>
                  <span>Shipping</span>
                  <span className='font-semibold text-emerald-700'>{shipping === 0 ? 'Free' : formatINR(shipping)}</span>
                </div>
                <div className='flex items-center justify-between text-sm text-slate-600'>
                  <span>Estimate for</span>
                  <span className='font-semibold text-slate-900'>India</span>
                </div>
              </div>

              <div className='mt-5 flex items-center justify-between'>
                <span className='text-base font-semibold text-slate-700'>Total</span>
                <span className='text-2xl font-bold text-emerald-700'>{formatINR(total)}</span>
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

export default CartPage
