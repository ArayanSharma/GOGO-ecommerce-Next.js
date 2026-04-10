
import "./globals.css";

import Header from "./components/Header";
import Footer from "./components/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { CartProvider } from "@/context/CartContext";

export const metadata = {
  title: "GOGO - Fresh Groceries & Organic Products Online",
  description: "Shop fresh groceries, organic products, and daily essentials at GOGO. Fast delivery, best prices, and premium quality products. Order now!",
  keywords: "online grocery, fresh groceries, organic products, delivery, food shopping, daily essentials, subscription grocery",
  authors: [{ name: "GOGO Ecommerce" }],
  creator: "GOGO Ecommerce",
  publisher: "GOGO",
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://gogo-ecommerce.vercel.app",
    siteName: "GOGO",
    title: "GOGO - Fresh Groceries & Organic Products Online",
    description: "Shop fresh groceries and organic products with fast delivery. Best prices guaranteed.",
    images: [
      {
        url: "https://gogo-ecommerce.vercel.app/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "GOGO - Fresh Groceries",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GOGO - Fresh Groceries & Organic Products Online",
    description: "Shop fresh groceries and organic products with fast delivery.",
    creator: "@gogostore",
    images: ["https://gogo-ecommerce.vercel.app/og-image.jpg"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "GOGO",
  },
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
};

export function generateViewport() {
  return {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Canonical URL */}
        <link rel="canonical" href="https://gogo-ecommerce.vercel.app" />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://gogo-api-oqeg.onrender.com" />
        
        {/* DNS Prefetch */}
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://gogo-api-oqeg.onrender.com" />
        
        {/* JSON-LD Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "GOGO",
              "url": "https://gogo-ecommerce.vercel.app",
              "description": "Fresh groceries and organic products online with fast delivery",
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": "https://gogo-ecommerce.vercel.app/search?q={search_term_string}"
                },
                "query-input": "required name=search_term_string"
              }
            }),
          }}
        />
      </head>
      <body>
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <Header />
              <main role="main">
                {children}
              </main>
              <Footer />
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
