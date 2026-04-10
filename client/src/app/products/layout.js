import { generatePageMetadata } from '@/utils/seoUtils'

export const metadata = generatePageMetadata('products')

export default function ProductsLayout({ children }) {
  return children
}
