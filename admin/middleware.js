import { NextResponse } from 'next/server'

const PUBLIC_PATHS = ['/admin-login', '/login']

export function middleware(request) {
  try {
    const { pathname } = request.nextUrl
    const adminToken = request.cookies.get('adminToken')?.value
    const isPublicPath = PUBLIC_PATHS.some(path => pathname === path || pathname.startsWith(path + '/'))

    // If no token and accessing protected route, redirect to login
    if (!adminToken && !isPublicPath) {
      const loginUrl = new URL('/admin-login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // If has token and accessing public path, redirect to dashboard
    if (adminToken && isPublicPath) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    return NextResponse.next()
  } catch (error) {
    console.error('Middleware error:', error)
    // In case of error, allow the request to proceed
    return NextResponse.next()
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
