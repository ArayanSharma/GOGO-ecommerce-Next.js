'use client'
import React, { useEffect, useMemo, useState } from 'react'
import Sidebar from '../components/Sidebar'
import { IoChevronDown } from 'react-icons/io5'
import Productitem from '../components/Productitem'
import Pagination from '@mui/material/Pagination';
import { fetchProducts } from '../utils/api'
import { usePathname } from 'next/navigation'
import Link from 'next/link'


const page = () => {
    const pathname = usePathname()
  const [sortOpen, setSortOpen] = useState(false)
  const [sortOption, setSortOption] = useState('Name, A to Z')
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchText, setSearchText] = useState('')
    const [filters, setFilters] = useState({
      categories: [],
      priceRange: [0, 10000],
      ratings: [],
    })
    const searchQuery = searchText.trim().toLowerCase()

    useEffect(() => {
        if (typeof window === 'undefined') return
        const params = new URLSearchParams(window.location.search)
        const q = params.get('search') || ''
        setSearchText(q)
    }, [pathname])

    useEffect(() => {
        const loadProducts = async () => {
            try {
                setLoading(true)
                const data = await fetchProducts()
                setProducts(data)
            } catch (error) {
                console.error('Failed to load storefront products:', error)
            } finally {
                setLoading(false)
            }
        }

        loadProducts()
    }, [])

  const handleSort = (option) => {
    setSortOption(option)
    setSortOpen(false)
  }

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters)
  }

    const filteredProducts = useMemo(() => {
        let result = products

        // Filter by search query
        if (searchQuery) {
            result = result.filter((item) => {
                const name = String(item.name || item.product || '').toLowerCase()
                const category = String(item.category || '').toLowerCase()
                const section = String(item.section || '').toLowerCase()
                return name.includes(searchQuery) || category.includes(searchQuery) || section.includes(searchQuery)
            })
        }

        // Filter by selected categories
        if (filters.categories.length > 0) {
            result = result.filter((item) => {
                const itemCategory = String(item.category || '')
                return filters.categories.some(cat => itemCategory.includes(cat) || cat.includes(itemCategory))
            })
        }

        // Filter by price range
        result = result.filter((item) => {
            const price = Number(item.price || 0)
            return price >= filters.priceRange[0] && price <= filters.priceRange[1]
        })

        // Filter by rating (if ratings are selected)
        if (filters.ratings.length > 0) {
            result = result.filter((item) => {
                const itemRating = Math.ceil(Number(item.rating || 0))
                return filters.ratings.some(rating => itemRating >= rating)
            })
        }

        return result
    }, [products, searchQuery, filters])

    const sortedProducts = useMemo(() => {
        const items = [...filteredProducts]

        switch (sortOption) {
            case 'Name, Z to A':
                return items.sort((a, b) => String(b.name || b.product || '').localeCompare(String(a.name || a.product || '')))
            case 'Price, Low to High':
                return items.sort((a, b) => Number(a.price || 0) - Number(b.price || 0))
            case 'Price, High to Low':
                return items.sort((a, b) => Number(b.price || 0) - Number(a.price || 0))
            case 'Name, A to Z':
            default:
                return items.sort((a, b) => String(a.name || a.product || '').localeCompare(String(b.name || b.product || '')))
        }
    }, [filteredProducts, sortOption])

  return (
    <div>
        <section className='py-3 sm:py-4 md:py-5 bg-white relative'>
            <div className='container'>
                {/* Sort By - Responsive Positioning */}
                <div className='flex items-center justify-between sm:justify-end gap-2 sm:gap-3 mb-4 sm:mb-0'>
                    <span className='text-xs sm:text-sm text-gray-800 font-600'> Sort By </span>

                    <div className='relative'>
                        <button 
                            onClick={() => setSortOpen(!sortOpen)}
                            className='flex items-center gap-2 px-2 sm:px-4 py-1.5 sm:py-2 bg-white border border-gray-300 rounded-lg text-xs sm:text-sm text-gray-700 font-medium hover:bg-gray-50 transition-colors'
                        >
                            <span className='hidden sm:inline'>{sortOption}</span>
                            <span className='sm:hidden'>Sort</span>
                            <IoChevronDown size={16} className={`transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {sortOpen && (
                            <div className='absolute top-full right-0 mt-2 w-max bg-white border border-gray-300 rounded-lg shadow-lg z-50'>
                                <button 
                                    onClick={() => handleSort('Name, A to Z')}
                                    className='block w-full text-left px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-700 hover:bg-gray-100 transition-colors border-b border-gray-200 last:border-b-0 whitespace-nowrap'
                                >
                                    Name, A to Z
                                </button>
                                <button 
                                    onClick={() => handleSort('Name, Z to A')}
                                    className='block w-full text-left px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-700 hover:bg-gray-100 transition-colors border-b border-gray-200 last:border-b-0 whitespace-nowrap'
                                >
                                    Name, Z to A
                                </button>
                                <button 
                                    onClick={() => handleSort('Price, Low to High')}
                                    className='block w-full text-left px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-700 hover:bg-gray-100 transition-colors border-b border-gray-200 last:border-b-0 whitespace-nowrap'
                                >
                                    Price, Low to High
                                </button>
                                <button 
                                    onClick={() => handleSort('Price, High to Low')}
                                    className='block w-full text-left px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-700 hover:bg-gray-100 transition-colors border-b border-gray-200 last:border-b-0 whitespace-nowrap'
                                >
                                    Price, High to Low
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Layout - Responsive Flex */}
                <div className='flex flex-col lg:flex-row gap-4 md:gap-6 mt-6'>
                    {/* Sidebar - Hidden on Mobile, Visible on Large Screens */}
                    <div className='hidden lg:block lg:w-1/4 flex-shrink-0'>
                        <Sidebar onFiltersChange={handleFiltersChange} />
                    </div>

                    {/* Right Content - Full Width on Mobile, 3/4 Width on Large Screens */}
                    <div className='w-full lg:w-3/4'> 
                                                {searchQuery && (
                                                    <div className='mb-3 sm:mb-4 flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-2 sm:gap-3 rounded-lg sm:rounded-xl border border-cyan-100 bg-cyan-50/70 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm'>
                                                        <p className='text-slate-700'>
                                                            Search results for: <span className='font-semibold text-slate-900'>"{searchText}"</span>
                                                        </p>
                                                        <span className='rounded-full bg-white px-2 sm:px-3 py-0.5 sm:py-1 text-xs font-semibold text-cyan-700 ring-1 ring-cyan-200'>
                                                            {sortedProducts.length} items
                                                        </span>
                                                        <Link href='/products' className='rounded-lg bg-white px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50 sm:ml-auto'>
                                                            Clear Search
                                                        </Link>
                                                    </div>
                                                )}
                                                {loading ? (
                                                    <div className='rounded-lg sm:rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 sm:p-6 text-xs sm:text-sm text-slate-600'>Loading products...</div>
                                                ) : sortedProducts.length === 0 ? (
                                                    <div className='rounded-lg sm:rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 sm:p-6 text-xs sm:text-sm text-slate-600'>No products found for this search.</div>
                                                ) : (
                                                    <div className='grid gap-3 sm:gap-4 md:gap-5 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
                                                        {sortedProducts.map((product) => (
                                                            <Productitem key={product.id} {...product} />
                                                        ))}
                                                    </div>
                                                )}
                    </div>
                </div>

                {/* Pagination - Centered at Bottom */}
                <div className='flex items-center justify-center mt-8 py-6'>
                    <Pagination 
                        count={10} 
                        showFirstButton 
                        showLastButton 
                        sx={{
                            '& .MuiButtonBase-root': {
                                color: '#6b7280',
                            },
                            '& .MuiButtonBase-root.Mui-selected': {
                                backgroundColor: '#10b981',
                                color: '#fff',
                                borderRadius: '50%',
                                '&:hover': {
                                    backgroundColor: '#059669',
                                },
                            },
                        }}
                    />
                </div>
            </div>
        </section>
      
    </div>
  )
}

export default page
