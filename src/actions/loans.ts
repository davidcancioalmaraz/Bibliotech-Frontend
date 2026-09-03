'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import type { ActionState } from '@/components/ui/Form'
import { apiFetch, isApiError } from '@/lib/api'
import { requireAdmin } from '@/lib/dal'
import { LOAN_TERM_DAYS, type Loan, type LoanTermDays } from '@/lib/types'

/**
 * `/loans` is admin-only and is not plain CRUD: lending and returning move a
 * book's status too, so the API runs them in a transaction and answers 409 when
 * the copy or the account is not in a state that allows it.
 *
 * Three fields never come from a form: `code` and `dueDate` are derived on the
 * server, and `returnedAt` is set by the return endpoint.
 */

/** Anything else answers 400 — the DTO validates the term with `@IsIn`. */
function readTermDays(formData: FormData): LoanTermDays | undefined {
  const value = Number(formData.get('termDays'))
  return LOAN_TERM_DAYS.find((term) => term === value)
}

function readLoanedAt(formData: FormData): string | undefined {
  // The DTO wants exactly `YYYY-MM-DD`; a full timestamp is rejected.
  const value = String(formData.get('loanedAt') ?? '').trim()
  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : undefined
}

export async function createLoanAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin()

  const bookId = Number(formData.get('bookId'))
  const userId = Number(formData.get('userId'))

  if (!Number.isInteger(bookId) || bookId < 1 || !Number.isInteger(userId) || userId < 1)
    return { errors: ['Selecciona un libro y un socio.'] }

  try {
    await apiFetch<Loan>('/loans', {
      method: 'POST',
      body: {
        bookId,
        userId,
        loanedAt: readLoanedAt(formData),
        termDays: readTermDays(formData),
      },
    })
  } catch (error) {
    if (!isApiError(error)) throw error
    return { errors: error.messages }
  }

  // A new loan flips its book to `on-loan`, so the catalogue is stale too.
  revalidatePath('/loans')
  revalidatePath('/books')
  redirect('/loans')
}

/**
 * An extension. The API refuses to move a loan to another book or another
 * borrower — `UpdateLoanDto` omits both — so only the dates travel.
 */
export async function updateLoanAction(
  id: number,
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin()

  try {
    await apiFetch<Loan>(`/loans/${id}`, {
      method: 'PATCH',
      body: {
        loanedAt: readLoanedAt(formData),
        termDays: readTermDays(formData),
      },
    })
  } catch (error) {
    if (!isApiError(error)) throw error
    return { errors: error.messages }
  }

  revalidatePath('/loans')
  redirect('/loans')
}

/** Closes the loan and puts the copy back on the shelf. Not idempotent: a
 *  second call answers 409. */
export async function returnLoanAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin()

  const id = Number(formData.get('id'))

  try {
    await apiFetch<Loan>(`/loans/${id}/return`, { method: 'POST' })
  } catch (error) {
    if (!isApiError(error)) throw error
    return { errors: error.messages }
  }

  revalidatePath('/loans')
  revalidatePath('/books')
  return { errors: [] }
}

/**
 * Deleting an open loan releases its book back to `available` — the only way to
 * undo a loan that should never have been recorded. Deleting a returned one
 * just erases that page of the history.
 */
export async function deleteLoanAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin()

  const id = Number(formData.get('id'))

  try {
    await apiFetch<null>(`/loans/${id}`, { method: 'DELETE' })
  } catch (error) {
    if (!isApiError(error)) throw error
    return { errors: error.messages }
  }

  revalidatePath('/loans')
  revalidatePath('/books')
  return { errors: [] }
}
