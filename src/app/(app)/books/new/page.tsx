import type { Metadata } from 'next'

import { createBookAction } from '@/actions/books'
import { BookForm } from '@/components/books/BookForm'
import { Panel, SectionHeader } from '@/components/ui/Panel'
import { requireAdmin } from '@/lib/dal'

export const metadata: Metadata = { title: 'BiblioTech — Nuevo libro' }

export default async function NewBookPage() {
  await requireAdmin()

  return (
    <>
      <SectionHeader title="Nuevo libro" subtitle="Añade un ejemplar al catálogo" />

      <Panel>
        <BookForm action={createBookAction} />
      </Panel>
    </>
  )
}
