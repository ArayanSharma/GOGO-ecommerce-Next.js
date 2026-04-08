
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
    <section className='bg-white py-4 mt-6 rounded-2xl shadow-sm ring-1 ring-emerald-100'>
      <div className='container'>
        <div className='mb-6 flex items-center justify-between gap-6'>
          <div className='coll w-[30%]'>
            <p className='text-xs font-semibold uppercase tracking-[0.25em] text-emerald-600'>Featured collection</p>
            <h2 className='text-2xl font-bold text-slate-900'>{Props.title}</h2>
          </div>
          <div className='coll w-[70%] flex items-center justify-end'>
            <Link href='/products' className='text-emerald-600 font-semibold flex items-center gap-2 hover:gap-4 transition-all'>
              View All <span>→</span>
            </Link>
          </div>
        </div>

        {loading ? (
          <div className='rounded-2xl border border-emerald-100 bg-emerald-50/50 p-6 text-slate-600'>Loading products...</div>
        ) : visibleProducts.length > 0 ? (
          <div className='grid grid-cols-2 gap-4 mt-8 lg:grid-cols-3 xl:grid-cols-6'>
            {visibleProducts.map((product) => (
              <Productitem key={product.id} {...product} />
            ))}
          </div>
        ) : (
          <div className='rounded-2xl border border-emerald-100 bg-emerald-50/50 p-6 text-slate-600'>
            No products available for this section yet.
          </div>
        )}
      </div>
    </section>
  )
}

export default Productrow
