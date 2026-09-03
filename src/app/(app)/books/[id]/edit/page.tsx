import type { Metadata } from 'next'

import { updateBookAction } from '@/actions/books'
import { BookForm } from '@/components/books/BookForm'
import { Panel, SectionHeader } from '@/components/ui/Panel'
import { apiFetch } from '@/lib/api'
import { requireAdmin } from '@/lib/dal'
import type { Book } from '@/lib/types'

export const metadata: Metadata = { title: 'BiblioTech — Editar libro' }

export default async function EditBookPage({ params }: PageProps<'/books/[id]/edit'>) {
  await requireAdmin()

  const { id } = await params
  const book = await apiFetch<Book>(`/books/${id}`)

  return (
    <>
      <SectionHeader title="Editar libro" subtitle={book.title} />

      <Panel>
        {/* The id is bound on the server; the form only submits the fields. */}
        <BookForm action={updateBookAction.bind(null, book.id)} book={book} />
      </Panel>
    </>
  )
}
