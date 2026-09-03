import type { Metadata } from 'next'

import './globals.css'

export const metadata: Metadata = {
  title: 'BiblioTech',
  description: 'Gestión de libros y préstamos de la biblioteca municipal',
}

/**
 * The one root layout. The login page and the application shell live in the
 * `(auth)` and `(app)` route groups below it, so navigating between them stays
 * a client transition instead of a full page load.
 *
 * No web font is loaded: the design uses the system stack, through `--font-sans`
 * in `globals.css`.
 */
export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
