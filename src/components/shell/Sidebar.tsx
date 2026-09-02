'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import type { UserRole } from '@/lib/types'

import { activeItem, navItemsFor } from './nav'

/**
 * A Client Component because the active link depends on the current path, and
 * layouts in Next 16 neither re-render on navigation nor read the request.
 */
export function Sidebar({ role }: { role: UserRole }) {
  const pathname = usePathname()
  const active = activeItem(pathname)

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <p className="brand brand-inverse">BiblioTech</p>
      </div>

      <nav className="sidebar-nav">
        <ul>
          {navItemsFor(role).map((item) => (
            <li key={item.href}>
              <Link
                className={`sidebar-link${item.href === active?.href ? ' is-active' : ''}`}
                href={item.href}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <LogoutForm className="sidebar-link link-button" />
      </div>
    </aside>
  )
}

/**
 * Signing out is a POST to `/logout`, which is the only place cookies can be
 * dropped. A plain form keeps it working without JavaScript, as the static
 * mockup did.
 */
export function LogoutForm({ className }: { className: string }) {
  return (
    <form method="post" action="/logout">
      <button className={className} type="submit">
        Cerrar sesión
      </button>
    </form>
  )
}
