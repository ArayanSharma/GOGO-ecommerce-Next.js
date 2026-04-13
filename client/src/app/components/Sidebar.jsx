
'use client'

import { FormControlLabel, FormGroup, Checkbox, Slider } from '@mui/material'
import React, { useState } from 'react'
import { IoChevronUp, IoChevronDown } from 'react-icons/io5'
import { GiCarrot, GiMeat, GiBreadSlice, GiCoffeeCup, GiIceCreamCone, GiCookie, GiBabyFace } from 'react-icons/gi'
import { FaHeartbeat } from 'react-icons/fa'

const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

const formatINR = (value) => inrFormatter.format(Number(value || 0))

const CATEGORIES = [
  { label: 'Fruits & Vegetables', icon: GiCarrot, color: 'text-green-600', bgColor: 'bg-green-100' },
  { label: 'Meats & Seafood', icon: GiMeat, color: 'text-red-600', bgColor: 'bg-red-100' },
  { label: 'Breakfast & Dairy', icon: GiBreadSlice, color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
  { label: 'Breads & Bakery', icon: GiBreadSlice, color: 'text-amber-600', bgColor: 'bg-amber-100' },
  { label: 'Beverages', icon: GiCoffeeCup, color: 'text-blue-600', bgColor: 'bg-blue-100' },
  { label: 'Frozen Foods', icon: GiIceCreamCone, color: 'text-cyan-600', bgColor: 'bg-cyan-100' },
  { label: 'Biscuits & Snacks', icon: GiCookie, color: 'text-orange-600', bgColor: 'bg-orange-100' },
  { label: 'Baby & Pregnancy', icon: GiBabyFace, color: 'text-pink-600', bgColor: 'bg-pink-100' },
  { label: 'Healthcare', icon: FaHeartbeat, color: 'text-rose-600', bgColor: 'bg-rose-100' },
]

const Sidebar = ({ onFiltersChange }) => {
  const [categoryOpen, setCategoryOpen] = useState(true)
  const [ratingOpen, setRatingOpen] = useState(false)
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedRatings, setSelectedRatings] = useState([])

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue)
    // Notify parent of filter change
    if (onFiltersChange) {
      onFiltersChange({
        categories: selectedCategories,
        priceRange: newValue,
        ratings: selectedRatings,
      })
    }
  }

  const toggleCategory = (category) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category]
    
    setSelectedCategories(newCategories)
    
    if (onFiltersChange) {
      onFiltersChange({
        categories: newCategories,
        priceRange: priceRange,
        ratings: selectedRatings,
      })
    }
  }

  const toggleRating = (rating) => {
    const newRatings = selectedRatings.includes(rating)
      ? selectedRatings.filter(r => r !== rating)
      : [...selectedRatings, rating]
    
    setSelectedRatings(newRatings)
    
    if (onFiltersChange) {
      onFiltersChange({
        categories: selectedCategories,
        priceRange: priceRange,
        ratings: newRatings,
      })
    }
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setSelectedRatings([])
    setPriceRange([0, 10000])
    
    if (onFiltersChange) {
      onFiltersChange({
        categories: [],
        priceRange: [0, 10000],
        ratings: [],
      })
    }
  }

  return (
    <div>
      <aside className='sticky top-24 w-full h-screen bg-linear-to-b from-emerald-50/50 to-white p-3 sm:p-4 md:p-5 shadow-sm overflow-y-auto rounded-lg sm:rounded-2xl border border-emerald-100/50'>
        <div className='space-y-4 sm:space-y-6'>
          {/* Categories Section */}
          <div className='rounded-lg sm:rounded-2xl border border-emerald-100 bg-white/80 backdrop-blur-sm overflow-hidden'>
            <button
              onClick={() => setCategoryOpen(!categoryOpen)}
              className='w-full flex items-center justify-between p-2 sm:p-4 hover:bg-emerald-50/50 transition-colors group'
            >
              <div className='flex items-center gap-2'>
                <div className='h-8 sm:h-10 w-8 sm:w-10 rounded-lg bg-linear-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-xs sm:text-base'>
                  🛒
                </div>
                <h3 className='text-xs sm:text-base font-bold text-slate-900'>Shop by Category</h3>
              </div>
              {categoryOpen ? (
                <IoChevronUp size={16} className='sm:size-5 text-emerald-600 group-hover:scale-110 transition-transform' />
              ) : (
                <IoChevronDown size={16} className='sm:size-5 text-emerald-600 group-hover:scale-110 transition-transform' />
              )}
            </button>

            {categoryOpen && (
              <div className='px-3 sm:px-4 pb-3 sm:pb-4 space-y-1 sm:space-y-2 border-t border-emerald-100/50'>
                {CATEGORIES.map((category, index) => {
                  const Icon = category.icon
                  const isSelected = selectedCategories.includes(category.label)
                  
                  return (
                    <button
                      key={index}
                      onClick={() => toggleCategory(category.label)}
                      className={`w-full flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-300 text-xs sm:text-sm ${
                        isSelected
                          ? 'bg-emerald-500 text-white shadow-md scale-105'
                          : `${category.bgColor}/30 text-slate-700 hover:${category.bgColor}/60 hover:scale-102`
                      }`}
                    >
                      <div className={`h-6 sm:h-8 w-6 sm:w-8 flex items-center justify-center rounded-lg flex-shrink-0 ${isSelected ? 'bg-white/20' : category.bgColor}`}>
                        <Icon size={14} className={`sm:size-4.5 ${isSelected ? 'text-white' : category.color}`} />
                      </div>
                      <span className='font-semibold flex-1 text-left'>{category.label}</span>
                      {isSelected && (
                        <span className='text-base sm:text-lg'>✓</span>
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Price Filter Section */}
          <div className='rounded-lg sm:rounded-2xl border border-emerald-100 bg-white/80 backdrop-blur-sm p-3 sm:p-4'>
            <div className='flex items-center gap-2 mb-3 sm:mb-4'>
              <div className='h-8 sm:h-10 w-8 sm:w-10 rounded-lg bg-linear-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white font-bold text-xs sm:text-base'>
                💰
              </div>
              <h4 className='text-xs sm:text-base font-bold text-slate-900'>Filter By Price</h4>
            </div>
            
            <div className='px-2 sm:px-0'>
              <Slider
                value={priceRange}
                onChange={handlePriceChange}
                valueLabelDisplay='off'
                min={0}
                max={10000}
                step={100}
                sx={{
                  color: '#10b981',
                  '& .MuiSlider-thumb': {
                    backgroundColor: '#10b981',
                    border: '3px solid white',
                    boxShadow: '0 2px 8px rgba(16, 185, 129, 0.4)',
                    '&:hover': {
                      boxShadow: '0 2px 12px rgba(16, 185, 129, 0.6)',
                    },
                  },
                  '& .MuiSlider-track': {
                    backgroundColor: 'linear-gradient(to right, #06b6d4, #10b981)',
                    border: 'none',
                  },
                  '& .MuiSlider-rail': {
                    backgroundColor: '#e0f2fe',
                    height: '6px',
                  },
                }}
              />
            </div>

            <div className='mt-3 sm:mt-4 space-y-2'>
              <p className='text-xs text-slate-500 font-semibold uppercase tracking-wide'>Price Range</p>
              <div className='flex items-center justify-between gap-2 sm:gap-3'>
                <div className='flex-1 bg-emerald-50 rounded-lg p-2 text-center'>
                  <p className='text-xs text-slate-600 mb-1'>Min</p>
                  <p className='text-xs sm:text-sm font-bold text-emerald-700'>{formatINR(priceRange[0])}</p>
                </div>
                <span className='text-slate-400'>→</span>
                <div className='flex-1 bg-emerald-50 rounded-lg p-2 text-center'>
                  <p className='text-xs text-slate-600 mb-1'>Max</p>
                  <p className='text-xs sm:text-sm font-bold text-emerald-700'>{formatINR(priceRange[1])}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Rating Filter Section */}
          <div className='rounded-lg sm:rounded-2xl border border-emerald-100 bg-white/80 backdrop-blur-sm overflow-hidden'>
            <button
              onClick={() => setRatingOpen(!ratingOpen)}
              className='w-full flex items-center justify-between p-2 sm:p-4 hover:bg-emerald-50/50 transition-colors group'
            >
              <div className='flex items-center gap-2'>
                <div className='h-8 sm:h-10 w-8 sm:w-10 rounded-lg bg-linear-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-xs sm:text-base'>
                  ⭐
                </div>
                <h4 className='text-xs sm:text-base font-bold text-slate-900'>Filter By Rating</h4>
              </div>
              {ratingOpen ? (
                <IoChevronUp size={16} className='sm:size-5 text-emerald-600 group-hover:scale-110 transition-transform' />
              ) : (
                <IoChevronDown size={16} className='sm:size-5 text-emerald-600 group-hover:scale-110 transition-transform' />
              )}
            </button>

            {ratingOpen && (
              <div className='px-3 sm:px-4 pb-3 sm:pb-4 pt-3 sm:pt-4 space-y-1 sm:space-y-2 border-t border-emerald-100/50'>
                {[5, 4, 3, 2, 1].map((rating) => (
                  <label key={rating} className='flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg sm:rounded-xl hover:bg-amber-50/50 transition-colors cursor-pointer group text-xs sm:text-sm'>
                    <input
                      type='checkbox'
                      checked={selectedRatings.includes(rating)}
                      onChange={() => toggleRating(rating)}
                      className='w-3 sm:w-4 h-3 sm:h-4 rounded'
                    />
                    <span className='font-semibold text-slate-700 flex-1'>
                      {'⭐'.repeat(rating)}
                    </span>
                    <span className='text-xs bg-slate-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg group-hover:bg-amber-100 transition-colors'>
                      {rating === 5 && '5 Stars'}
                      {rating === 4 && '4+ Stars'}
                      {rating === 3 && '3+ Stars'}
                      {rating === 2 && '2+ Stars'}
                      {rating === 1 && '1+ Star'}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Clear Filters Button */}
          <button 
            onClick={clearFilters}
            className='w-full bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-2 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-base transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95'
          >
            Clear All Filters
          </button>
        </div>
      </aside>
    </div>
  )
}

export default Sidebar
