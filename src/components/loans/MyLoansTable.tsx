import { LoanStatusBadge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/Panel'
import { bookLabel, formatDate, loanStatus } from '@/lib/domain'
import type { Loan } from '@/lib/types'

/** The current user's open loans. The borrower and management actions are
 * intentionally omitted because every row belongs to the signed-in user. */
export function MyLoansTable({ loans }: { loans: Loan[] }) {
  if (loans.length === 0) return <EmptyState>No tienes préstamos activos.</EmptyState>

  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            <th>Código</th>
            <th>Libro</th>
            <th>Fecha de préstamo</th>
            <th>Fecha de devolución</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {loans.map((loan) => (
            <tr key={loan.id}>
              <td>{loan.code}</td>
              <td>{bookLabel(loan.book)}</td>
              <td>{formatDate(loan.loanedAt)}</td>
              <td>{formatDate(loan.dueDate)}</td>
              <td>
                <LoanStatusBadge status={loanStatus(loan)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
