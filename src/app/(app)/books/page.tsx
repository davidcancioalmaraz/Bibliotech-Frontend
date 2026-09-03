import type { Metadata } from 'next'
import Link from 'next/link'

import { BooksTable } from '@/components/books/BooksTable'
import { DisabledFilters } from '@/components/ui/DisabledFilters'
import { Pagination } from '@/components/ui/Pagination'
import { Panel, SectionHeader } from '@/components/ui/Panel'
import { getPaginated } from '@/lib/api'
import { requireSession } from '@/lib/dal'
import { parsePage, parsePageSize } from '@/lib/pagination'
import type { Book } from '@/lib/types'

export const metadata: Metadata = { title: 'BiblioTech — Libros' }

/** The one section a member can reach, in read-only form. */
export default async function BooksPage({ searchParams }: PageProps<'/books'>) {
  const user = await requireSession()
  const query = await searchParams
  const page = parsePage(query.page)
  const limit = parsePageSize(query.limit)
  const { data, meta } = await getPaginated<Book>('/books', { page, limit })

  const canManage = user.role === 'admin'

  return (
    <>
      <SectionHeader
        title="Catálogo de libros"
        subtitle={`${meta.total} ${meta.total === 1 ? 'título registrado' : 'títulos registrados'}`}
        action={
          canManage ? (
            <Link className="btn btn-primary" href="/books/new">
              Nuevo libro
            </Link>
          ) : undefined
        }
      />

      <DisabledFilters
        searchPlaceholder="Título, autor o código"
        select={{
          id: 'category',
          label: 'Categoría',
          options: [{ value: '', label: 'Todas las categorías' }],
        }}
      />

      <Panel>
        <BooksTable books={data} canManage={canManage} />
      </Panel>

      <Pagination meta={meta} basePath="/books" />
    </>
  )
}
