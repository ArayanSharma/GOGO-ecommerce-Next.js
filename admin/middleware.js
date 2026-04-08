import { NextResponse } from 'next/server'

const PUBLIC_PATHS = ['/login']

export function middleware(request) {
  const { pathname } = request.nextUrl
  const adminToken = request.cookies.get('adminToken')?.value
  const isPublicPath = PUBLIC_PATHS.includes(pathname)

  if (!adminToken && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (adminToken && isPublicPath) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
