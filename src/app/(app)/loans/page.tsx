import type { Metadata } from 'next'
import Link from 'next/link'

import { LoansTable } from '@/components/loans/LoansTable'
import { DisabledFilters } from '@/components/ui/DisabledFilters'
import { Pagination } from '@/components/ui/Pagination'
import { Panel, SectionHeader } from '@/components/ui/Panel'
import { getPaginated } from '@/lib/api'
import { requireAdmin } from '@/lib/dal'
import { parsePage, parsePageSize } from '@/lib/pagination'
import type { Loan } from '@/lib/types'

export const metadata: Metadata = { title: 'BiblioTech — Préstamos' }

export default async function LoansPage({ searchParams }: PageProps<'/loans'>) {
  await requireAdmin()
  const query = await searchParams
  const page = parsePage(query.page)
  const limit = parsePageSize(query.limit)
  const { data, meta } = await getPaginated<Loan>('/loans', { page, limit })

  return (
    <>
      <SectionHeader
        title="Préstamos registrados"
        subtitle={`${meta.total} ${meta.total === 1 ? 'operación' : 'operaciones'} en el histórico`}
        action={
          <Link className="btn btn-primary" href="/loans/new">
            Nuevo préstamo
          </Link>
        }
      />

      <DisabledFilters
        searchPlaceholder="Código, libro o socio"
        select={{
          id: 'status',
          label: 'Estado',
          options: [{ value: '', label: 'Todos los estados' }],
        }}
      />

      <Panel>
        <LoansTable loans={data} />
      </Panel>

      <Pagination meta={meta} basePath="/loans" />
    </>
  )
}
