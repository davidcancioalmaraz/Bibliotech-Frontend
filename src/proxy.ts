import { NextResponse, type NextRequest } from 'next/server'

import { USER_COOKIE, homePathFor, parseSessionUser } from '@/lib/session-cookie'

/**
 * Proxy — what earlier versions of Next called Middleware. It runs before every
 * matched request and performs the *optimistic* access check: it reads the
 * session cookie and nothing else, no API calls, because it also runs on
 * prefetches.
 *
 * It is the first of three gates, not the only one. Pages and Server Actions
 * call `requireSession()` / `requireAdmin()`, and the API enforces the same
 * rules again with 401 and 403.
 */

/** Reachable without a session. `/logout` clears the cookies and bounces on. */
const ALWAYS_ALLOWED = ['/login', '/logout']

/** Whole sections the backend guards with `@Roles(UserRole.ADMIN)`. */
const ADMIN_SECTIONS = ['/dashboard', '/loans', '/users']

/**
 * `/books` is readable by any role, but creating and editing is admin-only —
 * `@Roles(UserRole.ADMIN)` sits on the handlers, not the controller.
 */
function isAdminOnlyBookRoute(path: string): boolean {
  return path === '/books/new' || /^\/books\/[^/]+\/edit$/.test(path)
}

function isAdminOnly(path: string): boolean {
  if (ADMIN_SECTIONS.some((section) => path === section || path.startsWith(`${section}/`)))
    return true
  return isAdminOnlyBookRoute(path)
}

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname
  const user = parseSessionUser(request.cookies.get(USER_COOKIE)?.value)

  if (ALWAYS_ALLOWED.includes(path)) {
    // Someone already signed in has no reason to see the login form again.
    // `?expired=1` is the exception: it comes from `/logout` after the API
    // rejected a token, and following it would bounce straight back.
    if (path === '/login' && user && !request.nextUrl.searchParams.has('expired'))
      return NextResponse.redirect(new URL(homePathFor(user.role), request.url))

    return NextResponse.next()
  }

  if (!user) return NextResponse.redirect(new URL('/login', request.url))

  if (user.role !== 'admin' && isAdminOnly(path))
    return NextResponse.redirect(new URL('/forbidden', request.url))

  return NextResponse.next()
}

export const config = {
  // Without a matcher the proxy also runs on static assets and images, which
  // the redirects above would happily block.
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
