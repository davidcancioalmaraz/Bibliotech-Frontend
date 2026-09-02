import type { Metadata } from 'next'

import { updateUserAction } from '@/actions/users'
import { Panel, SectionHeader } from '@/components/ui/Panel'
import { UserForm } from '@/components/users/UserForm'
import { apiFetch } from '@/lib/api'
import { requireAdmin } from '@/lib/dal'
import type { User } from '@/lib/types'

export const metadata: Metadata = { title: 'BiblioTech — Editar usuario' }

export default async function EditUserPage({ params }: PageProps<'/users/[id]/edit'>) {
  await requireAdmin()

  const { id } = await params
  const user = await apiFetch<User>(`/users/${id}`)

  return (
    <>
      <SectionHeader title="Editar usuario" subtitle={user.email} />

      <Panel>
        <UserForm action={updateUserAction.bind(null, user.id)} user={user} />
      </Panel>
    </>
  )
}
