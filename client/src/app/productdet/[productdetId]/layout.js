import { generatePageMetadata } from '@/utils/seoUtils'

// Static metadata for product detail pages
export const metadata = {
  title: 'Product Details | Buy Online at GOGO',
  description: 'View product details, pricing, and availability. Shop fresh groceries and organic products at GOGO with fast delivery.',
  keywords: 'product details, online shopping, buy now, fresh groceries',
  openGraph: {
    title: 'Product Details | GOGO',
    description: 'Browse product details and make your purchase at GOGO',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function ProductDetailLayout({ children }) {
  return children
}
