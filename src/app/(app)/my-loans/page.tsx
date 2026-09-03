import type { Metadata } from 'next'

import { MyLoansTable } from '@/components/loans/MyLoansTable'
import { Pagination } from '@/components/ui/Pagination'
import { Panel, SectionHeader } from '@/components/ui/Panel'
import { getPaginated } from '@/lib/api'
import { requireSession } from '@/lib/dal'
import { parsePage, parsePageSize } from '@/lib/pagination'
import type { Loan } from '@/lib/types'

export const metadata: Metadata = { title: 'BiblioTech — Mis préstamos' }

/** Personal, read-only view backed by the authenticated `/loans/me` endpoint. */
export default async function MyLoansPage({ searchParams }: PageProps<'/my-loans'>) {
  await requireSession()
  const query = await searchParams
  const page = parsePage(query.page)
  const limit = parsePageSize(query.limit)
  const { data, meta } = await getPaginated<Loan>('/loans/me', { page, limit })

  return (
    <>
      <SectionHeader
        title="Mis préstamos"
        subtitle={`${meta.total} ${
          meta.total === 1
            ? 'préstamo pendiente de devolución'
            : 'préstamos pendientes de devolución'
        }`}
      />

      <Panel>
        <MyLoansTable loans={data} />
      </Panel>

      <Pagination meta={meta} basePath="/my-loans" />
    </>
  )
}
