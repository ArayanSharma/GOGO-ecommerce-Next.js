'use client'

import React, { useState } from 'react'

const page = () => {
  const [banners, setBanners] = useState([
    { id: 1, title: 'Summer Sale', image: 'summer-sale.jpg', createdDate: '2024-01-10' },
    { id: 2, title: 'New Arrivals', image: 'new-arrivals.jpg', createdDate: '2024-01-15' },
    { id: 3, title: 'Flash Deal', image: 'flash-deal.jpg', createdDate: '2024-01-20' },
  ]);

  const [imagePreview, setImagePreview] = useState(null);
  const [bannerTitle, setBannerTitle] = useState('');

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

  const handleAddBanner = (e) => {
    e.preventDefault();
    if (imagePreview && bannerTitle) {
      const newBanner = {
        id: banners.length + 1,
        title: bannerTitle,
        image: imagePreview,
        createdDate: new Date().toISOString().split('T')[0]
      };
      setBanners([...banners, newBanner]);
      setImagePreview(null);
      setBannerTitle('');
      alert('Banner added successfully!');
    }
  };

  return (
    <div className='p-6'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-800 mb-2'>Banners</h1>
        <p className='text-gray-600'>Upload and manage homepage banner images</p>
      </div>

      {/* Upload Section */}
      <div className='bg-white shadow-lg rounded-lg p-8 mb-8'>
        <h2 className='text-2xl font-bold text-gray-800 mb-6'>Add New Banner</h2>
        <form onSubmit={handleAddBanner}>
          <div className='mb-6'>
            <label className='block text-gray-700 font-semibold mb-2'>Banner Title</label>
            <input
              type='text'
              value={bannerTitle}
              onChange={(e) => setBannerTitle(e.target.value)}
              required
              className='w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
              placeholder='Enter banner title'
            />
          </div>

          <div className='mb-6'>
            <label className='block text-gray-700 font-semibold mb-2'>Upload Image</label>
            <div className='border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition'>
              <input
                type='file'
                onChange={handleImageChange}
                accept='image/*'
                required
                className='w-full'
              />
              <p className='text-gray-500 text-sm mt-2'>Click to upload or drag and drop</p>
              <p className='text-gray-400 text-xs'>PNG, JPG, GIF up to 5MB</p>
            </div>
          </div>

          {imagePreview && (
            <div className='mb-6'>
              <p className='block text-gray-700 font-semibold mb-2'>Preview:</p>
              <img 
                src={imagePreview} 
                alt='Preview' 
                className='w-full h-48 object-cover rounded-lg border border-gray-300 mb-4'
              />
              <button
                type='button'
                onClick={() => setImagePreview(null)}
                className='px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition'
              >
                Remove Image
              </button>
            </div>
          )}

          <button
            type='submit'
            className='px-6 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition'
          >
            Create Banner
          </button>
        </form>
      </div>

      {/* Banners Gallery */}
      <div>
        <h2 className='text-2xl font-bold text-gray-800 mb-6'>Active Banners</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {banners.map((banner) => (
            <div key={banner.id} className='bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition'>
              <div className='h-48 bg-gray-200 overflow-hidden'>
                {typeof banner.image === 'string' && banner.image.startsWith('data:') ? (
                  <img src={banner.image} alt={banner.title} className='w-full h-full object-cover' />
                ) : (
                  <div className='w-full h-full flex items-center justify-center bg-gray-300 text-gray-500'>
                    {banner.image}
                  </div>
                )}
              </div>
              <div className='p-4'>
                <h3 className='text-lg font-semibold text-gray-800 mb-2'>{banner.title}</h3>
                <p className='text-sm text-gray-500 mb-4'>Created: {banner.createdDate}</p>
                <button className='w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition'>
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default page
