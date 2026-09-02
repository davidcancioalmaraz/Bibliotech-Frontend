import type { Metadata } from 'next'

import { updateLoanAction } from '@/actions/loans'
import { LoanForm } from '@/components/loans/LoanForm'
import { EmptyState, Panel, SectionHeader } from '@/components/ui/Panel'
import { apiFetch } from '@/lib/api'
import { requireAdmin } from '@/lib/dal'
import { bookLabel, daysBetween, formatDate } from '@/lib/domain'
import type { Loan } from '@/lib/types'

export const metadata: Metadata = { title: 'BiblioTech — Editar préstamo' }

/** Editing a loan means extending it: only the dates can move. */
export default async function EditLoanPage({ params }: PageProps<'/loans/[id]/edit'>) {
  await requireAdmin()

  const { id } = await params
  const loan = await apiFetch<Loan>(`/loans/${id}`)

  return (
    <>
      <SectionHeader title="Editar préstamo" subtitle={loan.code} />

      <Panel>
        {loan.returnedAt ? (
          <EmptyState>
            Este préstamo ya se devolvió el {formatDate(loan.returnedAt)} y no se puede
            modificar.
          </EmptyState>
        ) : (
          <LoanForm
            action={updateLoanAction.bind(null, loan.id)}
            loan={{
              bookLabel: bookLabel(loan.book),
              userLabel: `${loan.user.name} (${loan.user.email})`,
              loanedAt: loan.loanedAt,
              dueDate: loan.dueDate,
              // The term is not stored: the API derives it back from the two
              // dates whenever a PATCH leaves it out, and so does this form.
              termDays: daysBetween(loan.loanedAt, loan.dueDate),
            }}
          />
        )}
      </Panel>
    </>
  )
}
