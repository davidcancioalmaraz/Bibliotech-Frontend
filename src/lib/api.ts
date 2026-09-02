import { redirect } from 'next/navigation'

import { DEFAULT_PAGE_SIZE } from './pagination'
import { getToken } from './session'
import type { Paginated } from './types'

/** The backend exposes every controller through its versioned global prefix. */
const API_URL = (process.env.API_URL ?? 'http://localhost:3000').replace(/\/+$/, '')
const API_PREFIX = '/api/v1'

/** `limit` is capped at 100 by the backend's `PaginationQueryDto`. */
export const MAX_PAGE_SIZE = 100

/**
 * A response the API refused. `messages` is always an array: Nest answers with
 * `string[]` for `ValidationPipe` failures and a plain `string` for business
 * rules and `ParseIntPipe`, and callers should not have to care which.
 */
export class ApiError extends Error {
  readonly status: number
  readonly messages: string[]

  constructor(status: number, messages: string[]) {
    super(messages[0] ?? `La API respondió ${status}`)
    this.name = 'ApiError'
    this.status = status
    this.messages = messages
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError
}

function toMessages(body: unknown, status: number): string[] {
  if (body && typeof body === 'object' && 'message' in body) {
    const { message } = body as { message: unknown }
    if (Array.isArray(message)) return message.map(String)
    if (typeof message === 'string') return [message]
  }

  return [`La API respondió ${status}`]
}

interface ApiFetchOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  body?: unknown
  /**
   * Login is the one call made without a session. Everything else attaches the
   * bearer token and bounces the visitor out when the API rejects it.
   */
  anonymous?: boolean
}

interface PaginationOptions {
  page?: number
  limit?: number
}

/**
 * Single door to the API. Every call goes through here so the token, the JSON
 * headers and the 401/403 handling live in one place.
 *
 * `fetch` no longer caches by default in Next 16, and these responses are
 * per-user anyway, so no cache option is set.
 */
export async function apiFetch<T>(
  path: string,
  { method = 'GET', body, anonymous = false }: ApiFetchOptions = {},
): Promise<T> {
  const headers: Record<string, string> = {}

  if (body !== undefined) headers['Content-Type'] = 'application/json'

  if (!anonymous) {
    const token = await getToken()
    // No token at all is the same situation as an expired one.
    if (!token) redirect('/logout?expired=1')
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_URL}${API_PREFIX}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  })

  // Both DELETE endpoints answer 204 with an empty body — never parse those.
  if (response.status === 204) return null as T

  const payload: unknown = await response.json().catch(() => null)

  if (response.ok) return payload as T

  // Only login reports a bad password; a 401 anywhere else means the token
  // expired or the account was deactivated. The route handler can clear the
  // cookies, which a Server Component render cannot.
  if (response.status === 401 && !anonymous) redirect('/logout?expired=1')
  if (response.status === 403) redirect('/forbidden')

  throw new ApiError(response.status, toMessages(payload, response.status))
}

export async function getPaginated<T>(
  path: string,
  { page = 1, limit = DEFAULT_PAGE_SIZE }: PaginationOptions = {},
): Promise<Paginated<T>> {
  // Anything beyond `page` and `limit` answers 400: the global ValidationPipe
  // runs with `forbidNonWhitelisted`.
  const query = new URLSearchParams({ page: String(page), limit: String(limit) })
  return apiFetch<Paginated<T>>(`${path}?${query}`)
}

/**
 * Every row of a list, for the selects on the loan form. The API caps a page at
 * 100 rows and offers no "all" mode, so this walks the pages.
 */
export async function fetchAllPages<T>(path: string): Promise<T[]> {
  const rows: T[] = []
  let page = 1

  for (;;) {
    const { data, meta } = await getPaginated<T>(path, { page, limit: MAX_PAGE_SIZE })
    rows.push(...data)
    if (!meta.hasNextPage) return rows
    page += 1
  }
}
