'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Edit, Trash2, Plus, Search, Layers3, Package, CircleDollarSign, Sparkles } from 'lucide-react';

const CATEGORY_ORDER = [
  'Fruits & Vegetables',
  'Meat & Seafood',
  'Breakfast & Bakery',
  'Beverages',
  'Bread & Bakery',
  'Frozen Food',
  'Biscuits & Snacks',
  'Baby & pregnancy',
  'Healtcare',
  'Grocery & Staples',
];

const parseJsonSafely = async (response) => {
  try {
    const text = await response.text();
    if (!text) return null;
    return JSON.parse(text);
  } catch {
    return null;
  }
};

const page = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError('');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const endpoints = ['/api/products', `${apiUrl}/api/products`];
        let response = null;
        let result = null;
        let lastErrorMessage = '';

        for (const endpoint of endpoints) {
          try {
            const currentResponse = await fetch(endpoint);
            const currentResult = await parseJsonSafely(currentResponse);
            const isSuccess = currentResponse.ok && currentResult?.success !== false;

            response = currentResponse;
            result = currentResult;

            if (!currentResponse.ok) {
              lastErrorMessage = currentResult?.message || `Request failed with status ${currentResponse.status}`;
            }

            if (isSuccess) {
              break;
            }
          } catch (endpointError) {
            lastErrorMessage = endpointError?.message || 'Network error';
          }
        }

        if (!response || !response.ok || result?.success === false) {
          throw new Error(result?.message || lastErrorMessage || 'Failed to fetch products');
        }

        setProducts(Array.isArray(result?.data) ? result.data : []);
      } catch (fetchError) {
        console.error('Failed to fetch products:', fetchError);
        setError(fetchError.message || 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const groupedProducts = useMemo(() => {
    const grouped = CATEGORY_ORDER.map((category) => ({
      category,
      products: products.filter((product) => product.category === category),
    })).filter((group) => group.products.length > 0);

    const uncategorized = products.filter((product) => !CATEGORY_ORDER.includes(product.category));

    if (uncategorized.length > 0) {
      grouped.push({ category: 'Other', products: uncategorized });
    }

    return grouped;
  }, [products]);

  const categoryOptions = useMemo(() => {
    const categories = groupedProducts.map((group) => group.category);
    return ['All', ...categories];
  }, [groupedProducts]);

  const filteredGroups = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    const scopedGroups = activeCategory === 'All'
      ? groupedProducts
      : groupedProducts.filter((group) => group.category === activeCategory);

    if (!query) {
      return scopedGroups;
    }

    return scopedGroups
      .map((group) => ({
        ...group,
        products: group.products.filter((product) => {
          const name = String(product.product || product.name || '').toLowerCase();
          const category = String(product.category || '').toLowerCase();
          const section = String(product.section || '').toLowerCase();
          return name.includes(query) || category.includes(query) || section.includes(query);
        }),
      }))
      .filter((group) => group.products.length > 0);
  }, [groupedProducts, searchTerm, activeCategory]);

  const totalStock = useMemo(() => products.reduce((sum, product) => sum + Number(product.stock || 0), 0), [products]);

  const lowStockCount = useMemo(
    () => products.filter((product) => Number(product.stock || 0) <= 10).length,
    [products]
  );

  const totalValue = useMemo(
    () => products.reduce((sum, product) => sum + Number(product.price || 0) * Number(product.stock || 0), 0),
    [products]
  );

  const featuredCount = useMemo(
    () => products.filter((product) => Number(product.sales || 0) >= 10).length,
    [products]
  );

  const inrFormatter = useMemo(
    () =>
      new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 2,
      }),
    []
  );

  const formatPrice = (price) => inrFormatter.format(Number(price || 0));

  const getStockState = (stock) => {
    const numericStock = Number(stock || 0);
    if (numericStock > 25) return { label: 'In stock', className: 'bg-emerald-100 text-emerald-700' };
    if (numericStock > 10) return { label: 'Low stock', className: 'bg-amber-100 text-amber-700' };
    return { label: 'Critical', className: 'bg-red-100 text-red-700' };
  };

  const handleDeleteProduct = async (productId) => {
    if (!productId) return;

    const confirmed = window.confirm('Are you sure you want to delete this product?');
    if (!confirmed) return;

    try {
      setDeletingId(productId);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const endpoints = [`/api/products/${productId}`, `${apiUrl}/api/products/${productId}`];
      const uniqueEndpoints = [...new Set(endpoints)];
      let response = null;
      let result = null;
      let lastErrorMessage = '';

      for (const endpoint of uniqueEndpoints) {
        try {
          const currentResponse = await fetch(endpoint, { method: 'DELETE' });
          const currentResult = await parseJsonSafely(currentResponse);
          const isSuccess = currentResponse.ok && currentResult?.success !== false;

          response = currentResponse;
          result = currentResult;

          if (!currentResponse.ok) {
            lastErrorMessage = currentResult?.message || `Request failed with status ${currentResponse.status}`;
          }

          if (isSuccess) break;
        } catch (endpointError) {
          lastErrorMessage = endpointError?.message || 'Network error';
        }
      }

      if (!response || !response.ok || result?.success === false) {
        throw new Error(result?.message || lastErrorMessage || 'Failed to delete product');
      }

      setProducts((prev) => prev.filter((product) => (product._id || product.id) !== productId));
    } catch (deleteError) {
      console.error('Failed to delete product:', deleteError);
      setError(deleteError.message || 'Failed to delete product');
    } finally {
      setDeletingId('');
    }
  };

  return (
    <div className='p-6 space-y-6 reveal-up-delay'>
      <div className='glass-panel overflow-hidden rounded-3xl border border-emerald-100 relative'>
        <div className='absolute -right-10 -top-10 h-36 w-36 rounded-full bg-yellow-200/50 blur-3xl' />
        <div className='absolute -left-6 -bottom-6 h-28 w-28 rounded-full bg-emerald-200/40 blur-3xl' />
        <div className='relative flex flex-col gap-5 p-6 lg:flex-row lg:items-end lg:justify-between'>
          <div className='max-w-2xl'>
            <p className='text-sm font-semibold uppercase tracking-[0.25em] text-emerald-600'>Inventory control</p>
            <h1 className='mt-2 text-3xl font-bold text-emerald-900 md:text-4xl'>Products</h1>
            <p className='mt-2 text-sm text-slate-600'>Manage product inventory, pricing, stock, and product images from one place.</p>
          </div>

          <div className='flex flex-wrap gap-3'>
            <div className='rounded-2xl border border-emerald-100 bg-white/90 px-4 py-3 shadow-sm'>
              <p className='text-xs font-semibold uppercase tracking-wide text-slate-500'>Total products</p>
              <p className='text-2xl font-bold text-emerald-700'>{products.length}</p>
            </div>
            <div className='rounded-2xl border border-yellow-100 bg-yellow-50/80 px-4 py-3 shadow-sm'>
              <p className='text-xs font-semibold uppercase tracking-wide text-slate-500'>Low stock</p>
              <p className='text-2xl font-bold text-amber-700'>{lowStockCount}</p>
            </div>
            <div className='rounded-2xl border border-emerald-100 bg-emerald-50/70 px-4 py-3 shadow-sm'>
              <p className='text-xs font-semibold uppercase tracking-wide text-slate-500'>Total stock</p>
              <p className='text-2xl font-bold text-emerald-700'>{totalStock}</p>
            </div>
            <div className='rounded-2xl border border-emerald-100 bg-white/90 px-4 py-3 shadow-sm'>
              <p className='text-xs font-semibold uppercase tracking-wide text-slate-500'>Featured</p>
              <p className='text-2xl font-bold text-slate-800'>{featuredCount}</p>
            </div>
          </div>
        </div>
      </div>

      <div className='glass-panel flex flex-col gap-4 rounded-3xl border border-emerald-100 p-4 lg:flex-row lg:items-center lg:justify-between'>
        <div className='flex flex-wrap gap-2'>
          <span className='rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700'>Live products</span>
          <span className='rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-amber-700'>Cloudinary images</span>
          <span className='rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm ring-1 ring-emerald-100'>Auto grouped by category</span>
          <span className='rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm ring-1 ring-emerald-100'>Search enabled</span>
        </div>

        <div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
          <div className='relative min-w-65'>
            <Search size={18} className='pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400' />
            <input
              type='text'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder='Search products, category, section'
              className='w-full rounded-2xl border border-emerald-200 bg-white/95 py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200'
            />
          </div>

          <Link
            href='/addproduct'
            className='cta-glow inline-flex items-center gap-2 self-start rounded-2xl bg-emerald-600 px-5 py-3 font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-700'
          >
            <Plus size={18} />
            Add Product
          </Link>
        </div>
      </div>

      <div className='glass-panel rounded-3xl border border-emerald-100 p-4'>
        <div className='mb-3 flex items-center justify-between gap-4'>
          <div>
            <p className='text-sm font-semibold uppercase tracking-[0.25em] text-emerald-600'>Browse by category</p>
            <p className='mt-1 text-sm text-slate-600'>Switch the UI to focus on a specific product category.</p>
          </div>
          <span className='rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm ring-1 ring-emerald-100'>
            {activeCategory === 'All' ? 'All categories' : activeCategory}
          </span>
        </div>

        <div className='flex flex-wrap gap-2'>
          {categoryOptions.map((category) => {
            const isActive = activeCategory === category;

            return (
              <button
                key={category}
                type='button'
                onClick={() => setActiveCategory(category)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/25'
                    : 'bg-white text-slate-600 ring-1 ring-emerald-100 hover:bg-emerald-50 hover:text-emerald-700'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      {loading && (
        <div className='glass-panel rounded-2xl p-4 text-slate-600'>
          Loading products...
        </div>
      )}

      {error && (
        <div className='rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700'>
          {error}
        </div>
      )}

      <div className='space-y-6'>
        {filteredGroups.map((group) => (
          <div key={group.category} className='glass-panel overflow-hidden rounded-3xl border border-emerald-100'>
            <div className='flex items-center justify-between gap-4 border-b border-emerald-100 bg-emerald-50/80 px-5 py-4'>
              <div>
                <h2 className='text-lg font-semibold text-emerald-900'>{group.category}</h2>
                <p className='text-xs text-slate-500'>{group.products.length} product{group.products.length > 1 ? 's' : ''}</p>
              </div>
              <span className='rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-amber-700'>Category view</span>
            </div>

            <div className='grid gap-5 p-5 md:grid-cols-2 xl:grid-cols-3'>
              {group.products.map((product) => {
                const stockState = getStockState(product.stock);
                const productId = product._id || product.id;
                const productName = product.product || product.name || '-';

                return (
                  <article key={productId} className='saturated-card overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-lg'>
                    <div className='relative h-48 overflow-hidden bg-emerald-50'>
                      {product.image ? (
                        <img src={product.image} alt={productName} className='h-full w-full object-cover transition duration-500 hover:scale-105' />
                      ) : (
                        <div className='flex h-full w-full items-center justify-center text-sm font-semibold text-slate-500'>No image</div>
                      )}

                      <div className='absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-emerald-700 shadow-sm backdrop-blur'>
                        {String(productId).slice(-8)}
                      </div>

                      <div className='absolute right-4 top-4 rounded-full bg-yellow-400 px-3 py-1 text-xs font-semibold text-amber-950 shadow-sm'>
                        {product.section || 'Latest Products'}
                      </div>
                    </div>

                    <div className='space-y-4 p-5'>
                      <div className='flex items-start justify-between gap-3'>
                        <div>
                          <h3 className='text-lg font-bold text-slate-900'>{productName}</h3>
                          <p className='mt-1 text-xs uppercase tracking-[0.2em] text-slate-500'>{group.category}</p>
                        </div>
                        <div className='rounded-2xl bg-emerald-50 px-3 py-2 text-right'>
                          <p className='text-[11px] font-semibold uppercase tracking-wide text-slate-500'>Price</p>
                          <p className='text-base font-bold text-emerald-700'>{formatPrice(product.price)}</p>
                        </div>
                      </div>

                      <div className='grid grid-cols-3 gap-3'>
                        <div className='rounded-2xl bg-emerald-50/80 p-3 text-center'>
                          <p className='text-[11px] font-semibold uppercase tracking-wide text-slate-500'>Sales</p>
                          <p className='mt-1 text-lg font-bold text-slate-900'>{product.sales}</p>
                        </div>
                        <div className='rounded-2xl bg-yellow-50/80 p-3 text-center'>
                          <p className='text-[11px] font-semibold uppercase tracking-wide text-slate-500'>Stock</p>
                          <p className='mt-1 text-lg font-bold text-slate-900'>{product.stock}</p>
                        </div>
                        <div className={`rounded-2xl p-3 text-center ${stockState.className}`}>
                          <p className='text-[11px] font-semibold uppercase tracking-wide'>Status</p>
                          <p className='mt-1 text-sm font-bold'>{stockState.label}</p>
                        </div>
                      </div>

                      <div className='flex items-center justify-between gap-3'>
                        <button type='button' className='inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50 hover:border-emerald-300'>
                          <Edit size={16} />
                          Edit
                        </button>
                        <button
                          type='button'
                          onClick={() => handleDeleteProduct(productId)}
                          disabled={deletingId === productId}
                          className='inline-flex items-center gap-2 rounded-full border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60'
                        >
                          <Trash2 size={16} />
                          {deletingId === productId ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {!loading && !error && products.length > 0 && groupedProducts.length === 0 && (
        <div className='glass-panel rounded-3xl p-12 text-center'>
          <p className='text-lg font-semibold text-slate-700'>No products matched the selected category.</p>
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <div className='glass-panel rounded-3xl p-12 text-center'>
          <p className='text-lg font-semibold text-slate-700'>No products found.</p>
          <p className='mt-2 text-sm text-slate-500'>Add your first product to start building the catalog.</p>
          <Link href='/addproduct' className='cta-glow mt-6 inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-700'>
            <Plus size={18} />
            Add Product
          </Link>
        </div>
      )}
    </div>
  )
}

export default page
