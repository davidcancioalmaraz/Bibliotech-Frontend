'use client'

import { useActionState } from 'react'

import { Field, SelectField } from '@/components/ui/Field'
import {
  EMPTY_ACTION_STATE,
  FormActions,
  FormErrors,
  type ActionState,
} from '@/components/ui/Form'
import { BOOK_STATUS_LABELS, EDITABLE_BOOK_STATUSES } from '@/lib/domain'
import type { Book } from '@/lib/types'

/**
 * Create and edit share this form: `PATCH /books/:id` takes the same fields as
 * `POST /books`, all of them optional.
 *
 * The fields are the ones `CreateBookDto` declares. The mockup's *Ejemplares*
 * is gone — a book is a single copy here, which is what lets a loan flip its
 * status — and `description` is added, since the API requires it.
 */
export function BookForm({
  action,
  book,
}: {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>
  book?: Book
}) {
  const [state, formAction] = useActionState(action, EMPTY_ACTION_STATE)

  // A lent copy cannot have its status touched at all: `PATCH /books/:id`
  // answers 409 while an open loan exists. Returning the loan is the way back.
  const isOnLoan = book?.status === 'on-loan'

  return (
    <form className="form" action={formAction}>
      <FormErrors errors={state.errors} />

      <div className="form-grid">
        <Field
          id="code"
          label="Código"
          defaultValue={book?.code}
          placeholder="BT-4KQ7XZ21"
          maxLength={40}
          required
          hint="Único en todo el catálogo"
        />

        <SelectField
          id="status"
          label="Estado"
          defaultValue={book?.status ?? 'available'}
          disabled={isOnLoan}
          hint={
            isOnLoan
              ? 'El ejemplar está prestado; devuelve el préstamo para cambiar su estado.'
              : '«Prestado» lo asigna el registro de préstamos.'
          }
        >
          {EDITABLE_BOOK_STATUSES.map((status) => (
            <option key={status} value={status}>
              {BOOK_STATUS_LABELS[status]}
            </option>
          ))}
          {isOnLoan ? <option value="on-loan">{BOOK_STATUS_LABELS['on-loan']}</option> : null}
        </SelectField>

        <Field
          id="title"
          label="Título"
          defaultValue={book?.title}
          placeholder="Título completo de la obra"
          maxLength={200}
          required
          full
        />

        <Field
          id="description"
          label="Descripción"
          defaultValue={book?.description}
          placeholder="Breve reseña de la obra"
          maxLength={500}
          required
          full
        />

        <Field
          id="author"
          label="Autor"
          defaultValue={book?.author ?? ''}
          placeholder="Nombre y apellidos"
          maxLength={120}
        />

        <Field
          id="category"
          label="Categoría"
          defaultValue={book?.category ?? ''}
          placeholder="Ficción, Ensayo, Técnico…"
          maxLength={80}
        />

        <Field
          id="year"
          label="Año"
          type="number"
          defaultValue={book?.year ?? ''}
          placeholder="1967"
          min={1450}
          max={2100}
        />

        <Field
          id="pages"
          label="Páginas"
          type="number"
          defaultValue={book?.pages ?? ''}
          placeholder="471"
          min={1}
        />

        <Field
          id="isbn"
          label="ISBN"
          defaultValue={book?.isbn ?? ''}
          placeholder="978-0307474728"
          maxLength={20}
        />

        <Field
          id="publisher"
          label="Editorial"
          defaultValue={book?.publisher ?? ''}
          placeholder="Editorial Sudamericana"
          maxLength={120}
        />

        <Field
          id="language"
          label="Idioma"
          defaultValue={book?.language ?? 'es'}
          placeholder="es"
          maxLength={10}
          hint="Código ISO 639-1"
        />
      </div>

      <FormActions cancelHref="/books" submitLabel="Guardar" />
    </form>
  )
}
