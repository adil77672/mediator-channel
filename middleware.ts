import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { AUTH_COOKIE_NAME, verifyAuthToken } from './lib/auth'

const PUBLIC_ROUTES = ['/', '/login', '/register']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (PUBLIC_ROUTES.includes(pathname) || pathname.startsWith('/api/auth')) {
    return NextResponse.next()
  }

  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value
  const payload = await verifyAuthToken(token)

  if (payload) {
    return NextResponse.next()
  }

  if (pathname.startsWith('/api')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const loginUrl = new URL('/login', request.url)
  loginUrl.searchParams.set('redirect', pathname)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/upload/:path*',
    '/api/uploads/:path*',
    '/api/earnings/:path*',
    '/api/notifications/:path*',
    '/api/payment/:path*',
    '/api/test/:path*',
    '/api/cron/:path*'
  ]
}

