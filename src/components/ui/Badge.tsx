import {
  BOOK_STATUS_LABELS,
  LOAN_STATUS_LABELS,
  USER_ROLE_LABELS,
} from '@/lib/domain'
import type { BookStatus, LoanStatus, UserRole } from '@/lib/types'

/** Status pills. Class names in English, visible text in Spanish. */

export function BookStatusBadge({ status }: { status: BookStatus }) {
  return <span className={`badge badge-${status}`}>{BOOK_STATUS_LABELS[status]}</span>
}

export function LoanStatusBadge({ status }: { status: LoanStatus }) {
  return <span className={`badge badge-${status}`}>{LOAN_STATUS_LABELS[status]}</span>
}

export function UserRoleBadge({ role }: { role: UserRole }) {
  return <span className={`badge badge-${role}`}>{USER_ROLE_LABELS[role]}</span>
}

export function UserStatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <span className={`badge ${isActive ? 'badge-active-user' : 'badge-inactive'}`}>
      {isActive ? 'Activo' : 'Inactivo'}
    </span>
  )
}
