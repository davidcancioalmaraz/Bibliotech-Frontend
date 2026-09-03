import Link from 'next/link'

import { deleteUserAction } from '@/actions/users'
import { UserRoleBadge, UserStatusBadge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/Panel'
import { RowAction } from '@/components/ui/RowAction'
import type { User } from '@/lib/types'

export function UsersTable({ users, currentUserId }: { users: User[]; currentUserId: number }) {
  if (users.length === 0) return <EmptyState>Todavía no hay usuarios registrados.</EmptyState>

  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo electrónico</th>
            <th>Rol</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <UserRoleBadge role={user.role} />
              </td>
              <td>
                <UserStatusBadge isActive={user.isActive} />
              </td>
              <td>
                <div className="table-actions">
                  <Link className="btn btn-secondary btn-sm" href={`/users/${user.id}/edit`}>
                    Editar
                  </Link>
                  {/* Deleting your own account would end the session mid-request
                      and leave the app in a state nothing recovers from. */}
                  {user.id === currentUserId ? null : (
                    <RowAction
                      action={deleteUserAction}
                      id={user.id}
                      label="Eliminar"
                      pendingLabel="Eliminando…"
                      variant="danger"
                      confirmMessage={`¿Eliminar la cuenta de ${user.name}? Si tiene préstamos registrados, desactívala en su lugar.`}
                    />
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
