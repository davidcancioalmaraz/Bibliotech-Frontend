'use client'

import { usePathname } from 'next/navigation'

import type { AuthenticatedUser } from '@/lib/types'

import { LogoutForm } from './Sidebar'
import { activeItem } from './nav'

/**
 * The title tracks the current section, so like the sidebar this has to run on
 * the client: the layout that renders it is cached across navigations and never
 * sees the new path.
 */
export function Topbar({ user }: { user: AuthenticatedUser }) {
  const title = activeItem(usePathname())?.title ?? 'BiblioTech'

  return (
    <header className="topbar">
      <h1 className="topbar-title">{title}</h1>
      <div className="topbar-user">
        <span className="topbar-username">{user.name}</span>
        <LogoutForm className="topbar-logout link-button" />
      </div>
    </header>
  )
}
