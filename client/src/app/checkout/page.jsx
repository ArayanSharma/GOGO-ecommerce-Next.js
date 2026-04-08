'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Drawer from '@mui/material/Drawer'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import CloseIcon from '@mui/icons-material/Close'
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import { postData } from '@/utils/api'

const ADDRESS_STORAGE_PREFIX = 'gogo_addresses_v2'

const getAddressStorageKey = (email) => {
  const normalizedEmail = String(email || 'guest').trim().toLowerCase()
  return `${ADDRESS_STORAGE_PREFIX}_${encodeURIComponent(normalizedEmail)}`
}

const INITIAL_FORM = {
  fullName: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  landmark: '',
  type: 'Home',
}

const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 2,
})

const formatINR = (value) => inrFormatter.format(Number(value || 0))

const CheckoutPage = () => {
  const router = useRouter()
  const { userEmail, userName } = useAuth()
  const { cartItems, subtotal, clearCart } = useCart()
  const [openDrawer, setOpenDrawer] = useState(false)
  const [selectedAddress, setSelectedAddress] = useState('')
  const [formData, setFormData] = useState(INITIAL_FORM)
  const [addresses, setAddresses] = useState([])
  const [editingAddressId, setEditingAddressId] = useState(null)
  const [addressError, setAddressError] = useState('')
  const [orderError, setOrderError] = useState('')
  const [placingOrder, setPlacingOrder] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [addressBootstrapped, setAddressBootstrapped] = useState(false)
  const addressStorageKey = useMemo(() => getAddressStorageKey(userEmail), [userEmail])

  useEffect(() => {
    setAddressBootstrapped(false)
    try {
      const stored = localStorage.getItem(addressStorageKey)
      const parsed = stored ? JSON.parse(stored) : []
      if (Array.isArray(parsed) && parsed.length > 0) {
        setAddresses(parsed)
        setSelectedAddress(parsed[0].id)
      } else {
        setAddresses([])
        setSelectedAddress('')
      }
    } catch (error) {
      console.error('Failed to load addresses', error)
      setAddresses([])
      setSelectedAddress('')
    } finally {
      setAddressBootstrapped(true)
    }
  }, [addressStorageKey])

  useEffect(() => {
    if (!addressBootstrapped) return
    try {
      localStorage.setItem(addressStorageKey, JSON.stringify(addresses))
    } catch (error) {
      console.error('Failed to save addresses', error)
    }
  }, [addresses, addressStorageKey, addressBootstrapped])

  useEffect(() => {
    if (!addresses.some((addr) => addr.id === selectedAddress) && addresses[0]?.id) {
      setSelectedAddress(addresses[0].id)
    }
  }, [addresses, selectedAddress])

  const handleOpenDrawer = (address = null) => {
    if (address) {
      setEditingAddressId(address.id)
      setFormData({
        fullName: address.name || '',
        phone: address.phone || '',
        address: address.address || '',
        city: address.city || '',
        state: address.state || '',
        zipCode: address.zipCode || '',
        landmark: address.nearBy || '',
        type: address.type || 'Home',
      })
    } else {
      setEditingAddressId(null)
      setFormData({
        ...INITIAL_FORM,
        fullName: userName || '',
      })
    }
    setAddressError('')
    setOpenDrawer(true)
  }

  const handleCloseDrawer = () => {
    setOpenDrawer(false)
    setEditingAddressId(null)
    setAddressError('')
    setFormData(INITIAL_FORM)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAddAddress = () => {
    const requiredFields = [
      formData.fullName,
      formData.phone,
      formData.address,
      formData.city,
      formData.state,
      formData.zipCode,
    ]

    if (requiredFields.some((value) => !String(value || '').trim())) {
      setAddressError('Please fill all required fields')
      return
    }

    const payload = {
      id: editingAddressId || Date.now().toString(),
      type: formData.type || 'Home',
      name: formData.fullName.trim(),
      address: formData.address.trim(),
      city: formData.city.trim(),
      state: formData.state.trim(),
      zipCode: formData.zipCode.trim(),
      nearBy: formData.landmark.trim(),
      phone: formData.phone.trim(),
    }

    if (editingAddressId) {
      setAddresses((prev) => prev.map((addr) => (addr.id === editingAddressId ? payload : addr)))
    } else {
      setAddresses((prev) => [payload, ...prev])
      setSelectedAddress(payload.id)
    }

    handleCloseDrawer()
  }

  const shipping = useMemo(() => (subtotal > 500 ? 0 : 50), [subtotal])
  const tax = useMemo(() => Math.round(subtotal * 0.05), [subtotal])
  const total = useMemo(() => subtotal + shipping + tax, [subtotal, shipping, tax])

  const selectedAddressData = useMemo(
    () => addresses.find((addr) => addr.id === selectedAddress),
    [addresses, selectedAddress]
  )

  const handlePlaceOrder = async () => {
    setOrderError('')

    if (!selectedAddressData) {
      setOrderError('Please select a delivery address')
      return
    }

    if (cartItems.length === 0) {
      setOrderError('Your cart is empty. Add products before checkout.')
      return
    }

    setPlacingOrder(true)

    try {
      const orderPayload = {
        userEmail: userEmail || 'guest@gogo.local',
        items: cartItems.map((item) => ({
          id: item.id,
          name: item.name,
          image: item.image,
          quantity: item.quantity,
          price: Number(item.price || 0),
        })),
        deliveryAddress: selectedAddressData,
        paymentMethod: 'COD',
        subtotal,
        shipping,
        tax,
        totalAmount: total,
      }

      const orderResponse = await postData('/api/orders', orderPayload)

      if (orderResponse?.error || orderResponse?.success === false) {
        setOrderError(orderResponse?.message || 'Failed to place order')
        return
      }

      clearCart()
      setOrderPlaced(true)
    } finally {
      setPlacingOrder(false)
    }
  }

  if (orderPlaced) {
    return (
      <section className='relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_20%_10%,#cffafe,transparent_40%),radial-gradient(circle_at_100%_0%,#d1fae5,transparent_40%),linear-gradient(145deg,#f8fafc_0%,#ecfeff_45%,#ecfdf5_100%)] py-14'>
        <div className='container'>
          <div className='mx-auto max-w-2xl rounded-3xl border border-white/80 bg-white/85 p-10 text-center shadow-xl backdrop-blur'>
            <p className='text-xs font-bold uppercase tracking-[0.3em] text-cyan-600'>Order confirmed</p>
            <h1 className='mt-3 text-4xl font-bold text-slate-900'>Thank you for your purchase</h1>
            <p className='mt-3 text-slate-600'>Your order has been placed successfully and will be processed soon.</p>
            <div className='mt-8 flex flex-col justify-center gap-3 sm:flex-row'>
              <Link href='/products' className='rounded-xl bg-cyan-600 px-6 py-3 font-semibold text-white transition hover:bg-cyan-700'>
                Continue Shopping
              </Link>
              <button
                onClick={() => router.push('/')}
                className='rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50'
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <div className='relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_0%_0%,#cffafe,transparent_35%),radial-gradient(circle_at_90%_20%,#bfdbfe,transparent_35%),linear-gradient(155deg,#f8fafc_0%,#ecfeff_45%,#eff6ff_100%)] py-8'>
      <div className='pointer-events-none absolute -left-16 top-20 h-56 w-56 rounded-full bg-cyan-300/20 blur-3xl' />
      <div className='pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-blue-300/20 blur-3xl' />
      <div className='container'>
        {cartItems.length === 0 ? (
          <div className='mx-auto mt-12 max-w-2xl rounded-3xl border border-white/70 bg-white/85 p-10 text-center shadow-lg backdrop-blur'>
            <h2 className='text-3xl font-bold text-slate-900'>Your cart is empty</h2>
            <p className='mt-2 text-slate-600'>Add products to cart before proceeding to checkout.</p>
            <Link href='/products' className='mt-6 inline-block rounded-xl bg-cyan-600 px-6 py-3 font-semibold text-white transition hover:bg-cyan-700'>
              Explore Products
            </Link>
          </div>
        ) : (
        <div className='flex flex-col gap-6 lg:flex-row'>
          {/* Left Side - Delivery Address */}
          <div className='flex-1'>
            <div className='rounded-2xl border border-white/70 bg-white/80 p-6 shadow-lg backdrop-blur'>
              <div className='flex justify-between items-center mb-6'>
                <h2 className='text-2xl font-bold text-gray-800'>Select Delivery Address</h2>
                <Button
                  onClick={() => handleOpenDrawer()}
                  className='text-cyan-500 border-2 border-cyan-500 hover:bg-cyan-50'
                  style={{
                    textTransform: 'capitalize',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  + Add New Address
                </Button>
              </div>
              <p className='mb-4 inline-flex items-center rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700 ring-1 ring-cyan-100'>
                Addresses for: {userEmail || 'Guest User'}
              </p>

              {/* Address List */}
              <div className='space-y-4'>
                {addresses.length === 0 ? (
                  <div className='rounded-2xl border border-dashed border-cyan-200 bg-cyan-50/60 p-6 text-center'>
                    <p className='text-base font-semibold text-slate-700'>No saved address for this account yet</p>
                    <p className='mt-1 text-sm text-slate-500'>Add your first delivery address to continue checkout.</p>
                    <button
                      onClick={() => handleOpenDrawer()}
                      className='mt-4 rounded-xl bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-700'
                    >
                      Add First Address
                    </button>
                  </div>
                ) : (
                  <RadioGroup
                    value={selectedAddress}
                    onChange={(e) => setSelectedAddress(e.target.value)}
                  >
                    {addresses.map((addr) => (
                      <div key={addr.id} className='border-2 rounded-lg p-4 hover:border-cyan-500 transition-all cursor-pointer bg-white'>
                        <div className='flex items-start gap-4'>
                          <FormControlLabel
                            value={addr.id}
                            control={<Radio />}
                            label=''
                          />
                          <div className='flex-1'>
                            <div className='flex justify-between items-start mb-2'>
                              <div>
                                <span className='inline-block bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-semibold mb-2'>
                                  {addr.type}
                                </span>
                                <h4 className='font-semibold text-gray-800 text-sm'>{addr.name}</h4>
                              </div>
                              <Button
                                size='small'
                                className='text-cyan-500'
                                onClick={() => handleOpenDrawer(addr)}
                                style={{ minWidth: 'auto', padding: '4px' }}
                              >
                                <EditIcon style={{ fontSize: '18px' }} />
                              </Button>
                            </div>
                            <p className='text-gray-600 text-sm mb-1'>{addr.address}</p>
                            <p className='text-gray-600 text-sm mb-1'>{addr.city}, {addr.state} {addr.zipCode}</p>
                            <p className='text-gray-600 text-sm mb-1'>{addr.nearBy}</p>
                            <p className='text-gray-600 text-sm font-semibold'>{addr.phone}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                )}
              </div>
            </div>
          </div>

          {/* Right Side - Order Summary */}
          <div className='w-full lg:w-95'>
            <div className='rounded-2xl border border-white/70 bg-white/85 p-6 shadow-lg backdrop-blur sticky top-20'>
              <h3 className='text-xl font-bold text-gray-800 mb-6'>Your Order</h3>

              {/* Order Items */}
              <div className='space-y-4 mb-6 max-h-96 overflow-y-auto'>
                {cartItems.map((item) => (
                  <div key={item.id} className='flex gap-4 pb-4 border-b'>
                    <div className='w-16 h-16 bg-gray-100 rounded shrink-0 overflow-hidden'>
                      <img src={item.image} alt={item.name} className='w-full h-full object-cover' />
                    </div>
                    <div className='flex-1'>
                      <p className='text-sm text-gray-700 font-medium line-clamp-2'>{item.name}</p>
                      <p className='text-xs text-gray-500 mt-1'>Qty: {item.quantity}</p>
                      <p className='text-sm font-semibold text-gray-800 mt-1'>{formatINR(item.price)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className='space-y-3 mb-6 pb-6 border-b'>
                <div className='flex justify-between text-sm text-gray-600'>
                  <span>Subtotal</span>
                  <span className='font-semibold'>{formatINR(subtotal)}</span>
                </div>
                <div className='flex justify-between text-sm text-gray-600'>
                  <span>Shipping</span>
                  <span className='font-semibold'>{shipping === 0 ? 'Free' : formatINR(shipping)}</span>
                </div>
                <div className='flex justify-between text-sm text-gray-600'>
                  <span>Tax (5%)</span>
                  <span className='font-semibold'>{formatINR(tax)}</span>
                </div>
                <div className='flex justify-between text-lg font-bold text-gray-800 pt-3'>
                  <span>Total</span>
                  <span className='text-cyan-600'>{formatINR(total)}</span>
                </div>
              </div>

              {orderError && (
                <p className='mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600'>
                  {orderError}
                </p>
              )}

              {/* Checkout Button */}
              <Button
                fullWidth
                onClick={handlePlaceOrder}
                disabled={placingOrder}
                className='bg-cyan-500 text-white hover:bg-cyan-600'
                style={{
                  textTransform: 'uppercase',
                  fontSize: '14px',
                  fontWeight: '600',
                  padding: '12px 20px'
                }}
              >
                {placingOrder ? 'Placing Order...' : 'Checkout'}
              </Button>

              <Link href='/cart' className='mt-3 block text-center text-sm font-semibold text-slate-500 hover:text-slate-700'>
                Edit items in cart
              </Link>
            </div>
          </div>
        </div>
        )}
      </div>

      {/* Add Address Drawer */}
      <Drawer
        anchor='right'
        open={openDrawer}
        onClose={handleCloseDrawer}
      >
        <div className='relative flex h-full w-105 flex-col overflow-hidden bg-[radial-gradient(circle_at_20%_0%,#cffafe,transparent_45%),linear-gradient(180deg,#f8fafc_0%,#f0f9ff_100%)]'>
          <div className='pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-cyan-300/20 blur-2xl' />
          {/* Header */}
          <div className='flex items-center justify-between border-b border-cyan-100/80 bg-white/70 px-6 py-5 backdrop-blur'>
            <div>
              <p className='text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-600'>Address Book</p>
              <h3 className='mt-1 text-xl font-bold text-slate-900'>
                {editingAddressId ? 'Edit Address' : 'Add New Address'}
              </h3>
            </div>
            <IconButton onClick={handleCloseDrawer} size='small' className='bg-white'>
              <CloseIcon className='text-slate-600' />
            </IconButton>
          </div>

          {/* Form */}
          <div className='flex-1 overflow-y-auto px-6 py-5'>
            <div className='rounded-2xl border border-cyan-100 bg-white/80 p-4 shadow-sm'>
              <p className='text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700'>Address Type</p>
              <div className='mt-3 grid grid-cols-3 gap-2'>
                {['Home', 'Work', 'Other'].map((typeOption) => (
                  <button
                    key={typeOption}
                    type='button'
                    onClick={() => setFormData((prev) => ({ ...prev, type: typeOption }))}
                    className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
                      formData.type === typeOption
                        ? 'bg-cyan-600 text-white shadow-md shadow-cyan-100'
                        : 'bg-slate-100 text-slate-600 hover:bg-cyan-50'
                    }`}
                  >
                    {typeOption}
                  </button>
                ))}
              </div>
            </div>

            <div className='mt-4 space-y-4'>
              <TextField
                fullWidth
                label='Full Name'
                name='fullName'
                value={formData.fullName}
                onChange={handleInputChange}
                size='small'
                variant='outlined'
                placeholder='Enter your full name'
              />
              <TextField
                fullWidth
                label='Phone Number'
                name='phone'
                value={formData.phone}
                onChange={handleInputChange}
                size='small'
                variant='outlined'
                placeholder='+91 XXXXXXXXXX'
              />
              <TextField
                fullWidth
                label='Address'
                name='address'
                value={formData.address}
                onChange={handleInputChange}
                size='small'
                variant='outlined'
                placeholder='House No., Street name'
                multiline
                rows={2}
              />
              <div className='grid grid-cols-2 gap-3'>
                <TextField
                  fullWidth
                  label='City'
                  name='city'
                  value={formData.city}
                  onChange={handleInputChange}
                  size='small'
                  variant='outlined'
                  placeholder='Enter city name'
                />
                <TextField
                  fullWidth
                  label='State'
                  name='state'
                  value={formData.state}
                  onChange={handleInputChange}
                  size='small'
                  variant='outlined'
                  placeholder='Enter state name'
                />
              </div>
              <TextField
                fullWidth
                label='Zip Code'
                name='zipCode'
                value={formData.zipCode}
                onChange={handleInputChange}
                size='small'
                variant='outlined'
                placeholder='XXXXXX'
              />
              <TextField
                fullWidth
                label='Landmark (Optional)'
                name='landmark'
                value={formData.landmark}
                onChange={handleInputChange}
                size='small'
                variant='outlined'
                placeholder='e.g. near school, park, etc.'
              />
            </div>

            {addressError && (
              <p className='mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600'>
                {addressError}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className='flex gap-3 border-t border-cyan-100/80 bg-white/70 px-6 py-4 backdrop-blur'>
            <Button
              fullWidth
              onClick={handleCloseDrawer}
              className='border-2 border-gray-300 text-gray-700 hover:bg-gray-100'
              style={{
                textTransform: 'capitalize',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              Cancel
            </Button>
            <Button
              fullWidth
              onClick={handleAddAddress}
              className='bg-cyan-500 text-white hover:bg-cyan-600'
              style={{
                textTransform: 'capitalize',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              {editingAddressId ? 'Update Address' : 'Save Address'}
            </Button>
          </div>
        </div>
      </Drawer>
    </div>
  )
}

export default CheckoutPage
