'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import type { ActionState } from '@/components/ui/Form'
import { apiFetch, isApiError } from '@/lib/api'
import { requireAdmin } from '@/lib/dal'
import type { User, UserRole } from '@/lib/types'

/** The whole `/users` controller carries `@Roles(UserRole.ADMIN)`. */

interface UserPayload {
  name?: string
  email?: string
  password?: string
  role?: UserRole
  isActive?: boolean
}

function readUser(formData: FormData, { withPassword }: { withPassword: boolean }) {
  const payload: UserPayload = {
    name: String(formData.get('name') ?? '').trim(),
    email: String(formData.get('email') ?? '').trim(),
    role: (formData.get('role') as UserRole | null) ?? undefined,
    // An unchecked checkbox sends nothing at all.
    isActive: formData.get('isActive') === 'on',
  }

  const password = String(formData.get('password') ?? '')
  // On edit an empty box means "leave it as it is": sending `""` would fail
  // `@MinLength(8)` and refuse the whole update.
  if (withPassword || password) payload.password = password

  return payload
}

export async function createUserAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin()

  try {
    await apiFetch<User>('/users', {
      method: 'POST',
      body: readUser(formData, { withPassword: true }),
    })
  } catch (error) {
    if (!isApiError(error)) throw error
    return { errors: error.messages }
  }

  revalidatePath('/users')
  redirect('/users')
}

export async function updateUserAction(
  id: number,
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin()

  try {
    await apiFetch<User>(`/users/${id}`, {
      method: 'PATCH',
      body: readUser(formData, { withPassword: false }),
    })
  } catch (error) {
    if (!isApiError(error)) throw error
    return { errors: error.messages }
  }

  revalidatePath('/users')
  redirect('/users')
}

/**
 * Only works for an account that never borrowed anything: the loan history
 * keeps a foreign key on it and the API answers 409 rather than erasing that
 * history. Deactivating with `isActive: false` is the way to stop an account.
 */
export async function deleteUserAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin()

  const id = Number(formData.get('id'))

  try {
    await apiFetch<null>(`/users/${id}`, { method: 'DELETE' })
  } catch (error) {
    if (!isApiError(error)) throw error
    return { errors: error.messages }
  }

  revalidatePath('/users')
  return { errors: [] }
}
