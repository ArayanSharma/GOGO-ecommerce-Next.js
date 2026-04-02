import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/register', '/forgot-password', '/verify', '/checkout'];
  
  // Routes that require authentication
  const protectedRoutes = ['/', '/cart', '/wishlist', '/products', '/productdet'];

  // Get token from cookie
  const token = request.cookies.get('accessToken')?.value;

  // Check if current route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );

  // Check if current route is public
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );

  // If no token and trying to access protected route, redirect to login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // If token exists and trying to access auth pages, redirect to home
  if ((pathname === '/login' || pathname === '/register') && token) {
    const homeUrl = new URL('/', request.url);
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

// Configure which routes to apply middleware to
export const config = {
  matcher: [
    // Apply to all routes except API routes, static files, and images
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
