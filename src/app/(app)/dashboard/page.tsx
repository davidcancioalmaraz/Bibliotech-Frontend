import type { Metadata } from 'next'

import { LoansTable } from '@/components/loans/LoansTable'
import { Panel, PanelHeader } from '@/components/ui/Panel'
import { getPaginated } from '@/lib/api'
import { requireAdmin } from '@/lib/dal'
import type { Book, Loan, User } from '@/lib/types'

export const metadata: Metadata = { title: 'BiblioTech — Panel' }

/**
 * Reads `/loans`, so it is admin-only like the endpoint behind it.
 *
 * Three of the four counters are real: every list endpoint reports `meta.total`
 * alongside the rows, so a one-row page is enough to learn how many there are.
 * The other two stay as the mockup wrote them — the API exposes no counters and
 * no way to filter loans by state, so counting overdue loans would mean walking
 * every page of the history on each render.
 */
export default async function DashboardPage() {
  await requireAdmin()

  const [books, loans, users, latest] = await Promise.all([
    getPaginated<Book>('/books', { limit: 1 }),
    getPaginated<Loan>('/loans', { limit: 1 }),
    getPaginated<User>('/users', { limit: 1 }),
    getPaginated<Loan>('/loans', { limit: 5 }),
  ])

  return (
    <>
      <section className="metrics">
        <Metric label="Libros registrados" value={books.meta.total} hint="En el catálogo" />
        <Metric
          label="Préstamos registrados"
          value={loans.meta.total}
          hint="En todo el histórico"
        />
        <Metric label="Usuarios" value={users.meta.total} hint="Cuentas dadas de alta" />
        <Metric
          label="Préstamos vencidos"
          value={2}
          hint="Dato de ejemplo · pendiente en la API"
        />
      </section>

      <Panel>
        <PanelHeader title="Últimos préstamos" action={{ label: 'Ver todos', href: '/loans' }} />
        {/* Already ordered by the API: `loanedAt DESC, id DESC`. */}
        <LoansTable loans={latest.data} compact />
      </Panel>
    </>
  )
}

function Metric({ label, value, hint }: { label: string; value: number; hint: string }) {
  return (
    <article className="metric-card">
      <p className="metric-label">{label}</p>
      <p className="metric-value">{value}</p>
      <p className="metric-hint">{hint}</p>
    </article>
  )
}
