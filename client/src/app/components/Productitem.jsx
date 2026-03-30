import React from 'react'
import Link from 'next/link'
import Rating from '@mui/material/Rating'
import Button from '@mui/material/Button';

const Productitem = ({ id = '1', category = 'Bingo', name = '100 Percent Apple Juice - 64 fl oz Bottle', image = '/p1.webp', rating = 4, price = 25.99, originalPrice = 30.10 }) => {
  return (
    <div className='productitem shadow-md rounded-md bg-white p-4 w-full group'>
        <div className='img overflow-hidden rounded-md mb-3'>
        <Link href={`/productdet/${id}`}>
            <img src={image} alt={name} className='w-full h-auto group-hover:scale-110 transition-transform duration-300' />
          </Link>
        </div>
        <div className='flex flex-col gap-2'>
            <p className='text-gray-500 text-sm font-[500]'>{category}</p>
            <Link href={`/productdet/${id}`} className='text-center text-[15px] font-[600] text-gray-700 group-hover:text-blue-600 transition-colors line-clamp-2'>
              {name}
            </Link>
            <div className='flex justify-center'>
              <Rating name="read-only" value={rating} readOnly size='small'/>
            </div>
            <div className='flex justify-center gap-2 mt-2'>
                <span className='text-red-600 text-lg font-[600]'>${price.toFixed(2)}</span>
                <span className='text-gray-400 text-lg font-[500] line-through'>${originalPrice.toFixed(2)}</span>
            </div>
        </div>
        
        <Button className='w-full mt-3 border-2 border-cyan-500 text-cyan-500 hover:bg-cyan-500 hover:text-white transition-all' style={{textTransform: 'uppercase', fontSize: '12px', fontWeight: '600'}}>Add to Cart</Button>
    </div>
  )
}

export default Productitem
