'use server'

import { redirect } from 'next/navigation'

import type { ActionState } from '@/components/ui/Form'
import { apiFetch, isApiError } from '@/lib/api'
import { homePathFor } from '@/lib/dal'
import { setSession } from '@/lib/session'
import type { LoginResponse } from '@/lib/types'

/**
 * The only anonymous call in the app. The API answers 200 — not 201 — with the
 * token and the four public fields of the account.
 */
export async function loginAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')

  if (!email || !password) return { errors: ['Introduce tu correo y tu contraseña.'] }

  let session: LoginResponse

  try {
    session = await apiFetch<LoginResponse>('/auth/login', {
      method: 'POST',
      body: { email, password },
      anonymous: true,
    })
  } catch (error) {
    if (!isApiError(error)) throw error

    // The API deliberately answers the same 401 for an unknown address, a wrong
    // password and a deactivated account, so this cannot be more specific.
    if (error.status === 401) return { errors: ['Credenciales no válidas.'] }
    return { errors: error.messages }
  }

  await setSession(session.accessToken, session.user)

  // `redirect` throws a control-flow exception, so it stays outside the catch.
  redirect(homePathFor(session.user.role))
}
