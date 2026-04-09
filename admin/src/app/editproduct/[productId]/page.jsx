'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation';
import { BadgeCheck, Layers3, Package, Sparkles, UploadCloud, CircleDollarSign, ShoppingBag, ArrowLeft } from 'lucide-react';

const CATEGORY_OPTIONS = [
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
const SECTION_OPTIONS = ['Latest Products', 'New Arrivals'];

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
  const router = useRouter();
  const params = useParams();
  const productId = params.productId;
  
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [formData, setFormData] = useState({
    product: '',
    category: 'Fruits & Vegetables',
    section: 'Latest Products',
    price: '',
    sales: '',
    stock: '',
  });

  const [imagePreview, setImagePreview] = useState(null);
  const selectedImage = imagePreview || imageUrl;
  const filledFields = [
    formData.product,
    formData.category,
    formData.section,
    formData.price,
    formData.sales,
    formData.stock,
    imageUrl,
  ].filter(Boolean).length;
  const completionPercent = Math.round((filledFields / 7) * 100);

  // Fetch existing product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError('');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const endpoints = [`/api/products/${productId}`, `${apiUrl}/api/products/${productId}`];
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
          throw new Error(result?.message || lastErrorMessage || 'Failed to fetch product');
        }

        const product = result?.data;
        if (product) {
          setFormData({
            product: product.product || product.name || '',
            category: product.category || 'Fruits & Vegetables',
            section: product.section || 'Latest Products',
            price: product.price || '',
            sales: product.sales || '',
            stock: product.stock || '',
          });
          setImageUrl(product.image || '');
        }
      } catch (fetchError) {
        console.error('Failed to fetch product:', fetchError);
        setError(fetchError.message || 'Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      const uploadImage = async () => {
        try {
          setUploading(true);
          const uploadFormData = new FormData();
          uploadFormData.append('image', file);

          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
          const response = await fetch(`${apiUrl}/api/products/uploadImage`, {
            method: 'POST',
            body: uploadFormData,
          });

          const result = await parseJsonSafely(response);

          if (!response.ok || result?.success === false) {
            throw new Error(result?.message || 'Failed to upload image');
          }

          setImageUrl(result?.data?.url || '');
        } catch (error) {
          console.error('Failed to upload product image:', error);
          alert(error.message || 'Failed to upload image');
          setImageUrl('');
        } finally {
          setUploading(false);
        }
      };

      uploadImage();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedProduct = {
      product: formData.product.trim(),
      category: formData.category,
      section: formData.section,
      price: Number(formData.price),
      sales: Number(formData.sales),
      stock: Number(formData.stock),
      image: imageUrl || '',
    };

    if (uploading) {
      alert('Image upload is in progress. Please wait.');
      return;
    }

    if (!imageUrl) {
      alert('Please upload or select product image.');
      return;
    }

    try {
      setSaving(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const explicitBackendUrl = 'http://localhost:8000';
      const candidateUrls = [apiUrl, explicitBackendUrl];
      const endpoints = [`/api/products/${productId}`, ...candidateUrls.map((url) => `${url}/api/products/${productId}`)];
      const uniqueEndpoints = [...new Set(endpoints)];
      let response = null;
      let result = null;
      let lastErrorMessage = '';

      for (const endpoint of uniqueEndpoints) {
        try {
          const currentResponse = await fetch(endpoint, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedProduct),
          });

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
        throw new Error(result?.message || lastErrorMessage || 'Failed to update product');
      }
    } catch (error) {
      console.error('Failed to update product:', error);
      alert(error.message || 'Failed to update product');
      setSaving(false);
      return;
    }

    alert('Product updated successfully!');
    setSaving(false);
    router.push('/products');
  };

  if (loading) {
    return (
      <div className='p-6 reveal-up'>
        <div className='glass-panel rounded-2xl p-8 text-center text-slate-600'>
          Loading product...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='p-6 reveal-up'>
        <button
          onClick={() => router.back()}
          className='mb-4 inline-flex items-center gap-2 rounded-xl text-emerald-600 hover:text-emerald-700'
        >
          <ArrowLeft size={18} />
          Go Back
        </button>
        <div className='rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700'>
          <p className='font-semibold'>Error loading product</p>
          <p className='mt-2'>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className='p-6 reveal-up'>
      <button
        onClick={() => router.back()}
        className='mb-6 inline-flex items-center gap-2 rounded-xl text-emerald-600 hover:text-emerald-700'
      >
        <ArrowLeft size={18} />
        Go Back
      </button>

      <div className='grid gap-6 xl:grid-cols-[1.2fr_0.8fr]'>
        <section className='glass-panel relative overflow-hidden rounded-3xl border border-emerald-100 p-6 lg:p-8'>
          <div className='absolute -right-10 -top-10 h-36 w-36 rounded-full bg-yellow-200/50 blur-3xl' />
          <div className='absolute -left-6 -bottom-6 h-28 w-28 rounded-full bg-emerald-200/40 blur-3xl' />

          <div className='relative space-y-6'>
            <div className='flex flex-col gap-5 md:flex-row md:items-start md:justify-between'>
              <div className='max-w-2xl'>
                <p className='text-sm font-semibold uppercase tracking-[0.25em] text-emerald-600'>Product studio</p>
                <h1 className='mt-2 text-3xl font-bold text-emerald-900 md:text-4xl'>Edit Product</h1>
                <p className='mt-2 text-sm text-slate-600'>Update product details, pricing, stock, category, section, and Cloudinary image.</p>
              </div>

              <div className='rounded-2xl border border-emerald-100 bg-white/90 px-4 py-3 shadow-sm'>
                <p className='text-xs font-semibold uppercase tracking-wide text-slate-500'>Completion</p>
                <p className='text-2xl font-bold text-emerald-700'>{completionPercent}%</p>
              </div>
            </div>

            <div className='grid gap-3 sm:grid-cols-3'>
              <div className='rounded-2xl bg-emerald-50/80 p-4 shadow-sm ring-1 ring-emerald-100'>
                <Package size={18} className='text-emerald-600' />
                <p className='mt-3 text-xs font-semibold uppercase tracking-wide text-slate-500'>Product</p>
                <p className='mt-1 text-sm font-semibold text-slate-800'>Name and category</p>
              </div>
              <div className='rounded-2xl bg-yellow-50/80 p-4 shadow-sm ring-1 ring-yellow-100'>
                <CircleDollarSign size={18} className='text-amber-600' />
                <p className='mt-3 text-xs font-semibold uppercase tracking-wide text-slate-500'>Pricing</p>
                <p className='mt-1 text-sm font-semibold text-slate-800'>Price, stock, sales</p>
              </div>
              <div className='rounded-2xl bg-white p-4 shadow-sm ring-1 ring-emerald-100'>
                <UploadCloud size={18} className='text-emerald-600' />
                <p className='mt-3 text-xs font-semibold uppercase tracking-wide text-slate-500'>Image</p>
                <p className='mt-1 text-sm font-semibold text-slate-800'>Cloudinary upload</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className='space-y-6'>
              <div className='grid gap-6 lg:grid-cols-2'>
                <div className='space-y-2'>
                  <label className='block text-sm font-semibold text-slate-700'>Product Name</label>
                  <div className='relative'>
                    <Sparkles size={18} className='pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500' />
                    <input
                      type='text'
                      name='product'
                      value={formData.product}
                      onChange={handleChange}
                      required
                      className='w-full rounded-2xl border border-emerald-200 bg-white/90 py-3 pl-11 pr-4 text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200'
                      placeholder='Enter product name'
                    />
                  </div>
                </div>

                <div className='space-y-2'>
                  <label className='block text-sm font-semibold text-slate-700'>Category</label>
                  <div className='relative'>
                    <Layers3 size={18} className='pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500' />
                    <select
                      name='category'
                      value={formData.category}
                      onChange={handleChange}
                      required
                      className='w-full rounded-2xl border border-emerald-200 bg-white/90 py-3 pl-11 pr-4 text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200'
                    >
                      {CATEGORY_OPTIONS.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className='grid gap-6 lg:grid-cols-2'>
                <div className='space-y-2'>
                  <label className='block text-sm font-semibold text-slate-700'>Section</label>
                  <select
                    name='section'
                    value={formData.section}
                    onChange={handleChange}
                    required
                    className='w-full rounded-2xl border border-emerald-200 bg-white/90 px-4 py-3 text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200'
                  >
                    {SECTION_OPTIONS.map((section) => (
                      <option key={section} value={section}>
                        {section}
                      </option>
                    ))}
                  </select>
                </div>

                <div className='space-y-2'>
                  <label className='block text-sm font-semibold text-slate-700'>Sales</label>
                  <div className='relative'>
                    <BadgeCheck size={18} className='pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500' />
                    <input
                      type='number'
                      name='sales'
                      value={formData.sales}
                      onChange={handleChange}
                      required
                      className='w-full rounded-2xl border border-emerald-200 bg-white/90 py-3 pl-11 pr-4 text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200'
                      placeholder='Enter number of sales'
                    />
                  </div>
                </div>
              </div>

              <div className='grid gap-6 lg:grid-cols-2'>
                <div className='space-y-2'>
                  <label className='block text-sm font-semibold text-slate-700'>Price</label>
                  <input
                    type='number'
                    name='price'
                    value={formData.price}
                    onChange={handleChange}
                    required
                    step='0.01'
                    className='w-full rounded-2xl border border-emerald-200 bg-white/90 px-4 py-3 text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200'
                    placeholder='Enter price'
                  />
                </div>

                <div className='space-y-2'>
                  <label className='block text-sm font-semibold text-slate-700'>Stock</label>
                  <input
                    type='number'
                    name='stock'
                    value={formData.stock}
                    onChange={handleChange}
                    required
                    className='w-full rounded-2xl border border-emerald-200 bg-white/90 px-4 py-3 text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200'
                    placeholder='Enter stock quantity'
                  />
                </div>
              </div>

              <div className='rounded-3xl border border-dashed border-emerald-200 bg-emerald-50/45 p-6'>
                <div className='mb-4 flex items-center gap-3'>
                  <div className='flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-sm'>
                    <ShoppingBag size={20} />
                  </div>
                  <div>
                    <h2 className='text-lg font-bold text-slate-900'>Product Image</h2>
                    <p className='text-sm text-slate-600'>{uploading ? 'Uploading to Cloudinary...' : 'Upload a clean image to make the product stand out.'}</p>
                  </div>
                </div>

                <label className='block cursor-pointer rounded-2xl border border-emerald-200 bg-white/90 p-5 text-center transition hover:border-emerald-500 hover:bg-emerald-50'>
                  <input
                    type='file'
                    name='image'
                    onChange={handleImageChange}
                    accept='image/*'
                    disabled={uploading}
                    className='sr-only'
                  />
                  <UploadCloud size={28} className='mx-auto text-emerald-600' />
                  <p className='mt-3 text-sm font-semibold text-slate-700'>Click to upload or drag and drop</p>
                  <p className='mt-1 text-xs text-slate-500'>PNG, JPG, GIF up to 5MB</p>
                </label>

                {selectedImage && (
                  <div className='mt-5 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]'>
                    <div className='overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm'>
                      <img
                        src={selectedImage}
                        alt='Preview'
                        className='h-56 w-full object-cover'
                      />
                    </div>

                    <div className='rounded-3xl border border-emerald-100 bg-white p-4 shadow-sm'>
                      <p className='text-sm font-semibold text-emerald-800'>Preview Ready</p>
                      <p className='mt-2 text-sm text-slate-600'>The selected image is ready to be saved with the product update. You can remove or replace it before submitting.</p>
                      <button
                        type='button'
                        onClick={() => setImagePreview(null)}
                        className='mt-4 rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600'
                      >
                        Remove Image
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className='flex flex-col gap-3 sm:flex-row'>
                <button
                  type='submit'
                  disabled={saving || uploading}
                  className='cta-glow flex-1 rounded-2xl bg-emerald-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60'
                >
                  {saving ? 'Updating...' : 'Update Product'}
                </button>
                <button
                  type='button'
                  onClick={() => router.back()}
                  className='flex-1 rounded-2xl bg-yellow-100 px-6 py-3.5 font-semibold text-amber-900 transition hover:bg-yellow-200'
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </section>

        <aside className='glass-panel sticky top-6 h-fit rounded-3xl border border-emerald-100 p-6'>
          <div className='rounded-3xl bg-linear-to-br from-emerald-600 to-yellow-500 p-6 text-white shadow-lg shadow-emerald-500/20'>
            <p className='text-xs font-semibold uppercase tracking-[0.3em] text-white/80'>Quick guide</p>
            <h2 className='mt-2 text-2xl font-bold'>Update the product</h2>
            <p className='mt-2 text-sm text-white/90'>Make changes to the product details. Use a bright image, clear title, and matching category data for best results.</p>
          </div>

          <div className='mt-6 space-y-4'>
            <div className='rounded-2xl bg-emerald-50/80 p-4 ring-1 ring-emerald-100'>
              <div className='flex items-center gap-3'>
                <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm'>
                  <Package size={18} />
                </div>
                <div>
                  <p className='font-semibold text-slate-900'>Clear product naming</p>
                  <p className='text-sm text-slate-600'>Short, descriptive names work best.</p>
                </div>
              </div>
            </div>

            <div className='rounded-2xl bg-yellow-50/80 p-4 ring-1 ring-yellow-100'>
              <div className='flex items-center gap-3'>
                <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-white text-amber-600 shadow-sm'>
                  <Sparkles size={18} />
                </div>
                <div>
                  <p className='font-semibold text-slate-900'>High-quality image</p>
                  <p className='text-sm text-slate-600'>Use a clean image with good lighting.</p>
                </div>
              </div>
            </div>

            <div className='rounded-2xl bg-white p-4 ring-1 ring-emerald-100'>
              <div className='flex items-center gap-3'>
                <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm'>
                  <Layers3 size={18} />
                </div>
                <div>
                  <p className='font-semibold text-slate-900'>Correct categorization</p>
                  <p className='text-sm text-slate-600'>Choose the right product category.</p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default page
