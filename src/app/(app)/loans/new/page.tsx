import type { Metadata } from 'next'
import Link from 'next/link'

import { createLoanAction } from '@/actions/loans'
import { LoanForm, type SelectOption } from '@/components/loans/LoanForm'
import { EmptyState, Panel, SectionHeader } from '@/components/ui/Panel'
import { fetchAllPages } from '@/lib/api'
import { requireAdmin } from '@/lib/dal'
import { bookLabel } from '@/lib/domain'
import type { Book, User } from '@/lib/types'

export const metadata: Metadata = { title: 'BiblioTech — Nuevo préstamo' }

/**
 * Both selects are filled here, on the server, and narrowed to what the API
 * will actually accept: lending a copy that is not `available` answers 409, and
 * so does lending to a deactivated account.
 *
 * The lists are walked page by page — there is no endpoint that returns every
 * row at once, and no filter to ask the API for only the eligible ones.
 */
export default async function NewLoanPage() {
  await requireAdmin()

  const [allBooks, allUsers] = await Promise.all([
    fetchAllPages<Book>('/books'),
    fetchAllPages<User>('/users'),
  ])

  const books: SelectOption[] = allBooks
    .filter((book) => book.status === 'available')
    .map((book) => ({ id: book.id, label: bookLabel(book) }))

  const users: SelectOption[] = allUsers
    .filter((user) => user.isActive)
    .map((user) => ({ id: user.id, label: `${user.name} (${user.email})` }))

  return (
    <>
      <SectionHeader title="Nuevo préstamo" subtitle="Registra la salida de un ejemplar" />

      <Panel>
        {books.length === 0 || users.length === 0 ? (
          <EmptyState>
            {books.length === 0
              ? 'No hay ningún ejemplar disponible para prestar. Devuelve un préstamo o añade un libro al catálogo.'
              : 'No hay ningún socio activo al que prestar. Activa una cuenta o crea un usuario.'}{' '}
            <Link href={books.length === 0 ? '/books' : '/users'}>Ir a la sección</Link>
          </EmptyState>
        ) : (
          <LoanForm action={createLoanAction} books={books} users={users} />
        )}
      </Panel>
    </>
  )
}
