import { cache } from 'react'
import { redirect } from 'next/navigation'

import { getSessionUser } from './session'
import type { AuthenticatedUser } from './types'

export { homePathFor } from './session-cookie'

/**
 * The session behind the current request, memoised for the render pass so a
 * page and its layout do not each pay for parsing the cookie.
 */
export const getCurrentUser = cache(getSessionUser)

/** Any authenticated role. Pages under `(app)` all start here. */
export async function requireSession(): Promise<AuthenticatedUser> {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  return user
}

/**
 * Mirrors `@Roles(UserRole.ADMIN)` on the backend, which guards every `/users`
 * and `/loans` route and the write half of `/books`.
 *
 * Called from Server Actions as well as pages: Next 16 warns that Server
 * Functions are reachable by a direct POST, not only through the UI, so the
 * check cannot live in the page alone.
 */
export async function requireAdmin(): Promise<AuthenticatedUser> {
  const user = await requireSession()
  if (user.role !== 'admin') redirect('/forbidden')
  return user
}
