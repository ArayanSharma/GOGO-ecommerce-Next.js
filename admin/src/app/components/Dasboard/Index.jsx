import React from 'react'
import Dcard from './Dcard'

const Index = () => {
  return (
    <div className='grid grid-cols-4 gap-6'>
      
      <Dcard title="Total Users" count="1,234" icon="User" bg="from-blue-500 to-purple-500" link="/users" />

      <Dcard title="Total Orders" count="1,234" icon="User" bg="from-green-500 to-teal-500" link="/orders" />

      <Dcard title="Total Products" count="1,234" icon="User" bg="from-yellow-500 to-orange-500" link="/products" />

      <Dcard title="Total Revenue" count="1,234" icon="User" bg="from-red-500 to-pink-500" link="/revenue" />
      
      
    </div>
  )
}

export default Index
