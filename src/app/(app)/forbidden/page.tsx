import type { Metadata } from 'next'
import Link from 'next/link'

import { Panel, SectionHeader } from '@/components/ui/Panel'
import { homePathFor, requireSession } from '@/lib/dal'
import { USER_ROLE_LABELS } from '@/lib/domain'

export const metadata: Metadata = { title: 'BiblioTech — Sin permisos' }

/**
 * Where the proxy, the pages and `apiFetch` all send a visitor whose role does
 * not reach a section. Préstamos and Usuarios are reserved for administrators,
 * and a socio can only read the catalogue.
 */
export default async function ForbiddenPage() {
  const user = await requireSession()

  return (
    <>
      <SectionHeader
        title="Sin permisos"
        subtitle="Tu cuenta no puede acceder a esta sección"
      />

      <Panel>
        <div className="form">
          <p>
            Has iniciado sesión como <strong>{user.name}</strong> con el rol{' '}
            <strong>{USER_ROLE_LABELS[user.role].toLowerCase()}</strong>. Los préstamos y los
            usuarios están reservados a los administradores de la biblioteca.
          </p>

          <div className="form-actions">
            <Link className="btn btn-primary" href={homePathFor(user.role)}>
              Volver
            </Link>
          </div>
        </div>
      </Panel>
    </>
  )
}
