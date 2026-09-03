'use client'

import { useActionState } from 'react'

import { EMPTY_ACTION_STATE, type ActionState } from './Form'

type RowActionFn = (state: ActionState, formData: FormData) => Promise<ActionState>

/**
 * A one-button form inside a table row: returning a copy, deleting a record.
 *
 * It carries its own `useActionState` so a refusal lands next to the row that
 * caused it. These calls fail for reasons the visitor needs to read — a book
 * with loans on record answers 409, and so does returning a loan twice — and a
 * redirect would throw that message away.
 */
export function RowAction({
  action,
  id,
  label,
  pendingLabel,
  confirmMessage,
  variant = 'secondary',
}: {
  action: RowActionFn
  id: number
  label: string
  pendingLabel: string
  confirmMessage?: string
  variant?: 'secondary' | 'danger'
}) {
  const [state, formAction, pending] = useActionState(action, EMPTY_ACTION_STATE)

  return (
    <>
      <form action={formAction}>
        <input type="hidden" name="id" value={id} />
        <button
          className={`btn btn-${variant} btn-sm`}
          type="submit"
          disabled={pending}
          onClick={(event) => {
            if (confirmMessage && !window.confirm(confirmMessage)) event.preventDefault()
          }}
        >
          {pending ? pendingLabel : label}
        </button>
      </form>

      {state.errors.map((error) => (
        <p className="action-error" key={error} role="alert">
          {error}
        </p>
      ))}
    </>
  )
}
