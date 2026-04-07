import React from 'react'
import Dcard from './Dcard'

const Index = () => {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 reveal-up'>
      
      <Dcard title="Total Users" count="1,234" icon="User" bg="bg-emerald-600" link="/users" />

      <Dcard title="Total Orders" count="1,234" icon="User" bg="bg-amber-500" link="/orders" />

      <Dcard title="Total Products" count="1,234" icon="User" bg="bg-teal-500" link="/products" />

      <Dcard title="Total Revenue" count="1,234" icon="User" bg="bg-yellow-500" link="/revenue" />
      
      
    </div>
  )
}

export default Index
