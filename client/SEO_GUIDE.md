# SEO Optimization Guide for GOGO E-commerce

## Overview
This document outlines the SEO implementation and best practices for the GOGO e-commerce platform.

## Metadata Implementation

### 1. Root Layout Metadata (`src/app/layout.js`)
- **Title**: Clear, descriptive page title with brand name
- **Description**: Compelling meta description (160 characters)
- **Keywords**: Relevant keywords for search engines
- **Open Graph Tags**: For social media sharing
- **Twitter Cards**: For Twitter sharing
- **Mobile Optimization**: Viewport meta tag and app configuration
- **Structured Data**: JSON-LD schema for organization

### 2. Dynamic Page Metadata
Each page has its own metadata file:
- `src/app/products/layout.js` - Products listing page
- `src/app/cart/layout.js` - Shopping cart page
- `src/app/checkout/layout.js` - Checkout page
- `src/app/productdet/[productdetId]/layout.js` - Dynamic product pages
- `src/app/login/layout.js` - Login page
- `src/app/register/layout.js` - Registration page
- `src/app/forgot-password/layout.js` - Password reset page

### 3. SEO Utilities (`src/utils/seoUtils.js`)
Reusable functions for metadata generation:
- `generateProductMetadata()` - Product page metadata
- `generateCategoryMetadata()` - Category page metadata
- `generatePageMetadata()` - Static page metadata
- `generateProductStructuredData()` - Product JSON-LD schema
- `generateBreadcrumbStructuredData()` - Breadcrumb navigation schema
- `generateOrganizationStructuredData()` - Organization schema

## Key SEO Features

### ✅ Meta Tags
- Unique title (60 characters) for each page
- Compelling descriptions (160 characters)
- Keywords meta tag with relevant search terms
- Canonical URLs to prevent duplicate content
- Language meta tag (hreflang)

### ✅ Open Graph Tags
- og:title - Page title for social sharing
- og:description - Page description
- og:type - Content type (website, product, etc.)
- og:url - Canonical URL
- og:image - Social sharing image (1200x630px recommended)
- og:siteName - Website name

### ✅ Twitter Card Tags
- twitter:card - Card type (summary_large_image)
- twitter:title - Tweet title
- twitter:description - Tweet description
- twitter:image - Tweet image
- twitter:creator - Twitter handle

### ✅ Structured Data (JSON-LD)
- Product schema for product pages
- Organization schema for business details
- BreadcrumbList schema for navigation
- WebSite schema with SearchAction
- AggregateRating for product reviews

### ✅ Performance & Loading
- Image preconnection to CDN
- DNS prefetching for external domains
- Font preloading (if using custom fonts)
- Next.js Image optimization

### ✅ Search Engine Optimization
- Sitemap generation (`sitemap.js`)
- Robots.txt file (`public/robots.txt`)
- SEO-friendly URLs (slug-based routing)
- Mobile-first responsive design
- Proper heading hierarchy (h1, h2, h3)
- Semantic HTML structure
- Alt text for all images

## Best Practices for Development

### 1. Image Optimization
```jsx
// Always use alt attributes for images
<img 
  src="product-image.jpg" 
  alt="Fresh organic apples from local farms"
  width={400}
  height={400}
/>

// Use Next.js Image component when possible
import Image from 'next/image'

<Image
  src="/product.jpg"
  alt="Descriptive alt text"
  width={400}
  height={400}
  priority={true} // For above-fold images
/>
```

### 2. Heading Structure
```jsx
// One h1 per page
<h1>GOGO - Fresh Groceries & Organic Products</h1>

// Sub-headings with proper hierarchy
<h2>Latest Products</h2>
<h3>Featured Categories</h3>

// Avoid skipping levels: h1 -> h3 (skip h2)
// Correct: h1 -> h2 -> h3
// Incorrect: h1 -> h3
```

### 3. Links & Navigation
```jsx
// Use semantic anchor tags
<a href="/products">Browse Products</a>

// Add aria-labels for accessibility
<a href="/" aria-label="Go to home page">Home</a>

// Avoid "click here" anchor text
// Bad: <a href="/products">click here</a>
// Good: <a href="/products">Browse our products</a>
```

### 4. Meta Description Guidelines
- 155-160 characters
- Include target keyword naturally
- Unique for each page
- Include a call-to-action when relevant
- Avoid keyword stuffing

### 5. URL Structure
```
✅ Good:
/products/fresh-vegetables
/productdet/organic-apples-1kg
/categories/dairy-products

❌ Bad:
/products?id=123&sort=1
/product_detail.php?pid=456
```

### 6. Page Titles
```
Format: Primary Keyword | Secondary Info | Brand

✅ Good:
"Buy Fresh Organic Apples Online | GOGO"
"1kg Fresh Strawberries | Farm Direct | GOGO"

❌ Bad:
"Product"
"GOGO"
"Buy stuff online"
```

### 7. Adding New Pages
When creating a new page:

1. Create a `layout.js` in the page directory
2. Import `generatePageMetadata` from `@/utils/seoUtils`
3. Export metadata using the function
4. Add semantic HTML structure
5. Ensure proper heading hierarchy
6. Add alt text to images
7. Include structured data if needed

Example:
```jsx
// pages/about/layout.js
import { generatePageMetadata } from '@/utils/seoUtils'

export const metadata = generatePageMetadata('about')

export default function AboutLayout({ children }) {
  return children
}
```

### 8. Product Pages
Product pages automatically:
- Fetch product data
- Generate dynamic metadata
- Include JSON-LD product schema
- Display product images with alt text
- Show pricing and availability
- Include breadcrumb navigation

### 9. Internal Linking
```jsx
// Link related products
<Link href={`/productdet/${product.id}`}>{product.name}</Link>

// Link to category pages
<Link href={`/products?category=${category}`}>{category}</Link>

// Breadcrumb navigation
<nav aria-label="Breadcrumb">
  <ol>
    <li><Link href="/">Home</Link></li>
    <li><Link href="/products">Products</Link></li>
    <li aria-current="page">Product Name</li>
  </ol>
</nav>
```

## Monitoring & Analytics

### Search Console Integration
1. Add property in Google Search Console
2. Submit sitemap: `/sitemap.xml`
3. Monitor search performance
4. Fix indexing issues
5. Review search queries

### Speed Optimization
- Use Next.js Image component
- Enable static generation where possible
- Compress images
- Minify CSS and JavaScript
- Enable browser caching
- Use CDN for static assets

### Tools to Use
- Google Search Console
- Google PageSpeed Insights
- Lighthouse
- Screaming Frog SEO Spider
- SEMRUSH or Ahrefs

## Configuration

### Environment Variables
Required in `.env`:
```env
NEXT_PUBLIC_API_URL=https://api.gogo.com
NEXT_PUBLIC_SITE_URL=https://gogo-ecommerce.vercel.app
```

### Next.js Config
Already configured in `next.config.mjs`:
- Image remote patterns (Cloudinary, localhost)
- React compiler enabled
- Turbopack for faster builds

## Files Generated

- ✅ `src/utils/seoUtils.js` - SEO utility functions
- ✅ `src/app/sitemap.js` - Dynamic sitemap generation
- ✅ `public/robots.txt` - Search engine crawler rules
- ✅ `src/app/layout.js` - Root metadata with schemas
- ✅ Multiple `layout.js` files for SEO metadata

## Tracking & Maintenance

### Weekly Tasks
- Check Google Search Console for errors
- Monitor keyword rankings
- Review meta descriptions
- Audit page load speed

### Monthly Tasks
- Analyze search queries
- Review top-performing products
- Identify pages needing improvement
- Check for 404 errors
- Update product information

### Quarterly Tasks
- Full SEO audit
- Competitor analysis
- Keyword research
- Content improvement plan

## Common Issues & Solutions

### Duplicate Content
**Problem**: Same product shown on multiple URLs
**Solution**: Use canonical tags, 301 redirects, set preferred domain

### Slow Page Load
**Problem**: Poor page speed affects rankings
**Solution**: Optimize images, use Next.js Image, enable caching

### Missing Meta Tags
**Problem**: Pages not showing metadata
**Solution**: Ensure all pages have layout.js with metadata

### Poor Mobile Experience
**Problem**: Mobile traffic declining
**Solution**: Ensure responsive design, test on mobile devices

## Resources
- [Next.js SEO Best Practices](https://nextjs.org/learn-pages-router/seo/introduction-to-seo)
- [Google Search Central](https://developers.google.com/search)
- [Schema.org Documentation](https://schema.org)
- [Lighthouse Auditing](https://developers.google.com/web/tools/lighthouse)
