import type { ComponentProps, ReactNode } from 'react'

interface FieldProps extends Omit<ComponentProps<'input'>, 'className' | 'id'> {
  id: string
  label: string
  hint?: string
  /** Spans both columns of `.form-grid`. */
  full?: boolean
}

/** Label + input, the `.field` block the stylesheet defines. */
export function Field({ id, label, hint, full = false, ...input }: FieldProps) {
  return (
    <div className={full ? 'field field-full' : 'field'}>
      <label className="field-label" htmlFor={id}>
        {label}
      </label>
      <input className="field-input" id={id} name={id} {...input} />
      {hint ? <p className="field-hint">{hint}</p> : null}
    </div>
  )
}

interface SelectFieldProps extends Omit<ComponentProps<'select'>, 'className' | 'id'> {
  id: string
  label: string
  hint?: string
  full?: boolean
  children: ReactNode
}

export function SelectField({
  id,
  label,
  hint,
  full = false,
  children,
  ...select
}: SelectFieldProps) {
  return (
    <div className={full ? 'field field-full' : 'field'}>
      <label className="field-label" htmlFor={id}>
        {label}
      </label>
      <select className="field-select" id={id} name={id} {...select}>
        {children}
      </select>
      {hint ? <p className="field-hint">{hint}</p> : null}
    </div>
  )
}

/**
 * A value the form shows but cannot change. A loan never moves to another book
 * or another borrower — `PATCH /loans/:id` rejects both fields — so the edit
 * form states them instead of offering a control that would lie.
 */
export function ReadonlyField({
  label,
  value,
  full = false,
}: {
  label: string
  value: string
  full?: boolean
}) {
  return (
    <div className={full ? 'field field-full' : 'field'}>
      <span className="field-label">{label}</span>
      <p className="field-readonly">{value}</p>
    </div>
  )
}
