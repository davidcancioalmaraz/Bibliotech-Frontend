import { Sidebar } from '@/components/shell/Sidebar'
import { Topbar } from '@/components/shell/Topbar'
import { requireSession } from '@/lib/dal'

/**
 * The application shell, which the static mockup repeated by hand in each of
 * its five pages. Here it is mounted once and every route below it is just the
 * contents of `.content`.
 *
 * It also gates the whole group: `proxy.ts` already redirected anyone without a
 * session, but that check is optimistic by design, so the session is required
 * again where the pages actually render.
 */
export default async function AppLayout({ children }: LayoutProps<'/'>) {
  const user = await requireSession()

  return (
    <div className="app">
      <Sidebar role={user.role} />

      <div className="main">
        <Topbar user={user} />
        <main className="content">{children}</main>
      </div>
    </div>
  )
}
