import type { UserRole } from '@/lib/types'

export interface NavItem {
  href: string
  label: string
  /** Section title shown in the top bar for this branch of the tree. */
  title: string
  adminOnly: boolean
}

/**
 * The whole navigation, in one place, so the sidebar and the top bar cannot
 * disagree about what a route is called.
 *
 * `adminOnly` mirrors the backend: `/users` and `/loans` carry
 * `@Roles(UserRole.ADMIN)` on the controller, and the dashboard reads loans, so
 * a member has nothing to see in any of them.
 */
export const NAV_ITEMS: NavItem[] = [
  { href: '/dashboard', label: 'Panel', title: 'Panel', adminOnly: true },
  { href: '/books', label: 'Libros', title: 'Libros', adminOnly: false },
  { href: '/loans', label: 'Préstamos', title: 'Préstamos', adminOnly: true },
  { href: '/users', label: 'Usuarios', title: 'Usuarios', adminOnly: true },
]

export function navItemsFor(role: UserRole): NavItem[] {
  return role === 'admin' ? NAV_ITEMS : NAV_ITEMS.filter((item) => !item.adminOnly)
}

/**
 * The item a path belongs to. Child routes keep their parent highlighted, so
 * `/books/new` marks *Libros*, as the mockup did.
 */
export function activeItem(pathname: string): NavItem | undefined {
  return NAV_ITEMS.find(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
  )
}
