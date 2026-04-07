'use client'

import React from 'react'
import Dashboard from './components/Dasboard/Index'
import Products from './components/Products/page'

const page = () => {
  return (
    <div className='w-full h-full space-y-8'>
      <Dashboard />
      <Products/>

    </div>
    
    
  )
}

export default page
