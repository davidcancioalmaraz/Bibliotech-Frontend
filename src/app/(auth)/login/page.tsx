import type { Metadata } from 'next'

import { LoginForm } from './LoginForm'

export const metadata: Metadata = { title: 'BiblioTech — Acceso' }

/**
 * Outside the `(app)` shell: no sidebar, no top bar. The API has no self
 * sign-up — accounts are created by an administrator through `POST /users` —
 * so there is nothing to link to besides the form.
 */
export default async function LoginPage({ searchParams }: PageProps<'/login'>) {
  const { expired } = await searchParams

  return (
    <div className="login-page">
      <main className="login-card">
        <header className="login-header">
          <p className="brand">BiblioTech</p>
          <h1 className="login-title">Acceso al sistema</h1>
          <p className="login-subtitle">Introduce tus credenciales para continuar</p>
        </header>

        <LoginForm expired={expired !== undefined} />

        <footer className="login-footer">
          <p>Biblioteca municipal · Área de préstamos</p>
        </footer>
      </main>
    </div>
  )
}
