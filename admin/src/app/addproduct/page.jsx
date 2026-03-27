
'use client'

import React, { useState } from 'react'

const page = () => {
  const [formData, setFormData] = useState({
    product: '',
    category: '',
    price: '',
    sales: '',
    stock: '',
  });

  const [imagePreview, setImagePreview] = useState(null);

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
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    // Here you can send the data to your backend API
    alert('Product added successfully!');
    setFormData({
      product: '',
      category: '',
      price: '',
      sales: '',
      stock: '',
    });
  };

  return (
    <div className='p-6 max-w-2xl mx-auto'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-800 mb-2'>Add Product</h1>
        <p className='text-gray-600'>Fill in the details below to add a new product</p>
      </div>

      <form onSubmit={handleSubmit} className='bg-white shadow-lg rounded-lg p-8'>
        <div className='mb-6'>
          <label className='block text-gray-700 font-semibold mb-2'>Product Name</label>
          <input
            type='text'
            name='product'
            value={formData.product}
            onChange={handleChange}
            required
            className='w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
            placeholder='Enter product name'
          />
        </div>


        <div className='mb-6'>
          <label className='block text-gray-700 font-semibold mb-2'>Category</label>
          <select
            name='category'
            value={formData.category}
            onChange={handleChange}
            required
            className='w-full px-4 py-2 border border-g rounded focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
          >
            <option value='Fruits & Vegetables'>Fruits & Vegetables</option>
            <option value='Meat & Seafood'>Meat & Seafood</option>
            <option value='Breakfast & Bakery'>Breakfast & Bakery  </option>
            <option value='Beverages'>Beverages</option>
            <option value='Frozen Food'>Frozen Food</option>
            <option value='Biscuits & Snacks'>Biscuits & Snacks</option>
            <option value='Grocery & Staples'>Grocery & Staples</option>
          </select>
        </div>

        <div className='grid grid-cols-2 gap-6 mb-6'>
          <div>
            <label className='block text-gray-700 font-semibold mb-2'>Price</label>
            <input
              type='number'
              name='price'
              value={formData.price}
              onChange={handleChange}
              required
              step='0.01'
              className='w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
              placeholder='Enter price'
            />
          </div>

          <div>
            <label className='block text-gray-700 font-semibold mb-2'>Stock</label>
            <input
              type='number'
              name='stock'
              value={formData.stock}
              onChange={handleChange}
              required
              className='w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
              placeholder='Enter stock quantity'
            />
          </div>
        </div>

        <div className='mb-8'>
          <label className='block text-gray-700 font-semibold mb-2'>Sales</label>
          <input
            type='number'
            name='sales'
            value={formData.sales}
            onChange={handleChange}
            required
            className='w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
            placeholder='Enter number of sales'
          />
        </div>

        <div className='mb-8'>
          <label className='block text-gray-700 font-semibold mb-2'>Product Image</label>
          <div className='border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition'>
            <input
              type='file'
              name='image'
              onChange={handleImageChange}
              accept='image/*'
              className='w-full'
            />
            <p className='text-gray-500 text-sm mt-2'>Click to upload or drag and drop</p>
            <p className='text-gray-400 text-xs'>PNG, JPG, GIF up to 5MB</p>
          </div>
          
          {imagePreview && (
            <div className='mt-4'>
              <p className='block text-gray-700 font-semibold mb-2'>Preview:</p>
              <img 
                src={imagePreview} 
                alt='Preview' 
                className='w-full h-48 object-cover rounded-lg border border-gray-300'
              />
              <button
                type='button'
                onClick={() => setImagePreview(null)}
                className='mt-2 px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition'
              >
                Remove Image
              </button>
            </div>
          )}
        </div>

        <div className='flex gap-4'>
          <button
            type='submit'
            className='flex-1 px-6 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition'
          >
            Add Product
          </button>
          <button
            type='reset'
            className='flex-1 px-6 py-2 bg-gray-300 text-gray-700 font-semibold rounded hover:bg-gray-400 transition'
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  )
}

export default page
