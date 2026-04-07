'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Thumbs } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import Button from '@mui/material/Button'
import Rating from '@mui/material/Rating'
import { useParams } from 'next/navigation'
import Productrow from '@/app/components/Productrow'
import { fetchProductById } from '@/app/utils/api'

const ProductDetail = () => {
  const params = useParams()
  const productId = params.productdetId
  const [quantity, setQuantity] = useState(1)
  const [thumbsSwiper, setThumbsSwiper] = useState(null)
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true)
        setError('')
        const data = await fetchProductById(productId)
        setProduct(data)
      } catch (loadError) {
        console.error('Failed to load product details:', loadError)
        setError(loadError.message || 'Failed to load product')
      } finally {
        setLoading(false)
      }
    }

    if (productId) {
      loadProduct()
    }
  }, [productId])

  const images = useMemo(() => {
    if (!product?.image) {
      return ['/p1.webp', '/p1.webp', '/p1.webp']
    }

    return [product.image, product.image, product.image]
  }, [product])

  const inStock = Number(product?.stock || 0) > 0
  const price = Number(product?.price || 0)
  const originalPrice = Number(product?.originalPrice || (price > 0 ? price * 1.15 : 0))
  const discount = originalPrice > 0 ? Math.max(0, Math.round((1 - price / originalPrice) * 100)) : 0
  const rating = Number(product?.rating || 4)
  const quantityLimit = Math.max(1, Number(product?.stock || 1))

  const handleAddToCart = () => {
    console.log(`Added ${quantity} of product ${productId} to cart`)
  }

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value)
    if (value > 0 && value <= quantityLimit) {
      setQuantity(value)
    }
  }

  if (loading) {
    return (
      <div className='py-12'>
        <div className='container'>
          <div className='glass-panel rounded-3xl p-8 text-slate-600'>Loading product...</div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className='py-12'>
        <div className='container'>
          <div className='glass-panel rounded-3xl p-8 text-center'>
            <p className='text-lg font-semibold text-slate-700'>Product not found</p>
            <p className='mt-2 text-sm text-slate-500'>{error || 'The requested product could not be loaded.'}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <section className='py-8'>
        <div className='container'>
          <div className='mb-6 flex items-center gap-3 rounded-2xl bg-emerald-50/80 px-4 py-3 text-sm text-emerald-800 ring-1 ring-emerald-100'>
            <span className='font-semibold uppercase tracking-[0.2em] text-emerald-600'>Product details</span>
            <span>/{product.category}</span>
            <span>/{product.name}</span>
          </div>

          <div className='glass-panel rounded-3xl p-6 lg:p-8'>
            <div className='flex flex-col gap-8 py-5 lg:flex-row'>
              <div className='productImages lg:w-[45%]'>
                <div className='mb-4 overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm'>
                  <Swiper
                    modules={[Navigation, Pagination, Thumbs]}
                    thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                    navigation
                    pagination={{ clickable: true }}
                    className='rounded-3xl'
                  >
                    {images.map((image, index) => (
                      <SwiperSlide key={index}>
                        <img
                          src={image}
                          alt={`Product image ${index + 1}`}
                          className='h-105 w-full object-cover'
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>

                <Swiper
                  modules={[Thumbs]}
                  onSwiper={setThumbsSwiper}
                  slidesPerView={4}
                  spaceBetween={10}
                  className='thumbs-swiper'
                >
                  {images.map((image, index) => (
                    <SwiperSlide key={index}>
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className='h-20 w-full cursor-pointer rounded-2xl border-2 border-transparent object-cover hover:border-emerald-500'
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              <div className='productDetails lg:w-[55%]'>
                <div className='mb-4'>
                  <span className='mb-3 inline-block rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-amber-700'>
                    {product.category}
                  </span>
                  <h1 className='mb-3 text-3xl font-bold text-slate-900 lg:text-4xl'>{product.name}</h1>
                </div>

                <div className='mb-4 flex items-center gap-3'>
                  <Rating name='read-only' value={rating} readOnly size='medium' />
                  <span className='text-sm text-slate-600'>({Number(product.sales || 0)} sales)</span>
                </div>

                <div className='mb-6 flex flex-wrap items-center gap-4'>
                  <span className='text-4xl font-bold text-emerald-700'>${price.toFixed(2)}</span>
                  {originalPrice > price && (
                    <span className='text-2xl font-medium text-slate-400 line-through'>${originalPrice.toFixed(2)}</span>
                  )}
                  {discount > 0 && (
                    <span className='rounded-full bg-emerald-100 px-3 py-1 font-semibold text-emerald-700'>
                      Save {discount}%
                    </span>
                  )}
                </div>

                <div className='mb-6'>
                  {inStock ? (
                    <div className='flex items-center gap-2'>
                      <div className='h-3 w-3 rounded-full bg-emerald-500' />
                      <span className='font-semibold text-emerald-600'>In Stock ({quantityLimit} available)</span>
                    </div>
                  ) : (
                    <div className='flex items-center gap-2'>
                      <div className='h-3 w-3 rounded-full bg-red-500' />
                      <span className='font-semibold text-red-600'>Out of Stock</span>
                    </div>
                  )}
                </div>

                <p className='mb-6 text-base leading-relaxed text-slate-600'>
                  {product.description || 'Fresh product details will appear here once you add a description to this item.'}
                </p>

                <div className='mb-8 flex flex-col gap-4 sm:flex-row'>
                  <div className='flex items-center rounded-2xl border-2 border-emerald-200 bg-white shadow-sm'>
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className='px-4 py-3 text-slate-600 hover:bg-emerald-50'
                    >
                      −
                    </button>
                    <input
                      type='number'
                      value={quantity}
                      onChange={handleQuantityChange}
                      className='w-16 border-0 text-center font-semibold outline-none'
                      min='1'
                      max={quantityLimit}
                    />
                    <button
                      onClick={() => setQuantity(Math.min(quantityLimit, quantity + 1))}
                      className='px-4 py-3 text-slate-600 hover:bg-emerald-50'
                    >
                      +
                    </button>
                  </div>

                  <Button
                    onClick={handleAddToCart}
                    disabled={!inStock}
                    className='flex-1 bg-emerald-600 text-white hover:bg-emerald-700'
                    style={{
                      textTransform: 'uppercase',
                      fontSize: '14px',
                      fontWeight: '600',
                      padding: '12px 20px'
                    }}
                  >
                    Add to Cart
                  </Button>
                </div>

                <div className='border-t border-emerald-100 pt-6'>
                  <h3 className='mb-4 text-lg font-semibold text-slate-900'>Product Details</h3>
                  <div className='space-y-3'>
                    {[
                      ['Category', product.category],
                      ['Section', product.section],
                      ['Sales', product.sales],
                      ['Stock', product.stock],
                      ['Image', product.image ? 'Available' : 'Not available'],
                    ].map(([key, value]) => (
                      <div key={key} className='flex justify-between text-sm'>
                        <span className='font-medium capitalize text-slate-500'>{key}:</span>
                        <span className='font-semibold text-slate-800'>{String(value ?? '-')}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className='mt-6 flex gap-4 border-t border-emerald-100 pt-6'>
                  <Button
                    className='border-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                    style={{
                      textTransform: 'capitalize',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}
                  >
                    💙 Add to Wishlist
                  </Button>
                  <Button
                    className='border-2 border-yellow-200 text-amber-700 hover:bg-yellow-50'
                    style={{
                      textTransform: 'capitalize',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}
                  >
                    📤 Share
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Productrow title={product.section || 'Latest Products'} />
      </section>
    </div>
  )
}

export default ProductDetail
