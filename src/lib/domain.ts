import type { BookStatus, Loan, LoanStatus, UserRole } from './types'

/* Labels: class names and API values stay in English, visible text in Spanish,
   the same split the stylesheet documents. */

export const BOOK_STATUS_LABELS: Record<BookStatus, string> = {
  available: 'Disponible',
  'on-loan': 'Prestado',
  'under-repair': 'En reparación',
}

export const LOAN_STATUS_LABELS: Record<LoanStatus, string> = {
  active: 'Activo',
  returned: 'Devuelto',
  overdue: 'Vencido',
}

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Administrador',
  member: 'Socio',
}

/**
 * Statuses a book can be given by hand. `on-loan` is owned entirely by
 * `/loans`: creating a book with it answers 400, and moving a book into it
 * answers 409.
 */
export const EDITABLE_BOOK_STATUSES: BookStatus[] = ['available', 'under-repair']

/** Today as `YYYY-MM-DD`, in the viewer's timezone. */
export function today(): string {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}

/**
 * Overdue is not a column. A loan is overdue when it is still out and its due
 * date has passed — `YYYY-MM-DD` strings compare correctly as strings.
 */
export function loanStatus(loan: Loan): LoanStatus {
  if (loan.returnedAt) return 'returned'
  return loan.dueDate < today() ? 'overdue' : 'active'
}

/**
 * `2026-09-05` → `05/09/2026`, by splitting the string. Going through `Date`
 * would parse it as UTC midnight and show the previous day west of Greenwich.
 */
export function formatDate(value: string | null): string {
  if (!value) return '—'
  const [year, month, day] = value.slice(0, 10).split('-')
  return `${day}/${month}/${year}`
}

/**
 * Whole days between two `YYYY-MM-DD` dates. The loan term is not stored, so
 * the edit form recovers it from `loanedAt` and `dueDate`.
 */
export function daysBetween(from: string, to: string): number {
  const parse = (value: string) => {
    const [year, month, day] = value.slice(0, 10).split('-').map(Number)
    return Date.UTC(year, month - 1, day)
  }
  return Math.round((parse(to) - parse(from)) / 86_400_000)
}

/** How the mockup writes a book inside a loan row: `LIB-004 — La sombra…`. */
export function bookLabel(book: { code: string; title: string }): string {
  return `${book.code} — ${book.title}`
}
