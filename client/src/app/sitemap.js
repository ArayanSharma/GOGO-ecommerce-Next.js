import { fetchProductById } from '@/utils/api'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://gogo-ecommerce.vercel.app'

async function fetchAllProducts() {
  try {
    // Adjust this based on your API endpoint
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/products`, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) {
      return []
    }

    const data = await response.json()
    return Array.isArray(data) ? data : data.products || []
  } catch (error) {
    console.error('Error fetching products for sitemap:', error)
    return []
  }
}

export default async function sitemap() {
  const products = await fetchAllProducts()

  // Static pages
  const staticPages = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${SITE_URL}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/login`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/register`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ]

  // Dynamic product pages
  const productPages = products.map((product) => ({
    url: `${SITE_URL}/productdet/${product.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [...staticPages, ...productPages]
}
