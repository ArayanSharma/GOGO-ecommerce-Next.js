import { generatePageMetadata } from '@/utils/seoUtils'

export const metadata = generatePageMetadata('cart')

export default function CartLayout({ children }) {
  return children
}
