
'use client'

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Productitem from './Productitem';
import { fetchProducts } from '../utils/api';

const getProductsForRow = (products, title) => {
  const normalizedTitle = String(title || '').toLowerCase();

  if (normalizedTitle.includes('latest')) {
    return products.filter((product) => String(product.section || '').toLowerCase() === 'latest products');
  }

  if (normalizedTitle.includes('new arrivals')) {
    return products.filter((product) => String(product.section || '').toLowerCase() === 'new arrivals');
  }

  if (normalizedTitle.includes('breakfast')) {
    return products.filter((product) => String(product.category || '').toLowerCase() === 'breakfast & bakery');
  }

  return products;
};

const Productrow = (Props) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchProducts();
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch homepage products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const visibleProducts = useMemo(
    () => getProductsForRow(products, Props.title).slice(0, 6),
    [products, Props.title]
  );

  return (
    <section className='bg-white py-3 sm:py-4 md:py-6 mt-4 sm:mt-6 md:mt-8 rounded-lg md:rounded-2xl shadow-sm ring-1 ring-emerald-100'>
      <div className='container'>
        <div className='mb-4 sm:mb-5 md:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-6'>
          <div className='flex-1'>
            <p className='text-xs font-semibold uppercase tracking-[0.25em] text-emerald-600'>Featured collection</p>
            <h2 className='text-lg sm:text-xl md:text-2xl font-bold text-slate-900'>{Props.title}</h2>
          </div>
          <div className='flex items-center justify-start sm:justify-end'>
            <Link href='/products' className='text-emerald-600 font-semibold flex items-center gap-2 hover:gap-4 transition-all text-sm sm:text-base'>
              View All <span>→</span>
            </Link>
          </div>
        </div>

        {loading ? (
          <div className='rounded-lg md:rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 sm:p-5 md:p-6 text-slate-600 text-sm sm:text-base'>Loading products...</div>
        ) : visibleProducts.length > 0 ? (
          <div className='grid gap-3 sm:gap-4 md:gap-6 mt-5 sm:mt-6 md:mt-8 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
            {visibleProducts.map((product) => (
              <Productitem key={product.id} {...product} />
            ))}
          </div>
        ) : (
          <div className='rounded-lg md:rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 sm:p-5 md:p-6 text-slate-600 text-sm sm:text-base'>
            No products available for this section yet.
          </div>
        )}
      </div>
    </section>
  )
}

export default Productrow
