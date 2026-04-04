'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Edit, Eye, Trash2 } from 'lucide-react'

const page = () => {
  const [slides, setSlides] = useState([
    { 
      id: 1, 
      title: 'Stay Stylish', 
      image: '/c1.avif',
      description: '5 LATEST EXCLUSIVE ARRIVALS',
      createdDate: '2024-01-10' 
    }
   
  ]);

  const [showModal, setShowModal] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null
  });

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Show local preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Upload to backend
      setUploading(true);
      const uploadFormData = new FormData();
      uploadFormData.append('image', file);

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const response = await fetch(`${apiUrl}/api/sliders/uploadImage`, {
          method: 'POST',
          body: uploadFormData,
        });

        const result = await response.json();

        if (result.success) {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
          const fullImageUrl = `${apiUrl}${result.data.url}`;
          setImageUrl(fullImageUrl);
          setFormData({ ...formData, image: fullImageUrl });
        } else {
          alert('Image upload failed: ' + result.message);
        }
      } catch (error) {
        console.error('Upload error:', error);
        alert('Failed to upload image');
      } finally {
        setUploading(false);
      }
    }
  };

  const handleAddSlide = (e) => {
    e.preventDefault();
    if (imageUrl && formData.title) {
      const newSlide = {
        id: slides.length + 1,
        title: formData.title,
        description: formData.description,
        image: imageUrl,
        createdDate: new Date().toISOString().split('T')[0]
      };
      setSlides([...slides, newSlide]);
      setImagePreview(null);
      setImageUrl('');
      setFormData({ title: '', description: '', image: null });
      setShowModal(false);
      alert('Slide added successfully!');
    } else {
      alert('Please fill in all fields and upload an image');
    }
  };

  const handleDeleteSlide = (id) => {
    if (window.confirm('Are you sure you want to delete this slide?')) {
      setSlides(slides.filter(slide => slide.id !== id));
      alert('Slide deleted successfully!');
    }
  };

  return (
    <div className='p-6 bg-gray-50 min-h-screen'>
      {/* Header */}
      <div className='flex items-center justify-between mb-8'>
        <div>
          <h1 className='text-3xl font-bold text-gray-800'>Home Slides</h1>
          <p className='text-gray-600 text-sm mt-1'>Manage homepage slider images</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className='bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-200 flex items-center gap-2'
        >
          + ADD HOME SLIDE
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
            <div className='p-8'>
              <h2 className='text-2xl font-bold text-gray-800 mb-6'>Add New Slide</h2>
              <form onSubmit={handleAddSlide}>
                <div className='mb-6'>
                  <label className='block text-gray-700 font-semibold mb-2'>Slide Title</label>
                  <input
                    type='text'
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200'
                    placeholder='Enter slide title'
                  />
                </div>

                <div className='mb-6'>
                  <label className='block text-gray-700 font-semibold mb-2'>Description</label>
                  <input
                    type='text'
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200'
                    placeholder='Enter slide description'
                  />
                </div>

                <div className='mb-6'>
                  <label className='block text-gray-700 font-semibold mb-2'>Upload Image</label>
                  <div className='border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-emerald-500 transition cursor-pointer' style={{ opacity: uploading ? 0.6 : 1 }}>
                    <input
                      type='file'
                      onChange={handleImageChange}
                      accept='image/*'
                      required
                      disabled={uploading}
                      className='w-full'
                    />
                    <p className='text-gray-500 text-sm mt-2'>{uploading ? 'Uploading...' : 'Click to upload or drag and drop'}</p>
                    <p className='text-gray-400 text-xs'>PNG, JPG, GIF, WEBP up to 5MB</p>
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
                      onClick={() => {
                        setImagePreview(null);
                        setImageUrl('');
                        setFormData({ ...formData, image: null });
                      }}
                      className='px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition'
                    >
                      Remove Image
                    </button>
                  </div>
                )}

                <div className='flex gap-4 justify-end'>
                  <button
                    type='button'
                    onClick={() => setShowModal(false)}
                    className='px-6 py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400 transition'
                  >
                    Cancel
                  </button>
                  <button
                    type='submit'
                    className='px-6 py-2 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 transition'
                  >
                    Create Slide
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className='bg-white shadow-lg rounded-lg overflow-hidden'>
        <table className='w-full'>
          <thead>
            <tr className='bg-gray-100 border-b'>
              <th className='px-6 py-4 text-left font-semibold text-gray-700'>IMAGE</th>
              <th className='px-6 py-4 text-left font-semibold text-gray-700'>TITLE</th>
              <th className='px-6 py-4 text-left font-semibold text-gray-700'>DESCRIPTION</th>
              <th className='px-6 py-4 text-left font-semibold text-gray-700'>DATE</th>
              <th className='px-6 py-4 text-center font-semibold text-gray-700'>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {slides.map((slide) => (
              <tr key={slide.id} className='border-b hover:bg-gray-50 transition'>
                <td className='px-6 py-4'>
                  <div className='h-20 w-28 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center'>
                    {typeof slide.image === 'string' && (slide.image.startsWith('data:') || slide.image.startsWith('/')) ? (
                      <img src={slide.image} alt={slide.title} className='w-full h-full object-cover' />
                    ) : (
                      <div className='text-gray-500 text-sm'>No image</div>
                    )}
                  </div>
                </td>
                <td className='px-6 py-4 font-semibold text-gray-800'>{slide.title}</td>
                <td className='px-6 py-4 text-gray-600 text-sm'>{slide.description}</td>
                <td className='px-6 py-4 text-gray-600 text-sm'>{slide.createdDate}</td>
                <td className='px-6 py-4'>
                  <div className='flex items-center justify-center gap-3'>
                    <button className='text-blue-500 hover:text-blue-700 transition' title='Edit'>
                      <Edit size={20} />
                    </button>
                    <button className='text-green-500 hover:text-green-700 transition' title='View'>
                      <Eye size={20} />
                    </button>
                    <button 
                      onClick={() => handleDeleteSlide(slide.id)}
                      className='text-red-500 hover:text-red-700 transition' 
                      title='Delete'
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {slides.length === 0 && (
        <div className='bg-white rounded-lg p-12 text-center'>
          <p className='text-gray-500 text-lg'>No slides found. Create your first slide!</p>
        </div>
      )}
    </div>
  )
}

export default page
