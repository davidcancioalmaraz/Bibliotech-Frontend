import { NextResponse, type NextRequest } from 'next/server'

import { clearSession } from '@/lib/session'

/**
 * Ending a session is a route handler rather than a Server Action for two
 * reasons: the sidebar link works as a plain form POST without JavaScript, and
 * cookies can only be deleted from a handler or an action — never from a page
 * render, which is exactly where an expired token is discovered.
 *
 * The API has no logout endpoint and no token revocation; dropping the cookies
 * is all there is to do.
 */
async function endSession(request: NextRequest) {
  await clearSession()

  const target = new URL('/login', request.url)
  // Set by `apiFetch` when the API rejected the token, so the login page can
  // say why the visitor is back, and the proxy knows not to bounce them on.
  if (request.nextUrl.searchParams.has('expired')) target.searchParams.set('expired', '1')

  // 303 so the browser follows a POST with a GET.
  return NextResponse.redirect(target, 303)
}

export const POST = endSession

/** GET as well, because `apiFetch` reaches this route through a redirect. */
export const GET = endSession
