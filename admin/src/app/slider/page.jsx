'use client'

import React, { useEffect, useState } from 'react'
import { Edit, Eye, Trash2 } from 'lucide-react'

const formatSlideDate = (value) => {
  if (!value) return '-';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return '-';
  return parsed.toISOString().split('T')[0];
};

const page = () => {
  const [slides, setSlides] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [savingSlide, setSavingSlide] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null
  });

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const response = await fetch(`${apiUrl}/api/sliders`);
        const result = await response.json();

        if (result.success) {
          setSlides(result.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch slides:', error);
      }
    };

    fetchSlides();
  }, []);

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
          const fullImageUrl = result.data.url;
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

  const handleAddSlide = async (e) => {
    e.preventDefault();
    if (uploading) {
      alert('Image upload is still in progress. Please wait a moment.');
      return;
    }

    if (!formData.title.trim() || !formData.description.trim()) {
      alert('Please fill in all fields and upload an image');
      return;
    }

    if (!imageUrl) {
      alert('Please upload an image before creating the slide');
      return;
    }

    try {
      setSavingSlide(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      
      const url = isEditMode 
        ? `${apiUrl}/api/sliders/${editingId}`
        : `${apiUrl}/api/sliders`;
      
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          description: formData.description.trim(),
          image: imageUrl,
        }),
      });

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || `Failed to ${isEditMode ? 'update' : 'create'} slide`);
      }

      if (isEditMode) {
        setSlides((prev) => prev.map(slide => (slide._id || slide.id) === editingId ? result.data : slide));
        alert('Slide updated successfully!');
      } else {
        setSlides((prev) => [result.data, ...prev]);
        alert('Slide added successfully!');
      }

      setImagePreview(null);
      setImageUrl('');
      setFormData({ title: '', description: '', image: null });
      setShowModal(false);
      setIsEditMode(false);
      setEditingId(null);
    } catch (error) {
      console.error('Save slide error:', error);
      alert(error.message || `Failed to ${isEditMode ? 'update' : 'create'} slide`);
    } finally {
      setSavingSlide(false);
    }
  };

  const handleEditSlide = (slide) => {
    setIsEditMode(true);
    setEditingId(slide._id || slide.id);
    setFormData({
      title: slide.title,
      description: slide.description,
      image: slide.image
    });
    setImageUrl(slide.image);
    setImagePreview(slide.image);
    setShowModal(true);
  };

  const handleViewSlide = (slide) => {
    if (slide?.image) {
      window.open(slide.image, '_blank', 'noopener,noreferrer');
    }
  };

  const resetForm = () => {
    setShowModal(false);
    setIsEditMode(false);
    setEditingId(null);
    setImagePreview(null);
    setImageUrl('');
    setFormData({ title: '', description: '', image: null });
  };

  const handleOpenAddModal = () => {
    setIsEditMode(false);
    setEditingId(null);
    setImagePreview(null);
    setImageUrl('');
    setFormData({ title: '', description: '', image: null });
    setShowModal(true);
  };

  const handleDeleteSlide = async (id) => {
    if (window.confirm('Are you sure you want to delete this slide?')) {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const response = await fetch(`${apiUrl}/api/sliders/${id}`, {
          method: 'DELETE',
        });

        const result = await response.json();

        if (result.success) {
          setSlides((prev) => prev.filter((slide) => (slide._id || slide.id) !== id));
          alert('Slide deleted successfully!');
        } else {
          alert('Failed to delete slide: ' + result.message);
        }
      } catch (error) {
        console.error('Delete error:', error);
        alert('Failed to delete slide');
      }
    }
  };

  return (
    <div className='p-6 min-h-screen space-y-6 reveal-up-delay'>
      <div className='grid gap-4 lg:grid-cols-[1.5fr_1fr]'>
        <div className='glass-panel rounded-3xl p-6 border border-emerald-100 overflow-hidden relative'>
          <div className='absolute -right-10 -top-10 h-36 w-36 rounded-full bg-yellow-200/50 blur-3xl' />
          <div className='absolute -left-6 -bottom-6 h-28 w-28 rounded-full bg-emerald-200/40 blur-3xl' />
          <div className='relative flex flex-col gap-5 md:flex-row md:items-end md:justify-between'>
            <div>
              <p className='text-sm font-semibold uppercase tracking-[0.25em] text-emerald-600'>Homepage banners</p>
              <h1 className='mt-2 text-3xl font-bold text-emerald-900 md:text-4xl'>Home Slides</h1>
              <p className='mt-2 max-w-2xl text-sm text-slate-600'>Manage the promotional slider content shown on the storefront with a clean, high-contrast visual editor.</p>
            </div>

            <div className='flex flex-wrap gap-3'>
              <div className='rounded-2xl border border-emerald-100 bg-white/90 px-4 py-3 shadow-sm'>
                <p className='text-xs font-semibold uppercase tracking-wide text-slate-500'>Total slides</p>
                <p className='text-2xl font-bold text-emerald-700'>{slides.length}</p>
              </div>
              <div className='rounded-2xl border border-yellow-100 bg-yellow-50/80 px-4 py-3 shadow-sm'>
                <p className='text-xs font-semibold uppercase tracking-wide text-slate-500'>Ready to publish</p>
                <p className='text-2xl font-bold text-amber-700'>{slides.filter((slide) => slide.image).length}</p>
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={handleOpenAddModal}
          className='cta-glow self-start justify-self-end inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-700'
        >
          + Add Home Slide
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-emerald-950/30 p-4 backdrop-blur-sm'>
          <div className='glass-panel max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-emerald-100'>
            <div className='p-8'>
              <h2 className='text-2xl font-bold text-emerald-900 mb-2'>
                {isEditMode ? 'Edit Slide' : 'Add New Slide'}
              </h2>
              <p className='mb-6 text-sm text-slate-600'>Set the banner text and upload a featured image for the homepage slider.</p>
              <form onSubmit={handleAddSlide}>
                <div className='mb-6'>
                  <label className='block text-slate-700 font-semibold mb-2'>Slide Title</label>
                  <input
                    type='text'
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className='w-full rounded-xl border border-emerald-200 bg-white/90 px-4 py-3 text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200'
                    placeholder='Enter slide title'
                  />
                </div>

                <div className='mb-6'>
                  <label className='block text-slate-700 font-semibold mb-2'>Description</label>
                  <input
                    type='text'
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className='w-full rounded-xl border border-emerald-200 bg-white/90 px-4 py-3 text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200'
                    placeholder='Enter slide description'
                  />
                </div>

                <div className='mb-6'>
                  <label className='block text-slate-700 font-semibold mb-2'>Upload Image</label>
                  <div className='rounded-2xl border-2 border-dashed border-emerald-200 bg-emerald-50/50 p-8 text-center transition hover:border-emerald-500' style={{ opacity: uploading ? 0.7 : 1 }}>
                    <input
                      type='file'
                      onChange={handleImageChange}
                      accept='image/*'
                      disabled={uploading}
                      className='w-full'
                    />
                    <p className='mt-2 text-sm text-slate-600'>{uploading ? 'Uploading to Cloudinary...' : 'Click to upload or drag and drop'}</p>
                    <p className='text-xs text-slate-500'>PNG, JPG, GIF, WEBP up to 5MB</p>
                  </div>
                </div>

                {imagePreview && (
                  <div className='mb-6'>
                    <p className='block text-slate-700 font-semibold mb-2'>Preview:</p>
                    <img 
                      src={imagePreview} 
                      alt='Preview' 
                      className='mb-4 h-56 w-full rounded-2xl border border-emerald-100 object-cover shadow-md'
                    />
                    <button
                      type='button'
                      onClick={() => {
                        setImagePreview(null);
                        setImageUrl('');
                        setFormData({ ...formData, image: null });
                      }}
                      className='rounded-lg bg-red-500 px-4 py-1.5 text-white transition hover:bg-red-600'
                    >
                      Remove Image
                    </button>
                  </div>
                )}

                <div className='flex gap-4 justify-end'>
                  <button
                    type='button'
                    onClick={resetForm}
                    className='rounded-xl bg-yellow-100 px-6 py-2.5 font-semibold text-amber-900 transition hover:bg-yellow-200'
                  >
                    Cancel
                  </button>
                  <button
                    type='submit'
                    disabled={uploading || savingSlide}
                    className='cta-glow rounded-xl bg-emerald-600 px-6 py-2.5 font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60'
                  >
                    {uploading ? 'Uploading...' : savingSlide ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Slide' : 'Create Slide')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Gallery */}
      <div className='grid gap-5 md:grid-cols-2 xl:grid-cols-3'>
        {slides.map((slide) => (
          <article key={slide._id || slide.id} className='saturated-card group overflow-hidden rounded-3xl border border-emerald-100 bg-white/90 shadow-lg'>
            <div className='relative overflow-hidden'>
              <div className='absolute inset-0 bg-linear-to-t from-emerald-950/70 via-emerald-950/10 to-transparent opacity-0 transition group-hover:opacity-100' />
              <div className='h-56 bg-emerald-50'>
                {typeof slide.image === 'string' && (slide.image.startsWith('data:') || slide.image.startsWith('/') || slide.image.startsWith('http')) ? (
                  <img src={slide.image} alt={slide.title} className='h-full w-full object-cover transition duration-500 group-hover:scale-105' />
                ) : (
                  <div className='flex h-full w-full items-center justify-center text-sm font-semibold text-slate-500'>No image</div>
                )}
              </div>

              <div className='absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-emerald-700 shadow-sm backdrop-blur'>
                {formatSlideDate(slide.createdAt || slide.createdDate)}
              </div>

              <div className='absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3 opacity-100 transition group-hover:opacity-100 md:opacity-0 md:group-hover:opacity-100'>
                <button
                  type='button'
                  onClick={() => handleEditSlide(slide)}
                  className='rounded-full bg-white/90 p-3 text-emerald-700 shadow-lg backdrop-blur transition hover:bg-white'
                  title='Edit'
                >
                  <Edit size={18} />
                </button>
                <button
                  type='button'
                  onClick={() => handleViewSlide(slide)}
                  className='rounded-full bg-yellow-400/95 p-3 text-amber-900 shadow-lg transition hover:bg-yellow-300'
                  title='View'
                >
                  <Eye size={18} />
                </button>
                <button
                  type='button'
                  onClick={() => handleDeleteSlide(slide._id || slide.id)}
                  className='rounded-full bg-red-500/95 p-3 text-white shadow-lg transition hover:bg-red-600'
                  title='Delete'
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <div className='space-y-4 p-5'>
              <div>
                <div className='flex items-start justify-between gap-3'>
                  <h3 className='text-xl font-bold text-slate-900'>{slide.title}</h3>
                  <span className='rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700'>Live</span>
                </div>
                <p className='mt-2 text-sm leading-6 text-slate-600'>{slide.description}</p>
              </div>

              <div className='flex items-center justify-between rounded-2xl bg-emerald-50/80 px-4 py-3'>
                <div>
                  <p className='text-xs font-semibold uppercase tracking-wide text-slate-500'>Slide image</p>
                  <p className='mt-1 text-sm font-semibold text-emerald-800'>Homepage banner</p>
                </div>
                <button
                  type='button'
                  onClick={() => handleViewSlide(slide)}
                  className='rounded-xl bg-white px-3 py-2 text-sm font-semibold text-amber-700 shadow-sm ring-1 ring-yellow-200 transition hover:bg-yellow-50'
                >
                  Preview
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {slides.length === 0 && (
        <div className='glass-panel rounded-3xl p-12 text-center'>
          <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 shadow-sm'>
            <Eye size={28} />
          </div>
          <p className='text-lg font-semibold text-slate-600'>No slides found yet.</p>
          <p className='mt-2 text-sm text-slate-500'>Create your first promotional banner to populate the homepage slider.</p>
        </div>
      )}
    </div>
  )
}

export default page
