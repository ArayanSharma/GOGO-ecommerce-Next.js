'use client'

import React, { useState } from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Drawer from '@mui/material/Drawer'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import CloseIcon from '@mui/icons-material/Close'
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'

const CheckoutPage = () => {
  const [openDrawer, setOpenDrawer] = useState(false)
  const [selectedAddress, setSelectedAddress] = useState('1')
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    landmark: ''
  })

  const [addresses, setAddresses] = useState([
    {
      id: '1',
      type: 'Home',
      name: 'RINKU VERMA',
      address: 'H No 222 Street No 6 Adarsh Mohalla Delhi',
      city: 'India Delhi',
      nearBy: 'near govt school',
      phone: '+919873798202'
    },
    {
      id: '2',
      type: 'Home',
      name: 'RINKU VERMA',
      address: 'H No 222 Street No 6 Adarsh Mohalla Delhi',
      city: 'India Delhi',
      nearBy: 'near govt school',
      phone: '+919873798202'
    }
  ])

  const [cartItems] = useState([
    {
      id: 1,
      name: 'Fortune Sunlite Refined Oil',
      price: 99,
      quantity: 1,
      image: '/p1.webp'
    },
    {
      id: 2,
      name: 'Fortune Sunlite Refined Oil',
      price: 99,
      quantity: 1,
      image: '/p1.webp'
    },
    {
      id: 3,
      name: 'Fortune Sunlite Refined Oil',
      price: 99,
      quantity: 1,
      image: '/p1.webp'
    },
    {
      id: 4,
      name: 'Fortune Sunlite Refined Oil',
      price: 99,
      quantity: 1,
      image: '/p1.webp'
    }
  ])

  const handleOpenDrawer = () => {
    setOpenDrawer(true)
  }

  const handleCloseDrawer = () => {
    setOpenDrawer(false)
    setFormData({
      fullName: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      landmark: ''
    })
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAddAddress = () => {
    const newAddress = {
      id: (addresses.length + 1).toString(),
      type: 'Home',
      name: formData.fullName,
      address: formData.address,
      city: formData.city,
      nearBy: formData.landmark,
      phone: formData.phone
    }
    setAddresses([...addresses, newAddress])
    handleCloseDrawer()
  }

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shipping = 50
  const tax = Math.round(subtotal * 0.05)
  const total = subtotal + shipping + tax

  return (
    <div className='bg-gray-50 min-h-screen py-8'>
      <div className='container'>
        <div className='flex gap-6'>
          {/* Left Side - Delivery Address */}
          <div className='flex-1'>
            <div className='bg-white rounded-lg p-6'>
              <div className='flex justify-between items-center mb-6'>
                <h2 className='text-2xl font-[700] text-gray-800'>Select Delivery Address</h2>
                <Button
                  onClick={handleOpenDrawer}
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

              {/* Address List */}
              <div className='space-y-4'>
                <RadioGroup
                  value={selectedAddress}
                  onChange={(e) => setSelectedAddress(e.target.value)}
                >
                  {addresses.map((addr) => (
                    <div key={addr.id} className='border-2 rounded-lg p-4 hover:border-cyan-500 transition-all cursor-pointer'>
                      <div className='flex items-start gap-4'>
                        <FormControlLabel
                          value={addr.id}
                          control={<Radio />}
                          label=''
                        />
                        <div className='flex-1'>
                          <div className='flex justify-between items-start mb-2'>
                            <div>
                              <span className='inline-block bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-[600] mb-2'>
                                {addr.type}
                              </span>
                              <h4 className='font-[600] text-gray-800 text-sm'>{addr.name}</h4>
                            </div>
                            <Button
                              size='small'
                              className='text-cyan-500'
                              style={{ minWidth: 'auto', padding: '4px' }}
                            >
                              <EditIcon style={{ fontSize: '18px' }} />
                            </Button>
                          </div>
                          <p className='text-gray-600 text-sm mb-1'>{addr.address}</p>
                          <p className='text-gray-600 text-sm mb-1'>{addr.city} {addr.nearBy}</p>
                          <p className='text-gray-600 text-sm font-[600]'>{addr.phone}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          </div>

          {/* Right Side - Order Summary */}
          <div className='w-[380px]'>
            <div className='bg-white rounded-lg p-6 sticky top-20'>
              <h3 className='text-xl font-[700] text-gray-800 mb-6'>Your Order</h3>

              {/* Order Items */}
              <div className='space-y-4 mb-6 max-h-96 overflow-y-auto'>
                {cartItems.map((item) => (
                  <div key={item.id} className='flex gap-4 pb-4 border-b'>
                    <div className='w-16 h-16 bg-gray-100 rounded flex-shrink-0 overflow-hidden'>
                      <img src={item.image} alt={item.name} className='w-full h-full object-cover' />
                    </div>
                    <div className='flex-1'>
                      <p className='text-sm text-gray-700 font-[500] line-clamp-2'>{item.name}</p>
                      <p className='text-xs text-gray-500 mt-1'>Qty: {item.quantity}</p>
                      <p className='text-sm font-[600] text-gray-800 mt-1'>${item.price}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className='space-y-3 mb-6 pb-6 border-b'>
                <div className='flex justify-between text-sm text-gray-600'>
                  <span>Subtotal</span>
                  <span className='font-[600]'>${subtotal}</span>
                </div>
                <div className='flex justify-between text-sm text-gray-600'>
                  <span>Shipping</span>
                  <span className='font-[600]'>${shipping}</span>
                </div>
                <div className='flex justify-between text-sm text-gray-600'>
                  <span>Tax (5%)</span>
                  <span className='font-[600]'>${tax}</span>
                </div>
                <div className='flex justify-between text-lg font-[700] text-gray-800 pt-3'>
                  <span>Total</span>
                  <span className='text-cyan-600'>${total}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <Button
                fullWidth
                className='bg-cyan-500 text-white hover:bg-cyan-600'
                style={{
                  textTransform: 'uppercase',
                  fontSize: '14px',
                  fontWeight: '600',
                  padding: '12px 20px'
                }}
              >
                Checkout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Address Drawer */}
      <Drawer
        anchor='right'
        open={openDrawer}
        onClose={handleCloseDrawer}
      >
        <div className='w-96 p-6 flex flex-col h-full'>
          {/* Header */}
          <div className='flex justify-between items-center mb-6'>
            <h3 className='text-xl font-[700] text-gray-800'>Add New Address</h3>
            <IconButton onClick={handleCloseDrawer} size='small'>
              <CloseIcon />
            </IconButton>
          </div>

          {/* Form */}
          <div className='flex-1 overflow-y-auto space-y-4 mb-6'>
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

          {/* Buttons */}
          <div className='flex gap-3'>
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
              Save Address
            </Button>
          </div>
        </div>
      </Drawer>
    </div>
  )
}

export default CheckoutPage
