import Link from 'next/link'

import { deleteLoanAction, returnLoanAction } from '@/actions/loans'
import { LoanStatusBadge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/Panel'
import { RowAction } from '@/components/ui/RowAction'
import { bookLabel, formatDate, loanStatus } from '@/lib/domain'
import type { Loan } from '@/lib/types'

/**
 * The lending history, newest first — the API orders by `loanedAt DESC`.
 * `book` and `user` are eager relations, so every row already knows what was
 * lent and to whom without a second request.
 *
 * `compact` is the dashboard's cut: no dates of departure, no actions.
 */
export function LoansTable({ loans, compact = false }: { loans: Loan[]; compact?: boolean }) {
  if (loans.length === 0) return <EmptyState>Todavía no hay préstamos registrados.</EmptyState>

  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            <th>Código</th>
            <th>Libro</th>
            <th>Socio</th>
            {compact ? null : <th>Fecha de préstamo</th>}
            <th>Fecha de devolución</th>
            <th>Estado</th>
            {compact ? null : <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {loans.map((loan) => {
            const status = loanStatus(loan)
            const isOpen = loan.returnedAt === null

            return (
              <tr key={loan.id}>
                <td>{loan.code}</td>
                <td>{bookLabel(loan.book)}</td>
                <td>{loan.user.name}</td>
                {compact ? null : <td>{formatDate(loan.loanedAt)}</td>}
                <td>{formatDate(loan.dueDate)}</td>
                <td>
                  <LoanStatusBadge status={status} />
                </td>
                {compact ? null : (
                  <td>
                    <div className="table-actions">
                      {/* Returning or editing a closed loan answers 409, so
                          neither is offered once the copy is back. */}
                      {isOpen ? (
                        <>
                          <RowAction
                            action={returnLoanAction}
                            id={loan.id}
                            label="Devolver"
                            pendingLabel="Devolviendo…"
                          />
                          <Link
                            className="btn btn-secondary btn-sm"
                            href={`/loans/${loan.id}/edit`}
                          >
                            Editar
                          </Link>
                        </>
                      ) : null}
                      <RowAction
                        action={deleteLoanAction}
                        id={loan.id}
                        label="Eliminar"
                        pendingLabel="Eliminando…"
                        variant="danger"
                        confirmMessage={
                          isOpen
                            ? `¿Eliminar el préstamo ${loan.code}? El ejemplar volverá a estar disponible.`
                            : `¿Eliminar el préstamo ${loan.code} del histórico?`
                        }
                      />
                    </div>
                  </td>
                )}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
