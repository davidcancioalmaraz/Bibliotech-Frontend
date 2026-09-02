import type { Metadata } from 'next'
import Link from 'next/link'

import { DisabledFilters } from '@/components/ui/DisabledFilters'
import { Pagination } from '@/components/ui/Pagination'
import { Panel, SectionHeader } from '@/components/ui/Panel'
import { UsersTable } from '@/components/users/UsersTable'
import { getPaginated, parsePage } from '@/lib/api'
import { requireAdmin } from '@/lib/dal'
import type { User } from '@/lib/types'

export const metadata: Metadata = { title: 'BiblioTech — Usuarios' }

export default async function UsersPage({ searchParams }: PageProps<'/users'>) {
  const admin = await requireAdmin()
  const page = parsePage((await searchParams).page)
  const { data, meta } = await getPaginated<User>('/users', { page })

  return (
    <>
      <SectionHeader
        title="Usuarios"
        subtitle={`${meta.total} ${meta.total === 1 ? 'cuenta registrada' : 'cuentas registradas'}`}
        action={
          <Link className="btn btn-primary" href="/users/new">
            Nuevo usuario
          </Link>
        }
      />

      <DisabledFilters
        searchPlaceholder="Nombre o correo electrónico"
        select={{
          id: 'role',
          label: 'Rol',
          options: [{ value: '', label: 'Todos los roles' }],
        }}
      />

      <Panel>
        <UsersTable users={data} currentUserId={admin.id} />
      </Panel>

      <Pagination meta={meta} basePath="/users" />
    </>
  )
}
