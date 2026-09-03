import Link from 'next/link'

import { deleteBookAction } from '@/actions/books'
import { BookStatusBadge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/Panel'
import { RowAction } from '@/components/ui/RowAction'
import type { Book } from '@/lib/types'

/**
 * The catalogue. Where the mockup listed *Ejemplares*, this shows the fields
 * the API actually stores.
 *
 * `canManage` is false for a member: `GET /books` is open to any role, but
 * creating, editing and deleting carry `@Roles(UserRole.ADMIN)`.
 */
export function BooksTable({ books, canManage }: { books: Book[]; canManage: boolean }) {
  if (books.length === 0)
    return <EmptyState>Todavía no hay libros en el catálogo.</EmptyState>

  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            <th>Código</th>
            <th>Título</th>
            <th>Autor</th>
            <th>Categoría</th>
            <th>Año</th>
            <th>Estado</th>
            {canManage ? <th>Acciones</th> : null}
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id}>
              <td>{book.code}</td>
              <td>{book.title}</td>
              <td>{book.author ?? '—'}</td>
              <td>{book.category ?? '—'}</td>
              <td>{book.year ?? '—'}</td>
              <td>
                <BookStatusBadge status={book.status} />
              </td>
              {canManage ? (
                <td>
                  <div className="table-actions">
                    <Link className="btn btn-secondary btn-sm" href={`/books/${book.id}/edit`}>
                      Editar
                    </Link>
                    <RowAction
                      action={deleteBookAction}
                      id={book.id}
                      label="Eliminar"
                      pendingLabel="Eliminando…"
                      variant="danger"
                      confirmMessage={`¿Eliminar «${book.title}»? Esta acción no se puede deshacer.`}
                    />
                  </div>
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
