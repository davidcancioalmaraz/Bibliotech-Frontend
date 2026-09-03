import { cookies } from 'next/headers'

import { TOKEN_COOKIE, USER_COOKIE, parseSessionUser } from './session-cookie'
import type { AuthenticatedUser } from './types'

/** Matches the backend's `JWT_EXPIRES_IN=1d`; there is no refresh endpoint. */
const MAX_AGE_SECONDS = 60 * 60 * 24

/**
 * The session lives in two httpOnly cookies rather than one: the JWT payload
 * carries `sub`, `email` and `role`, but not the display name the top bar
 * shows, and calling `GET /auth/me` on every render would add a round trip to
 * each page.
 *
 * Neither cookie is signed, on purpose. `proxy.ts` reads the user one for the
 * *optimistic* check Next recommends; the real authorisation stays where the
 * data is — the API answers 401 and 403 on its own.
 */
const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax',
  path: '/',
  secure: process.env.NODE_ENV === 'production',
  maxAge: MAX_AGE_SECONDS,
} as const

export async function setSession(token: string, user: AuthenticatedUser) {
  const store = await cookies()
  store.set(TOKEN_COOKIE, token, COOKIE_OPTIONS)
  store.set(USER_COOKIE, JSON.stringify(user), COOKIE_OPTIONS)
}

export async function clearSession() {
  const store = await cookies()
  store.delete(TOKEN_COOKIE)
  store.delete(USER_COOKIE)
}

export async function getToken() {
  return (await cookies()).get(TOKEN_COOKIE)?.value ?? null
}

export async function getSessionUser(): Promise<AuthenticatedUser | null> {
  return parseSessionUser((await cookies()).get(USER_COOKIE)?.value)
}
