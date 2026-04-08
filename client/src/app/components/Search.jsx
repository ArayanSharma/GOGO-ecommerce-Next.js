import React, { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { IoSearchOutline } from "react-icons/io5";
import { MdClose } from 'react-icons/md'



const Search = () => {
  const router = useRouter()
  const pathname = usePathname()
  const [query, setQuery] = useState('')

  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    const urlQuery = params.get('search') || ''
    setQuery(urlQuery)
  }, [pathname])

  const submitSearch = (e) => {
    e.preventDefault()
    const value = query.trim()
    if (!value) {
      router.push('/products')
      return
    }

    router.push(`/products?search=${encodeURIComponent(value)}`)
  }

  const clearSearch = () => {
    setQuery('')
    router.push('/products')
  }

  return (
    <form
      onSubmit={submitSearch}
      className='search group bg-white/95 w-full h-[50px] rounded-xl px-3 relative border border-slate-200 flex items-center shadow-sm hover:shadow-md focus-within:ring-2 focus-within:ring-cyan-300 transition-all duration-200'
    >
      <span className='mr-2 text-slate-500 group-focus-within:text-cyan-600 transition-colors'>
        <IoSearchOutline size={22} />
      </span>
      <input
        type='text'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder='Search for products, brands and more'
        className='w-full h-full outline-none border-0 bg-transparent text-[15px] text-slate-700 placeholder:text-slate-400 pr-20'
      />
      {query && (
        <button
          type='button'
          onClick={clearSearch}
          aria-label='Clear search'
          className='w-8 h-8 rounded-full bg-slate-100 absolute top-[9px] right-12 z-50 flex items-center justify-center cursor-pointer hover:bg-slate-200 transition-colors'
        >
          <MdClose size={18} />
        </button>
      )}
      <button
        type='submit'
        aria-label='Search products'
        className='w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white absolute top-[9px] right-2 z-50 flex items-center justify-center cursor-pointer hover:from-blue-700 hover:to-cyan-600 transition-colors'
      >
        <IoSearchOutline size={16} />
      </button>
    </form>
  )
}

export default Search
