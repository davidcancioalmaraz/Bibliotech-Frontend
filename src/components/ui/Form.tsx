'use client'

import Link from 'next/link'
import { useFormStatus } from 'react-dom'

/** What every Server Action in `src/actions/` hands back when it fails. */
export interface ActionState {
  errors: string[]
}

export const EMPTY_ACTION_STATE: ActionState = { errors: [] }

/**
 * The messages the API refused with, shown verbatim. They are precise —
 * `Book code BT-1 is already taken`, `User 5 is inactive and cannot borrow` —
 * and inventing a friendlier wording would only hide which rule was broken.
 */
export function FormErrors({ errors }: { errors: string[] }) {
  if (errors.length === 0) return null

  return (
    <div className="form-errors" role="alert">
      <ul>
        {errors.map((error) => (
          <li key={error}>{error}</li>
        ))}
      </ul>
    </div>
  )
}

/** Submit button that reports the pending action instead of looking inert. */
export function SubmitButton({
  children,
  pendingLabel = 'Guardando…',
  className = 'btn btn-primary',
}: {
  children: string
  pendingLabel?: string
  className?: string
}) {
  const { pending } = useFormStatus()

  return (
    <button className={className} type="submit" disabled={pending}>
      {pending ? pendingLabel : children}
    </button>
  )
}

/** Cancel + submit, right-aligned above a top border. */
export function FormActions({
  cancelHref,
  submitLabel,
}: {
  cancelHref: string
  submitLabel: string
}) {
  return (
    <div className="form-actions">
      <Link className="btn btn-secondary" href={cancelHref}>
        Cancelar
      </Link>
      <SubmitButton>{submitLabel}</SubmitButton>
    </div>
  )
}
