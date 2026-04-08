
'use client'

import { FormControlLabel, FormGroup, Checkbox, Slider } from '@mui/material'
import React, { useState } from 'react'
import { IoChevronUp, IoChevronDown } from 'react-icons/io5'
import { GiCarrot, GiMeat, GiBreadSlice, GiCoffeeCup, GiIceCreamCone, GiCookie, } from 'react-icons/gi'

const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

const formatINR = (value) => inrFormatter.format(Number(value || 0))

const Sidebar = () => {
  const [categoryOpen, setCategoryOpen] = useState(true)
  const [ratingOpen, setRatingOpen] = useState(true)
  const [priceRange, setPriceRange] = useState([0, 100])

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue)
  }

  return (
    <div>
      <aside className='sticky top-[100px] w-full h-screen bg-white p-5 shadow-lg overflow-y-auto'>
        <div className='box'>
          {/* Categories Section */}
          <div className='mb-6'>
            <div 
              className='flex items-center justify-between cursor-pointer mb-3'
              onClick={() => setCategoryOpen(!categoryOpen)}
            >
              <h3 className='text-base font-semibold text-gray-800'>Shop by Category</h3>
              {categoryOpen ? (
                <IoChevronUp size={20} className='text-gray-600' />
              ) : (
                <IoChevronDown size={20} className='text-gray-600' />
              )}
            </div>

            {categoryOpen && (
              <div className='scroll overflow-y-auto max-h-[220px] mb-4'>
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox size='small' />}
                    label={<span className='text-sm text-gray-700 flex items-center gap-2'><GiCarrot size={16} /> Fruits & Vegetables</span>}
                    sx={{ marginBottom: '8px', '& .MuiCheckbox-root': { padding: '4px' } }}
                  />
                  <FormControlLabel
                    control={<Checkbox size='small' />}
                    label={<span className='text-sm text-gray-700 flex items-center gap-2'><GiMeat size={16} /> Meats & Seafood</span>}
                    sx={{ marginBottom: '8px', '& .MuiCheckbox-root': { padding: '4px' } }}
                  />
                  <FormControlLabel
                    control={<Checkbox size='small' />}
                    label={<span className='text-sm text-gray-700 flex items-center gap-2'><GiBreadSlice size={16} /> Breakfast & Dairy</span>}
                    sx={{ marginBottom: '8px', '& .MuiCheckbox-root': { padding: '4px' } }}
                  />
                  <FormControlLabel
                    control={<Checkbox size='small' />}
                    label={<span className='text-sm text-gray-700 flex items-center gap-2'><GiBreadSlice size={16} /> Breads & Bakery</span>}
                    sx={{ marginBottom: '8px', '& .MuiCheckbox-root': { padding: '4px' } }}
                  />
                  <FormControlLabel
                    control={<Checkbox size='small' />}
                    label={<span className='text-sm text-gray-700 flex items-center gap-2'><GiCoffeeCup size={16} /> Beverages</span>}
                    sx={{ marginBottom: '8px', '& .MuiCheckbox-root': { padding: '4px' } }}
                  />
                  <FormControlLabel
                    control={<Checkbox size='small' />}
                    label={<span className='text-sm text-gray-700 flex items-center gap-2'><GiIceCreamCone size={16} /> Frozen Foods</span>}
                    sx={{ marginBottom: '8px', '& .MuiCheckbox-root': { padding: '4px' } }}
                  />
                  <FormControlLabel
                    control={<Checkbox size='small' />}
                    label={<span className='text-sm text-gray-700 flex items-center gap-2'><GiCookie size={16} /> Biscuits & Snacks</span>}
                    sx={{ marginBottom: '8px', '& .MuiCheckbox-root': { padding: '4px' } }}
                  />
                </FormGroup>
              </div>
            )}
          </div>

          {/* Price Filter Section */}
          <div className='mb-6'>
            <h4 className='text-base font-semibold text-gray-800 mb-3'>Filter By Price</h4>
            <Slider
              value={priceRange}
              onChange={handlePriceChange}
              valueLabelDisplay='off'
              min={0}
              max={1000}
              sx={{
                color: '#10b981',
                '& .MuiSlider-thumb': {
                  backgroundColor: '#10b981',
                  border: '2px solid white',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                },
                '& .MuiSlider-track': {
                  backgroundColor: '#10b981',
                  border: 'none',
                },
                '& .MuiSlider-rail': {
                  backgroundColor: '#e5e7eb',
                },
              }}
            />
            <div className='flex justify-between mt-2 text-xs text-gray-600'>
              <span>{formatINR(priceRange[0])}</span>
              <span>{formatINR(priceRange[1])}</span>
            </div>
          </div>

          {/* Rating Filter Section */}
          <div>
            <div 
              className='flex items-center justify-between cursor-pointer mb-3'
              onClick={() => setRatingOpen(!ratingOpen)}
            >
              <h4 className='text-base font-semibold text-gray-800'>Filter By Rating</h4>
              {ratingOpen ? (
                <IoChevronUp size={20} className='text-gray-600' />
              ) : (
                <IoChevronDown size={20} className='text-gray-600' />
              )}
            </div>

            {ratingOpen && (
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox size='small' />}
                  label={<span className='text-sm'>⭐⭐⭐⭐⭐</span>}
                  sx={{ marginBottom: '8px', '& .MuiCheckbox-root': { padding: '4px' } }}
                />
                <FormControlLabel
                  control={<Checkbox size='small' />}
                  label={<span className='text-sm'>⭐⭐⭐⭐</span>}
                  sx={{ marginBottom: '8px', '& .MuiCheckbox-root': { padding: '4px' } }}
                />
                <FormControlLabel
                  control={<Checkbox size='small' />}
                  label={<span className='text-sm'>⭐⭐⭐</span>}
                  sx={{ marginBottom: '8px', '& .MuiCheckbox-root': { padding: '4px' } }}
                />
                <FormControlLabel
                  control={<Checkbox size='small' />}
                  label={<span className='text-sm'>⭐⭐</span>}
                  sx={{ marginBottom: '8px', '& .MuiCheckbox-root': { padding: '4px' } }}
                />
                <FormControlLabel
                  control={<Checkbox size='small' />}
                  label={<span className='text-sm'>⭐</span>}
                  sx={{ marginBottom: '8px', '& .MuiCheckbox-root': { padding: '4px' } }}
                />
              </FormGroup>
            )}
          </div>
        </div>
      </aside>
    </div>
  )
}

export default Sidebar
