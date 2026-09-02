'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import type { ActionState } from '@/components/ui/Form'
import { apiFetch, isApiError } from '@/lib/api'
import { requireAdmin } from '@/lib/dal'
import type { Book, BookStatus } from '@/lib/types'

/**
 * Writing to `/books` is admin-only. The check is repeated in every action
 * because a Server Function is reachable by a direct POST, not only through the
 * form that renders it.
 */

interface BookPayload {
  title: string
  description: string
  code: string
  isbn?: string
  author?: string
  category?: string
  year?: number
  publisher?: string
  language?: string
  pages?: number
  status?: BookStatus
}

function text(formData: FormData, key: string): string {
  return String(formData.get(key) ?? '').trim()
}

/**
 * An empty optional field is left out entirely rather than sent as `""`: the
 * DTO validates it with `@IsString()`, so a blank string would pass and store
 * an empty value where the column allows null.
 */
function optionalText(formData: FormData, key: string): string | undefined {
  return text(formData, key) || undefined
}

/**
 * `year` and `pages` are `@IsInt()` with no implicit conversion on the API
 * side, so they have to travel as JSON numbers, never as strings.
 */
function optionalInt(formData: FormData, key: string): number | undefined {
  const raw = text(formData, key)
  if (!raw) return undefined
  const value = Number(raw)
  return Number.isFinite(value) ? value : undefined
}

function readBook(formData: FormData): BookPayload {
  return {
    title: text(formData, 'title'),
    description: text(formData, 'description'),
    code: text(formData, 'code'),
    isbn: optionalText(formData, 'isbn'),
    author: optionalText(formData, 'author'),
    category: optionalText(formData, 'category'),
    year: optionalInt(formData, 'year'),
    publisher: optionalText(formData, 'publisher'),
    language: optionalText(formData, 'language'),
    pages: optionalInt(formData, 'pages'),
    // Absent when the select is disabled, which is how a lent copy is edited:
    // moving a book to `on-loan` by hand answers 409, and so does changing the
    // status of a book that has an open loan.
    status: (formData.get('status') as BookStatus | null) ?? undefined,
  }
}

export async function createBookAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin()

  try {
    await apiFetch<Book>('/books', { method: 'POST', body: readBook(formData) })
  } catch (error) {
    if (!isApiError(error)) throw error
    return { errors: error.messages }
  }

  revalidatePath('/books')
  redirect('/books')
}

export async function updateBookAction(
  id: number,
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin()

  try {
    await apiFetch<Book>(`/books/${id}`, { method: 'PATCH', body: readBook(formData) })
  } catch (error) {
    if (!isApiError(error)) throw error
    return { errors: error.messages }
  }

  revalidatePath('/books')
  redirect('/books')
}

/**
 * Usually refused: the foreign keys are `ON DELETE NO ACTION`, so a book with
 * any loan on record — open or returned — answers 409. The message says so and
 * the row shows it.
 */
export async function deleteBookAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin()

  const id = Number(formData.get('id'))

  try {
    await apiFetch<null>(`/books/${id}`, { method: 'DELETE' })
  } catch (error) {
    if (!isApiError(error)) throw error
    return { errors: error.messages }
  }

  revalidatePath('/books')
  return { errors: [] }
}
