import type { Metadata } from 'next'

import { createUserAction } from '@/actions/users'
import { Panel, SectionHeader } from '@/components/ui/Panel'
import { UserForm } from '@/components/users/UserForm'
import { requireAdmin } from '@/lib/dal'

export const metadata: Metadata = { title: 'BiblioTech — Nuevo usuario' }

/** The API has no self sign-up: accounts are created here. */
export default async function NewUserPage() {
  await requireAdmin()

  return (
    <>
      <SectionHeader title="Nuevo usuario" subtitle="Da de alta una cuenta de la biblioteca" />

      <Panel>
        <UserForm action={createUserAction} />
      </Panel>
    </>
  )
}
