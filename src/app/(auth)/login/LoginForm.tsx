'use client'

import { useActionState } from 'react'

import { loginAction } from '@/actions/auth'
import { Field } from '@/components/ui/Field'
import { EMPTY_ACTION_STATE, FormErrors, SubmitButton } from '@/components/ui/Form'

export function LoginForm({ expired }: { expired: boolean }) {
  const [state, formAction] = useActionState(loginAction, EMPTY_ACTION_STATE)

  return (
    <>
      {expired ? (
        <div className="form-errors" role="status">
          Tu sesión ha caducado. Vuelve a iniciar sesión.
        </div>
      ) : null}

      <FormErrors errors={state.errors} />

      <form className="login-form" action={formAction}>
        <Field
          id="email"
          label="Correo electrónico"
          type="email"
          placeholder="nombre@bibliotech.test"
          autoComplete="username"
          maxLength={120}
          required
        />

        <Field
          id="password"
          label="Contraseña"
          type="password"
          placeholder="Contraseña"
          autoComplete="current-password"
          maxLength={72}
          required
        />

        {/* Kept from the mockup but disabled: the API issues a one-day token
            and has no refresh endpoint to extend a session with. */}
        <label className="checkbox" htmlFor="remember">
          <input
            className="checkbox-input"
            type="checkbox"
            id="remember"
            name="remember"
            disabled
            title="Las sesiones persistentes aún no están disponibles en la API"
          />
          <span className="checkbox-label">Recordarme</span>
        </label>

        <SubmitButton className="btn btn-primary btn-block" pendingLabel="Entrando…">
          Iniciar sesión
        </SubmitButton>
      </form>
    </>
  )
}
