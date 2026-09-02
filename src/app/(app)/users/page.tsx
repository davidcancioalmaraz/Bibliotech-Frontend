import type { Metadata } from 'next'
import Link from 'next/link'

import { DisabledFilters } from '@/components/ui/DisabledFilters'
import { Pagination } from '@/components/ui/Pagination'
import { Panel, SectionHeader } from '@/components/ui/Panel'
import { UsersTable } from '@/components/users/UsersTable'
import { getPaginated } from '@/lib/api'
import { requireAdmin } from '@/lib/dal'
import { parsePage, parsePageSize } from '@/lib/pagination'
import type { User } from '@/lib/types'

export const metadata: Metadata = { title: 'BiblioTech — Usuarios' }

export default async function UsersPage({ searchParams }: PageProps<'/users'>) {
  const admin = await requireAdmin()
  const query = await searchParams
  const page = parsePage(query.page)
  const limit = parsePageSize(query.limit)
  const { data, meta } = await getPaginated<User>('/users', { page, limit })

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
