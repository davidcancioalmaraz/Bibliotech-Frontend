import type { AuthenticatedUser, UserRole } from './types'

export const TOKEN_COOKIE = 'bt_token'
export const USER_COOKIE = 'bt_user'

/**
 * Where a role lands after logging in. A member can only read `/books`, so the
 * dashboard would be a redirect the moment they arrived.
 */
export function homePathFor(role: UserRole): string {
  return role === 'admin' ? '/dashboard' : '/books'
}

/**
 * Reading half of the session, with no dependency on `next/headers`, so that
 * `proxy.ts` can pull the user off `request.cookies` without dragging the
 * request-scoped cookie store into the proxy bundle.
 *
 * A cookie that fails to parse counts as no session: something tampered with
 * it, and the caller should send the visitor back to the login page.
 */
export function parseSessionUser(raw: string | undefined): AuthenticatedUser | null {
  if (!raw) return null

  try {
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return null

    const { id, name, email, role } = parsed as Record<string, unknown>
    if (typeof id !== 'number') return null
    if (typeof name !== 'string' || typeof email !== 'string') return null
    if (role !== 'admin' && role !== 'member') return null

    return { id, name, email, role }
  } catch {
    return null
  }
}
