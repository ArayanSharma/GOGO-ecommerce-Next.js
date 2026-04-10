import { NextResponse } from 'next/server'

// Public routes that don't require authentication
const PUBLIC_PATHS = ['/admin-login', '/login']

export function middleware(request) {
  const { pathname } = request.nextUrl
  
  // Get admin token from cookies
  const adminToken = request.cookies.get('adminToken')?.value
  
  // Check if current path is public
  const isPublicPath = PUBLIC_PATHS.some(path => 
    pathname === path || pathname.startsWith(path + '/')
  )

  // Skip middleware for public paths (allow access without token)
  if (isPublicPath) {
    // If user is already logged in and trying to access login page, redirect to dashboard
    if (adminToken) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    return NextResponse.next()
  }

  // For all other routes, check if token exists
  if (!adminToken) {
    // Redirect to login page with return URL
    const loginUrl = new URL('/admin-login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Token exists, verify it's valid (basic check)
  try {
    const parts = adminToken.split('.')
    if (parts.length !== 3) {
      // Invalid token format, redirect to login
      const loginUrl = new URL('/admin-login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString())
    const now = Math.floor(Date.now() / 1000)

    // Check if token is expired
    if (payload.exp && payload.exp < now) {
      // Token expired, redirect to login
      const response = NextResponse.redirect(new URL('/admin-login', request.url))
      // Clear the expired token
      response.cookies.delete('adminToken')
      return response
    }
  } catch (error) {
    console.error('Token validation error:', error)
    // If token parsing fails, redirect to login
    const response = NextResponse.redirect(new URL('/admin-login', request.url))
    response.cookies.delete('adminToken')
    return response
  }

  // Token is valid, allow access
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Apply middleware to all routes except Next.js internals and static files
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}
