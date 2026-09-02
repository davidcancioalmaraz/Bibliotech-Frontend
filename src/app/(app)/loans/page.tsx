import type { Metadata } from 'next'
import Link from 'next/link'

import { LoansTable } from '@/components/loans/LoansTable'
import { DisabledFilters } from '@/components/ui/DisabledFilters'
import { Pagination } from '@/components/ui/Pagination'
import { Panel, SectionHeader } from '@/components/ui/Panel'
import { getPaginated, parsePage } from '@/lib/api'
import { requireAdmin } from '@/lib/dal'
import type { Loan } from '@/lib/types'

export const metadata: Metadata = { title: 'BiblioTech — Préstamos' }

export default async function LoansPage({ searchParams }: PageProps<'/loans'>) {
  await requireAdmin()
  const page = parsePage((await searchParams).page)
  const { data, meta } = await getPaginated<Loan>('/loans', { page })

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
