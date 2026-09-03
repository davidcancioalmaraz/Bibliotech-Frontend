'use client'

import { useActionState } from 'react'

import { Field, ReadonlyField, SelectField } from '@/components/ui/Field'
import {
  EMPTY_ACTION_STATE,
  FormActions,
  FormErrors,
  type ActionState,
} from '@/components/ui/Form'
import { formatDate, today } from '@/lib/domain'
import { LOAN_TERM_DAYS } from '@/lib/types'

export interface SelectOption {
  id: number
  label: string
}

/**
 * Lending, and extending a loan already recorded.
 *
 * The book and the borrower are chosen from lists, not typed: `POST /loans`
 * takes a `bookId` and a `userId`, and answers 404 for an unknown one. On edit
 * both are shown as text — the API omits them from `UpdateLoanDto`, so handing
 * a copy to someone else is a return followed by a new loan.
 *
 * There is no field for the code or the return date: the server generates the
 * first and derives the second from `loanedAt` plus the term.
 */
export function LoanForm({
  action,
  books,
  users,
  loan,
}: {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>
  /** Only copies the API will accept: `available`. Empty when editing. */
  books?: SelectOption[]
  /** Only accounts that may borrow: `isActive`. Empty when editing. */
  users?: SelectOption[]
  loan?: {
    bookLabel: string
    userLabel: string
    loanedAt: string
    /** Shown as it stands today; the API recomputes it from the term. */
    dueDate: string
    termDays: number
  }
}) {
  const [state, formAction] = useActionState(action, EMPTY_ACTION_STATE)
  const isEditing = loan !== undefined

  return (
    <form className="form" action={formAction}>
      <FormErrors errors={state.errors} />

      <div className="form-grid">
        {isEditing ? (
          <>
            <ReadonlyField label="Libro" value={loan.bookLabel} full />
            <ReadonlyField label="Socio" value={loan.userLabel} full />
          </>
        ) : (
          <>
            <SelectField id="bookId" label="Libro" required full>
              <option value="">Selecciona un libro disponible</option>
              {books?.map((book) => (
                <option key={book.id} value={book.id}>
                  {book.label}
                </option>
              ))}
            </SelectField>

            <SelectField id="userId" label="Socio" required full>
              <option value="">Selecciona un socio</option>
              {users?.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.label}
                </option>
              ))}
            </SelectField>
          </>
        )}

        <Field
          id="loanedAt"
          label="Fecha de préstamo"
          type="date"
          defaultValue={loan?.loanedAt ?? today()}
          max={today()}
          required
          hint="No puede ser una fecha futura."
        />

        <SelectField
          id="termDays"
          label="Plazo"
          defaultValue={loan?.termDays ?? 14}
          hint={
            isEditing
              ? `Devolución actual: ${formatDate(loan.dueDate)}. Se recalcula al guardar.`
              : 'La fecha de devolución se calcula a partir del plazo.'
          }
        >
          {LOAN_TERM_DAYS.map((term) => (
            <option key={term} value={term}>
              {term} días
            </option>
          ))}
        </SelectField>
      </div>

      <FormActions cancelHref="/loans" submitLabel="Guardar" />
    </form>
  )
}
