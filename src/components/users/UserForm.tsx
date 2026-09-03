'use client'

import { useActionState } from 'react'

import { Field, SelectField } from '@/components/ui/Field'
import {
  EMPTY_ACTION_STATE,
  FormActions,
  FormErrors,
  type ActionState,
} from '@/components/ui/Form'
import { USER_ROLE_LABELS } from '@/lib/domain'
import type { User, UserRole } from '@/lib/types'

const ROLES: UserRole[] = ['member', 'admin']

export function UserForm({
  action,
  user,
}: {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>
  user?: User
}) {
  const [state, formAction] = useActionState(action, EMPTY_ACTION_STATE)
  const isEditing = user !== undefined

  return (
    <form className="form" action={formAction}>
      <FormErrors errors={state.errors} />

      <div className="form-grid">
        <Field
          id="name"
          label="Nombre"
          defaultValue={user?.name}
          placeholder="Nombre y apellidos"
          maxLength={120}
          required
        />

        <Field
          id="email"
          label="Correo electrónico"
          type="email"
          defaultValue={user?.email}
          placeholder="nombre@bibliotech.test"
          maxLength={120}
          required
          hint="Se normaliza en minúsculas y debe ser único."
        />

        <Field
          id="password"
          label={isEditing ? 'Nueva contraseña' : 'Contraseña'}
          type="password"
          autoComplete="new-password"
          minLength={8}
          required={!isEditing}
          placeholder={isEditing ? 'Déjalo vacío para no cambiarla' : 'Mínimo 8 caracteres'}
          hint="Mínimo 8 caracteres."
        />

        <SelectField id="role" label="Rol" defaultValue={user?.role ?? 'member'}>
          {ROLES.map((role) => (
            <option key={role} value={role}>
              {USER_ROLE_LABELS[role]}
            </option>
          ))}
        </SelectField>

        <div className="field field-full">
          <label className="checkbox" htmlFor="isActive">
            <input
              className="checkbox-input"
              type="checkbox"
              id="isActive"
              name="isActive"
              defaultChecked={user?.isActive ?? true}
            />
            <span className="checkbox-label">Cuenta activa</span>
          </label>
          {/* Deactivating is the alternative to deleting: an account with loans
              on record cannot be removed, and an inactive one cannot borrow
              nor log in. */}
          <p className="field-hint">
            Una cuenta inactiva no puede iniciar sesión ni recibir préstamos.
          </p>
        </div>
      </div>

      <FormActions cancelHref="/users" submitLabel="Guardar" />
    </form>
  )
}
