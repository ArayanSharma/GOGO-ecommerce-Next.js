import React from 'react'
import Link from 'next/link'
import Rating from '@mui/material/Rating'
import Button from '@mui/material/Button';

const Productitem = ({
  id = '1',
  category = 'Bingo',
  name = '100 Percent Apple Juice - 64 fl oz Bottle',
  image = '/p1.webp',
  rating = 4,
  price = 25.99,
  originalPrice = 30.10,
}) => {
  const safePrice = Number(price || 0);
  const safeOriginalPrice = Number(originalPrice || safePrice || 0);

  return (
    <div className='productitem group w-full rounded-2xl border border-emerald-100 bg-white p-4 shadow-md transition hover:-translate-y-1 hover:shadow-xl'>
        <div className='img mb-3 overflow-hidden rounded-xl bg-emerald-50'>
        <Link href={`/productdet/${id}`}>
            <img src={image} alt={name} className='w-full h-auto group-hover:scale-110 transition-transform duration-300' />
          </Link>
        </div>
        <div className='flex flex-col gap-2'>
            <p className='text-sm font-semibold text-emerald-600'>{category}</p>
            <Link href={`/productdet/${id}`} className='text-center text-[15px] font-bold text-slate-800 group-hover:text-emerald-700 transition-colors line-clamp-2'>
              {name}
            </Link>
            <div className='flex justify-center'>
              <Rating name="read-only" value={rating} readOnly size='small'/>
            </div>
            <div className='flex justify-center gap-2 mt-2'>
                <span className='text-red-600 text-lg font-bold'>${safePrice.toFixed(2)}</span>
                <span className='text-slate-400 text-lg font-medium line-through'>${safeOriginalPrice.toFixed(2)}</span>
            </div>
        </div>
        
        <Button className='w-full mt-3 border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all' style={{textTransform: 'uppercase', fontSize: '12px', fontWeight: '600'}}>Add to Cart</Button>
    </div>
  )
}

export default Productitem
