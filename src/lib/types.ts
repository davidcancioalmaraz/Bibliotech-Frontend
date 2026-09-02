/**
 * Mirror of the shapes the BiblioTech API answers with. Kept by hand rather
 * than generated from `/docs-json`, so anything the frontend reads is spelled
 * out here and a backend change shows up as a type error.
 */

export type BookStatus = 'available' | 'on-loan' | 'under-repair'

export type UserRole = 'admin' | 'member'

/** Terms the library lends for. `dueDate` is derived from one of these. */
export const LOAN_TERM_DAYS = [14, 21, 30] as const

export type LoanTermDays = (typeof LOAN_TERM_DAYS)[number]

/**
 * Not a column: the API has no notion of an overdue loan, and no endpoint
 * filters by it. It is derived from `returnedAt` and `dueDate`.
 */
export type LoanStatus = 'active' | 'returned' | 'overdue'

export interface Book {
  id: number
  title: string
  description: string
  isbn: string | null
  code: string
  author: string | null
  category: string | null
  year: number | null
  publisher: string | null
  language: string
  pages: number | null
  status: BookStatus
  createdAt: string
  updatedAt: string
}

export interface User {
  id: number
  name: string
  email: string
  role: UserRole
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Loan {
  id: number
  code: string
  bookId: number
  userId: number
  /** `YYYY-MM-DD`, not a timestamp. */
  loanedAt: string
  dueDate: string
  returnedAt: string | null
  createdAt: string
  updatedAt: string
  /** Both relations are eager on the backend, so they always travel along. */
  book: Book
  user: User
}

/** What `POST /auth/login` and `GET /auth/me` return: only these four fields. */
export interface AuthenticatedUser {
  id: number
  name: string
  email: string
  role: UserRole
}

export interface LoginResponse {
  accessToken: string
  user: AuthenticatedUser
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  /** `0` when the result set is empty. */
  totalPages: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}

export interface Paginated<T> {
  data: T[]
  meta: PaginationMeta
}
