/**
 * SEO Utilities for generating metadata
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://gogo-ecommerce.vercel.app';
const SITE_NAME = 'GOGO';

export const seoConfig = {
  siteUrl: SITE_URL,
  siteName: SITE_NAME,
  defaultImage: `${SITE_URL}/og-image.jpg`,
  twitterHandle: '@gogostore',
};

/**
 * Generate product metadata
 */
export function generateProductMetadata(product) {
  const url = `${SITE_URL}/productdet/${product.id}`;
  const title = `${product.name} | Buy Online at GOGO`;
  const description = product.description 
    ? product.description.substring(0, 160) 
    : `Buy ${product.name} at GOGO. Fresh quality, best prices, fast delivery.`;
  
  return {
    title,
    description,
    keywords: `${product.name}, ${product.category}, buy online, grocery, fresh`,
    authors: [{ name: "GOGO Ecommerce" }],
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      images: [
        {
          url: product.image || seoConfig.defaultImage,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
      siteName: SITE_NAME,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [product.image || seoConfig.defaultImage],
      creator: seoConfig.twitterHandle,
    },
    metadataBase: new URL(SITE_URL),
    canonical: url,
  };
}

/**
 * Generate category page metadata
 */
export function generateCategoryMetadata(category) {
  const url = `${SITE_URL}/products?category=${category}`;
  const title = `${category} - Buy Fresh Online at GOGO`;
  const description = `Shop fresh ${category.toLowerCase()} products online at GOGO. Best quality, best prices, fast delivery.`;
  
  return {
    title,
    description,
    keywords: `${category} online, buy ${category}, fresh ${category}, GOGO`,
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      siteName: SITE_NAME,
    },
    metadataBase: new URL(SITE_URL),
  };
}

/**
 * Generate page metadata
 */
export function generatePageMetadata(page) {
  const pages = {
    home: {
      title: 'GOGO - Fresh Groceries & Organic Products Online',
      description: 'Shop fresh groceries, organic products, and daily essentials at GOGO. Fast delivery, best prices, and premium quality products.',
      url: SITE_URL,
    },
    products: {
      title: 'All Products - Buy Fresh Groceries Online | GOGO',
      description: 'Browse all fresh groceries and organic products at GOGO. Handpicked selections, best quality, competitive prices.',
      url: `${SITE_URL}/products`,
    },
    cart: {
      title: 'Shopping Cart | GOGO',
      description: 'Review your shopping cart and proceed to checkout at GOGO.',
      url: `${SITE_URL}/cart`,
    },
    checkout: {
      title: 'Checkout & Payment | GOGO',
      description: 'Complete your purchase securely at GOGO. Fast, safe, and easy payment.',
      url: `${SITE_URL}/checkout`,
    },
    register: {
      title: 'Create Account | GOGO',
      description: 'Join GOGO and start shopping fresh groceries online. Register a new account.',
      url: `${SITE_URL}/register`,
    },
    login: {
      title: 'Login to Your Account | GOGO',
      description: 'Login to your GOGO account to continue shopping.',
      url: `${SITE_URL}/login`,
    },
    forgotPassword: {
      title: 'Reset Password | GOGO',
      description: 'Forgot your password? Reset it securely at GOGO.',
      url: `${SITE_URL}/forgot-password`,
    },
  };

  const pageData = pages[page] || {
    title: `${page} | GOGO`,
    description: 'GOGO - Fresh Groceries & Organic Products Online',
    url: `${SITE_URL}/${page}`,
  };

  return {
    title: pageData.title,
    description: pageData.description,
    openGraph: {
      title: pageData.title,
      description: pageData.description,
      url: pageData.url,
      type: 'website',
      siteName: SITE_NAME,
      images: [
        {
          url: seoConfig.defaultImage,
          width: 1200,
          height: 630,
          alt: SITE_NAME,
        },
      ],
    },
    metadataBase: new URL(SITE_URL),
  };
}

/**
 * Generate structured data for products
 */
export function generateProductStructuredData(product) {
  return {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    'name': product.name,
    'description': product.description,
    'image': product.image,
    'brand': {
      '@type': 'Brand',
      'name': 'GOGO',
    },
    'category': product.category,
    'offers': {
      '@type': 'Offer',
      'url': `${SITE_URL}/productdet/${product.id}`,
      'priceCurrency': 'INR',
      'price': product.price,
      'availability': product.stock > 0 ? 'InStock' : 'OutOfStock',
      'seller': {
        '@type': 'Organization',
        'name': 'GOGO',
      },
    },
    'aggregateRating': product.rating ? {
      '@type': 'AggregateRating',
      'ratingValue': product.rating,
      'bestRating': '5',
      'worstRating': '1',
      'ratingCount': product.sales || 0,
    } : undefined,
  };
}

/**
 * Generate breadcrumb structured data
 */
export function generateBreadcrumbStructuredData(breadcrumbs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': item.name,
      'item': `${SITE_URL}${item.url}`,
    })),
  };
}

/**
 * Generate organization structured data
 */
export function generateOrganizationStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': 'GOGO',
    'url': SITE_URL,
    'description': 'Fresh groceries and organic products delivered to your door',
    'logo': `${SITE_URL}/logo.png`,
    'sameAs': [
      'https://www.facebook.com/gogo',
      'https://www.instagram.com/gogo',
      'https://twitter.com/gogostore',
    ],
    'contact': {
      '@type': 'ContactPoint',
      'contactType': 'Customer Support',
      'telephone': '+1-234-567-8900',
      'email': 'support@gogo.com',
    },
  };
}
